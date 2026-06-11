import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useI18n } from "../i18n";

type BannerSlide = {
  id: string;
  eyebrowKey: string;
  titleKey: string;
  subtitleKey: string;
  sideIntroKey: string;
  productNameKey: string;
  imageUrl: string;
  linkUrl: string;
};

type ArtType =
  | "camera"
  | "mic"
  | "drone"
  | "pocket"
  | "avata"
  | "mobile"
  | "compare"
  | "agri"
  | "ring"
  | "field";

const bannerSlides: BannerSlide[] = [
  {
    id: "osmo-pocket-4p",
    eyebrowKey: "website.home.banner.osmoPocket.eyebrow",
    titleKey: "website.home.banner.osmoPocket.title",
    subtitleKey: "website.home.banner.osmoPocket.subtitle",
    sideIntroKey: "website.home.banner.osmoPocket.sideIntro",
    productNameKey: "website.home.banner.osmoPocket.productName",
    imageUrl: "/banner/1.webp",
    linkUrl: "/products",
  },
  {
    id: "dji-mavic-4-pro",
    eyebrowKey: "website.home.banner.mavic.eyebrow",
    titleKey: "website.home.banner.mavic.title",
    subtitleKey: "website.home.banner.mavic.subtitle",
    sideIntroKey: "website.home.banner.mavic.sideIntro",
    productNameKey: "website.home.banner.mavic.productName",
    imageUrl: "/banner/2.jpg",
    linkUrl: "/products",
  },
  {
    id: "dji-air-3s",
    eyebrowKey: "website.home.banner.air.eyebrow",
    titleKey: "website.home.banner.air.title",
    subtitleKey: "website.home.banner.air.subtitle",
    sideIntroKey: "website.home.banner.air.sideIntro",
    productNameKey: "website.home.banner.air.productName",
    imageUrl: "/banner/3.jpg",
    linkUrl: "/products",
  },
  {
    id: "osmo-action-6",
    eyebrowKey: "website.home.banner.action.eyebrow",
    titleKey: "website.home.banner.action.title",
    subtitleKey: "website.home.banner.action.subtitle",
    sideIntroKey: "website.home.banner.action.sideIntro",
    productNameKey: "website.home.banner.action.productName",
    imageUrl: "/banner/4.jpg",
    linkUrl: "/products",
  },
  {
    id: "dji-rs-5",
    eyebrowKey: "website.home.banner.rs.eyebrow",
    titleKey: "website.home.banner.rs.title",
    subtitleKey: "website.home.banner.rs.subtitle",
    sideIntroKey: "website.home.banner.rs.sideIntro",
    productNameKey: "website.home.banner.rs.productName",
    imageUrl: "/banner/5.jpg",
    linkUrl: "/products",
  },
  {
    id: "dji-agras-t100",
    eyebrowKey: "website.home.banner.agras.eyebrow",
    titleKey: "website.home.banner.agras.title",
    subtitleKey: "website.home.banner.agras.subtitle",
    sideIntroKey: "website.home.banner.agras.sideIntro",
    productNameKey: "website.home.banner.agras.productName",
    imageUrl: "/banner/6.jpg",
    linkUrl: "/products",
  },
  {
    id: "dji-flycart-100",
    eyebrowKey: "website.home.banner.flycart.eyebrow",
    titleKey: "website.home.banner.flycart.title",
    subtitleKey: "website.home.banner.flycart.subtitle",
    sideIntroKey: "website.home.banner.flycart.sideIntro",
    productNameKey: "website.home.banner.flycart.productName",
    imageUrl: "/banner/7.jpg",
    linkUrl: "/products",
  },
  {
    id: "dji-romo-series",
    eyebrowKey: "website.home.banner.romo.eyebrow",
    titleKey: "website.home.banner.romo.title",
    subtitleKey: "website.home.banner.romo.subtitle",
    sideIntroKey: "website.home.banner.romo.sideIntro",
    productNameKey: "website.home.banner.romo.productName",
    imageUrl: "/banner/8.jpg",
    linkUrl: "/products",
  },
];

const featurePanels = [
  {
    eyebrowKey: "website.home.feature.storeDay.eyebrow",
    titleKey: "website.home.feature.storeDay.title",
    subtitleKey: "website.home.feature.storeDay.subtitle",
    tone: "blue",
    art: "camera" as ArtType,
  },
  {
    eyebrowKey: "website.home.feature.mic.eyebrow",
    titleKey: "website.home.feature.mic.title",
    subtitleKey: "website.home.feature.mic.subtitle",
    tone: "mist",
    art: "mic" as ArtType,
  },
];

