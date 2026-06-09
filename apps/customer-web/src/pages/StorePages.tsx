import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import './StorePages.css'

type StoreSection = 'store-day' | 'camera-drones' | 'handheld' | 'robot-vacuum' | 'services' | 'accessories' | 'education' | 'refurbished'

type NavKey = Exclude<StoreSection, 'store-day'>

type Product = {
  name: string
  image: string
  price?: string
  oldPrice?: string
  tag?: string
  desc?: string
}

type ProductGroup = {
  title: string
  hero?: Product
  products: Product[]
}

type SideItem = {
  label: string
  image?: string
  section?: string
}

type HomeBannerItem = {
  eyebrow: string
  title: string
  subtitle: string
  image: string
  baked?: boolean
}

const asset = {
  heroHome: '/dji-home/hero.jpg',
  storeDay: '/dji-home/store-day.jpg',
  pocket: '/dji-home/tile-pocket.jpg',
  mic: '/dji-home/tile-mic-mini.jpg',
  lito: '/dji-home/tile-lite.jpg',
  mobile: '/dji-home/tile-mobile.jpg',
  shotMobile: '/dji-home/shot-mobile.jpg',
  innovationRight: '/dji-home/innovation-right.jpg',
  fieldVideo: '/dji-home/field-video.jpg',
  fieldEnterprise: '/dji-home/field-enterprise.jpg',
  fieldAgriculture: '/dji-home/field-agriculture.jpg',
  droneHero: 'https://www-cdn.djiits.com/dps/616ce40a9e6299aec3fa19f787b5c97f.jpg?w=2512&h=1392',
  droneMini: 'https://www-cdn.djiits.com/dps/ec954fdfec4192a5893daa89ba3ae5ba.jpg?w=2512&h=1392',
  droneAvata: 'https://www-cdn.djiits.com/dps/b7ffee306ba185536873e2d0328afd36.jpg?w=2512&h=1392',
  droneNeo: 'https://www-cdn.djiits.com/dps/1fb824220c1b8806011c96512681181b.jpg?w=2512&h=1392',
  droneBeach: 'https://www-cdn.djiits.com/dps/38f6cede8d1c6232796e5ea82b9b70ba@origin.jpg?w=5120&h=1600',
  action: 'https://www-cdn.djiits.com/dps/006e32f2690bef717945e93f2ace6d5e.jpg?w=864&h=1200',
  bike: 'https://www-cdn.djiits.com/dps/0b8dd0e6dc1843989868ce802482e788.jpg?w=864&h=1200',
  dive: 'https://www-cdn.djiits.com/dps/f8b1248af7af96e073f62a5f6ef7ea65.jpg?w=864&h=1200',
  travel: 'https://www-cdn.djiits.com/dps/664940f142c76324dcf40a4e12af3d39.jpg?w=864&h=1200',
  ronin: 'https://www-cdn.djiits.com/dps/72fd553b1234640bbe06aa703aeb25cd.jpg?w=2512&h=1392',
  laptop: 'https://www-cdn.djiits.com/cms/uploads/4fd3c35ee4bf3265bc4e5c5b16d132a3.png',
  romo: '/dji-home/tile-compare.jpg',
}

const p = (name: string, image: string, price = '39', desc = '', tag = ''): Product => ({
  name,
  image,
  price,
  desc,
  tag,
})

const side = (label: string, image?: string, section?: string): SideItem => ({ label, image, section })

const repeatTo = (products: Product[], count: number) =>
  Array.from({ length: count }, (_, index) => products[index % products.length])

const homeBannerItems: HomeBannerItem[] = [
  { eyebrow: 'Dual-Camera Drone for Travel Photography', title: 'DJI AIR 3S', subtitle: 'Chase the View', image: asset.heroHome, baked: true },
  { eyebrow: 'Flagship Camera Drone', title: 'DJI Mavic 4 Pro', subtitle: 'See More. Tell More.', image: asset.droneHero },
  { eyebrow: 'All-in-One Vlog Camera Drone', title: 'DJI Flip', subtitle: 'Open New Possibilities', image: asset.droneAvata },
  { eyebrow: 'Professional Handheld Camera', title: 'OSMO ACTION 6', subtitle: 'Capture Every Detail', image: asset.action },
  { eyebrow: 'Lightweight Commercial Stabilizer', title: 'DJI RS 5', subtitle: 'Create Beyond Limits', image: asset.ronin },
  { eyebrow: 'Agricultural Equipment', title: 'DJI AGRAS T100', subtitle: 'See More. Tell More.', image: asset.fieldAgriculture },
  { eyebrow: 'Ready for Transport', title: 'DJI FlyCart 100', subtitle: 'Heavy Payload. Long Distance.', image: asset.fieldEnterprise },
  { eyebrow: 'Robot Vacuum', title: 'ROMO', subtitle: 'See More. Tell More.', image: asset.romo },
]

const officialNavItems = [
  { label: 'Camera Drones', path: '/camera-drones' },
  { label: 'Handheld', path: '/handheld' },
  { label: 'SkyPixel', path: '/products' },
  { label: 'Support', path: '/support' },
  { label: 'Explore', path: '/products' },
  { label: 'Store', path: '/store-day' },
  { label: 'Where to Buy', path: '/products' },
]

const droneProducts = [
  p('DJI Mavic 4 Pro (DJI RC 2)', asset.droneHero, '2,049', '100MP Hasselblad Camera'),
  p('DJI Mini 5 Pro', asset.droneMini, '739', 'All-in-One Flagship Mini Camera Drone'),
  p('DJI Air 3S', asset.droneBeach, '926', 'Dual-Camera Drone for Travel Photography'),
  p('DJI Flip', asset.droneAvata, '329', 'All-in-One Vlog Camera Drone'),
  p('DJI Neo 2', asset.droneNeo, '209', 'Follow-Me Camera Drone'),
  p('DJI Lito X1', asset.lito, '399', 'Beginner-Friendly Camera Drone', 'New'),
]

const accessoryProducts = [
  p('DJI RC Pro 2', asset.droneHero, '999'),
  p('DJI Mavic 4 Pro Intelligent Flight Battery', asset.laptop, '209'),
  p('DJI Mavic 4 Pro Propellers', asset.droneMini, '19'),
  p('DJI Mavic 240W Power Adapter', asset.mic, '109'),
  p('DJI Mavic 4 Pro Propeller Guard', asset.droneAvata, '43'),
  p('DJI Mavic 3 Series Intelligent Flight Battery', asset.laptop, '159'),
  p('DJI 65W Car Charger', asset.mobile, '69'),
  p('DJI Mavic 3 Classic ND Filter Set', asset.droneNeo, '129'),
]

