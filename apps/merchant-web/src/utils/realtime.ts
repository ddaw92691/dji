import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

let stompClient: Client | null = null
const listeners = new Set<(event: any) => void>()

function resolveSockJsEndpoint() {
  const configuredUrl = import.meta.env.VITE_WS_URL?.trim()
  if (configuredUrl) {
    return configuredUrl.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:')
  }

  const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').trim()
  if (!baseUrl) {
    return '/ws'
  }

  return `${baseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '')}/ws`
}

function notifyListeners(event: any) {
  listeners.forEach((listener) => {
    try {
      listener(event)
    } catch {
      // 单个监听器失败不影响全局实时连接
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

  const client = new Client({
    webSocketFactory: () => new SockJS(resolveSockJsEndpoint()),
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