const productTiles = [
  {
    eyebrowKey: "website.home.product.lito.eyebrow",
    titleKey: "website.home.product.lito.title",
    subtitleKey: "website.home.product.lito.subtitle",
    art: "drone" as ArtType,
  },
  {
    eyebrowKey: "website.home.product.pocket.eyebrow",
    titleKey: "website.home.product.pocket.title",
    subtitleKey: "website.home.product.pocket.subtitle",
    art: "pocket" as ArtType,
  },
  {
    eyebrowKey: "website.home.product.avata.eyebrow",
    titleKey: "website.home.product.avata.title",
    subtitleKey: "website.home.product.avata.subtitle",
    art: "avata" as ArtType,
  },
  {
    eyebrowKey: "website.home.product.mic.eyebrow",
    titleKey: "website.home.product.mic.title",
    subtitleKey: "website.home.product.mic.subtitle",
    art: "mic" as ArtType,
  },
  {
    eyebrowKey: "website.home.product.mobile.eyebrow",
    titleKey: "website.home.product.mobile.title",
    subtitleKey: "website.home.product.mobile.subtitle",
    art: "mobile" as ArtType,
  },
  {
    eyebrowKey: "website.home.product.compare.eyebrow",
    titleKey: "website.home.product.compare.title",
    subtitleKey: "website.home.product.compare.subtitle",
    art: "compare" as ArtType,
  },
];

const storySlides = [
  {
    eyebrowKey: "website.home.story.mobile.eyebrow",
    titleKey: "website.home.story.mobile.title",
    subtitleKey: "website.home.story.cta",
  },
  {
    eyebrowKey: "website.home.story.pocket.eyebrow",
    titleKey: "website.home.story.pocket.title",
    subtitleKey: "website.home.story.cta",
  },
  {
    eyebrowKey: "website.home.story.lito.eyebrow",
    titleKey: "website.home.story.lito.title",
    subtitleKey: "website.home.story.cta",
  },
];

const innovationCards = [
  {
    eyebrowKey: "website.home.innovation.agri.eyebrow",
    titleKey: "website.home.innovation.agri.title",
    subtitleKey: "website.common.learnMoreArrow",
    art: "agri" as ArtType,
  },
  {
    eyebrowKey: "website.home.innovation.tech.eyebrow",
    titleKey: "website.home.innovation.tech.title",
    subtitleKey: "website.common.learnMoreArrow",
    art: "ring" as ArtType,
  },
];

const fieldCards = [
  {
    eyebrowKey: "website.home.fields.video.eyebrow",
    titleKey: "website.home.fields.video.title",
    subtitleKey: "website.common.learnMoreArrow",
    art: "mobile" as ArtType,
  },
  {
    eyebrowKey: "website.home.fields.enterprise.eyebrow",
    titleKey: "website.home.fields.enterprise.title",
    subtitleKey: "website.common.learnMoreArrow",
    art: "field" as ArtType,
  },
  {
    eyebrowKey: "website.home.fields.agriculture.eyebrow",
    titleKey: "website.home.fields.agriculture.title",
    subtitleKey: "website.common.learnMoreArrow",
    art: "agri" as ArtType,
  },
];

const services = [
  {
    icon: "bag",
    titleKey: "website.footer.colWhereToBuy",
    textKey: "website.common.learnMoreArrow",
  },
  {
    icon: "support",
    titleKey: "website.nav.support",
    textKey: "website.common.learnMoreArrow",
  },
  {
    icon: "pin",
    titleKey: "website.footer.colFlySafe",
    textKey: "website.common.learnMoreArrow",
  },
];

