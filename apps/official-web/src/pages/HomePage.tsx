import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'

type BannerSlide = {
  id: string
  eyebrow: string
  title: string
  subtitle: string
  sideIntro: string
  productName: string
  imageUrl: string
  linkUrl: string
}

type ArtType =
  | 'camera'
  | 'mic'
  | 'drone'
  | 'pocket'
  | 'avata'
  | 'mobile'
  | 'compare'
  | 'agri'
  | 'ring'
  | 'field'

const bannerSlides: BannerSlide[] = [
  {
    id: 'osmo-pocket-4p',
    eyebrow: 'Stay Tuned',
    title: 'OSMO POCKET 4P',
    subtitle: 'See More. Tell More.',
    sideIntro: 'Stay Tuned',
    productName: 'See More. Tell More.',
    imageUrl: '/banner/1.webp',
    linkUrl: '/products',
  },
  {
    id: 'dji-mavic-4-pro',
    eyebrow: 'Triple-Lens Flagship Camera Drone',
    title: 'DJI MAVIC 4 PRO',
    subtitle: 'Spin Your World',
    sideIntro: 'Camera Drone',
    productName: 'DJI Mavic 4 Pro',
    imageUrl: '/banner/2.jpg',
    linkUrl: '/products',
  },
  {
    id: 'dji-air-3s',
    eyebrow: 'Dual-Camera Drone for Travel Photography',
    title: 'DJI AIR 3S',
    subtitle: 'Chase the View',
    sideIntro: 'Travel Photography',
    productName: 'DJI Air 3S',
    imageUrl: '/banner/3.jpg',
    linkUrl: '/products',
  },
  {
    id: 'osmo-action-6',
    eyebrow: 'All-In-One Flagship Action Camera',
    title: 'OSMO ACTION 6',
    subtitle: 'Square Up, Nail the Move',
    sideIntro: 'Action Camera',
    productName: 'OSMO ACTION 6',
    imageUrl: '/banner/4.jpg',
    linkUrl: '/products',
  },
  {
    id: 'dji-rs-5',
    eyebrow: 'Lightweight Commercial Stabilizer',
    title: 'DJI RS 5',
    subtitle: 'Lead the Scene',
    sideIntro: 'Commercial Stabilizer',
    productName: 'DJI RS 5',
    imageUrl: '/banner/5.jpg',
    linkUrl: '/products',
  },
  {
    id: 'dji-agras-t100',
    eyebrow: 'Smart Agricultural Equipment',
    title: 'DJI AGRAS T100',
    subtitle: 'Big Drone, BigJobs.',
    sideIntro: 'Agricultural Equipment',
    productName: 'DJI AGRAS T100',
    imageUrl: '/banner/6.jpg',
    linkUrl: '/products',
  },
  {
    id: 'dji-flycart-100',
    eyebrow: 'All-in-one Intelligent Transportation Flagship',
    title: 'DJI FLYCART 100',
    subtitle: 'Achieve More Deliveries',
    sideIntro: 'Transportation Flagship',
    productName: 'DJI FLYCART 100',
    imageUrl: '/banner/7.jpg',
    linkUrl: '/products',
  },
  {
    id: 'dji-romo-series',
    eyebrow: 'Flagship Robot Vacuum With Advanced Sensing',
    title: 'DJI ROMO SERIES',
    subtitle: 'Make a Clean Sweep',
    sideIntro: 'ROMO',
    productName: 'ROMO',
    imageUrl: '/banner/8.jpg',
    linkUrl: '/products',
  },
]

const featurePanels = [
  {
    eyebrow: 'DJI Store Day',
    title: 'DJI Store Day',
    subtitle: 'Time for an Upgrade Explore More for Less',
    tone: 'blue',
    art: 'camera' as ArtType,
  },
  {
    eyebrow: 'Internal Recording Mini Wireless Mic',
    title: 'DJI MIC MINI 2S',
    subtitle: 'Capture Every Detail',
    tone: 'mist',
    art: 'mic' as ArtType,
  },
]