const handheldProducts = [
  p('Osmo Pocket 4 Standard Combo', asset.pocket, '543', 'New 1-inch CMOS and 4K/240fps Slow Motion', 'New'),
  p('Osmo Pocket 4 Creator Combo', asset.pocket, '699', '', 'New'),
  p('Osmo Pocket 4 Battery Handle', asset.mic, '89'),
  p('Osmo Pocket 4 Carrying Bag', asset.mobile, '26'),
  p('Osmo Pocket 3', asset.pocket, '538', '1-Inch CMOS and 4K/120fps'),
  p('Osmo Action 6', asset.action, '369'),
  p('Osmo Mobile 8P', asset.mobile, '129'),
  p('DJI Mic Mini 2', asset.mic, '84', '', 'New'),
]

const romoProducts = [
  p('DJI ROMO P (Water Tank Version)', asset.romo, '1,219', 'Flagship Robot Vacuum With Advanced Sensing', 'New'),
  p('DJI ROMO A (Water Tank Version)', asset.romo, '1,069', '', 'New'),
  p('DJI ROMO S (Water Tank Version)', asset.romo, '899', '', 'New'),
  p('ROMO Cleaning Solution', asset.laptop, '19'),
  p('ROMO Side Brush', asset.mobile, '9'),
  p('ROMO Mop Pad', asset.droneNeo, '19'),
  p('ROMO Base Station Dust Bag', asset.mic, '19'),
  p('ROMO Accessory Kit', asset.droneMini, '89'),
]

const serviceProducts = [
  p('DJI Inspire 3 RAW License', asset.laptop, '1'),
  p('DJI Ronin 4D RAW License', asset.laptop, '1'),
]

const educationProducts = [
  p('DJI Terra Agriculture 1 Year (3 devices)', asset.laptop, '329'),
  p('DJI Mavic 3 Propeller Guard', asset.droneAvata, '39'),
  p('DJI X-Port', asset.ronin, '283'),
  p('DJI X-PORT Carrying Case', asset.droneHero, '66'),
  p('Livox Mid-70 LiDAR', asset.laptop, '1,009'),
  p('Livox TELE-15 LiDAR', asset.mic, '1,299'),
  p('Livox Extension Cable & Coupler', asset.mobile, '50'),
  p('DJI RC Plus Strap and Waist Support Kit', asset.ronin, '59'),
  p('Matrice 300 Series DJI Smart Controller Enterprise', asset.droneHero, '969', '', 'Out of stock'),
  p('Livox Avia', asset.laptop, '1,615', '', 'Out of stock'),
]

const refurbishedProducts = [
  p('DJI Neo 2 Fly More Combo (Refurbished Unit)', asset.droneNeo, '189'),
  p('DJI Mini 5 Pro (Refurbished Unit)', asset.droneMini, '629'),
  p('DJI Avata 2 Fly More Combo (Refurbished Unit)', asset.droneAvata, '739'),
  p('DJI Mini 4 Pro Fly More Combo Plus (Refurbished Unit)', asset.droneHero, '799'),
  p('DJI Flip (DJI RC-N3) (Refurbished Unit)', asset.droneAvata, '279'),
  p('DJI Mini 2 SE (Refurbished Unit)', asset.droneMini, '219'),
  p('Osmo Mobile 6 (Refurbished Unit)', asset.mobile, '69'),
  p('Osmo Pocket 3 Creator Combo (Refurbished Unit)', asset.pocket, '469'),
]

const pageGroups: Record<StoreSection, ProductGroup[]> = {
  'store-day': [],
  'camera-drones': [
    { title: 'DJI Mavic 4 Pro', hero: droneProducts[0], products: droneProducts.slice(1, 6) },
    { title: 'DJI Mavic 3 Pro', hero: p('DJI Mavic 3 Pro (DJI RC)', asset.droneBeach, '1,859'), products: accessoryProducts.slice(0, 5) },
    { title: 'DJI Mavic 3 Classic', products: accessoryProducts.slice(2, 8) },
    { title: 'DJI Mavic 3', products: accessoryProducts.slice(5, 8).concat(accessoryProducts.slice(0, 1)) },
  ],
  handheld: [
    { title: 'Osmo Pocket 4', hero: handheldProducts[0], products: handheldProducts.slice(1, 5) },
    { title: 'Osmo Pocket 3', hero: handheldProducts[4], products: handheldProducts.slice(2, 8) },
    { title: 'DJI Pocket 2', products: handheldProducts.concat(accessoryProducts.slice(0, 4)) },
  ],
  'robot-vacuum': [{ title: 'Robot Vacuums', hero: romoProducts[0], products: romoProducts.slice(1) }],
  services: [{ title: 'Services', products: serviceProducts }],
  accessories: [
    { title: 'DJI Mavic 4 Pro', products: accessoryProducts.slice(0, 7) },
    { title: 'DJI Mavic 3 Pro', products: accessoryProducts.slice(1, 8) },
    { title: 'DJI Mavic 3 Classic', products: accessoryProducts.concat(droneProducts.slice(0, 2)) },
    { title: 'Mavic 2', products: accessoryProducts.slice(2, 4) },
  ],
  education: [{ title: 'Enterprise', products: educationProducts.concat(educationProducts, educationProducts.slice(0, 3)) }],
  refurbished: [
    { title: 'Camera Drones', products: refurbishedProducts.concat(refurbishedProducts, refurbishedProducts.slice(0, 6)) },
    { title: 'Handheld', products: handheldProducts.concat(handheldProducts.slice(0, 1)) },
  ],
}

