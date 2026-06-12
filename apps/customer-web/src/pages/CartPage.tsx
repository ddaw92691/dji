import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartApi, type CartData, type CartItem } from '../services/cart'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'

export default function CartPage() {
  const { t, localeId } = useI18nStore()
  const { token } = useAuthStore()
  const navigate = useNavigate()

  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<Set<number>>(new Set())
  const [error, setError] = useState('')

  const fetchCart = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await cartApi.getCart()
      if (res.data.code === 200) {
        setCart(res.data.data)
      }
    } catch {
      setError(t('mall.cart.loadFailed', 'Failed to load cart'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    fetchCart()
  }, [token, localeId, fetchCart])

  const handleQuantityChange = async (item: CartItem, delta: number) => {
    const newQty = item.quantity + delta
    if (newQty < 1 || newQty > item.stock) return
    setUpdating((prev) => new Set(prev).add(item.id))
    try {
      const res = await cartApi.updateItem(item.id, { quantity: newQty })
      if (res.data.code === 200) await fetchCart()
    } catch {
      // ignore
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    }
  }

  const handleToggleSelect = async (item: CartItem) => {
    setUpdating((prev) => new Set(prev).add(item.id))
    try {
      const res = await cartApi.updateItem(item.id, { selected: !item.selected })
      if (res.data.code === 200) await fetchCart()
    } catch {
      // ignore
    } finally {
      setUpdating((prev) => {
        const next = new Set(prev)
        next.delete(item.id)
        return next
      })
    }
  }

  const handleSelectAll = async () => {
    const allSelected = cart?.items.every((i) => i.selected) ?? false
    try {
      const res = await cartApi.selectAll(!allSelected)
      if (res.data.code === 200) await fetchCart()
    } catch {
      // ignore
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await cartApi.deleteItem(id)
      await fetchCart()
    } catch {
      // ignore
    }
  }

  const handleCheckout = () => {
    if (!cart || cart.selectedCount === 0) return
    const selectedIds = cart.items.filter((i) => i.selected).map((i) => i.id).join(',')
    navigate(`/checkout?items=${selectedIds}`)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title={t('customer.cart') || 'Cart'} onBack={() => navigate(-1)} />
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      </div>
    )
  }

  const items = cart?.items || []
  const allSelected = items.length > 0 && items.filter((i) => i.available).every((i) => i.selected)
  const hasUnavailable = items.some((i) => !i.available)

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={t('customer.cart') || 'Cart'} onBack={() => navigate(-1)} />

      {error ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 p-4">
          <p className="text-red-500 text-sm">{error}</p>
          <button onClick={fetchCart} className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm">
            {t('common.retry', 'Retry')}
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-4 p-4">
          <span className="text-6xl text-gray-300">🛒</span>
          <p className="text-gray-400 text-sm">{t('mall.cart.empty', 'Your cart is empty')}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm"
          >
            {t('mall.cart.goShopping', 'Go Shopping')}
          </button>
        </div>
      ) : (
        <>
          <main className="flex-1 overflow-y-auto">
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-white">
              <button
                onClick={handleSelectAll}
                className="text-sm flex items-center gap-2"
              >
                <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-white text-xs ${
                  allSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                }`}>
                  {allSelected ? '✓' : ''}
                </span>
                <span className="text-gray-600">{t('mall.cart.selectAll', 'Select All')}</span>
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.id}
                className={`p-4 bg-white border-b ${!item.available ? 'opacity-50' : ''}`}
              >
                <div className="flex gap-3">
                  {item.available ? (
                    <button
                      onClick={() => handleToggleSelect(item)}
                      disabled={updating.has(item.id)}
                      className="flex-shrink-0 self-center"
                    >
                      <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-white text-xs ${
                        item.selected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      }`}>
                        {item.selected ? '✓' : ''}
                      </span>
                    </button>
                  ) : (
                    <span className="w-5 h-5 flex-shrink-0 self-center rounded border-2 border-gray-200 bg-gray-100" />
                  )}

                  <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    {item.coverImage ? (
                      <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">{t('product.noImage', 'No Image')}</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>

                    {!item.available && (
                      <p className="text-xs text-red-400 mt-0.5">
                        {item.productStatus === 'OFF_SHELF'
                          ? t('mall.cart.productRemoved', 'Product removed')
                          : t('mall.cart.outOfStock', 'Out of stock')}
                      </p>
                    )}

                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-sm font-bold text-red-500">¥{item.price.toFixed(2)}</span>
                      {item.originalPrice > item.price && (
                        <span className="text-xs text-gray-400 line-through">¥{item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {item.available ? (
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={item.quantity <= 1 || updating.has(item.id)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 disabled:text-gray-300"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item, 1)}
                            disabled={item.quantity >= item.stock || updating.has(item.id)}
                            className="w-7 h-7 flex items-center justify-center text-gray-500 disabled:text-gray-300"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">×{item.quantity}</span>
                      )}

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-xs text-gray-400 hover:text-red-500"
                      >
                        {t('common.delete', 'Delete')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {hasUnavailable && (
              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-400 border-b">
                {t('mall.cart.unavailableTip', 'Some items are no longer available and cannot be purchased.')}
              </div>
            )}
          </main>

          <div className="bg-white border-t p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">
                {t('mall.cart.selected', 'Selected')}: <span className="font-bold text-gray-900">{cart?.selectedCount || 0}</span> {t('mall.cart.items', 'items')}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-sm text-gray-600">{t('common.total', 'Total')}:</span>
                <span className="text-lg font-bold text-red-500">
                  ¥{(cart?.selectedTotalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={!cart || cart.selectedCount === 0}
              className="w-full py-3 rounded-lg bg-orange-500 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('mall.cart.checkout', 'Checkout')}
            </button>
          </div>
        </>
      )}

      <BottomNav navigate={navigate} t={t} />
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