const productTiles = [
  { eyebrow: 'Beginner-Friendly Camera Drones', title: 'DJI LITO SERIES', subtitle: 'Just Fly.', art: 'drone' as ArtType },
  { eyebrow: '1-Inch Pocket Gimbal Camera', title: 'OSMO POCKET 4', subtitle: 'The World in My Pocket', art: 'pocket' as ArtType },
  { eyebrow: '8K Flight 360 Degree', title: 'DJI AVATA 360', subtitle: 'Above It All. See It All.', art: 'avata' as ArtType },
  { eyebrow: 'Mini Wireless Microphone', title: 'DJI MIC MINI 2', subtitle: 'More Than Sound', art: 'mic' as ArtType },
  { eyebrow: 'Pro Imaging and Tracking Phone Gimbal', title: 'OSMO MOBILE 8P', subtitle: 'Wonders in Your Palm', art: 'mobile' as ArtType },
  { eyebrow: 'Products Info', title: 'Compare Camera Drones', subtitle: 'See product overviews and comparisons here', art: 'compare' as ArtType },
]

const storySlides = [
  { eyebrow: 'Shot on', title: 'Osmo Mobile 8P', subtitle: 'Learn More > Buy Now >' },
  { eyebrow: 'Created with', title: 'OSMO POCKET 4', subtitle: 'Learn More > Buy Now >' },
  { eyebrow: 'Explore with', title: 'DJI LITO SERIES', subtitle: 'Learn More > Buy Now >' },
]

const innovationCards = [
  { eyebrow: 'DJI Agriculture Report', title: 'DJI Agriculture Annual Report', subtitle: 'Learn More >', art: 'agri' as ArtType },
  {
    eyebrow: 'Engineering & Technology',
    title: 'DJI Ronin 2 Gimbal System Honored with 2025 Scientific and Technical Award',
    subtitle: 'Learn More >',
    art: 'ring' as ArtType,
  },
]

const fieldCards = [
  { eyebrow: 'Video Production', title: 'Professional Aerial and Ground Filmmaking Tools', subtitle: 'Learn More >', art: 'mobile' as ArtType },
  { eyebrow: 'Enterprise', title: 'Drone Solutions for a New Generation of Work', subtitle: 'Learn More >', art: 'field' as ArtType },
  { eyebrow: 'Agriculture', title: 'Efficient and Intelligent Agricultural Solution', subtitle: 'Learn More >', art: 'agri' as ArtType },
]

const services = [
  { icon: 'bag', title: 'Where to buy', text: 'Learn More >' },
  { icon: 'support', title: 'Support', text: 'Learn More >' },
  { icon: 'pin', title: 'Fly Safe', text: 'Learn More >' },
]