const navMeta: Record<NavKey, { label: string; path: string; sideTitle: string; sideItems: SideItem[]; groups: ProductGroup[] }> = {
  'camera-drones': {
    label: 'Camera Drones',
    path: '/camera-drones',
    sideTitle: 'Aerial Photography',
    sideItems: [
      side('DJI Mavic', asset.droneHero),
      side('DJI Air', asset.droneBeach),
      side('DJI Mini', asset.droneMini),
      side('DJI Lito New', asset.lito),
      side('DJI Flip', asset.droneAvata),
      side('DJI Neo', asset.droneNeo),
      side('DJI Avata New', asset.droneAvata, 'Immersive Flight Experience'),
      side('DJI FPV', asset.droneHero),
      side('Inspire', asset.droneHero, 'Aerial Cinematic Tools'),
    ],
    groups: pageGroups['camera-drones'],
  },
  handheld: {
    label: 'Handheld',
    path: '/handheld',
    sideTitle: 'Record Your Life',
    sideItems: [
      side('Osmo Pocket New', asset.pocket),
      side('Osmo Nano', asset.mobile),
      side('Osmo 360', asset.action),
      side('Osmo Action', asset.action),
      side('Osmo Mobile New', asset.mobile),
      side('DJI Mic New', asset.mic),
      side('Ronin Stabilizers', asset.ronin, 'Professional Shooting'),
      side('Ronin Cinema Cameras', asset.ronin),
      side('Pro Accessories', asset.laptop),
    ],
    groups: pageGroups.handheld,
  },
  'robot-vacuum': {
    label: 'Robot Vacuum',
    path: '/robot-vacuum',
    sideTitle: 'Robot Vacuums',
    sideItems: [side('DJI ROMO', asset.romo)],
    groups: pageGroups['robot-vacuum'],
  },
  services: {
    label: 'Services',
    path: '/services',
    sideTitle: '',
    sideItems: [side('License', asset.laptop)],
    groups: [],
  },
  accessories: {
    label: 'Accessories',
    path: '/accessories',
    sideTitle: 'Camera Drones',
    sideItems: [
      side('DJI Mavic', asset.droneHero),
      side('DJI Air', asset.droneBeach),
      side('DJI Mini', asset.droneMini),
      side('DJI Lito', asset.lito),
      side('DJI Flip', asset.droneAvata),
      side('DJI Neo', asset.droneNeo),
      side('DJI Avata & DJI FPV', asset.droneAvata),
      side('Osmo Nano', asset.mobile, 'Handheld'),
      side('Osmo 360', asset.action),
      side('Osmo Pocket', asset.pocket),
      side('Osmo Action', asset.action),
      side('Osmo Mobile', asset.mobile),
      side('DJI Mic', asset.mic),
      side('DJI ROMO', asset.romo, 'Robot Vacuums'),
    ],
    groups: pageGroups.accessories,
  },
  education: {
    label: 'Education & Industry',
    path: '/education-industry',
    sideTitle: '',
    sideItems: [side('Enterprise', asset.droneHero), side('Education', asset.lito)],
    groups: [{ title: 'Software', products: educationProducts.slice(0, 1) }],
  },
  refurbished: {
    label: 'Official Refurbished',
    path: '/official-refurbished',
    sideTitle: '',
    sideItems: [side('Camera Drones', asset.droneNeo), side('Handheld', asset.pocket)],
    groups: [{ title: 'Camera Drones', products: refurbishedProducts }],
  },
}

function topNavKeys(isHome: boolean): NavKey[] {
  return isHome
    ? ['camera-drones', 'handheld', 'robot-vacuum', 'services', 'accessories', 'education', 'refurbished']
    : ['camera-drones', 'handheld', 'robot-vacuum', 'services', 'accessories']
}

export function StoreHomePage() {
  return (
    <StoreShell home>
      <main className="store-home-main">
        <section className="store-hero" style={{ backgroundImage: `url(${asset.heroHome})` }}>
          <div>
            <p>Stay Tuned</p>
            <h1>OSMO POCKET 4P</h1>
            <span>See More. Tell More.</span>
            <Link to="/products">Learn More</Link>
          </div>
        </section>
        <HomeIconStrip />
        <HomeCarousel />
        <h2 className="home-section-title">Camera Drones</h2>
        <HomeBand title="DJI Lito X1" image={asset.droneBeach} to="/camera-drones" />
        <ProductRail products={[droneProducts[5], droneProducts[1], droneProducts[4], droneProducts[0]]} />
        <h2 className="home-section-title">Handheld - Daily Vlogging</h2>
        <HomeBand title="Osmo Pocket 4" image={asset.shotMobile} to="/handheld" />
        <ProductRail products={[p('Osmo Mobile 8P', asset.mobile, '129'), handheldProducts[1], p('Osmo Mobile 8', asset.mobile, '83'), p('Osmo Nano', asset.pocket, '199')]} />
        <h2 className="home-section-title">Handheld - Pro Shooting</h2>
        <HomeBand title="DJI RS 5" image={asset.ronin} to="/handheld" />
        <ProductRail products={[p('DJI RS 4 Mini', asset.ronin, '268'), p('DJI RS 4 Pro', asset.ronin, '689'), p('DJI Ronin 4D-8K', asset.fieldVideo, '6,299'), p('DJI SDR Transmission', asset.mic, '309')]} />
        <section className="home-education-block">
          <h2 className="home-section-title">Education & Industry</h2>
          <div>
            <ArticleCard title="Enterprise" subtitle="Integrated drone-based industrial solutions" image={asset.fieldEnterprise} />
            <ArticleCard title="Education" subtitle="Programming education solutions" image={asset.fieldAgriculture} />
          </div>
        </section>
        <section className="store-playbook">
          <h2>Buying Guides</h2>
          <div>
            {[asset.droneHero, asset.droneAvata, asset.droneBeach, asset.bike].map((image, index) => (
              <ArticleCard
                key={`${image}-home-guide-${index}`}
                title={['DJI Mini 4 Pro vs. DJI Air 3S vs. DJI Mavic 3 Pro', 'Follow Me Drones 2024', 'DJI Air 3S vs DJI Air 3', 'Osmo Action 5 Pro Unboxing'][index]}
                subtitle="Everything you need to know."
                image={image}
              />
            ))}
          </div>
        </section>
      </main>
    </StoreShell>
  )
}

function HomeWideBanner({ eyebrow, title, subtitle, image, cta = 'Buy Now', light = false }: { eyebrow: string; title: string; subtitle: string; image: string; cta?: string; light?: boolean }) {
  return (
    <section className={`home-wide-banner is-composite ${light ? 'light' : ''}`} style={{ backgroundImage: `url(${image})` }}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <span>{subtitle}</span>
      <Link to="/products">{cta}</Link>
    </section>
  )
}

