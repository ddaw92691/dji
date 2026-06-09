import { useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { cartApi, type CartItem } from '../services/cart'
import { addressApi, type AddressItem } from '../services/address'
import { orderApi } from '../services/order'
import { couponApi, type UserCouponItem } from '../services/coupon'
import { productApi } from '../services/product'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'

export default function CheckoutPage() {
  const { t } = useI18nStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [selectedItems, setSelectedItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<AddressItem[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<number>(0)
  const [remark, setRemark] = useState('')
  const [buyNowProduct, setBuyNowProduct] = useState<{ productId: number; quantity: number } | null>(null)

  const [usableCoupons, setUsableCoupons] = useState<UserCouponItem[]>([])
  const [selectedUserCouponId, setSelectedUserCouponId] = useState<number | null>(null)
  const [priceWarning, setPriceWarning] = useState('')

  const source = searchParams.get('source')
  const itemsParam = searchParams.get('items')
  const productId = searchParams.get('productId')
  const qty = searchParams.get('quantity')

  const isBuyNow = source === 'BUY_NOW' && productId

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    loadData()
  }, [token])

  const loadData = async () => {
    setLoading(true)
    setError('')
    let items: CartItem[] = []
    try {
      if (isBuyNow && productId) {
        setBuyNowProduct({ productId: Number(productId), quantity: Number(qty) || 1 })
      } else if (itemsParam) {
        const ids = itemsParam.split(',').map(Number)
        const res = await cartApi.getCart()
        if (res.data.code === 200) {
          items = res.data.data.items.filter((i) => ids.includes(i.id) && i.selected && i.available)
          setSelectedItems(items)
        }
      }

      const addrRes = await addressApi.getAddresses()
      if (addrRes.data.code === 200) {
        const list = addrRes.data.data
        setAddresses(list)
        const def = list.find((a) => a.isDefault)
        setSelectedAddressId(def ? def.id : (list[0]?.id || 0))
      }

      const computedTotal = isBuyNow ? 0 : items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      if (computedTotal > 0) {
        try {
          const couponRes = await couponApi.getUsable(computedTotal)
          if (couponRes.data.code === 200) {
            setUsableCoupons(couponRes.data.data || [])
          }
        } catch { /* coupon fetch is optional */ }
      }
    } catch {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = useMemo(() => {
    if (buyNowProduct) return 0
    return selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  }, [selectedItems, buyNowProduct])

  const selectedCoupon = useMemo(() => {
    if (!selectedUserCouponId) return null
    return usableCoupons.find((c) => c.id === selectedUserCouponId) || null
  }, [selectedUserCouponId, usableCoupons])

  const couponDiscount = useMemo(() => {
    if (!selectedCoupon) return 0
    if (selectedCoupon.type === 'PERCENTAGE' || selectedCoupon.type === 'DISCOUNT') {
      return Math.round(totalAmount * selectedCoupon.discountRate / 100 * 100) / 100
    }
    return Math.min(selectedCoupon.amount, totalAmount)
  }, [selectedCoupon, totalAmount])

  const finalPayAmount = useMemo(() => {
    return Math.max(0, totalAmount - couponDiscount)
  }, [totalAmount, couponDiscount])

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError('Please select a shipping address')
      return
    }

    setPriceWarning('')
    setSubmitting(true)
    setError('')

    try {
      if (!isBuyNow && selectedItems.length > 0) {
        const latestPrices: Record<number, number> = {}
        for (const item of selectedItems) {
          try {
            const pres = await productApi.getProductDetail(item.productId)
            if (pres.data.code === 200 && pres.data.data) {
              latestPrices[item.productId] = pres.data.data.price
            }
          } catch { /* ignore individual fetch */ }
        }
        const changedItems = selectedItems.filter(
          (item) => latestPrices[item.productId] !== undefined && latestPrices[item.productId] !== item.price
        )
        if (changedItems.length > 0) {
          const names = changedItems.map((i) => i.title).join(', ')
          setPriceWarning(`Prices have changed for: ${names}. Please review before placing order.`)
          setSubmitting(false)
          return
        }
      }

      const data: any = {
        addressId: selectedAddressId,
        remark: remark,
        userCouponId: selectedUserCouponId || null,
      }

      if (isBuyNow && buyNowProduct) {
        data.source = 'BUY_NOW'
        data.items = [{ productId: buyNowProduct.productId, quantity: buyNowProduct.quantity }]
      } else {
        data.source = 'CART'
        data.cartItemIds = selectedItems.map((i) => i.id)
      }

      const res = await orderApi.createOrder(data)
      if (res.data.code === 200) {
        const orders = res.data.data.orders
        if (orders && orders.length > 0) {
          navigate(`/payment/${orders[0].id}`)
        }
      } else {
        setError('Failed to create order')
      }
    } catch {
      setError('Failed to create order')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Checkout" onBack={() => navigate(-1)} />
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Checkout" onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto">
        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        {priceWarning && (
          <div className="mx-4 mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm flex items-center justify-between">
            <span>{priceWarning}</span>
            <button
              onClick={() => { setPriceWarning(''); window.location.reload() }}
              className="text-xs bg-yellow-200 px-2 py-1 rounded"
            >Refresh</button>
          </div>
        )}

        <div className="p-4 border-b bg-white">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h2>
          {addresses.length === 0 ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">No address</span>
              <button
                onClick={() => navigate('/addresses')}
                className="text-sm text-blue-500"
              >
                + Add Address
              </button>
            </div>
          ) : (
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              {addresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.receiverName} {addr.phone} - {[addr.province, addr.city, addr.detail].filter(Boolean).join(', ')}
                  {addr.isDefault ? ' [Default]' : ''}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => navigate('/addresses')}
            className="text-sm text-blue-500 mt-2 inline-block"
          >
            + Add New Address
          </button>
        </div>

        {!isBuyNow && selectedItems.length > 0 && (
          <div className="p-4 bg-white border-b">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Order Items</h2>
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  {item.coverImage ? (
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-red-500 font-medium">¥{item.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-400">×{item.quantity}</span>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ¥{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}

        {isBuyNow && (
          <div className="p-4 bg-white border-b">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Buy Now</h2>
            <p className="text-xs text-gray-500">Product #{productId} × {qty || 1}</p>
          </div>
        )}

        {!isBuyNow && usableCoupons.length > 0 && (
          <div className="p-4 bg-white border-b">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Select Coupon</h2>
            <select
              value={selectedUserCouponId || ''}
              onChange={(e) => setSelectedUserCouponId(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="">No coupon</option>
              {usableCoupons.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type === 'PERCENTAGE' || c.type === 'DISCOUNT' ? `${c.discountRate}% off` : `¥${c.amount} off`})
                  {c.minSpend > 0 ? ` · Min ¥${c.minSpend}` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="p-4 bg-white border-b">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Remark</h2>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Leave a message for the seller..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        <div className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Order Total</span>
            <span className="text-sm">
              ¥{isBuyNow ? '---' : totalAmount.toFixed(2)}
            </span>
          </div>
          {couponDiscount > 0 && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-gray-600">Coupon Discount</span>
              <span className="text-sm text-red-500">-¥{couponDiscount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-1 pt-1 border-t">
            <span className="text-sm font-semibold text-gray-800">Pay Amount</span>
            <span className="text-xl font-bold text-red-500">
              ¥{isBuyNow ? '---' : finalPayAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </main>

      <div className="bg-white border-t p-4">
        <button
          onClick={handlePlaceOrder}
          disabled={submitting || !selectedAddressId}
          className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
      <button onClick={onBack} className="text-lg">←</button>
      <h1 className="text-base font-semibold">{title}</h1>
    </header>
  )
}