export default function HomePage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [storyIndex, setStoryIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % bannerSlides.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [])

  const activeSlide = bannerSlides[activeIndex]
  const activeStory = useMemo(() => storySlides[storyIndex], [storyIndex])

  const moveBanner = (direction: number) => {
    setActiveIndex((current) => (current + direction + bannerSlides.length) % bannerSlides.length)
  }

  const moveStory = (direction: number) => {
    setStoryIndex((current) => (current + direction + storySlides.length) % storySlides.length)
  }

  return (
    <div className="official-home">
      <Navbar />

      <section className="official-banner" aria-label="Featured products">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`official-banner-slide ${index === activeIndex ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
        ))}
        <div className="official-banner-shade" />
        <div key={activeSlide.id} className="official-banner-content">
          <p>{activeSlide.eyebrow}</p>
          <h1>{activeSlide.title}</h1>
          <h2>{activeSlide.subtitle}</h2>
          <div className="official-banner-actions">
            <Link to={activeSlide.linkUrl}>Learn More</Link>
            <Link to="/products">Buy Now</Link>
          </div>
        </div>

        <div key={`${activeSlide.id}-list`} className="official-banner-products">
          <p>{activeSlide.sideIntro}</p>
          <div>
            {bannerSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={index === activeIndex ? 'is-active' : ''}
                onClick={() => setActiveIndex(index)}
              >
                {slide.productName}
              </button>
            ))}
          </div>
        </div>

        <button type="button" className="official-banner-arrow official-banner-arrow-left" aria-label="Previous banner" onClick={() => moveBanner(-1)}>
          ‹
        </button>
        <button type="button" className="official-banner-arrow official-banner-arrow-right" aria-label="Next banner" onClick={() => moveBanner(1)}>
          ›
        </button>
      </section>

      <section className="official-feature-stack">
        {featurePanels.map((panel) => (
          <Link key={panel.title} to="/products" className={`official-feature-panel is-${panel.tone}`}>
            <PanelCopy eyebrow={panel.eyebrow} title={panel.title} subtitle={panel.subtitle} />
            <ProductArt type={panel.art} />
          </Link>
        ))}
      </section>

      <section className="official-product-wall">
        <div className="official-product-grid">
          {productTiles.map((tile) => (
            <Link key={tile.title} to="/products" className="official-product-tile">
              <PanelCopy eyebrow={tile.eyebrow} title={tile.title} subtitle={tile.subtitle} />
              <ProductArt type={tile.art} />
            </Link>
          ))}
        </div>
      </section>

      <section className="official-story-section">
        <button type="button" className="official-story-arrow is-left" aria-label="Previous story" onClick={() => moveStory(-1)}>
          ‹
        </button>
        <div className="official-story-frame">
          <div className="official-story-card">
            <div className="official-story-copy">
              <p>{activeStory.eyebrow}</p>
              <h2>{activeStory.title}</h2>
              <span>{activeStory.subtitle}</span>
            </div>
            <div className="official-story-person">
              <span />
            </div>
            <ProductArt type="mobile" />
          </div>
        </div>
        <button type="button" className="official-story-arrow is-right" aria-label="Next story" onClick={() => moveStory(1)}>
          ›
        </button>
      </section>

      <section className="official-innovation">
        <div className="official-heading-block">
          <h2>Standing at the Forefront of Innovation</h2>
          <p>
            As we explore new technology, we push the capabilities of what is possible, driving progress through continuous innovation.
          </p>
        </div>
        <div className="official-insight-grid">
          {innovationCards.map((card) => (
            <Link key={card.title} to="/products" className="official-insight-card">
              <PanelCopy eyebrow={card.eyebrow} title={card.title} subtitle={card.subtitle} />
              <ProductArt type={card.art} />
            </Link>
          ))}
        </div>
      </section>

      <section className="official-fields">
        <div className="official-heading-block">
          <h2>Explore DJI Products in Different Fields</h2>
        </div>
        <div className="official-field-grid">
          {fieldCards.map((card) => (
            <Link key={card.eyebrow} to="/products" className="official-field-card">
              <PanelCopy eyebrow={card.eyebrow} title={card.title} subtitle={card.subtitle} />
              <ProductArt type={card.art} />
            </Link>
          ))}
        </div>
      </section>

      <section className="official-service-strip">
        {services.map((service) => (
          <Link key={service.title} to="/products" className="official-service-item">
            <ServiceIcon type={service.icon} />
            <h3>{service.title}</h3>
            <span>{service.text}</span>
          </Link>
        ))}
      </section>

      <Footer />
    </div>
  )
}

function PanelCopy({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="official-panel-copy">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <h3>{subtitle}</h3>
      <span>Learn More &gt; Buy Now &gt;</span>
    </div>
  )
}

function ProductArt({ type }: { type: ArtType }) {
  return (
    <div className={`product-art product-art-${type}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={`art-part art-part-${index + 1}`} />
      ))}
    </div>
  )
}

function ServiceIcon({ type }: { type: string }) {
  if (type === 'bag') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M20 25h24l3 27H17l3-27Z" />
        <path d="M25 25v-5a7 7 0 0 1 14 0v5" />
      </svg>
    )
  }

  if (type === 'support') {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18 35V28a14 14 0 0 1 28 0v7" />
        <path d="M18 35h8v12h-8zM38 35h8v12h-8z" />
        <path d="M45 47c0 5-4 8-13 8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 56S16 38 16 26a16 16 0 0 1 32 0c0 12-16 30-16 30Z" />
      <circle cx="32" cy="26" r="6" />
    </svg>
  )
}
