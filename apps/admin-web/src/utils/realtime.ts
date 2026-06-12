import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

let stompClient: Client | null = null
const listeners = new Set<(event: any) => void>()

function notifyListeners(event: any) {
  listeners.forEach((listener) => {
    try {
      listener(event)
    } catch {
      // 单个页面监听失败不影响其它监听器
    }
  })
}

export function addRealtimeListener(listener: (event: any) => void) {
  listeners.add(listener)
}

export function removeRealtimeListener(listener: (event: any) => void) {
  listeners.delete(listener)
}

export function connectWebSocket(token: string, onEvent?: (event: any) => void) {
  if (onEvent) listeners.add(onEvent)
  if (!token) return

  if (stompClient?.active) {
    return
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const wsEndpoint = baseUrl ? `${baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')}/ws` : '/ws'
  const client = new Client({
    webSocketFactory: () => new SockJS(wsEndpoint),
    connectHeaders: { Authorization: 'Bearer ' + token },
    debug: () => {},
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe('/user/queue/events', (msg) => notifyListeners(JSON.parse(msg.body)))
    },
  })
  client.activate()
  stompClient = client
}

export function disconnectWebSocket() {
  stompClient?.deactivate()
  stompClient = null
  listeners.clear()
}
