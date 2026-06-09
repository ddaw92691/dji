import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

type NavItem = {
  label: string
  to?: string
  external?: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { label: 'Camera Drones', to: '/camera-drones' },
  { label: 'Handheld', to: '/handheld' },
  {
    label: 'Lifestyle Tech',
    children: [
      { label: 'Power Stations', to: '/lifestyle-tech/power-stations' },
      { label: 'Robot Vacuums', to: '/lifestyle-tech/robot-vacuums' },
    ],
  },
  {
    label: 'Specialized',
    children: [
      { label: 'Enterprise', external: 'https://enterprise.dji.com/?site=brandsite&from=nav' },
      { label: 'Agriculture', external: 'https://ag.dji.com/?site=brandsite&from=nav' },
      { label: 'DJI Delivery', to: '/delivery' },
    ],
  },
  {
    label: 'Explore',
    children: [
      { label: 'Who We Are', to: '/company' },
      { label: 'SkyPixel', external: 'https://www.skypixel.com/?site=brandsite&from=nav' },
      { label: 'DJI Forum', external: 'https://forum.dji.com/?site=brandsite&from=nav' },
      { label: 'Media Center', to: '/media-center' },
      { label: 'DJI Trust Center', to: '/trust-center' },
      { label: 'DJI Blog', external: 'https://viewpoints.dji.com/blog?site=brandsite&from=nav' },
      { label: 'Careers', external: 'https://we.dji.com/index_en.html?site=brandsite&from=nav' },
    ],
  },
  { label: 'Support', to: '/support' },
  { label: 'Where to Buy', to: '/where-to-buy' },
]

const shellClass = 'mx-auto w-full max-w-[1210px] px-5 xl:px-0'

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const solid = scrolled || open || location.pathname !== '/'

  return (
    <nav
      className={[
        'fixed left-0 right-0 top-0 z-50 h-14 transition-all duration-300',
        solid
          ? 'bg-white/95 text-[#1f1f1f] shadow-[0_1px_10px_rgba(0,0,0,0.06)] backdrop-blur'
          : 'bg-transparent text-white',
      ].join(' ')}
    >
      <div className={`grid h-full grid-cols-[auto_auto_1fr] items-center md:grid-cols-[auto_1fr_auto] ${shellClass}`}>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen((value) => !value)}
          className="mr-3 flex h-9 w-9 flex-col justify-center gap-[7px] md:hidden"
        >
          <span className="block h-[2px] w-6 bg-current" />
          <span className="block h-[2px] w-6 bg-current" />
        </button>

        <Link to="/" aria-label="DJI Home" className="flex h-full w-[44px] shrink-0 items-center justify-self-start md:w-[46px]">
          <img
            src={solid ? '/nav/logo-black.webp' : '/nav/logo-white.webp'}
            alt="DJI"
            className="block h-auto w-full object-contain"
          />
        </Link>

        <div className="hidden items-center justify-center gap-[32px] justify-self-center text-[13px] font-normal leading-none md:flex xl:gap-[38px]">
          {navItems.map((item) => (
            <div key={item.label} className="group relative flex h-14 items-center">
              <NavLink item={item} className="whitespace-nowrap opacity-95 transition-opacity hover:opacity-100" />
              {item.children && (
                <div className="invisible absolute left-1/2 top-full min-w-[210px] -translate-x-1/2 rounded-b-lg bg-white py-3 text-[#1f1f1f] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.label}
                      item={child}
                      className="block px-5 py-3 text-[13px] leading-none text-[#333] hover:bg-[#f5f5f5]"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-[20px] justify-self-end md:flex">
          <Link to="/products" aria-label="Search" className="opacity-90 hover:opacity-100">
            <SearchIcon />
          </Link>
          <a href="http://localhost:4173/login" target="_blank" rel="noopener" aria-label="Account" className="opacity-90 hover:opacity-100">
            <UserIcon />
          </a>
          <button
            type="button"
            className={[
              'inline-flex h-8 items-center gap-2 rounded-full px-4 text-[13px] font-normal transition-colors',
              solid ? 'bg-[#f3f4f5]' : 'bg-white/15',
            ].join(' ')}
          >
            <GlobeIcon />
            Singapore
          </button>
          <a
            href="http://localhost:4173"
            target="_blank"
            rel="noopener"
            className="inline-flex h-8 min-w-[78px] items-center justify-center gap-2 rounded-full bg-[#0a84ff] px-4 text-[13px] font-normal text-white"
          >
            <BagIcon />
            Store
          </a>
        </div>

        <div className="flex items-center gap-5 justify-self-end md:hidden">
          <Link to="/products" aria-label="Search">
            <SearchIcon />
          </Link>
          <a href="http://localhost:4173" target="_blank" rel="noopener" aria-label="Store">
            <BagIcon />
          </a>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-white px-6 py-3 text-[#1f1f1f] shadow-lg md:hidden">
          {navItems.map((item) => (
            <div key={item.label} className="border-b border-black/5 py-3">
              <NavLink item={item} onClick={() => setOpen(false)} className="block py-1 text-[13px]" />
              {item.children?.map((child) => (
                <NavLink key={child.label} item={child} onClick={() => setOpen(false)} className="block py-2 pl-4 text-[12px] text-[#666]" />
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  )
}

function NavLink({ item, className, onClick }: { item: NavItem; className?: string; onClick?: () => void }) {
  if (item.external) {
    return (
      <a href={item.external} target="_blank" rel="noopener" onClick={onClick} className={className}>
        {item.label}
      </a>
    )
  }

  return (
    <Link to={item.to || '#'} onClick={onClick} className={className}>
      {item.label}
    </Link>
  )
}

function SearchIcon() {
  return (
    <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.8 18.1a7.3 7.3 0 1 1 5.2-2.1l4 4-1.3 1.3-4-4a7.2 7.2 0 0 1-3.9.8Zm0-1.8a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg className="h-[18px] w-[18px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12.3a4.7 4.7 0 1 1 0-9.4 4.7 4.7 0 0 1 0 9.4Zm0-1.8a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8Zm8.2 10.6h-1.8a6.4 6.4 0 0 0-12.8 0H3.8a8.2 8.2 0 0 1 16.4 0Z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg className="h-[14px] w-[14px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm5.7-10a7 7 0 0 0-1.4-3.7h-2.1c.3 1.1.5 2.4.6 3.7h2.9Zm-4.8 0a18 18 0 0 0-.6-3.7h-.6a18 18 0 0 0-.6 3.7h1.8Zm-3.7 0c.1-1.3.3-2.6.6-3.7H7.7A7 7 0 0 0 6.3 11h2.9Zm-2.9 2a7 7 0 0 0 1.4 3.7h2.1A17 17 0 0 1 9.2 13H6.3Zm4.8 0c.1 1.4.3 2.6.6 3.7h.6c.3-1.1.5-2.3.6-3.7h-1.8Zm3.7 0c-.1 1.4-.3 2.6-.6 3.7h2.1a7 7 0 0 0 1.4-3.7h-2.9Z" />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg className="h-[15px] w-[15px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7.5V7a5 5 0 0 1 10 0v.5h2.1l1 13.5H3.9l1-13.5H7Zm1.8 0h6.4V7a3.2 3.2 0 0 0-6.4 0v.5Zm-2.2 1.8-.7 9.9h12.2l-.7-9.9H6.6Z" />
    </svg>
  )
}