export function OfficialHomePage() {
  const [heroIndex, setHeroIndex] = useState(0)
  const activeHero = homeBannerItems[heroIndex]
  const visibleHeroTitles = [-1, 0, 1].map((offset) => {
    const index = (heroIndex + offset + homeBannerItems.length) % homeBannerItems.length
    return { index, item: homeBannerItems[index], active: offset === 0 }
  })

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroIndex((index) => (index + 1) % homeBannerItems.length)
    }, 4200)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <StoreShell home>
      <main className="official-home-main">
        <section className={`official-hero ${activeHero.baked ? 'is-baked' : ''}`} style={{ backgroundImage: `url(${activeHero.image})` }}>
          <div className="official-hero-copy">
            <p>{activeHero.eyebrow}</p>
            <h1>{activeHero.title}</h1>
            <span>{activeHero.subtitle}</span>
            <div>
              <Link to="/products">Learn More</Link>
              <Link to="/products">Buy Now</Link>
            </div>
          </div>
          <div className="official-hero-rail">
            {visibleHeroTitles.map(({ index, item, active }) => (
              <button key={item.title} type="button" className={active ? 'active' : ''} onClick={() => setHeroIndex(index)}>
                {item.title}
                {active && <span>{item.subtitle}</span>}
              </button>
            ))}
          </div>
          <div className="official-hero-specs"><span>249 g</span><span>45 min</span><span>Omnidirectional Sensing</span></div>
        </section>
        <HomeWideBanner eyebrow="Up to 30% Off" title="DJI Store Day" subtitle="Time for an Upgrade Explore More For Less" image={asset.storeDay} />
        <HomeWideBanner eyebrow="Immersive Recording Mini Wireless Mic" title="DJI MIC MINI 2S" subtitle="Capture Every Detail" image={asset.mic} cta="Learn More" light />
        <HomeFeatureGrid />
        <section className="home-shot-section">
          <button aria-label="Previous">&lt;</button>
          <HomeFeatureCard title="Shot on Osmo Mobile 8P" subtitle="Learn More / Buy Now" image={asset.shotMobile} />
          <button aria-label="Next">&gt;</button>
        </section>
        <section className="home-innovation">
          <h2>Standing at the Forefront of Innovation</h2>
          <p>As we explore new technology, we push the capabilities of what is possible, driving progress through continuous innovation.</p>
          <div>
            <HomeFeatureCard title="DJI Agriculture Annual Report" subtitle="Learn More" image={asset.fieldAgriculture} />
            <HomeFeatureCard title="DJI Ronin 2 Gimbal System Honored with 2025 Scientific and Technical Award" subtitle="Learn More" image={asset.innovationRight} />
          </div>
        </section>
        <section className="home-fields">
          <h2>Explore DJI Products in Different Fields</h2>
          <div>
            <HomeFeatureCard title="Video Production" subtitle="Professional Aerial and Ground Filmmaking Tools" image={asset.ronin} />
            <HomeFeatureCard title="Enterprise" subtitle="Drone Solutions for a New Generation of Work" image={asset.fieldEnterprise} />
            <HomeFeatureCard title="Agriculture" subtitle="Efficient and Intelligent Agricultural Solution" image={asset.fieldAgriculture} />
          </div>
        </section>
        <HomeQuickLinks />
      </main>
    </StoreShell>
  )
}

function HomeFeatureGrid() {
  const tiles = [
    ['Beginner-Friendly Camera Drone', 'DJI LITO SERIES', 'Just Fly.', asset.lito],
    ['1" CMOS Pocket Gimbal Camera', 'OSMO POCKET 4', 'The World in My Pocket', asset.pocket],
    ['8K Flagship 360 Degree Drone', 'DJI AVATA 360', 'Above It All, See It All', asset.droneAvata],
    ['Mini Wireless Microphone', 'DJI MIC MINI 2', 'More Than Sound', asset.mic],
    ['Pro Framing and Tracking Phone Gimbal', 'OSMO MOBILE 8P', 'Wonders in Your Palm', asset.mobile],
    ['Product Info', 'Compare Camera Drones', 'See product overviews and comparisons here', asset.romo],
  ]
  return (
    <section className="home-feature-grid">
      {tiles.map(([eyebrow, title, subtitle, image]) => (
        <article key={title}>
          <p>{eyebrow}</p>
          <h2>{title}</h2>
          <span>{subtitle}</span>
          <div className="home-tile-actions">
            <Link to="/products">Learn More</Link>
            <Link to="/products">Buy Now</Link>
          </div>
          <img src={image} alt="" />
        </article>
      ))}
    </section>
  )
}

function HomeFeatureCard({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <Link to="/products" className="home-feature-card" style={{ backgroundImage: `url(${image})` }}>
      <h3>{title}</h3>
      <p>{subtitle}</p>
    </Link>
  )
}

function HomeQuickLinks() {
  return (
    <section className="home-quick-links">
      {['Where to buy', 'Support', 'Fly Safe'].map((item) => (
        <Link key={item} to="/products">
          <span className="service-thumb" />
          <strong>{item}</strong>
          <small>Learn More &gt;</small>
        </Link>
      ))}
    </section>
  )
}

export function StoreCategoryPage({ section }: { section: StoreSection }) {
  if (section === 'store-day') return <StoreDayPage />
  if (section === 'refurbished') return <RefurbishedPage />
  if (section === 'camera-drones' || section === 'handheld') {
    return (
      <StoreShell>
        <MarketingCategory section={section} />
      </StoreShell>
    )
  }

  const titleMap: Record<StoreSection, string> = {
    'store-day': 'DJI STORE DAY',
    'camera-drones': 'Camera Drones',
    handheld: 'Camera & Gimbal',
    'robot-vacuum': 'Shop Robot Vacuum',
    services: 'Shop Services',
    accessories: 'Shop all accessories',
    education: 'Education & Industry',
    refurbished: 'OFFICIAL REFURBISHED',
  }

  const groups = pageGroups[section]
  const isListing = section === 'education' || section === 'services' || section === 'robot-vacuum'
  const products = listingProducts(section, groups)

  return (
    <StoreShell>
      <main className={`store-list-page store-list-${section} ${isListing ? 'catalog' : ''}`}>
        <h1>{titleMap[section]}</h1>
        {section === 'education' && <div className="store-tabs"><span className="active">Enterprise</span><span>Education</span></div>}
        <div className="store-catalog-layout">
          <FilterSidebar section={section} />
          <section className="store-product-area">
            <div className="store-sort"><span>{products.length} Item(s) Found</span><button>Sort by: Recommendation v</button></div>
            <div className="store-product-grid">{products.map((product, index) => <ProductCard key={`${product.name}-${index}`} product={product} />)}</div>
          </section>
        </div>
      </main>
    </StoreShell>
  )
}

