import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { supportApi, type SupportSession } from '../services/support'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'

const STATUS_COLORS: Record<string, string> = {
  OPEN: 'bg-green-100 text-green-700',
  CLOSED: 'bg-gray-100 text-gray-500',
  PENDING: 'bg-yellow-100 text-yellow-700',
}

const PRIORITY_COLORS: Record<string, string> = {
  HIGH: 'text-red-500',
  MEDIUM: 'text-yellow-500',
  LOW: 'text-gray-400',
}

export default function SupportSessionsPage() {
  const navigate = useNavigate()
  const { t } = useI18nStore()
  const { token } = useAuthStore()
  const [sessions, setSessions] = useState<SupportSession[]>([])
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef<any>(null)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    loadSessions()
    intervalRef.current = setInterval(loadSessions, 15000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [token])

  const loadSessions = async () => {
    try {
      const res = await supportApi.getSessions()
      if (res.data.code === 200) {
        setSessions(res.data.data.list || [])
      }
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    setLoading(true)
    loadSessions()
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-lg">←</button>
          <h1 className="text-base font-semibold">{t('support.title') || 'Customer Service'}</h1>
        </header>
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-lg">←</button>
        <h1 className="text-base font-semibold flex-1">{t('support.title') || 'Customer Service'}</h1>
        <button onClick={handleRefresh} className="text-blue-500 text-sm">Refresh</button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-4xl mb-3">💬</span>
            <p className="text-sm">{t('support.noSessions') || 'No support sessions'}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => navigate(`/support/${session.id}`)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold truncate">{session.merchantName}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${STATUS_COLORS[session.status] || 'bg-gray-100'}`}>
                        {session.status}
                      </span>
                      {session.priority === 'HIGH' && (
                        <span className={`text-xs font-bold ${PRIORITY_COLORS[session.priority] || ''}`}>HIGH</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-1 truncate">{session.title}</p>
                    <p className="text-xs text-gray-400 truncate">{session.lastMessage || t('support.noMessages') || 'No messages'}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs text-gray-300">
                      {session.lastMessageAt ? new Date(session.lastMessageAt).toLocaleDateString() : ''}
                    </span>
                    {session.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-medium">
                        {session.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
