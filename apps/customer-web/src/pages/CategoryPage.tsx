import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productApi, type CategoryItem } from '../services/product'
import { useI18nStore } from '../stores/i18nStore'

export default function CategoryPage() {
  const navigate = useNavigate()
  const { t, localeId } = useI18nStore()
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [localeId])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const res = await productApi.getCategories()
      if (res.data.code === 200) {
        setCategories(res.data.data || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f5f6f7]">
      <header className="sticky top-0 z-10 border-b border-black/5 bg-white/95 px-4 py-3 backdrop-blur">
        <h1 className="text-lg font-bold text-center">{t('customer.categories') || 'Categories'}</h1>
      </header>

      <main className="flex-1 px-3 py-4 sm:px-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            {t('common.empty') || 'No categories available'}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate(`/products?categoryId=${cat.id}`)}
                className="min-h-[104px] rounded-xl bg-white p-3 text-center transition-colors hover:bg-gray-100"
              >
                {cat.icon ? (
                  <img src={cat.icon} alt={cat.name} className="mx-auto mb-2 h-11 w-11 object-contain" />
                ) : (
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-300 flex items-center justify-center text-lg">
                    {cat.name.charAt(0)}
                  </div>
                )}
                <span className="line-clamp-2 block text-xs font-medium leading-4 text-[#111]">{cat.name}</span>
              </button>
            ))}
          </div>
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
