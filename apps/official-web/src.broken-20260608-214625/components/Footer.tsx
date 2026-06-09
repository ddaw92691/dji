export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Products</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p><a href="http://localhost:4173/products" target="_blank" className="hover:text-white">All Products</a></p>
              <p><a href="http://localhost:4173/products?sort=latest" target="_blank" className="hover:text-white">New Arrivals</a></p>
              <p><a href="http://localhost:4173/products?sort=salesDesc" target="_blank" className="hover:text-white">Best Sellers</a></p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p><a href="http://localhost:4173/orders" target="_blank" className="hover:text-white">Order Status</a></p>
              <p><a href="http://localhost:4173/support" target="_blank" className="hover:text-white">Customer Service</a></p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p className="hover:text-white cursor-pointer">About Us</p>
              <p className="hover:text-white cursor-pointer">Contact</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Store</h4>
            <a href="http://localhost:4173" target="_blank" rel="noopener"
               className="inline-block px-6 py-3 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
              Shop Now →
            </a>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-xs text-gray-500">
          © 2026 Mall System. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
