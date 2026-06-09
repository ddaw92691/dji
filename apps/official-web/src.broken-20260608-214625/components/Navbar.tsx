import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-wider text-white">MALL</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/products" className="hover:text-white transition-colors">Products</Link>
          <a href="http://localhost:4173" target="_blank" rel="noopener"
             className="ml-4 px-5 py-2 bg-white text-black rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">
            Enter Store →
          </a>
        </div>
        <a href="http://localhost:4173" target="_blank" rel="noopener"
           className="md:hidden px-4 py-1.5 bg-white text-black rounded-full text-xs font-semibold">
          Store →
        </a>
      </div>
    </nav>
  )
}
