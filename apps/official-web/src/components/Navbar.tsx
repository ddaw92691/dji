import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { getMallUrl } from '../utils/mallUrl'
import LanguageSelector from './LanguageSelector'

type NavItem = {
  // labelKey 走语言包；label 为品牌专有名词，不翻译
  labelKey?: string
  label?: string
  to?: string
  external?: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { labelKey: 'website.nav.cameraDrones', to: '/camera-drones' },
  { labelKey: 'website.nav.handheld', to: '/handheld' },
  {
    labelKey: 'website.nav.lifestyleTech',
    children: [
      { labelKey: 'website.nav.powerStations', to: '/lifestyle-tech/power-stations' },
      { labelKey: 'website.nav.robotVacuums', to: '/lifestyle-tech/robot-vacuums' },
    ],
  },
  {
    labelKey: 'website.nav.specialized',
    children: [
      { labelKey: 'website.nav.enterprise', external: 'https://enterprise.dji.com/?site=brandsite&from=nav' },
      { labelKey: 'website.nav.agriculture', external: 'https://ag.dji.com/?site=brandsite&from=nav' },
      { labelKey: 'website.nav.delivery', to: '/delivery' },
    ],
  },
  {
    labelKey: 'website.nav.explore',
    children: [
      { labelKey: 'website.nav.whoWeAre', to: '/company' },
      { label: 'SkyPixel', external: 'https://www.skypixel.com/?site=brandsite&from=nav' },
      { label: 'DJI Forum', external: 'https://forum.dji.com/?site=brandsite&from=nav' },
      { labelKey: 'website.nav.mediaCenter', to: '/media-center' },
      { labelKey: 'website.nav.trustCenter', to: '/trust-center' },
      { label: 'DJI Blog', external: 'https://viewpoints.dji.com/blog?site=brandsite&from=nav' },
      { labelKey: 'website.nav.careers', external: 'https://we.dji.com/index_en.html?site=brandsite&from=nav' },
    ],
  },
  { labelKey: 'website.nav.support', to: '/support' },
  { labelKey: 'website.nav.whereToBuy', to: '/where-to-buy' },
]

const shellClass = 'mx-auto w-full max-w-[1210px] px-5 xl:px-0'

export default function Navbar() {
  const location = useLocation()
  const { t } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const mallProductsUrl = getMallUrl('/products')
  const mallLoginUrl = getMallUrl('/login')

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
          aria-label={t('website.nav.menuAria')}
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
            <div key={item.labelKey || item.label} className="group relative flex h-14 items-center">
              <NavLink item={item} className="whitespace-nowrap opacity-95 transition-opacity hover:opacity-100" />
              {item.children && (
                <div className="invisible absolute left-1/2 top-full min-w-[210px] -translate-x-1/2 rounded-b-lg bg-white py-3 text-[#1f1f1f] opacity-0 shadow-[0_12px_30px_rgba(0,0,0,0.12)] transition-all duration-150 group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.labelKey || child.label}
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
          <Link to="/products" aria-label={t('website.nav.searchAria')} className="opacity-90 hover:opacity-100">
            <SearchIcon />
          </Link>
          <a href={mallLoginUrl} target="_blank" rel="noopener" aria-label={t('website.nav.accountAria')} className="opacity-90 hover:opacity-100">
            <UserIcon />
          </a>
          <LanguageSelector buttonClassName={solid ? 'bg-[#f3f4f5]' : 'bg-white/15'} />
          <a
            href={mallProductsUrl}
            target="_blank"
            rel="noopener"
            className="inline-flex h-8 min-w-[78px] items-center justify-center gap-2 rounded-full bg-[#0a84ff] px-4 text-[13px] font-normal text-white"
          >
            <BagIcon />
            {t('website.nav.store')}
          </a>
        </div>

        <div className="flex items-center gap-5 justify-self-end md:hidden">
          <Link to="/products" aria-label={t('website.nav.searchAria')}>
            <SearchIcon />
          </Link>
          <a href={mallProductsUrl} target="_blank" rel="noopener" aria-label={t('website.nav.store')}>
            <BagIcon />
          </a>
        </div>
      </div>

      {open && (
        <div className="border-t border-black/10 bg-white px-6 py-3 text-[#1f1f1f] shadow-lg md:hidden">
          {navItems.map((item) => (
            <div key={item.labelKey || item.label} className="border-b border-black/5 py-3">
              <NavLink item={item} onClick={() => setOpen(false)} className="block py-1 text-[13px]" />
              {item.children?.map((child) => (
                <NavLink key={child.labelKey || child.label} item={child} onClick={() => setOpen(false)} className="block py-2 pl-4 text-[12px] text-[#666]" />
              ))}
            </div>
          ))}
          <div className="py-3">
            <LanguageSelector variant="plain" buttonClassName="text-[#1f1f1f]" onChanged={() => setOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  )
}

function NavLink({ item, className, onClick }: { item: NavItem; className?: string; onClick?: () => void }) {
  const { t } = useI18n()
  const text = item.labelKey ? t(item.labelKey) : item.label
  if (item.external) {
    return (
      <a href={item.external} target="_blank" rel="noopener" onClick={onClick} className={className}>
        {text}
      </a>
    )
  }

  return (
    <Link to={item.to || '#'} onClick={onClick} className={className}>
      {text}
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

function BagIcon() {
  return (
    <svg className="h-[15px] w-[15px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 7.5V7a5 5 0 0 1 10 0v.5h2.1l1 13.5H3.9l1-13.5H7Zm1.8 0h6.4V7a3.2 3.2 0 0 0-6.4 0v.5Zm-2.2 1.8-.7 9.9h12.2l-.7-9.9H6.6Z" />
    </svg>
  )
}
