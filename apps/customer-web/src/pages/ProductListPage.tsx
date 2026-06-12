import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { productApi, type ProductItem } from '../services/product'
import { useI18nStore } from '../stores/i18nStore'

export default function ProductListPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { t, localeId } = useI18nStore()
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
  }, [categoryId, sort, localeId])

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
        setProducts((prev) => (reset ? list : [...prev, ...list]))
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
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f5f6f7]">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/95 px-4 pb-3 pt-3 backdrop-blur">
        <h1 className="mb-3 text-center text-base font-semibold text-[#111]">
          {t('product.list.title', 'Products')}
        </h1>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={t('product.list.search', 'Search products')}
            className="h-10 min-w-0 rounded-full bg-[#f1f3f5] px-4 text-sm focus:outline-none"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 max-w-[116px] rounded-full bg-[#f1f3f5] px-3 text-sm focus:outline-none"
          >
            <option value="latest">{t('product.sort.latest', 'Latest')}</option>
            <option value="priceAsc">{t('product.sort.priceAsc', 'Price ↑')}</option>
            <option value="priceDesc">{t('product.sort.priceDesc', 'Price ↓')}</option>
            <option value="salesDesc">{t('product.sort.salesDesc', 'Best Selling')}</option>
          </select>
        </div>
      </header>

      <main className="flex-1 px-3 py-4 sm:px-4">
        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            {t('product.list.empty', 'No products found')}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="overflow-hidden rounded-xl bg-white text-left shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md"
                  >
                    <div className="flex aspect-square items-center justify-center overflow-hidden bg-[#f4f5f6]">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0].imageUrl}
                          alt={product.title}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                      <span className="text-gray-400 text-sm">{t('product.noImage', 'No Image')}</span>
                    )}
                  </div>
                  <div className="p-3">
                      <p className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-[#111]">
                        {product.title}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1">
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
                  {loading ? t('common.loading', 'Loading...') : t('product.loadMore', 'Load More')}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <nav className="sticky bottom-0 flex items-center justify-around border-t border-black/5 bg-white/95 px-1 py-2 pb-[calc(8px+env(safe-area-inset-bottom))] backdrop-blur">
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
