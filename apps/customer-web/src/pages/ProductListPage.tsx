import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { productApi, type ProductItem } from '../services/product'
import { useI18nStore } from '../stores/i18nStore'

export default function ProductListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t, countryCode } = useI18nStore()
  const categoryId = searchParams.get('categoryId') || ''

  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [sort, setSort] = useState('latest')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const pageSize = 10

  useEffect(() => {
    setPage(1)
    setProducts([])
    loadProducts(1, true)
  }, [categoryId, sort])

  const loadProducts = async (pageNum: number, reset = false) => {
    setLoading(true)
    try {
      const params: Record<string, unknown> = {
        page: pageNum,
        pageSize,
        sort,
      }
      if (categoryId) params.categoryId = Number(categoryId)
      if (keyword) params.keyword = keyword

      const res = await productApi.getProducts(params)
      if (res.data.code === 200) {
        const list = res.data.data?.list || []
        setProducts(reset ? list : [...products, ...list])
        setTotal(res.data.data?.total || 0)
        setPage(pageNum)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setProducts([])
    loadProducts(1, true)
  }

  const hasMore = products.length < total

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white border-b z-10 p-4">
        <h1 className="text-lg font-bold text-center mb-3">
          {t('customer.products') || 'Products'}
        </h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t('customer.searchPlaceholder') || 'Search products...'}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-2 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none"
          >
            <option value="latest">Latest</option>
            <option value="priceAsc">Price ↑</option>
            <option value="priceDesc">Price ↓</option>
            <option value="salesDesc">Best Selling</option>
          </select>
        </div>
      </header>

      <main className="flex-1 p-4">
        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            {t('common.empty') || 'No products found'}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="bg-white border rounded-lg overflow-hidden text-left hover:shadow-md transition-shadow"
                >
                  <div className="bg-gray-200 h-40 flex items-center justify-center overflow-hidden">
                    {product.coverImage ? (
                      <img
                        src={product.coverImage}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">{product.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-sm text-red-500 font-semibold">
                        ¥{product.price.toFixed(2)}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">
                          ¥{product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => loadProducts(page + 1)}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <nav className="sticky bottom-0 bg-white border-t flex items-center justify-around py-2">
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
    </div>
  )
}