function StoreDayPage() {
  const saleProducts = [handheldProducts[0], droneProducts[4], handheldProducts[1], romoProducts[0], p('Osmo Mobile 8P', asset.mobile, '129'), p('DJI Air 3S', asset.droneBeach, '926')]
  const curated = repeatTo(saleProducts, 25)
  const privileges = repeatTo(saleProducts.slice(0, 5), 12)
  const news = repeatTo([handheldProducts[0], handheldProducts[1], droneProducts[5], droneProducts[2]], 8)
  return (
    <StoreShell>
      <main className="store-day-page">
        <section className="store-day-hero" style={{ backgroundImage: `url(${asset.storeDay})` }}>
          <div>
            <p>June 1 - June 8</p>
            <h1>DJI STORE DAY</h1>
            <span>Up to 30% Off</span>
          </div>
        </section>
        <div className="event-tabs"><span>June 1</span><span>June 4</span><span>June 8</span></div>
        <section className="why-shop">
          {['5% Off for New Subscribers', 'Exclusive Gift', 'Earn 5% in DJI Credit', 'Accessory Coupon'].map((item) => <article key={item}><h3>{item}</h3><p>Exclusive benefits for DJI Store members.</p></article>)}
        </section>
        <h2>Curated Picks</h2>
        <div className="sale-grid">
          {curated.map((product, index) => <PromoProduct key={`${product.name}-curated-${index}`} product={product} index={index} />)}
        </div>
        <h2>Exclusive Privileges</h2>
        <div className="sale-grid two">
          {privileges.map((product, index) => <PromoProduct key={`${product.name}-privilege-${index}`} product={product} index={index} />)}
        </div>
        <h2>News Refresh</h2>
        <div className="sale-grid news">
          {news.map((product, index) => <PromoProduct key={`${product.name}-news-${index}`} product={product} index={index} />)}
        </div>
        <h2>Officially Refurbished, Quality Guaranteed</h2>
        <div className="sale-refurb-row">
          {refurbishedProducts.slice(0, 6).map((product) => <ProductCard key={product.name} product={product} />)}
        </div>
      </main>
    </StoreShell>
  )
}

function StoreShell({ children, home = false }: { children: React.ReactNode; home?: boolean }) {
  return (
    <div className={`store-page-shell ${home ? 'home-shell' : ''}`}>
      <StoreNav home={home} />
      {children}
      <TrustStrip />
      <StoreFooter />
      <FloatingHelp />
    </div>
  )
}

function StoreNav({ home }: { home: boolean }) {
  const { pathname } = useLocation()
  const { user } = useAuthStore()
  const [openPanel, setOpenPanel] = useState<NavKey | null>(null)
  const [moreOpen, setMoreOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const keys = topNavKeys(home)
  const transparent = home && !scrolled && !openPanel && !mobileMenuOpen
  const logoSrc = transparent ? '/logo-white.webp' : '/logo-black.webp'
  const storeMobileNavItems = [
    { label: 'DJI STORE DAY', path: '/store-day', simple: true },
    ...(['camera-drones', 'handheld', 'robot-vacuum', 'services', 'accessories', 'education', 'refurbished'] as NavKey[]).map((key) => ({
      label: navMeta[key].label,
      path: navMeta[key].path,
      simple: false,
    })),
  ]
  const mobileNavItems = storeMobileNavItems

  useEffect(() => {
    const syncScroll = () => {
      const nextScrolled = window.scrollY > 8
      setScrolled((current) => (current === nextScrolled ? current : nextScrolled))
    }
    syncScroll()
    const interval = window.setInterval(syncScroll, 120)
    window.addEventListener('scroll', syncScroll, { passive: true })
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('scroll', syncScroll)
    }
  }, [])

  useEffect(() => {
    setOpenPanel(null)
    setMoreOpen(false)
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <div className="store-topbar">
        <div>
          <Link to="/">dji.com</Link>
          <Link to="/">DJI Store APP</Link>
          <button onClick={() => setMoreOpen((value) => !value)}>More v</button>
          <span>Virtual Flight is now available - A must-try for beginners! Download the <b>DJI Store app</b> and experience the thrill of flying.</span>
        </div>
        <div className="store-locale"><GlobeIcon /> Singapore (English / $ USD)</div>
      </div>
      <header className={`store-nav ${home ? 'official-nav' : ''} ${transparent ? 'is-transparent' : ''} ${scrolled ? 'is-scrolled' : ''} ${mobileMenuOpen ? 'has-mobile-menu' : ''}`}>
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => {
            setOpenPanel(null)
            setMobileMenuOpen((value) => !value)
          }}
        >
          <span />
          <span />
        </button>
        <Link className="store-logo" to="/">
          <img src={logoSrc} alt="DJI" />
          <span>STORE</span>
        </Link>
        <nav>
          <Link className={pathname === '/store-day' ? 'active' : ''} to="/store-day">DJI STORE DAY</Link>
          {keys.map((key) => (
            <Link
              key={key}
              to={navMeta[key].path}
              className={`${pathname === navMeta[key].path ? 'active' : ''} ${openPanel === key ? 'is-open' : ''}`}
              onMouseEnter={() => setOpenPanel(key)}
              onFocus={() => setOpenPanel(key)}
              onClick={(event) => {
                if (!openPanel) {
                  event.preventDefault()
                  setOpenPanel(key)
                }
              }}
            >
              {navMeta[key].label}
            </Link>
          ))}
          {!home && (
            <div className="more-menu" onMouseEnter={() => setOpenPanel(null)}>
              <button type="button" onClick={() => setMoreOpen((value) => !value)}>More v</button>
              {moreOpen && <div><Link to="/education-industry">Education & Industry</Link><Link to="/official-refurbished">Official Refurbished</Link></div>}
            </div>
          )}
        </nav>
        <div className="store-actions">
          <Link to="/products" aria-label="Search"><SearchIcon /></Link>
          <Link to="/cart" aria-label="Cart"><CartIcon /></Link>
          <Link to={user ? '/orders' : '/login'} aria-label="Account"><UserIcon /></Link>
        </div>
      </header>
      {mobileMenuOpen && (
        <section className={`mobile-nav-panel ${home ? 'official-mobile-panel' : ''}`}>
          <p>Virtual Flight is now available - A must-try for beginners! Download the <b>DJI Store app</b> and experience the thrill of flying.</p>
          <nav>
            {mobileNavItems.map((item) => (
              <Link key={item.path} to={item.path}>
                {item.label}
                <span>{item.simple ? '>' : 'v'}</span>
              </Link>
            ))}
          </nav>
          <div className="mobile-nav-secondary">
            {['dji.com', 'DJI Store APP', 'Guides', 'DJI Credit'].map((item) => <Link key={item} to="/">{item} <span>&gt;</span></Link>)}
          </div>
          <Link className="mobile-locale" to="/">Singapore / English <span>&gt;</span></Link>
        </section>
      )}
      {openPanel && <MegaPanel panelKey={openPanel} onClose={() => setOpenPanel(null)} />}
      {openPanel && <button className="mega-backdrop" aria-label="Close menu" onClick={() => setOpenPanel(null)} />}
    </>
  )
}

