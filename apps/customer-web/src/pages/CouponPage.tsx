import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { couponApi, type CouponItem, type UserCouponItem } from '../services/coupon'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'

const COUPON_TYPE_LABELS: Record<string, string> = {
  FIXED_AMOUNT: 'Fixed Amount',
  PERCENTAGE: 'Percentage',
  FULL_REDUCTION: 'Full Reduction',
  DISCOUNT: 'Discount',
  CASH: 'Cash',
}

const COUPON_STATUS_COLORS: Record<string, string> = {
  UNUSED: 'bg-green-100 text-green-700',
  USED: 'bg-gray-100 text-gray-500',
  EXPIRED: 'bg-red-100 text-red-700',
}

export default function CouponPage() {
  const { t, localeId } = useI18nStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<'available' | 'my'>('available')

  const [availableCoupons, setAvailableCoupons] = useState<CouponItem[]>([])
  const [availableLoading, setAvailableLoading] = useState(true)
  const [availableError, setAvailableError] = useState('')

  const [myCoupons, setMyCoupons] = useState<UserCouponItem[]>([])
  const [myLoading, setMyLoading] = useState(true)
  const [myError, setMyError] = useState('')

  const [successMsg, setSuccessMsg] = useState('')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
  }, [token])

  const loadAvailable = useCallback(async () => {
    setAvailableLoading(true)
    setAvailableError('')
    try {
      const res = await couponApi.getAvailable()
      if (res.data.code === 200) {
        setAvailableCoupons(res.data.data.list || [])
      }
    } catch {
      setAvailableError(t('coupon.loadFailed', 'Failed to load coupons'))
    } finally {
      setAvailableLoading(false)
    }
  }, [t])

  const loadMyCoupons = useCallback(async () => {
    setMyLoading(true)
    setMyError('')
    try {
      const res = await couponApi.getMyCoupons()
      if (res.data.code === 200) {
        setMyCoupons(res.data.data.list || [])
      }
    } catch {
      setMyError(t('coupon.loadFailed', 'Failed to load coupons'))
    } finally {
      setMyLoading(false)
    }
  }, [t])

  useEffect(() => {
    if (activeTab === 'available') loadAvailable()
    else loadMyCoupons()
  }, [activeTab, localeId, loadAvailable, loadMyCoupons])

  const handleReceive = async (coupon: CouponItem) => {
    try {
      const res = await couponApi.receive(coupon.id)
      if (res.data.code === 200) {
        setSuccessMsg(t('coupon.received', 'Coupon received!'))
        setTimeout(() => setSuccessMsg(''), 2000)
        loadAvailable()
      }
    } catch {
      setSuccessMsg(t('coupon.receiveFailed', 'Failed to receive coupon'))
      setTimeout(() => setSuccessMsg(''), 2000)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-lg">←</button>
        <h1 className="text-base font-semibold">{t('customer.coupons') || 'Coupons'}</h1>
      </header>

      <div className="flex bg-white border-b">
        <button
          onClick={() => setActiveTab('available')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'available' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          {t('coupon.available', 'Available Coupons')}
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'my' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'
          }`}
        >
          {t('coupon.mine', 'My Coupons')}
        </button>
      </div>

      {successMsg && (
        <div className="mx-3 mt-3 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm text-center">
          {successMsg}
        </div>
      )}

      <main className="flex-1 overflow-y-auto p-3">
        {activeTab === 'available' ? (
          availableLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : availableError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-red-500 text-sm">{availableError}</p>
              <button onClick={loadAvailable} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">{t('common.retry', 'Retry')}</button>
            </div>
          ) : availableCoupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
              <p className="text-sm">{t('coupon.noneAvailable', 'No coupons available')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableCoupons.map((coupon) => (
                <div key={coupon.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        coupon.type === 'FIXED_AMOUNT' || coupon.type === 'FULL_REDUCTION' ? 'bg-orange-100 text-orange-600' :
                        coupon.type === 'PERCENTAGE' || coupon.type === 'DISCOUNT' ? 'bg-blue-100 text-blue-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        {COUPON_TYPE_LABELS[coupon.type] || coupon.type}
                      </span>
                    </div>
                    <button
                      onClick={() => handleReceive(coupon)}
                      className="text-xs px-4 py-1.5 bg-blue-500 text-white rounded font-medium"
                    >
                      {t('coupon.receive', 'Receive')}
                    </button>
                  </div>
                  <p className="text-base font-bold text-gray-900">{coupon.name}</p>
                  <p className="text-sm text-red-500 mt-1">
                    {coupon.type === 'PERCENTAGE' || coupon.type === 'DISCOUNT'
                      ? `${coupon.discountRate}% ${t('mall.checkout.off', 'off')}`
                      : `¥${coupon.amount} ${t('mall.checkout.off', 'off')}`
                    }
                  </p>
                  {coupon.minSpend > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{t('mall.checkout.min', 'Min')} ¥{coupon.minSpend}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(coupon.startAt)} ~ {formatDate(coupon.endAt)}
                  </p>
                </div>
              ))}
            </div>
          )
        ) : (
          myLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
            </div>
          ) : myError ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <p className="text-red-500 text-sm">{myError}</p>
              <button onClick={loadMyCoupons} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">{t('common.retry', 'Retry')}</button>
            </div>
          ) : myCoupons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-400">
              <p className="text-sm">{t('coupon.noneMine', 'No coupons yet')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myCoupons.map((coupon) => (
                <div key={coupon.id} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      coupon.type === 'FIXED_AMOUNT' || coupon.type === 'FULL_REDUCTION' ? 'bg-orange-100 text-orange-600' :
                      coupon.type === 'PERCENTAGE' || coupon.type === 'DISCOUNT' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {COUPON_TYPE_LABELS[coupon.type] || coupon.type}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${COUPON_STATUS_COLORS[coupon.status] || 'bg-gray-100 text-gray-500'}`}>
                      {coupon.status}
                    </span>
                  </div>
                  <p className="text-base font-bold text-gray-900">{coupon.name}</p>
                  <p className="text-sm text-red-500 mt-1">
                    {coupon.type === 'PERCENTAGE' || coupon.type === 'DISCOUNT'
                      ? `${coupon.discountRate}% ${t('mall.checkout.off', 'off')}`
                      : `¥${coupon.amount} ${t('mall.checkout.off', 'off')}`
                    }
                  </p>
                  {coupon.minSpend > 0 && (
                    <p className="text-xs text-gray-400 mt-1">{t('mall.checkout.min', 'Min')} ¥{coupon.minSpend}</p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{t('coupon.receivedAt', 'Received')}: {formatDate(coupon.receivedAt)}</span>
                    {coupon.usedAt && <span>{t('coupon.usedAt', 'Used')}: {formatDate(coupon.usedAt)}</span>}
                  </div>
                  {coupon.endAt && (
                    <p className="text-xs text-gray-400 mt-0.5">{t('coupon.expires', 'Expires')}: {formatDate(coupon.endAt)}</p>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  )
}
