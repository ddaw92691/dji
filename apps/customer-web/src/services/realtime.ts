let ws: WebSocket | null = null
let reconnectTimer: any = null

function resolveRealtimeUrl() {
  const configuredUrl = import.meta.env.VITE_WS_URL?.trim()
  if (configuredUrl) {
    const wsUrl = configuredUrl.replace(/^https?:/, (protocol: string) => (protocol === 'https:' ? 'wss:' : 'ws:'))
    return wsUrl.endsWith('/ws') ? wsUrl : `${wsUrl.replace(/\/$/, '')}/ws`
  }

  return window.location.protocol === 'https:'
    ? `wss://${window.location.host}/ws`
    : `ws://${window.location.host}/ws`
}

export function connectRealtime(token: string, onEvent: (event: any) => void) {
  const url = `${resolveRealtimeUrl()}?token=${token}`

  function connect() {
    ws = new WebSocket(url)
    ws.onopen = () => console.log('WebSocket connected')
    ws.onmessage = (msg) => { try { onEvent(JSON.parse(msg.data)) } catch {} }
    ws.onclose = () => { reconnectTimer = setTimeout(connect, 5000) }
    ws.onerror = () => {}
  }
  connect()
}

export function disconnectRealtime() {
  clearTimeout(reconnectTimer)
  ws?.close()
}