function MegaPanel({ panelKey, onClose }: { panelKey: NavKey; onClose: () => void }) {
  const meta = navMeta[panelKey]
  return (
    <section className={`mega-panel mega-${panelKey}`} data-menu={panelKey} onMouseEnter={() => undefined}>
      <button className="mega-close" onClick={onClose} aria-label="Close">x</button>
      <aside>
        {meta.sideTitle && <p>{meta.sideTitle}</p>}
        {meta.sideItems.map((item) => (
          <div key={`${item.section || ''}-${item.label}`} className="mega-side-row-wrap">
            {item.section && <p>{item.section}</p>}
            <Link to={meta.path}>
              {item.image ? <img src={item.image} alt="" /> : <span className="nav-thumb" />}
              {item.label}
            </Link>
          </div>
        ))}
        <Link className="view-all" to={meta.path}>View All {meta.label} &gt;</Link>
      </aside>
      <div className="mega-products">
        {meta.groups.map((group) => <ProductGroupView key={group.title} group={group} compact />)}
      </div>
    </section>
  )
}

function ProductGroupView({ group, compact = false }: { group: ProductGroup; compact?: boolean }) {
  return (
    <section className={`store-product-group ${compact ? 'compact' : ''}`}>
      <h2>{group.title} <Link to="/products">View all &gt;</Link></h2>
      <div className={group.hero ? 'group-grid has-hero' : 'group-grid'}>
        {group.hero && <ProductCard product={group.hero} featured />}
        {group.products.map((product) => <ProductCard key={product.name} product={product} />)}
        {compact && <Link className="view-card" to="/products"><span>-&gt;</span><p>View all</p></Link>}
      </div>
    </section>
  )
}

function ProductCard({ product, featured = false }: { product: Product; featured?: boolean }) {
  return (
    <Link to="/products" className={`store-product-card ${featured ? 'featured' : ''}`}>
      <img src={product.image} alt={product.name} />
      {product.tag && <span className={product.tag === 'Out of stock' ? 'muted' : ''}>{product.tag}</span>}
      <h3>{product.name}</h3>
      {product.desc && <p>{product.desc}</p>}
      {product.price && <strong>USD $ {product.price}</strong>}
      {product.oldPrice && <del>USD ${product.oldPrice}</del>}
    </Link>
  )
}

function MarketingCategory({ section }: { section: StoreSection }) {
  const camera = section === 'camera-drones'
  const sceneImages = camera ? [asset.droneBeach, asset.droneAvata, asset.droneHero] : [asset.action, asset.ronin, asset.fieldVideo]
  const sceneTitles = camera ? ['Aerial Photography', 'Immersive Flight', 'Aerial Cinematic Tools'] : ['Daily Vlogs', 'Professional Creation', 'Professional Accessories']
  const playbookImages = camera ? [asset.droneBeach, asset.droneHero, asset.droneAvata, asset.action] : [asset.action, asset.bike, asset.dive, asset.travel]
  const playbookTitles = camera
    ? ['Essential Accessories for DJI Avata 2', 'DJI Avata First Use', 'Mini 4 Pro: A Skyward Upgrade', 'The Ultimate Mavic Series Accessory Guide']
    : ['Pick Your Wireless Microphone', 'Pick Your Action Cams & Mounts', 'Essential Accessories for Osmo Pocket 3', 'From Dusk Till Dawn With Osmo Action 4']
  return (
    <section className={`compare-page compare-${section}`}>
      <h1>{camera ? 'Camera Drones' : 'Camera & Gimbal'}</h1>
      <p>{camera ? 'Unlock adventure in the sky' : 'Discover the ideal DJI camera, gimbal, and accessories tailored for your daily vlogs or pro-level content creation.'}</p>
      <div className="compare-scenes">
        {sceneTitles.map((title, index) => <ArticleCard key={title} title={title} image={sceneImages[index]} />)}
      </div>
      <h2>Which {camera ? 'Drone' : 'Camera or Gimbal'} Is Right for Me?</h2>
      <ProductRail products={camera ? droneProducts.slice(1, 5) : handheldProducts.slice(0, 4)} />
      <h2>{camera ? 'Image Quality' : 'Imaging Performance'}</h2>
      <SpecComparison camera={camera} />
      <h2>{camera ? 'Safety & Flight Performance' : 'Main Body Performance'}</h2>
      <SpecComparison camera={camera} />
      {camera && <ProductRail products={[droneProducts[5], droneProducts[4], droneProducts[3], droneProducts[1]]} />}
      {camera ? (
        <section className="marketing-video">
          <h2>Moments By You</h2>
          <ArticleCard title="Exploring The Wild" image={asset.droneBeach} />
        </section>
      ) : (
        <section className="marketing-cards">
          <h2>Explore Cameras & Gimbals by Activity</h2>
          <div>
            {[asset.action, asset.bike, asset.dive, asset.travel].map((image, index) => (
              <ArticleCard key={`${image}-activity-${index}`} title={['Vlog', 'Biking', 'Diving', 'Travel'][index]} image={image} />
            ))}
          </div>
        </section>
      )}
      {!camera && (
        <section className="marketing-video">
          <h2>Videos Shot on DJI Cameras and Gimbals</h2>
          <ArticleCard title="Cycling is a feeling as natural as breathing" image={asset.fieldVideo} />
        </section>
      )}
      <section className="marketing-cards">
        <h2>{camera ? 'Camera Drones Playbook' : 'Camera & Gimbal Playbook'}</h2>
        <div>
          {playbookImages.map((image, index) => (
            <ArticleCard
              key={`${image}-playbook-${index}`}
              title={playbookTitles[index]}
              image={image}
            />
          ))}
        </div>
      </section>
    </section>
  )
}

