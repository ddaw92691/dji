import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { reviewApi } from '../services/review'
import { productApi } from '../services/product'
import uploadApi from '../services/upload'
import { useAuthStore } from '../stores/authStore'

export default function ReviewCreatePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { token } = useAuthStore()

  const orderId = Number(searchParams.get('orderId'))
  const orderItemId = Number(searchParams.get('orderItemId'))
  const productId = Number(searchParams.get('productId'))

  const [productTitle, setProductTitle] = useState('')
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [loadingProduct, setLoadingProduct] = useState(true)

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    if (!orderId || !orderItemId || !productId) {
      setError('Missing required parameters')
      setLoadingProduct(false)
      return
    }
    loadProduct()
  }, [token])

  const loadProduct = async () => {
    try {
      const res = await productApi.getProductDetail(productId)
      if (res.data.code === 200) {
        setProductTitle(res.data.data.title || '')
      }
    } catch {
      setError('Failed to load product')
    } finally {
      setLoadingProduct(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    if (images.length + files.length > 3) {
      setError('Maximum 3 images allowed')
      return
    }
    setUploading(true)
    setError('')
    try {
      for (let i = 0; i < files.length; i++) {
        const res = await uploadApi.uploadImage(files[i], 'review')
        if (res.data.code === 200) {
          setImages((prev) => [...prev, res.data.data.url || res.data.data])
        }
      }
    } catch {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    if (!content.trim()) {
      setError('Please enter review content')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const res = await reviewApi.createReview({
        productId,
        orderId,
        orderItemId,
        rating,
        content: content.trim(),
        images: images.length > 0 ? images : undefined,
      } as any)
      if (res.data.code === 200) {
        navigate(`/orders/${orderId}`, { replace: true })
      } else {
        setError((res.data as any).message || 'Failed to submit review')
      }
    } catch {
      setError('Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) return null

  if (loadingProduct) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 bg-white border-b z-10 p-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-lg">←</button>
          <h1 className="text-base font-semibold">Write Review</h1>
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
        <h1 className="text-base font-semibold">Write Review</h1>
      </header>

      <main className="flex-1 p-4">
        {error && (
          <div className="mb-4 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700">{productTitle}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Content</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Images (optional, up to 3)</p>
          <div className="flex flex-wrap gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded overflow-hidden bg-gray-100">
                <img src={img} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(idx)}
                  className="absolute top-0 right-0 w-5 h-5 bg-black/50 text-white text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < 3 && (
              <label className={`w-20 h-20 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-2xl cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : 'hover:border-blue-500'}`}>
                {uploading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent" />
                ) : (
                  '+'
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || rating === 0}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold text-sm disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </main>
    </div>
  )
}
