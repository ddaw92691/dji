import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, type HomeData, type ProductItem } from '../services/product'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.getHome().then(r => { if (r.data.code === 200) setData(r.data.data) }).finally(() => setLoading(false)) }, [])

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-hero overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent" />
        <div className="relative max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight leading-tight">
              <span className="text-gradient">Discover Amazing</span><br />
              <span className="text-white">Technology Products</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed">
              Explore our curated collection of premium products. From electronics to fashion, find everything you need.
            </p>
            <div className="mt-10 flex gap-4">
              <a href="http://localhost:4173" target="_blank" rel="noopener"
                 className="px-8 py-3.5 bg-white text-black rounded-full text-base font-semibold hover:bg-gray-200 transition-colors">
                Shop Now
              </a>
              <Link to="/products"
                 className="px-8 py-3.5 border border-white/30 text-white rounded-full text-base font-semibold hover:bg-white/10 transition-colors">
                Explore Products
              </Link>
            </div>
          </div>
        </div>
        {data?.banners && data.banners.length > 0 && (
          <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 mt-16 md:mt-24">
            <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-white/5">
              <img src={data.banners[0].imageUrl} alt={data.banners[0].title} className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <h2 className="text-2xl md:text-4xl font-bold">{data.banners[0].title}</h2>
                <p className="mt-2 text-gray-300">{data.banners[0].subtitle}</p>
              </div>
            </div>
          </div>
        )}
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {(data?.categories || []).map(c => (
              <Link key={c.id} to={`/products?categoryId=${c.id}`} className="group p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-center">
                <span className="text-3xl">{c.icon}</span>
                <p className="mt-3 text-sm font-medium text-gray-300 group-hover:text-white">{c.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24 bg-white/[0.02]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Recommended</h2>
            <Link to="/products?sort=latest" className="text-sm text-gray-400 hover:text-white">View All →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {(data?.recommendedProducts || []).slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">Hot Products</h2>
            <Link to="/products?sort=salesDesc" className="text-sm text-gray-400 hover:text-white">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {(data?.hotProducts || []).slice(0, 4).map(p => (
              <Link key={p.id} to={`/products/${p.id}`} className="group flex gap-6 p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <img src={p.coverImage} alt={p.title} className="w-32 h-32 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-semibold group-hover:text-gray-200">{p.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold">${p.price}</span>
                    {p.originalPrice && p.originalPrice > p.price && <span className="text-sm text-gray-500 line-through">${p.originalPrice}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}

function ProductCard({ product }: { product: ProductItem }) {
  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="aspect-[4/5] rounded-xl overflow-hidden bg-white/5 mb-4">
        <img src={product.coverImage} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <h3 className="font-medium text-sm text-gray-200 group-hover:text-white line-clamp-1">{product.title}</h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="font-bold">${product.price}</span>
        {product.originalPrice && product.originalPrice > product.price && <span className="text-xs text-gray-500 line-through">${product.originalPrice}</span>}
      </div>
    </Link>
  )
}
