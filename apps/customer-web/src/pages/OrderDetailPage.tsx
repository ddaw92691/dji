import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { orderApi, type OrderInfo } from '../services/order'
import { supportApi } from '../services/support'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'

const STATUS_STEPS = ['PENDING_PAYMENT', 'PAID', 'SHIPPED', 'COMPLETED']
const STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Pending',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}
const STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-gray-100 text-gray-500',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useI18nStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const [order, setOrder] = useState<OrderInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    if (id) loadOrder(Number(id))
  }, [token, id])

  const loadOrder = async (orderId: number) => {
    setLoading(true)
    setError('')
    try {
      const res = await orderApi.getOrderDetail(orderId)
      if (res.data.code === 200) setOrder(res.data.data)
      else setError(t('order.notFound', 'Order not found'))
    } catch {
      setError(t('order.loadFailed', 'Failed to load order'))
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!order || !window.confirm(t('order.confirmCancel', 'Cancel this order?'))) return
    try {
      const res = await orderApi.cancelOrder(order.id)
      if (res.data.code === 200) loadOrder(order.id)
    } catch {
      // ignore
    }
  }

  const handlePay = () => {
    if (order) navigate(`/payment/${order.id}`)
  }

  const [contacting, setContacting] = useState(false)

  const handleConfirm = async () => {
    if (!order || !window.confirm(t('order.confirmReceipt', 'Confirm receipt?'))) return
    try {
      const res = await orderApi.confirmOrder(order.id)
      if (res.data.code === 200) loadOrder(order.id)
    } catch {
      // ignore
    }
  }

  const handleContactMerchant = async () => {
    if (!order) return
    setContacting(true)
    try {
      const res = await supportApi.createSession({
        merchantId: order.merchantId || (order as any).merchantId,
        orderId: order.id,
        title: `Inquiry about order: ${order.orderNo}`,
        sessionType: 'NORMAL',
      })
      if (res.data.code === 200 && res.data.data) {
        navigate(`/support/${res.data.data.id}`)
      }
    } catch { /* ignore */ } finally {
      setContacting(false)
    }
  }

  const getStepIndex = (status: string) => {
    if (status === 'CANCELLED') return -1
    const idx = STATUS_STEPS.indexOf(status)
    return idx >= 0 ? idx : STATUS_STEPS.length
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-lg">←</button>
          <h1 className="text-base font-semibold">{t('order.detail', 'Order Detail')}</h1>
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
          <h1 className="text-base font-semibold">{t('order.detail', 'Order Detail')}</h1>
        </header>
        <div className="flex flex-col items-center justify-center flex-1 gap-3 text-gray-400">
          <p className="text-sm">{error || t('order.notFound', 'Order not found')}</p>
          <button onClick={() => navigate('/orders')} className="text-sm text-blue-500">{t('order.viewOrders', 'View Orders')}</button>
        </div>
      </div>
    )
  }

  const stepIdx = getStepIndex(order.status)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-lg">←</button>
        <h1 className="text-base font-semibold">Order Detail</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4 bg-white border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400 font-mono">{order.orderNo}</span>
            <span className={`text-xs px-2 py-0.5 rounded ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-500'}`}>
              {t(`order.status.${order.status}`, STATUS_LABELS[order.status] || order.status)}
            </span>
          </div>
          <p className="text-xs text-gray-400">
            {t('order.created', 'Created')}: {order.createdAt ? new Date(order.createdAt).toLocaleString() : ''}
          </p>
          {order.paidAt && (
            <p className="text-xs text-gray-400">{t('order.paid', 'Paid')}: {new Date(order.paidAt).toLocaleString()}</p>
          )}
          {order.cancelledAt && (
            <p className="text-xs text-red-400">{t('order.cancelled', 'Cancelled')}: {new Date(order.cancelledAt).toLocaleString()}</p>
          )}
        </div>

        {order.status !== 'CANCELLED' && (
          <div className="p-4 bg-white border-b">
            <div className="flex items-center justify-between">
              {STATUS_STEPS.map((step, idx) => {
                const isActive = idx <= stepIdx
                const isLastActive = idx === stepIdx
                return (
                  <div key={step} className="flex items-center flex-1">
                    {idx > 0 && (
                      <div className={`flex-1 h-0.5 -ml-2 mr-2 ${idx <= stepIdx ? 'bg-blue-500' : 'bg-gray-200'}`} />
                    )}
                    <div className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs text-white ${
                        isActive ? (isLastActive ? 'bg-blue-500' : 'bg-blue-300') : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isActive && !isLastActive ? '✓' : idx + 1}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-0.5">{t(`order.status.${step}`, STATUS_LABELS[step])}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {order.remark && (
          <div className="p-4 bg-white border-b">
            <h3 className="text-xs text-gray-500 mb-1">{t('order.remark', 'Remark')}</h3>
            <p className="text-sm text-gray-700">{order.remark}</p>
          </div>
        )}

        {(order.status === 'SHIPPED' || order.status === 'COMPLETED') && (order.logisticsCompany || order.trackingNo) && (
          <div className="p-4 bg-white border-b">
            <h3 className="text-xs text-gray-500 mb-2">{t('order.logistics', 'Logistics')}</h3>
            <div className="space-y-1 text-sm">
              {order.logisticsCompany && (
                <p className="text-gray-700">{t('order.carrier', 'Carrier')}: {order.logisticsCompany}</p>
              )}
              {order.trackingNo && (
                <p className="text-gray-700">{t('order.tracking', 'Tracking')}: <span className="font-mono">{order.trackingNo}</span></p>
              )}
            </div>
          </div>
        )}

        {(order.refundStatus === 'REQUESTED' || order.refundStatus === 'APPROVED' || order.refundStatus === 'REJECTED') && (
          <div className="p-4 bg-white border-b">
            <h3 className="text-xs text-gray-500 mb-2">{t('order.refund', 'Refund')}</h3>
            <div className="space-y-1 text-sm">
              {order.refundAmount > 0 && (
                <p className="text-gray-700">{t('order.amount', 'Amount')}: <span className="font-medium">¥{order.refundAmount.toFixed(2)}</span></p>
              )}
              {order.refundReason && (
                <p className="text-gray-700">{t('order.reason', 'Reason')}: {order.refundReason}</p>
              )}
              <p className="text-gray-700">{t('common.status', 'Status')}: <span className={`font-medium ${
                order.refundStatus === 'APPROVED' ? 'text-green-600' :
                order.refundStatus === 'REJECTED' ? 'text-red-600' :
                'text-yellow-600'
              }`}>{t(`order.refundStatus.${order.refundStatus}`, order.refundStatus)}</span></p>
              {order.refundRejectReason && (
                <p className="text-red-500">{t('order.rejectReason', 'Reject reason')}: {order.refundRejectReason}</p>
              )}
            </div>
          </div>
        )}

        {order.addressSnapshot && (
          <div className="p-4 bg-white border-b">
            <h3 className="text-xs text-gray-500 mb-2">{t('order.shippingAddress', 'Shipping Address')}</h3>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{order.addressSnapshot.receiverName} {order.addressSnapshot.phone}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {[order.addressSnapshot.country, order.addressSnapshot.province, order.addressSnapshot.city, order.addressSnapshot.detail]
                  .filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        )}

        <div className="p-4 bg-white border-b">
          <h3 className="text-xs text-gray-500 mb-2">{t('order.items', 'Items')}</h3>
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productTitle} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{t('common.imgPlaceholder', 'Img')}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.productTitle}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ¥{item.price.toFixed(2)} × {item.quantity}
                  </p>
                  {order.status === 'COMPLETED' && (
                    <div className="mt-1">
                      {(item as any).reviewed ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          <span className="text-yellow-400">★</span>
                          {t('order.reviewed', 'Reviewed')} {(item as any).reviewRating > 0 ? (item as any).reviewRating : ''}
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/reviews/create?orderId=${order.id}&orderItemId=${item.id}&productId=${item.productId}`)
                          }}
                          className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded"
                        >
                          {t('review.title', 'Write Review')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">¥{item.totalAmount.toFixed(2)}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">{t('order.noItems', 'No items')}</p>
          )}
        </div>

        <div className="p-4 bg-white">
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-500">{t('order.subtotal', 'Subtotal')}</span>
            <span className="text-sm">¥{order.totalAmount.toFixed(2)}</span>
          </div>
          {order.couponAmount > 0 && (
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-gray-500">{t('order.coupon', 'Coupon')}</span>
              <span className="text-sm text-red-500">-¥{order.couponAmount.toFixed(2)}</span>
            </div>
          )}
          {order.discountAmount > 0 && (
            <div className="flex items-center justify-between py-1">
              <span className="text-xs text-gray-500">{t('order.discount', 'Discount')}</span>
              <span className="text-sm text-red-500">-¥{order.discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between py-1">
            <span className="text-xs text-gray-500">{t('order.shipping', 'Shipping')}</span>
            <span className="text-sm">¥{order.shippingAmount.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t mt-1">
            <span className="text-sm font-semibold">{t('common.total', 'Total')}</span>
            <span className="text-lg font-bold text-red-500">¥{order.payAmount.toFixed(2)}</span>
          </div>
          {order.payment && (
            <div className="flex items-center justify-between py-1 mt-1">
              <span className="text-xs text-gray-500">{t('order.paymentMethod', 'Payment Method')}</span>
              <span className="text-xs text-gray-600">{order.payment.method || 'MOCK'}</span>
            </div>
          )}
        </div>
      </main>

      <div className="bg-white border-t p-4 flex gap-3">
        <button
          onClick={handleContactMerchant}
          disabled={contacting}
          className="flex-1 py-3 border border-blue-200 rounded-lg text-blue-500 font-medium text-sm disabled:opacity-50"
        >
          {contacting ? '...' : `💬 ${t('order.contactMerchant', 'Contact Merchant')}`}
        </button>
        {order.status === 'PENDING_PAYMENT' && (
          <>
            <button
              onClick={handleCancel}
              className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 font-medium text-sm"
            >
              {t('common.cancel', 'Cancel')}
            </button>
            <button
              onClick={handlePay}
              className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-semibold text-sm"
            >
              {t('order.payNow', 'Pay Now')}
            </button>
          </>
        )}
        {order.status === 'SHIPPED' && (
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 bg-green-500 text-white rounded-lg font-semibold text-sm"
          >
            {t('order.confirmReceipt2', 'Confirm Receipt')}
          </button>
        )}
      </div>
    </div>
  )
}
