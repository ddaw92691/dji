import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs'

let stompClient: Client | null = null

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

export function connectWebSocket(token: string, onEvent: (event: any) => void) {
  const client = new Client({
    webSocketFactory: () => new SockJS(resolveSockJsEndpoint()),
    connectHeaders: { Authorization: 'Bearer ' + token },
    debug: () => {},
    reconnectDelay: 5000,
    onConnect: () => {
      client.subscribe('/user/queue/events', (msg) => onEvent(JSON.parse(msg.body)))
    },
  })
  client.activate()
  stompClient = client
}

export function disconnectWebSocket() {
  stompClient?.deactivate()
}