function SpecComparison({ camera }: { camera: boolean }) {
  const specs = camera ? ['4K', '6K', '4K', 'Max Video Resolution', '50 MP', '100 MP', '50 MP', '48 MP'] : ['20 mm, f/2.0', '20 mm, f/2.0', 'Full-Pixel PDAF', 'Full-Pixel PDAF', '4K/240fps', '4K/120fps', '240 Mins', '166 Mins']
  return (
    <div className="spec-table">
      {specs.map((spec, index) => <article key={`${spec}-${index}`}><strong>{spec}</strong><span>{index < 4 ? 'Imaging Performance' : 'Main Body Performance'}</span></article>)}
    </div>
  )
}

function HomeCarousel() {
  const fresh = [
    p('Osmo Pocket 3', asset.pocket, '358', '1-Inch CMOS Pocket Gimbal Camera'),
    p('Osmo Mobile 8P', asset.mobile, '129', 'Pro Framing and Tracking Phone Gimbal'),
    p('DJI Mic Mini 2', asset.mic, '84', 'Mini Wireless Microphone'),
    p('DJI Lito X1', asset.lito, '369', 'Beginner-Friendly Premium Camera Drone'),
  ]
  return (
    <>
      <section className="whats-new">
        <h2>What's New</h2>
        <div>
          {fresh.map((product) => <HomeNewCard key={product.name} product={product} />)}
        </div>
      </section>
      <h2 className="home-section-title compact">Why shop with DJI Store</h2>
      <section className="home-benefits">
        <article className="benefit-tall"><h3>1% DJI Credit Reward</h3><img src={asset.storeDay} alt="" /></article>
        <article><h3>Up to 30-Day Returns</h3><strong>30</strong></article>
        <article><h3>Over USD $45 Ships Free</h3><strong>FREE</strong></article>
        <article><h3>Get DJI Expert Help</h3><img src={asset.fieldAgriculture} alt="" /></article>
        <article><h3>Official Refurbished</h3><img src={asset.droneHero} alt="" /></article>
        <article className="benefit-tall"><h3>Official Accessories</h3><img src={asset.laptop} alt="" /></article>
      </section>
      <Link className="home-sale-banner" to="/store-day" style={{ backgroundImage: `url(${asset.storeDay})` }}>
        <span>Up to 30% Off</span>
        <strong>DJI Store Day</strong>
      </Link>
    </>
  )
}

function HomeNewCard({ product }: { product: Product }) {
  return (
    <Link to="/products" className="home-new-card" style={{ backgroundImage: `url(${product.image})` }}>
      <h3>{product.name}</h3>
      <p>{product.desc}</p>
      <span>From USD ${product.price}</span>
      <button>Buy Now</button>
    </Link>
  )
}

function HomeIconStrip() {
  const icons = ['DJI Mavic', 'DJI Air', 'DJI Mini', 'DJI Lito', 'DJI Flip', 'DJI Avata', 'DJI FPV', 'Osmo Pocket', 'Osmo Nano', 'Osmo 360']
  const images = [asset.droneHero, asset.droneBeach, asset.droneMini, asset.lito, asset.droneAvata, asset.droneNeo, asset.droneHero, asset.pocket, asset.mobile, asset.action]
  return (
    <section className="home-icon-strip">
      {icons.map((label, index) => (
        <Link key={label} to="/products">
          <img src={images[index]} alt="" />
          <span>{label}</span>
        </Link>
      ))}
    </section>
  )
}

function HomeBand({ title, image, to }: { title: string; image: string; to: string }) {
  return (
    <Link to={to} className="home-band" style={{ backgroundImage: `url(${image})` }}>
      <h2>{title}</h2>
      <button>Buy Now</button>
    </Link>
  )
}

function ProductRail({ products }: { products: Product[] }) {
  return <div className="product-rail">{products.map((product) => <ProductCard key={product.name} product={product} />)}<Link className="guide-card" to="/products">All Accessories</Link></div>
}

function ArticleCard({ title, subtitle, image }: { title: string; subtitle?: string; image: string }) {
  return <Link to="/products" className="article-card" style={{ backgroundImage: `url(${image})` }}><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</Link>
}

function FilterSidebar({ section }: { section: StoreSection }) {
  const items = section === 'robot-vacuum' ? ['DJI ROMO'] : section === 'services' ? ['Inspire', 'Ronin Cinema Cameras'] : ['DJI Mavic', 'M30', 'Developer Tools', 'M300', 'Software', 'Livox']
  return (
    <aside className="filter-sidebar">
      <h3>Filter</h3>
      <strong>Product Series</strong>
      {items.map((item) => <label key={item}><input type="radio" /> {item}</label>)}
      <strong>Product Types</strong>
      <label><input type="checkbox" /> Main Products</label>
      <label><input type="checkbox" /> Accessory</label>
    </aside>
  )
}

function RefurbishedHero() {
  return <section className="refurb-hero"><div><h2>OFFICIAL REFURBISHED</h2><p>Up to 30% Off. Certified Quality, Guaranteed.</p></div><img src={asset.mobile} alt="" /></section>
}

function RefurbishedPage() {
  const cameraProducts = repeatTo(pageGroups.refurbished[0].products, 48)
  const handheldRefurbs = repeatTo(pageGroups.refurbished[1].products, 17)
  return (
    <StoreShell>
      <main className="refurbished-page">
        <RefurbishedHero />
        <RefurbishedSection title="Camera Drones" products={cameraProducts} />
        <RefurbishedSection title="Handheld" products={handheldRefurbs} />
        <section className="refurb-info">
          <h2>Why Refurbished Products?</h2>
          <p>Official refurbished products are tested to DJI standards and come with support for essential store services.</p>
          <Link to="/products">Learn More</Link>
        </section>
        <section className="refurb-process">
          {['Product Renewal', 'Cleaning and Sanitizing', 'Functionality and Quality', 'Professional Inspection', 'Repackaged and Ready', 'Valid Warranty'].map((item) => <article key={item}><span className="service-thumb" /><h3>{item}</h3></article>)}
        </section>
        <section className="refurb-faq">
          <h2>Let's Answer Your Questions</h2>
          {['Where do refurbished products come from?', 'Is the quality of a refurbished product guaranteed?', 'What is the difference between refurbished and new products?', 'How should I choose a refurbished product?'].map((item) => <details key={item} open><summary>{item}</summary><p>Every official refurbished product is inspected, cleaned, and covered by DJI Store support.</p></details>)}
        </section>
      </main>
    </StoreShell>
  )
}

