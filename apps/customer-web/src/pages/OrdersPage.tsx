import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderApi, type OrderInfo } from '../services/order'
import { refundApi } from '../services/refund'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'

const STATUS_TABS = [
  { key: '', label: 'All' },
  { key: 'PENDING_PAYMENT', label: 'Pending' },
  { key: 'PAID', label: 'Paid' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
]

const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
}

export default function OrdersPage() {
  const { t, localeId } = useI18nStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const [orders, setOrders] = useState<OrderInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params: any = { page, pageSize }
      if (activeTab) params.status = activeTab
      const res = await orderApi.getOrders(params)
      if (res.data.code === 200) {
        setOrders(res.data.data.list)
        setTotal(res.data.data.total)
      }
    } catch {
      setError(t('order.loadFailed', 'Failed to load orders'))
    } finally {
      setLoading(false)
    }
  }, [activeTab, page, localeId, t])

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchOrders()
  }, [token, fetchOrders])

  const handleCancel = async (order: OrderInfo) => {
    if (!window.confirm('Cancel this order?')) return
    try {
      const res = await orderApi.cancelOrder(order.id)
      if (res.data.code === 200) fetchOrders()
    } catch {
      // ignore
    }
  }

  const handleConfirm = async (order: OrderInfo) => {
    if (!window.confirm('Confirm receipt of this order?')) return
    try {
      const res = await orderApi.confirmOrder(order.id)
      if (res.data.code === 200) fetchOrders()
    } catch {
      // ignore
    }
  }

  const handleRefund = async (order: OrderInfo) => {
    const reason = window.prompt('Please enter refund reason:')
    if (!reason || !reason.trim()) return
    try {
      const res = await refundApi.requestRefund(order.id, reason.trim())
      if (res.data.code === 200) {
        fetchOrders()
      }
    } catch {
      // ignore
    }
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-lg">←</button>
        <h1 className="text-base font-semibold">{t('customer.orders') || 'Orders'}</h1>
      </header>

      <div className="flex overflow-x-auto bg-white border-b">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setActiveTab(tab.key); setPage(1) }}
            className={`flex-shrink-0 px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600 font-medium'
                : 'border-transparent text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={fetchOrders} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">Retry</button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
            <span className="text-5xl">📦</span>
            <p className="text-sm">No orders found</p>
            <button onClick={() => navigate('/')} className="text-sm text-blue-500">Go Shopping</button>
          </div>
        ) : (
          <div className="p-3 space-y-3">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="bg-white border rounded-lg p-3 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-mono">{order.orderNo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
                    {order.status}
                  </span>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {order.items.slice(0, 4).map((item) => (
                      <div key={item.id} className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {item.productImage ? (
                          <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Img</div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded flex items-center justify-center text-xs text-gray-400">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold text-gray-900">
                    ¥{order.payAmount.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                  {order.status === 'PENDING_PAYMENT' && (
                    <>
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/payment/${order.id}`) }}
                        className="text-xs px-3 py-1.5 bg-orange-500 text-white rounded"
                      >
                        Pay Now
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCancel(order) }}
                        className="text-xs px-3 py-1.5 border border-gray-300 text-gray-500 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'SHIPPED' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleConfirm(order) }}
                      className="text-xs px-3 py-1.5 bg-green-500 text-white rounded"
                    >
                      Confirm Receipt
                    </button>
                  )}
                  {(order.status === 'PAID' || order.status === 'SHIPPED' || order.status === 'COMPLETED') && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleRefund(order) }}
                      className="text-xs px-3 py-1.5 border border-orange-400 text-orange-500 rounded"
                    >
                      Request Refund
                    </button>
                  )}
                </div>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 border rounded text-sm disabled:opacity-30"
                >
                  Prev
                </button>
                <span className="text-sm text-gray-500">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 border rounded text-sm disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNav navigate={navigate} t={t} />
    </div>
  )
}

function BottomNav({ navigate, t }: { navigate: (path: string) => void; t: (key: string) => string }) {
  return (
    <nav className="bg-white border-t flex items-center justify-around py-2">
      {[
        { label: t('customer.home') || 'Home', path: '/' },
        { label: t('customer.categories') || 'Categories', path: '/categories' },
        { label: t('customer.cart') || 'Cart', path: '/cart' },
        { label: t('customer.orders') || 'Orders', path: '/orders' },
        { label: t('customer.profile') || 'Profile', path: '/profile' },
      ].map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="flex flex-col items-center text-xs text-gray-500"
        >
          <span className="text-lg mb-0.5">●</span>
          {item.label}
        </button>
      ))}
    </nav>
  )
}
