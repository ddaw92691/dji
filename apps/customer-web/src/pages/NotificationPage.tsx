import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { notificationApi, type NotificationItem } from '../services/notification'
import { useAuthStore } from '../stores/authStore'

const TYPE_BADGES: Record<string, string> = {
  ORDER: 'bg-blue-100 text-blue-700',
  REFUND: 'bg-red-100 text-red-700',
  REVIEW: 'bg-yellow-100 text-yellow-700',
  SYSTEM: 'bg-gray-100 text-gray-700',
  PROMOTION: 'bg-purple-100 text-purple-700',
}

export default function NotificationPage() {
  const navigate = useNavigate()
  const { token } = useAuthStore()

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'all' | 'unread'>('all')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    loadData()
    loadUnreadCount()
  }, [token, tab])

  const loadData = async () => {
    setLoading(true)
    try {
      const res = await notificationApi.getNotifications({
        page: 1,
        pageSize: 20,
        unreadOnly: tab === 'unread' ? true : undefined,
      })
      if (res.data.code === 200) {
        const data = res.data.data
        setNotifications(data.list || data || [])
        setHasMore(data.list ? data.list.length >= 20 : false)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const loadUnreadCount = async () => {
    try {
      const res = await notificationApi.getUnreadCount()
      if (res.data.code === 200) {
        setUnreadCount(res.data.data || 0)
      }
    } catch {
      // ignore
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      )
      loadUnreadCount()
    } catch {
      // ignore
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch {
      // ignore
    }
  }

  const loadMore = async () => {
    const nextPage = page + 1
    try {
      const res = await notificationApi.getNotifications({
        page: nextPage,
        pageSize: 20,
        unreadOnly: tab === 'unread' ? true : undefined,
      })
      if (res.data.code === 200) {
        const data = res.data.data
        const list = data.list || data || []
        setNotifications((prev) => [...prev, ...list])
        setPage(nextPage)
        setHasMore(list.length >= 20)
      }
    } catch {
      // ignore
    }
  }

  if (!token) return null

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-lg">←</button>
        <h1 className="text-base font-semibold flex-1">Notifications</h1>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-blue-500"
          >
            Mark all read
          </button>
        )}
      </header>

      <div className="flex border-b bg-white">
        <button
          onClick={() => { setTab('all'); setPage(1) }}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'all' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'
          }`}
        >
          All
        </button>
        <button
          onClick={() => { setTab('unread'); setPage(1) }}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            tab === 'unread' ? 'border-blue-500 text-blue-500' : 'border-transparent text-gray-500'
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="text-lg mb-2">●</span>
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          <>
            {notifications.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.isRead && handleMarkAsRead(item.id)}
                className={`w-full text-left p-4 border-b border-gray-50 transition-colors ${
                  !item.isRead ? 'bg-blue-50/50' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${TYPE_BADGES[item.type] || 'bg-gray-100 text-gray-500'}`}>
                        {item.type}
                      </span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                      {item.content}
                    </p>
                  </div>
                  <span className="text-[10px] text-gray-400 flex-shrink-0 mt-1">
                    {formatTime(item.createdAt)}
                  </span>
                </div>
              </button>
            ))}
            {hasMore && (
              <div className="p-4 text-center">
                <button
                  onClick={loadMore}
                  className="text-sm text-blue-500"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
