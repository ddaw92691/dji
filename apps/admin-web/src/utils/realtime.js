import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
let stompClient = null;
const listeners = new Set();
function notifyListeners(event) {
    listeners.forEach((listener) => {
        try {
            listener(event);
        }
        catch {
            // 单个页面监听失败不影响其他监听器
        }
    });
}
export function addRealtimeListener(listener) {
    listeners.add(listener);
}
export function removeRealtimeListener(listener) {
    listeners.delete(listener);
}
export function connectWebSocket(token, onEvent) {
    if (onEvent)
        listeners.add(onEvent);
    if (!token)
        return;
    if (stompClient?.active) {
        return;
    }
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const wsEndpoint = baseUrl ? `${baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')}/ws` : '/ws';
    const client = new Client({
        webSocketFactory: () => new SockJS(wsEndpoint),
        connectHeaders: { Authorization: 'Bearer ' + token },
        debug: () => { },
        reconnectDelay: 5000,
        onConnect: () => {
            client.subscribe('/user/queue/events', (msg) => notifyListeners(JSON.parse(msg.body)));
        },
    });
    client.activate();
    stompClient = client;
}
export function disconnectWebSocket() {
    stompClient?.deactivate();
    stompClient = null;
    listeners.clear();
}