function RefurbishedSection({ title, products }: { title: string; products: Product[] }) {
  return (
    <section className="refurb-section">
      <h2>{title}</h2>
      <div className="refurb-grid">
        {products.map((product, index) => (
          <article key={`${product.name}-${index}`} className="refurb-card">
            <img src={product.image} alt={product.name} />
            <div>
              <h3>{product.name}</h3>
              <p>{product.desc || 'Official refurbished product inspected by DJI.'}</p>
              <strong>USD $ {product.price}</strong>
              <Link to="/products">Buy Now</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PromoProduct({ product, index }: { product: Product; index: number }) {
  return <article className="promo-card"><div className="sale-tag">Save {index % 3 === 0 ? '30%' : '15%'}</div><img src={product.image} alt={product.name} /><h3>{product.name}</h3><p>{product.desc || 'Limited-time exclusive offer'}</p><strong>USD $ {product.price}</strong><button>Buy Now</button></article>
}

function TrustStrip() {
  return <section className="trust-strip">{['Free shipping on orders over USD $45', 'We accept credit cards, PayPal, and bank wires', 'Order Service: Live Chat'].map((item) => <article key={item}><span className="service-thumb" /><span>{item}</span></article>)}</section>
}

function StoreFooter() {
  const cols = [
    ['Product Categories', 'Camera Drones', 'Handheld', 'Education & Industry', 'Accessory'],
    ['Help & Support', 'Payment Methods', 'Order Information', 'Shipping & Delivery', 'Return Policy', 'Repair Services'],
    ['Programs', 'DJI Credit', 'Official Refurbished', 'DJI Store App'],
    ['Explore', 'SkyPixel', 'DJI Forum', 'Buying Guides', 'Fly Safe', 'DJI Flying Tips'],
    ['Subscribe', 'Be the first to find out about our newest offerings and hottest deals.'],
  ]
  return <footer className="store-footer"><div>{cols.map((col) => <section key={col[0]}><h3>{col[0]}</h3>{col.slice(1).map((item) => <Link key={item} to="/products">{item}</Link>)}</section>)}</div><p><b>dji</b> Who We Are - Contact Us - Careers - Flagship Stores</p><small>Copyright 2026 DJI All Rights Reserved.</small></footer>
}

function OfficialFooter() {
  const cols = [
    ['Product Categories', 'Camera Drones', 'Handheld', 'Specialized', 'Enterprise'],
    ['Where to Buy', 'DJI Online Store', 'Flagship Store', 'DJI-Operated Stores', 'Retail Stores'],
    ['Fly Safe', 'Fly Safe', 'DJI Flying Tips'],
    ['Support', 'Product Support', 'Service Request and Inquiry', 'Help Center', 'After-Sales Service Policies'],
    ['Explore', 'SkyPixel', 'DJI Forum', 'Buying Guides'],
    ['Community', 'SkyPixel', 'DJI Forum', 'Developer'],
  ]

  return (
    <footer className="official-footer">
      <section className="official-app-banner">
        <strong>Only in the DJI Store App</strong>
        <p>Try virtual flight online for fun, and enjoy convenient one-stop device services.</p>
        <Link to="/products">Download App</Link>
      </section>
      <div className="official-footer-grid">
        {cols.map((col) => (
          <section key={col[0]}>
            <h3>{col[0]}</h3>
            {col.slice(1).map((item) => <Link key={item} to="/products">{item}</Link>)}
          </section>
        ))}
      </div>
      <div className="official-footer-bottom">
        <Link className="footer-logo" to="/"><img src="/logo-white.webp" alt="DJI" /></Link>
        <nav>
          {['Who We Are', 'Contact Us', 'Careers', 'Store', 'Newsroom', 'Affiliate'].map((item) => <Link key={item} to="/products">{item}</Link>)}
        </nav>
      </div>
      <small>Copyright 2026 DJI All Rights Reserved. Privacy Policy / Terms of Use / Site Map</small>
    </footer>
  )
}

function FloatingHelp() {
  return <div className="floating-help"><button>^</button><button>?</button><button>[]</button></div>
}

function flatProducts(groups: ProductGroup[]) {
  return groups.flatMap((group) => (group.hero ? [group.hero, ...group.products] : group.products))
}

function listingProducts(section: StoreSection, groups: ProductGroup[]) {
  const products = flatProducts(groups)
  if (section === 'accessories') return repeatTo(products, 63)
  if (section === 'robot-vacuum') return repeatTo(products, 13)
  return products
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24"><path d="M10.8 18.1a7.3 7.3 0 1 1 5.2-2.1l4 4-1.3 1.3-4-4a7.2 7.2 0 0 1-3.9.8Zm0-1.8a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" /></svg>
}

function CartIcon() {
  return <svg viewBox="0 0 24 24"><path d="M7 18.5a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Zm10 0a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2ZM5.2 5l1.6 8.4h9.7l1.7-6.2H8.4L8 5H5.2Zm-2.1-2h4.5l.5 2.2h12.7l-2.8 10.2H5.2L3.1 3Z" /></svg>
}

function UserIcon() {
  return <svg viewBox="0 0 24 24"><path d="M12 12.3a4.7 4.7 0 1 1 0-9.4 4.7 4.7 0 0 1 0 9.4Zm0-1.8a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8Zm8.2 10.6h-1.8a6.4 6.4 0 0 0-12.8 0H3.8a8.2 8.2 0 0 1 16.4 0Z" /></svg>
}

function GlobeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18Zm0-1.8c.9-1 1.7-2.5 2.1-4.2H9.9c.4 1.7 1.2 3.2 2.1 4.2Zm-2.5-6h5a12 12 0 0 0 0-2.4h-5a12 12 0 0 0 0 2.4Zm-4.6 0h2.8a15 15 0 0 1 0-2.4H4.9a7.1 7.1 0 0 0 0 2.4Zm11.4 0h2.8a7.1 7.1 0 0 0 0-2.4h-2.8a15 15 0 0 1 0 2.4Zm-6.4-4.2h4.2C13.7 7.3 12.9 5.8 12 4.8c-.9 1-1.7 2.5-2.1 4.2Zm6.1 0h2.5a7.3 7.3 0 0 0-4-3.5c.6 1 1.1 2.2 1.5 3.5Zm-10.5 0H8c.4-1.3.9-2.5 1.5-3.5a7.3 7.3 0 0 0-4 3.5Zm9 9.5a7.3 7.3 0 0 0 4-3.5H16c-.4 1.3-.9 2.5-1.5 3.5Zm-5 0A13.7 13.7 0 0 1 8 15H5.5a7.3 7.3 0 0 0 4 3.5Z" /></svg>
}
