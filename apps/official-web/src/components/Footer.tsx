const footerGroups = [
  { title: 'Product Categories', links: ['Camera Drones', 'Handheld', 'Specialized', 'Enterprise', 'Components'] },
  { title: 'Where to Buy', links: ['DJI Online Store', 'Flagship Stores', 'DJI Experience Stores', 'Retail Stores', 'Enterprise Dealers', 'Agricultural Drone Dealer'] },
  { title: 'Fly Safe', links: ['Fly Safe', 'DJI Flying Tips'] },
  { title: 'Support', links: ['Product Support', 'Service Request and Inquiry', 'Help Center', 'After-Sales Service Policies', 'Download Center', 'Security and Privacy'] },
  { title: 'Explore', links: ['Media Center', 'Buying Guides', 'DJI Store Events', 'Stories'] },
  { title: 'Community', links: ['SkyPixel', 'DJI Forum', 'Developer', 'Subscribe'] },
]

export default function Footer() {
  return (
    <footer className="relative bg-[#222] text-[#a6a6a6]">
      <div className="mx-auto max-w-[1180px] px-6 pb-9 pt-9 md:px-8">
        <div className="border-b border-white/10 pb-9 text-center">
          <p className="mb-2 text-[13px] font-semibold text-white">Only in the DJI Store App</p>
          <p className="mx-auto max-w-[520px] text-[11px] leading-5 text-[#9a9a9a]">
            Try virtual flight, online store, and app-exclusive deals from your device.
          </p>
          <a
            href="http://localhost:4173"
            target="_blank"
            rel="noopener"
            className="mt-4 inline-flex h-8 items-center justify-center rounded-full border border-white/30 px-5 text-[11px] font-semibold text-white transition-colors hover:bg-white hover:text-[#222]"
          >
            Download App
          </a>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-8 py-10 md:grid-cols-3 lg:grid-cols-6">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-4 text-[12px] font-semibold text-white">{group.title}</h4>
              <div className="space-y-3 text-[11px] leading-none">
                {group.links.map((link) => (
                  <p key={link}>
                    <a href="http://localhost:4173/products" target="_blank" rel="noopener" className="transition-colors hover:text-white">
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
            {['Who We Are', 'Contact Us', 'Careers', 'Dealer Portal', 'RoboMaster'].map((link) => (
              <a key={link} href="http://localhost:4173" target="_blank" rel="noopener" className="hover:text-white">
                {link}
              </a>
            ))}
          </div>
          <div className="flex gap-2">
            {['f', 'x', 'in', 'yt', 'ig'].map((item) => (
              <a
                key={item}
                href="http://localhost:4173"
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
          <span>Copyright (c) 2026 DJI All Rights Reserved.</span>
          <a href="http://localhost:4173" target="_blank" rel="noopener" className="hover:text-white">
            Privacy Policy
          </a>
          <a href="http://localhost:4173" target="_blank" rel="noopener" className="hover:text-white">
            Terms of Use
          </a>
          <a href="http://localhost:4173" target="_blank" rel="noopener" className="hover:text-white">
            Cookie Preferences
          </a>
        </div>
      </div>

      <div className="fixed bottom-5 right-5 z-40 hidden flex-col gap-2 md:flex">
        <a href="http://localhost:4173/support" target="_blank" rel="noopener" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[13px] font-bold text-[#333] shadow-lg">
          ?
        </a>
        <a href="http://localhost:4173" target="_blank" rel="noopener" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a84ff] text-[13px] font-bold text-white shadow-lg">
          S
        </a>
      </div>
    </footer>
  )
}
