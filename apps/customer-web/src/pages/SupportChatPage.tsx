import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supportApi, type SupportSession, type SupportMessage } from '../services/support'
import uploadApi from '../services/upload'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'

export default function SupportChatPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useI18nStore()
  const { token, user } = useAuthStore()

  const [session, setSession] = useState<SupportSession | null>(null)
  const [messages, setMessages] = useState<SupportMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [closing, setClosing] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sessionId = Number(id)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    if (sessionId) {
      loadSession()
      supportApi.markRead(sessionId)
    }
    intervalRef.current = setInterval(() => {
      if (sessionId) loadMessages()
    }, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [token, sessionId])

  const loadSession = async () => {
    try {
      const res = await supportApi.getSessionDetail(sessionId)
      if (res.data.code === 200) setSession(res.data.data)
    } catch { /* ignore */ }
  }

  const loadMessages = useCallback(async () => {
    try {
      const res = await supportApi.getMessages(sessionId)
      if (res.data.code === 200) {
        setMessages(res.data.data || [])
      }
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = inputText.trim()
    if (!text || sending) return
    setSending(true)
    try {
      const res = await supportApi.sendMessage(sessionId, { content: text, messageType: 'TEXT' })
      if (res.data.code === 200) {
        setInputText('')
        await loadMessages()
      }
    } catch { /* ignore */ } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await uploadApi.uploadImage(file, 'support')
      if (res.data.code === 200) {
        const url = res.data.data
        const sendRes = await supportApi.sendMessage(sessionId, { content: url, messageType: 'IMAGE' })
        if (sendRes.data.code === 200) await loadMessages()
      }
    } catch { /* ignore */ }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleClose = async () => {
    if (!window.confirm('Close this session?')) return
    setClosing(true)
    try {
      const res = await supportApi.closeSession(sessionId)
      if (res.data.code === 200) {
        setSession((prev) => prev ? { ...prev, status: 'CLOSED' } : null)
      }
    } catch { /* ignore */ } finally {
      setClosing(false)
    }
  }

  const isCustomer = (msg: SupportMessage) => msg.senderSide === 'CUSTOMER' || String(msg.senderUserId) === String(user?.id)
  const isSystem = (msg: SupportMessage) => msg.messageType === 'SYSTEM'

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-lg">←</button>
          <h1 className="text-base font-semibold">Chat</h1>
        </header>
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b p-3 flex items-center gap-3">
        <button onClick={() => navigate('/support')} className="text-lg">←</button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold truncate">{session?.merchantName || 'Support'}</h1>
          <p className="text-xs text-gray-400">
            {session?.status === 'CLOSED'
              ? (t('support.sessionClosed') || 'Session closed')
              : (t('support.online') || 'Online')}
          </p>
        </div>
        {session?.status === 'OPEN' && (
          <button
            onClick={handleClose}
            disabled={closing}
            className="text-xs text-red-500 border border-red-200 rounded px-3 py-1 disabled:opacity-50"
          >
            {closing ? 'Closing...' : (t('support.closeSession') || 'Close')}
          </button>
        )}
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-3 space-y-3">
        {messages.map((msg) => {
          if (isSystem(msg)) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">{msg.content}</span>
              </div>
            )
          }
          const isMine = isCustomer(msg)
          return (
            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'}`}>
                {!isMine && (
                  <p className="text-xs text-gray-400 ml-1 mb-0.5">{msg.senderDisplayName}</p>
                )}
                {msg.messageType === 'IMAGE' ? (
                  <img
                    src={msg.content}
                    alt="attachment"
                    className={`max-w-[200px] rounded-lg cursor-pointer ${
                      isMine ? 'rounded-br-sm' : 'rounded-bl-sm'
                    }`}
                    onClick={() => window.open(msg.content, '_blank')}
                  />
                ) : (
                  <div className={`px-3 py-2 text-sm rounded-lg break-words ${
                    isMine
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-white text-gray-700 rounded-bl-sm shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                )}
                <p className={`text-xs text-gray-300 mt-0.5 ${isMine ? 'text-right mr-1' : 'ml-1'}`}>
                  {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </main>

      {session?.status === 'CLOSED' ? (
        <div className="bg-gray-100 border-t p-4 text-center">
          <p className="text-sm text-gray-500">{t('support.sessionClosed') || 'This session has been closed'}</p>
        </div>
      ) : (
        <div className="bg-white border-t p-3 flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 flex items-center justify-center text-gray-400 border border-gray-200 rounded-lg flex-shrink-0"
          >
            📷
          </button>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('support.inputPlaceholder') || 'Type a message...'}
            rows={1}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-300"
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || sending}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg disabled:opacity-50 flex-shrink-0"
          >
            {sending ? '...' : (t('support.send') || 'Send')}
          </button>
        </div>
      )}
    </div>
  )
}
