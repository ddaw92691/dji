import { useI18n } from '../i18n'
import { getMallUrl } from '../utils/mallUrl'

const footerGroups: { titleKey: string; links: string[] }[] = [
  { titleKey: 'website.footer.colProductCategories', links: ['Camera Drones', 'Handheld', 'Specialized', 'Enterprise', 'Components'] },
  { titleKey: 'website.footer.colWhereToBuy', links: ['DJI Online Store', 'Flagship Stores', 'DJI Experience Stores', 'Retail Stores', 'Enterprise Dealers', 'Agricultural Drone Dealer'] },
  { titleKey: 'website.footer.colFlySafe', links: ['Fly Safe', 'DJI Flying Tips'] },
  { titleKey: 'website.footer.colSupport', links: ['Product Support', 'Service Request and Inquiry', 'Help Center', 'After-Sales Service Policies', 'Download Center', 'Security and Privacy'] },
  { titleKey: 'website.footer.colExplore', links: ['Media Center', 'Buying Guides', 'DJI Store Events', 'Stories'] },
  { titleKey: 'website.footer.colCommunity', links: ['SkyPixel', 'DJI Forum', 'Developer', 'Subscribe'] },
]

export default function Footer() {
  const { t } = useI18n()
  const mallHomeUrl = getMallUrl()
  const mallProductsUrl = getMallUrl('/products')
  const mallSupportUrl = getMallUrl('/support')
  const bottomLinks: { key: string; label: string }[] = [
    { key: 'website.footer.whoWeAre', label: t('website.footer.whoWeAre') },
    { key: 'website.footer.contactUs', label: t('website.footer.contactUs') },
    { key: 'website.footer.careers', label: t('website.footer.careers') },
    { key: 'website.footer.dealerPortal', label: t('website.footer.dealerPortal') },
    { key: 'RoboMaster', label: 'RoboMaster' },
  ]

  return (
    <footer className="relative bg-[#222] text-[#a6a6a6]">
      <div className="mx-auto max-w-[1180px] px-6 pb-9 pt-9 md:px-8">
        <div className="border-b border-white/10 pb-9 text-center">
          <p className="mb-2 text-[13px] font-semibold text-white">{t('website.footer.bannerTitle')}</p>
          <p className="mx-auto max-w-[520px] text-[11px] leading-5 text-[#9a9a9a]">
            {t('website.footer.bannerDesc')}
          </p>
          <a
            href={mallHomeUrl}
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex h-8 items-center justify-center rounded-full border border-white/30 px-5 text-[11px] font-semibold text-white transition-colors hover:bg-white hover:text-[#222]"
          >
            {t('website.footer.download')}
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-8 py-10 md:grid-cols-3 lg:grid-cols-6">
          {footerGroups.map((group) => (
            <div key={group.titleKey}>
              <h4 className="mb-4 text-[12px] font-semibold text-white">{t(group.titleKey)}</h4>
              <div className="space-y-3 text-[11px] leading-none">
                {group.links.map((link) => (
                  <p key={link}>
                    <a href={mallProductsUrl} target="_blank" rel="noopener" className="transition-colors hover:text-white">
                      {link}
                    </a>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-6 border-t border-white/10 pt-6 md:flex-row md:items-center">
          <div className="shrink-0 text-[22px] font-black italic leading-none tracking-normal text-white">dji</div>
          <div className="flex flex-1 flex-wrap gap-x-5 gap-y-2 text-[11px]">
            {bottomLinks.map((link) => (
              <a key={link.key} href={mallHomeUrl} target="_blank" rel="noopener" className="hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            {['f', 'x', 'in', 'yt', 'ig'].map((item) => (
              <a
                key={item}
                href={mallHomeUrl}
                target="_blank"
                rel="noopener"
                className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-white/10 px-2 text-[10px] font-semibold text-white hover:bg-white/20"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-[#777]">
          <span>{t('website.footer.copyright')}</span>
          <a href={mallHomeUrl} target="_blank" rel="noopener" className="hover:text-white">
            {t('website.footer.privacy')}
          </a>
          <a href={mallHomeUrl} target="_blank" rel="noopener" className="hover:text-white">
            {t('website.footer.terms')}
          </a>
          <a href={mallHomeUrl} target="_blank" rel="noopener" className="hover:text-white">
            {t('website.footer.cookie')}
          </a>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-40 hidden flex-col gap-2 md:flex">
        <a href={mallSupportUrl} target="_blank" rel="noopener" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[13px] font-bold text-[#333] shadow-lg">
          ?
        </a>
        <a href={mallProductsUrl} target="_blank" rel="noopener" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a84ff] text-[13px] font-bold text-white shadow-lg">
          S
        </a>
      </div>
    </footer>
  )
}