export default function HomePage() {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % bannerSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const activeSlide = bannerSlides[activeIndex];
  const activeStory = useMemo(() => storySlides[storyIndex], [storyIndex]);

  const moveBanner = (direction: number) => {
    setActiveIndex(
      (current) =>
        (current + direction + bannerSlides.length) % bannerSlides.length,
    );
  };

  const moveStory = (direction: number) => {
    setStoryIndex(
      (current) =>
        (current + direction + storySlides.length) % storySlides.length,
    );
  };

  return (
    <div className="official-home">
      <Navbar />

      <section
        className="official-banner"
        aria-label={t("website.home.featuredProducts")}
      >
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`official-banner-slide ${index === activeIndex ? "is-active" : ""}`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          />
        ))}
        <div className="official-banner-shade" />
        <div key={activeSlide.id} className="official-banner-content">
          <p>{t(activeSlide.eyebrowKey)}</p>
          <h1>{t(activeSlide.titleKey)}</h1>
          <h2>{t(activeSlide.subtitleKey)}</h2>
          <div className="official-banner-actions">
            <Link to={activeSlide.linkUrl}>
              {t("website.common.learnMore")}
            </Link>
            <Link to="/products">{t("website.common.buyNow")}</Link>
          </div>
        </div>

        <div
          key={`${activeSlide.id}-list`}
          className="official-banner-products"
        >
          <p>{t(activeSlide.sideIntroKey)}</p>
          <div>
            {bannerSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={index === activeIndex ? "is-active" : ""}
                onClick={() => setActiveIndex(index)}
              >
                {t(slide.productNameKey)}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="official-banner-arrow official-banner-arrow-left"
          aria-label={t("website.common.previous")}
          onClick={() => moveBanner(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          className="official-banner-arrow official-banner-arrow-right"
          aria-label={t("website.common.next")}
          onClick={() => moveBanner(1)}
        >
          ›
        </button>
      </section>

      <section className="official-feature-stack">
        {featurePanels.map((panel) => (
          <Link
            key={panel.titleKey}
            to="/products"
            className={`official-feature-panel is-${panel.tone}`}
          >
            <PanelCopy
              eyebrow={t(panel.eyebrowKey)}
              title={t(panel.titleKey)}
              subtitle={t(panel.subtitleKey)}
              cta={t("website.common.learnMoreBuyNow")}
            />
            <ProductArt type={panel.art} />
          </Link>
        ))}
      </section>

      <section className="official-product-wall">
        <div className="official-product-grid">
          {productTiles.map((tile) => (
            <Link
              key={tile.titleKey}
              to="/products"
              className="official-product-tile"
            >
              <PanelCopy
                eyebrow={t(tile.eyebrowKey)}
                title={t(tile.titleKey)}
                subtitle={t(tile.subtitleKey)}
                cta={t("website.common.learnMoreBuyNow")}
              />
              <ProductArt type={tile.art} />
            </Link>
          ))}
        </div>
      </section>

      <section className="official-story-section">
        <button
          type="button"
          className="official-story-arrow is-left"
          aria-label={t("website.common.previous")}
          onClick={() => moveStory(-1)}
        >
          ‹
        </button>
        <div className="official-story-frame">
          <div className="official-story-card">
            <div className="official-story-copy">
              <p>{t(activeStory.eyebrowKey)}</p>
              <h2>{t(activeStory.titleKey)}</h2>
              <span>{t(activeStory.subtitleKey)}</span>
            </div>
            <div className="official-story-person">
              <span />
            </div>
            <ProductArt type="mobile" />
          </div>
        </div>
        <button
          type="button"
          className="official-story-arrow is-right"
          aria-label={t("website.common.next")}
          onClick={() => moveStory(1)}
        >
          ›
        </button>
      </section>

      <section className="official-innovation">
        <div className="official-heading-block">
          <h2>{t("website.home.innovation.title")}</h2>
          <p>{t("website.home.innovation.subtitle")}</p>
        </div>
        <div className="official-insight-grid">
          {innovationCards.map((card) => (
            <Link
              key={card.titleKey}
              to="/products"
              className="official-insight-card"
            >
              <PanelCopy
                eyebrow={t(card.eyebrowKey)}
                title={t(card.titleKey)}
                subtitle={t(card.subtitleKey)}
                cta={t("website.common.learnMoreBuyNow")}
              />
              <ProductArt type={card.art} />
            </Link>
          ))}
        </div>
      </section>

      <section className="official-fields">
        <div className="official-heading-block">
          <h2>{t("website.home.fields.title")}</h2>
        </div>
        <div className="official-field-grid">
          {fieldCards.map((card) => (
            <Link
              key={card.eyebrowKey}
              to="/products"
              className="official-field-card"
            >
              <PanelCopy
                eyebrow={t(card.eyebrowKey)}
                title={t(card.titleKey)}
                subtitle={t(card.subtitleKey)}
                cta={t("website.common.learnMoreBuyNow")}
              />
              <ProductArt type={card.art} />
            </Link>
          ))}
        </div>
      </section>

      <section className="official-service-strip">
        {services.map((service) => (
          <Link
            key={service.titleKey}
            to="/products"
            className="official-service-item"
          >
            <ServiceIcon type={service.icon} />
            <h3>{t(service.titleKey)}</h3>
            <span>{t(service.textKey)}</span>
          </Link>
        ))}
      </section>

      <Footer />
    </div>
  );
}

function PanelCopy({
  eyebrow,
  title,
  subtitle,
  cta,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: string;
}) {
  return (
    <div className="official-panel-copy">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      <h3>{subtitle}</h3>
      <span>{cta}</span>
    </div>
  );
}

function ProductArt({ type }: { type: ArtType }) {
  return (
    <div className={`product-art product-art-${type}`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={`art-part art-part-${index + 1}`} />
      ))}
    </div>
  );
}

function ServiceIcon({ type }: { type: string }) {
  if (type === "bag") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M20 25h24l3 27H17l3-27Z" />
        <path d="M25 25v-5a7 7 0 0 1 14 0v5" />
      </svg>
    );
  }

  if (type === "support") {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M18 35V28a14 14 0 0 1 28 0v7" />
        <path d="M18 35h8v12h-8zM38 35h8v12h-8z" />
        <path d="M45 47c0 5-4 8-13 8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 56S16 38 16 26a16 16 0 0 1 32 0c0 12-16 30-16 30Z" />
      <circle cx="32" cy="26" r="6" />
    </svg>
  );
}
