let ws: WebSocket | null = null
let reconnectTimer: any = null

export function connectRealtime(token: string, onEvent: (event: any) => void) {
  const wsUrl = window.location.protocol === 'https:'
    ? `wss://${window.location.host}/ws`
    : `ws://${window.location.host}/ws`
  const devWsUrl = import.meta.env.VITE_WS_URL
  const finalUrl = devWsUrl ? devWsUrl.replace(/^http/, 'ws') + '/ws' : wsUrl
  const url = `${finalUrl}?token=${token}`

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
