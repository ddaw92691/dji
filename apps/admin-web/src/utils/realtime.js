import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
let stompClient = null;
export function connectWebSocket(token, onEvent) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const wsEndpoint = baseUrl ? baseUrl + '/ws' : '/ws';
    const client = new Client({
        webSocketFactory: () => new SockJS(wsEndpoint),
        connectHeaders: { Authorization: 'Bearer ' + token },
        debug: () => { },
        reconnectDelay: 5000,
        onConnect: () => {
            client.subscribe('/user/queue/events', (msg) => onEvent(JSON.parse(msg.body)));
        },
    });
    client.activate();
    stompClient = client;
}
export function disconnectWebSocket() {
    stompClient?.deactivate();
}
