import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderApi, type OrderInfo } from '../services/order'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>()
  const { t, localeId } = useI18nStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    if (orderId) loadOrder(Number(orderId))
  }, [token, orderId, localeId])

  const loadOrder = async (id: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await orderApi.getOrderDetail(id)
      if (res.data.code === 200) setOrder(res.data.data)
      else setError(t('mall.payment.orderNotFound', 'Order not found'))
    } catch {
      setError(t('mall.payment.loadFailed', 'Failed to load order'))
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async () => {
    if (!order) return
    setPaying(true)
    setError('')
    try {
      const res = await orderApi.payOrder(order.id)
      if (res.data.code === 200) {
        navigate(`/payment-result?orderId=${order.id}&status=success`)
      } else {
        setError((res.data as any).message || t('mall.payment.payFailed', 'Payment failed'))
      }
    } catch {
      setError(t('mall.payment.payFailed', 'Payment failed'))
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-lg">←</button>
          <h1 className="text-base font-semibold">{t('mall.payment.title', 'Payment')}</h1>
        </header>
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-lg">←</button>
          <h1 className="text-base font-semibold">{t('mall.payment.title', 'Payment')}</h1>
        </header>
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400">
          <p className="text-sm">{error || t('mall.payment.orderNotFound', 'Order not found')}</p>
          <button onClick={() => navigate('/orders')} className="text-sm text-blue-500">{t('mall.payment.viewOrders', 'View Orders')}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-lg">←</button>
        <h1 className="text-base font-semibold">{t('mall.payment.title', 'Payment')}</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{t('order.orderNo', 'Order No.')}</span>
            <span className="text-sm font-medium">{order.orderNo}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-gray-500">{t('mall.payment.amount', 'Amount')}</span>
            <span className="text-xl font-bold text-red-500">¥{order.payAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-gray-500">{t('common.status', 'Status')}</span>
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">{order.payStatus}</span>
          </div>
        </div>

        {order.items && order.items.length > 0 && (
          <div className="p-4 bg-white border-b">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">{t('mall.payment.items', 'Items')}</h2>
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{t('common.imgPlaceholder', 'Img')}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate">{item.productTitle}</p>
                  <p className="text-xs text-gray-400">
                    ¥{item.price.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium">¥{item.totalAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 bg-white">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">{t('mall.payment.method', 'Payment Method')}</h2>
          <div className="border border-gray-200 rounded-lg p-3 bg-blue-50 border-blue-200">
            <p className="text-sm font-medium text-blue-700">{t('mall.payment.mock', 'Mock Payment')}</p>
            <p className="text-xs text-blue-500 mt-0.5">{t('mall.payment.mockDesc', 'Simulated payment for demonstration')}</p>
          </div>
        </div>
      </main>

      <div className="bg-white border-t p-4">
        <button
          onClick={handlePay}
          disabled={paying}
          className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm disabled:opacity-50"
        >
          {paying ? t('mall.payment.processing', 'Processing...') : t('mall.payment.confirm', 'Confirm Payment')}
        </button>
      </div>
    </div>
  )
}
