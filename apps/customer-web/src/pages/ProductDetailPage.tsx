import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productApi, type ProductItem } from '../services/product'
import { reviewApi, type ReviewItem } from '../services/review'
import { cartApi } from '../services/cart'
import { supportApi } from '../services/support'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'
import { wsEventBus } from '../App'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useI18nStore()
  const { token } = useAuthStore()

  const [product, setProduct] = useState<ProductItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [priceBanner, setPriceBanner] = useState<string | null>(null)
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [reviewPage, setReviewPage] = useState(1)
  const [hasMoreReviews, setHasMoreReviews] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(false)

  useEffect(() => {
    if (id) { loadProduct(Number(id)); loadReviews(Number(id), 1) }
  }, [id])

  const onWsEvent = useCallback((e: Event) => {
    const event = e as CustomEvent
    if ((event.type === 'PRODUCT_PRICE_UPDATED' || event.type === 'PRODUCT_STATUS_UPDATED') && Number(id) === event.detail?.productId) {
      setPriceBanner('Price or status has been updated')
      loadProduct(Number(id))
    }
  }, [id])

  useEffect(() => {
    wsEventBus.addEventListener('PRODUCT_PRICE_UPDATED', onWsEvent)
    wsEventBus.addEventListener('PRODUCT_STATUS_UPDATED', onWsEvent)
    return () => {
      wsEventBus.removeEventListener('PRODUCT_PRICE_UPDATED', onWsEvent)
      wsEventBus.removeEventListener('PRODUCT_STATUS_UPDATED', onWsEvent)
    }
  }, [onWsEvent])

  const loadProduct = async (productId: number) => {
    setLoading(true)
    try {
      const res = await productApi.getProductDetail(productId)
      if (res.data.code === 200) {
        const p = res.data.data
        setProduct(p)
        setMainImage(p.coverImage || (p.images?.[0]?.imageUrl || ''))
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!token) { navigate('/login'); return }
    if (!product) return
    setAddingToCart(true)
    setMessage(null)
    try {
      const res = await cartApi.addItem(product.id, quantity)
      if (res.data.code === 200) {
        setMessage({ text: 'Added to cart', type: 'success' })
      } else {
        setMessage({ text: (res.data as any).message || 'Failed to add', type: 'error' })
      }
    } catch {
      setMessage({ text: 'Failed to add to cart', type: 'error' })
    } finally {
      setAddingToCart(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const loadReviews = async (productId: number, page: number) => {
    setLoadingReviews(true)
    try {
      const res = await reviewApi.getProductReviews(productId, { page, pageSize: 5 })
      if (res.data.code === 200) {
        const data = res.data.data
        const list = data.list || data || []
        if (page === 1) {
          setReviews(list)
          if (data.avgRating !== undefined) setAvgRating(data.avgRating)
          else if (list.length > 0) {
            const avg = list.reduce((sum: number, r: ReviewItem) => sum + r.rating, 0) / list.length
            setAvgRating(Math.round(avg * 10) / 10)
          }
        } else {
          setReviews((prev) => [...prev, ...list])
        }
        setReviewPage(page)
        setHasMoreReviews(list.length >= 5)
      }
    } catch {
      // ignore
    } finally {
      setLoadingReviews(false)
    }
  }

  const loadMoreReviews = () => {
    if (id && hasMoreReviews && !loadingReviews) {
      loadReviews(Number(id), reviewPage + 1)
    }
  }

  const handleBuyNow = () => {
    if (!token) { navigate('/login'); return }
    if (!product) return
    navigate(`/checkout?source=BUY_NOW&productId=${product.id}&quantity=${quantity}`)
  }

  const [contacting, setContacting] = useState(false)
  const handleContactMerchant = async () => {
    if (!token) { navigate('/login'); return }
    if (!product) return
    setContacting(true)
    try {
      const res = await supportApi.createSession({
        merchantId: product.merchantId,
        productId: product.id,
        title: `Inquiry about: ${product.title}`,
        sessionType: 'NORMAL',
      })
      if (res.data.code === 200 && res.data.data) {
        navigate(`/support/${res.data.data.id}`)
      }
    } catch { /* ignore */ } finally {
      setContacting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <p className="text-lg mb-2">{t('common.notFound') || 'Product not found'}</p>
        <button onClick={() => navigate('/')} className="text-blue-500 text-sm">
          {t('common.backHome') || 'Back to Home'}
        </button>
      </div>
    )
  }

  const allImages = product.images?.length
    ? product.images.map((img) => img.imageUrl)
    : product.coverImage
      ? [product.coverImage]
      : []

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f5f6f7]">
      <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b border-black/5 bg-white/95 px-3 backdrop-blur">
        <button onClick={() => navigate(-1)} className="grid h-9 w-9 place-items-center rounded-full text-lg">
          ←
        </button>
        <h1 className="min-w-0 flex-1 truncate text-sm font-semibold text-[#111]">{product.title}</h1>
      </header>

      <main className="flex-1">
        {priceBanner && (
          <div className="mx-3 mt-3 flex items-start justify-between gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-700">
            <span className="min-w-0 flex-1 leading-5">{priceBanner}</span>
            <button
              className="shrink-0 text-xs font-medium underline"
              onClick={() => {
                setPriceBanner(null)
                loadProduct(Number(id))
              }}
            >
              Refresh
            </button>
          </div>
        )}
        <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-white">
          {mainImage ? (
            <img src={mainImage} alt={product.title} className="h-full w-full object-contain" />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>

        {allImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto bg-white px-3 pb-3 pt-2">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 bg-[#f5f6f7] ${
                  mainImage === img ? 'border-blue-500' : 'border-gray-200'
                }`}
              >
                <img src={img} alt="" className="h-full w-full object-contain" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-2 bg-white p-4">
          <h2 className="text-xl font-semibold leading-7 text-[#111]">{product.title}</h2>

          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-red-500">¥{product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">
                ¥{product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex gap-4 mt-3 text-sm text-gray-500">
            <span>Stock: {product.stock}</span>
            <span>Sold: {product.salesCount}</span>
          </div>

          {product.categoryName && (
            <div className="mt-2">
              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs text-gray-600">
                {product.categoryName}
              </span>
            </div>
          )}

          {product.merchantName && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500">
              <span>Seller: <span className="text-gray-700 font-medium">{product.merchantName}</span></span>
              <button
                onClick={handleContactMerchant}
                disabled={contacting}
                className="text-xs text-blue-500 border border-blue-200 rounded-full px-3 py-1 disabled:opacity-50"
              >
                {contacting ? '...' : '💬 Contact'}
              </button>
            </div>
          )}

          {product.description && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                {t('customer.description') || 'Description'}
              </h3>
              <p className="break-words whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>
          )}

          <div className="mt-6 border-t pt-4">
            <h3 className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-gray-700">
              <span>Reviews</span>
              {avgRating > 0 && (
                <span className="text-yellow-400 font-normal">
                  {'★'.repeat(Math.round(avgRating))}
                  {'☆'.repeat(5 - Math.round(avgRating))} {avgRating}
                </span>
              )}
            </h3>
            {loadingReviews && reviews.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No reviews yet</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-3 last:border-0">
                    <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="shrink-0 text-sm text-yellow-400">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                      <span className="max-w-[45vw] truncate text-xs text-gray-400">
                        {review.userName || 'Anonymous'}
                      </span>
                      <span className="text-xs text-gray-300">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="break-words text-sm leading-6 text-gray-700">{review.content}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {hasMoreReviews && (
                  <div className="text-center pt-2">
                    <button
                      onClick={loadMoreReviews}
                      disabled={loadingReviews}
                      className="text-sm text-blue-500 disabled:opacity-50"
                    >
                      {loadingReviews ? 'Loading...' : 'Load more'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="sticky bottom-[calc(58px+env(safe-area-inset-bottom))] z-20 border-t border-black/5 bg-white/95 p-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur">
        {message && (
          <div className={`mb-3 px-3 py-2 rounded-lg text-sm text-center ${
            message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
          }`}>
            {message.text}
          </div>
        )}
        <div className="mb-3 grid grid-cols-[auto_auto_auto_auto_1fr] items-center gap-2">
          <span className="text-sm text-gray-500">Qty:</span>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-9 w-9 rounded-full border border-gray-200 text-gray-500"
          >
            −
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))}
            className="h-9 w-14 rounded-full border border-gray-200 text-center text-sm"
            min={1}
            max={product.stock}
          />
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="h-9 w-9 rounded-full border border-gray-200 text-gray-500"
          >
            +
          </button>
          <span className="min-w-0 truncate text-right text-xs text-gray-400">
            Stock: {product.stock}
          </span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock <= 0}
            className="min-h-11 flex-1 rounded-full border border-orange-500 px-3 py-3 text-sm font-semibold text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="min-h-11 flex-1 rounded-full bg-orange-500 px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Buy Now
          </button>
        </div>
      </div>

      <nav className="sticky bottom-0 z-30 flex items-center justify-around border-t border-black/5 bg-white/95 px-1 py-2 pb-[calc(8px+env(safe-area-inset-bottom))] backdrop-blur">
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
            className="flex min-w-0 flex-1 flex-col items-center px-1 text-[11px] leading-4 text-gray-500"
          >
            <span className="mb-0.5 text-base leading-none">●</span>
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
