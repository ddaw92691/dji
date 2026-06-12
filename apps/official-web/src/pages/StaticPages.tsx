import { Link } from "react-router-dom";
import { useI18n } from "../i18n";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { getMallUrl } from "../utils/mallUrl";

const D = {
  cameraBase:
    "https://www-cdn.djiits.com/dps/38f6cede8d1c6232796e5ea82b9b70ba@origin.jpg?w=5120&h=1600",
  cameraMavic:
    "https://www-cdn.djiits.com/dps/616ce40a9e6299aec3fa19f787b5c97f.jpg?w=2512&h=1392",
  cameraMini:
    "https://www-cdn.djiits.com/dps/ec954fdfec4192a5893daa89ba3ae5ba.jpg?w=2512&h=1392",
  cameraAvata:
    "https://www-cdn.djiits.com/dps/b7ffee306ba185536873e2d0328afd36.jpg?w=2512&h=1392",
  cameraNeo:
    "https://www-cdn.djiits.com/dps/1fb824220c1b8806011c96512681181b.jpg?w=2512&h=1392",
  handheldActivity1:
    "https://www-cdn.djiits.com/dps/006e32f2690bef717945e93f2ace6d5e.jpg?w=864&h=1200",
  handheldActivity2:
    "https://www-cdn.djiits.com/dps/0b8dd0e6dc1843989868ce802482e788.jpg?w=864&h=1200",
  handheldActivity3:
    "https://www-cdn.djiits.com/dps/f8b1248af7af96e073f62a5f6ef7ea65.jpg?w=864&h=1200",
  handheldActivity4:
    "https://www-cdn.djiits.com/dps/664940f142c76324dcf40a4e12af3d39.jpg?w=864&h=1200",
  handheldActivity5:
    "https://www-cdn.djiits.com/dps/56ac3e1c344ce430896a06763ecea63a.jpg?w=864&h=1200",
  handheldMini:
    "https://www-cdn.djiits.com/dps/c83362e725b56f98f6c16a54cb75c92e.jpg?w=1184&h=592",
  handheldRonin:
    "https://www-cdn.djiits.com/dps/72fd553b1234640bbe06aa703aeb25cd.jpg?w=2512&h=1392",
  powerProduct:
    "https://www-cdn.djiits.com/cms/uploads/4fd3c35ee4bf3265bc4e5c5b16d132a3.png",
  deliveryHero:
    "https://www-cdn.djiits.com/dps/e0f6834978dc23e8771eb09a182f581a.jpg",
  deliveryScene:
    "https://www-cdn.djiits.com/dps/1ae6e48c2e24efb8eed4f70b8717a18e.jpg?w=1800&h=1000",
  deliveryProduct:
    "https://www-cdn.djiits.com/dps/e38930a980c843f69f68dc708037249c.jpg",
  deliveryHub:
    "https://www-cdn.djiits.com/dps/83ee74637888fd362aac186aae1ff370.jpg",
  companyHero:
    "https://www-cdn.djiits.com/dps/c8103c8aca19373d0e0632f434ebbe83.webp",
  mediaHero:
    "https://www-cdn.djiits.com/cms/uploads/187cd6bd8123342f34a326d78ce3f85f@770*462.png",
  trustHero:
    "https://www-cdn.djiits.com/dps/2e55710f13aca7834b56e33d595aebca@origin.jpg",
  trustCard1:
    "https://www-cdn.djiits.com/dps/6cd18d323ffa533ac49b8a201de18dbc@origin.jpg?w=778&h=384",
  trustCard2:
    "https://www-cdn.djiits.com/dps/138f9da44eb417caaebeaa0f9abebee1@origin.jpg",
  trustCard3:
    "https://www-cdn.djiits.com/dps/c1e6bfbcf0c2045095ec199b8ad21b14@origin.jpg",
  trustCard4:
    "https://www-cdn.djiits.com/dps/bc341248f8a77207c84388cde1507024@origin.jpg",
  supportHero:
    "https://www-cdn.djiits.com/dps/45e7e873451133328e2adf78ea2e4c1d.jpg",
  whereToBuyHero:
    "https://terra-1-g.djicdn.com/851d20f7b9f64838a34cd02351370894/W2B%20Banner/Online%20Stores.jpg",
  romoHero:
    "https://romo.online/wp-content/uploads/2025/09/062463dfee974f416d48e02359ad5412-scaled.jpg",
  romoSeries:
    "https://romo.online/wp-content/uploads/2025/09/09bd75187440babc7b8774f441dc5207-scaled.jpg",
  romoSubscribe:
    "https://romo.online/wp-content/uploads/2025/09/3576ddd7534697a17b705433577aa2a1-scaled.jpg",
};

const iconImages = [
  D.cameraMavic,
  D.cameraMini,
  D.cameraAvata,
  D.cameraNeo,
  "/banner/2.jpg",
  "/banner/3.jpg",
  D.powerProduct,
  "/banner/8.jpg",
];

const mediaImages = [
  D.mediaHero,
  "/banner/1.webp",
  "/banner/7.jpg",
  D.deliveryScene,
  D.trustCard1,
  D.trustCard2,
  D.trustCard3,
  D.trustCard4,
];

function staticKey(text: string) {
  return `website.static.${text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "")}`;
}

function useStaticT() {
  const { t } = useI18n();
  return (text?: string) => (text ? t(staticKey(text), text) : "");
}

function fallbackImage(seed: string) {
  return `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80&sig=${encodeURIComponent(seed)}`;
}

const droneProducts: [string, string, string][] = [
  ["DJI LITO SERIES", "Just Fly", D.cameraBase],
  ["DJI MAVIC 4 PRO", "Spin Your World", D.cameraMavic],
  ["DJI MINI 5 PRO", "Pro in Mini", D.cameraMini],
  ["DJI AVATA 360", "Above It All. See It All", D.cameraAvata],
  ["DJI NEO 2", "Fly Your Way", D.cameraNeo],
];

const handheldProducts: [string, string, string][] = [
  ["DJI MIC MINI 2", "More Than Sound", D.handheldMini],
  ["OSMO MOBILE 8P", "Wonders in Your Palm", "/banner/5.jpg"],
  ["OSMO POCKET 4", "The World in My Pocket", "/banner/1.webp"],
  ["OSMO ACTION 6", "Square Up, Nail the Move", "/banner/4.jpg"],
  ["OSMO 360", "All in One", D.cameraAvata],
  ["OSMO NANO", "Own the Moment", D.cameraNeo],
];

const powerProducts: [string, string, string][] = [
  [
    "DJI Power 1000 Mini",
    "DJI ultra-portable 1kWh power station with high-efficiency output and fast charging.",
    D.powerProduct,
  ],
  [
    "DJI Power 1000 V2",
    "High-capacity output, safety design, USB-C ports, and fast charging.",
    D.powerProduct,
  ],
  [
    "DJI Power 2000",
    "Compact 2048Wh power station with stable high-power output.",
    D.powerProduct,
  ],
  [
    "DJI Power Super Fast Car Chargers",
    "Super fast car charging for portable power stations.",
    D.powerProduct,
  ],
  [
    "DJI Power Expansion Battery 2000",
    "2048Wh high-capacity expansion battery for extended use.",
    D.powerProduct,
  ],
  [
    "DJI Power 1000",
    "Genuine ultra-high-capacity power output for camping and road trips.",
    D.powerProduct,
  ],
];

export function CameraDronesPage() {
  return (
    <DjiPage>
      <IconStrip
        items={[
          "DJI Mavic",
          "DJI Air",
          "DJI Mini",
          "DJI Neo",
          "DJI Avata",
          "Compare",
          "Accessories",
          "Shop Now",
        ]}
      />
      <SectionTitle
        title="Camera Drones"
        text="Capture your moments from above with a mini drone, FPV, or professional aerial camera."
      />
      <ProductMosaic products={droneProducts} />
      <QuizBlock />
      <Comparison
        title="Popular Drone Comparisons"
        products={[
          "DJI Mavic 4 Pro",
          "DJI Air 3S",
          "DJI Mini 5 Pro",
          "DJI Avata 360",
        ]}
      />
      <ExploreGrid
        title="Explore More"
        cards={[
          [
            "Accessories",
            "Controllers, goggles, batteries, and more",
            fallbackImage("accessories"),
          ],
          [
            "DJI Care Refresh",
            "Protect your drone with this comprehensive plan",
            fallbackImage("care"),
          ],
        ]}
      />
      <ProductSupport />
    </DjiPage>
  );
}

export function HandheldPage() {
  return (
    <DjiPage>
      <IconStrip
        items={[
          "Osmo Mobile",
          "Osmo 360",
          "Osmo Action",
          "Osmo Pocket",
          "DJI Mic",
          "Ronin",
          "Accessories",
          "Shop Now",
        ]}
      />
      <SectionTitle
        title="Select Handheld Gear"
        text="Tailored to Your Scene"
      />
      <SceneTiles />
      <SectionTitle
        title="Handheld Imaging Devices"
        text="From casual vlogging to professional shoots, there is always an action camera or handheld stabilizer that is right for you."
      />
      <ProductMosaic products={handheldProducts} />
      <Comparison
        title="Which handheld imaging device is right for you?"
        products={["Osmo Action 6", "Osmo Action 5 Pro", "Osmo Action 4"]}
      />
      <ExploreGrid
        title="More Popular Products"
        cards={[
          ["DJI RS 5", "Lightweight Commercial Stabilizer", "/banner/5.jpg"],
          [
            "DJI Ronin 4D",
            "Full-frame 8K/60fps 4-axis cinema camera",
            D.handheldRonin,
          ],
        ]}
      />
      <ExploreGrid
        title="Explore More"
        cards={[
          [
            "DJI Care Refresh",
            "Comprehensive plan to protect your device",
            fallbackImage("care2"),
          ],
          [
            "Download Center",
            "Official apps, software, and manuals",
            fallbackImage("apps"),
          ],
        ]}
      />
      <ServiceStrip />
    </DjiPage>
  );
}

export function PowerStationsPage() {
  const tr = useStaticT();
  return (
    <DjiPage tone="gray">
      <section className="ow-product-list-page">
        <SectionTitle
          title="Portable Power Station"
          text="Power Anywhere, Anytime"
        />
        <div className="ow-product-list-layout">
          <aside className="ow-side-pill">
            {tr("DJI Power Series")} <span>{tr("New")}</span>
          </aside>
          <div className="ow-power-grid">
            {powerProducts.map((product, index) => (
              <ProductCard
                key={product[0]}
                product={product}
                cta={index === 5 ? "Buy Now" : "Learn More"}
              />
            ))}
          </div>
        </div>
      </section>
    </DjiPage>
  );
}

export function RobotVacuumsPage() {
  const tr = useStaticT();
  return (
    <div className="romo-page">
      <RomoNav />
      <HeroPanel
        title="ROMO P"
        eyebrow="Flagship Robot Vacuum With Advanced Sensing"
        image={D.romoHero}
        align="left"
      />
      <HeroPanel
        title="ROMO A ROMO S"
        eyebrow="DJI's First Flagship Robot Vacuum"
        image={D.romoSeries}
        align="left"
        dark={false}
      />
      <section className="romo-modern">
        <h2>{tr("For the Modern Aesthete")}</h2>
        <p>
          {tr(
            "The ROMO series combines cutting-edge perception and electromechanical technology inspired by flagship drones, freeing you to enjoy a clean home with minimal effort.",
          )}
        </p>
        <div className="romo-card-grid">
          {["ROMO P", "ROMO A", "ROMO S"].map((title, index) => (
            <article key={title}>
              <img
                src={
                  index === 0 ? "/banner/8.jpg" : fallbackImage(`romo-${index}`)
                }
                alt={title}
              />
              <h3>{title}</h3>
              <p>
                {tr(
                  "Features intelligent sensing, anti-tangle brushes, powerful suction, and a self-cleaning base station.",
                )}
              </p>
              <div>
                <button type="button">{tr("Buy Now")}</button>
                <button type="button">{tr("Learn More")}</button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section
        className="romo-subscribe"
        style={{ backgroundImage: `url(${D.romoSubscribe})` }}
      >
        <h2>{tr("Subscribe to receive news about ROMO products.")}</h2>
        <button type="button">{tr("Subscribe")}</button>
      </section>
      <RomoFooter />
    </div>
  );
}

export function DeliveryPage() {
  const tr = useStaticT();
  const scenarios = [
    "Emergency",
    "Firefighting",
    "Utility",
    "Construction",
    "Logistics",
    "Waters",
  ];

  return (
    <DjiPage>
      <HeroPanel
        title="DJI FLYCART 100"
        eyebrow="Achieve More Deliveries"
        image={D.deliveryHero}
        align="left"
        buttons={["Learn More"]}
      />
      <section className="ow-narrow">
        <h2>{tr("Application Scenarios")}</h2>
        <div className="ow-scenario-grid">
          {scenarios.map((scenario) => (
            <ImageOverlayCard
              key={scenario}
              title={scenario}
              image={fallbackImage(`delivery-${scenario}`)}
            />
          ))}
        </div>
      </section>
      <section className="ow-delivery-products">
        {["DJI FlyCart 100", "DJI FlyCart 30", "DJI DeliveryHub"].map(
          (title, index) => (
            <article key={title}>
              <div>
                <h3>{title}</h3>
                <p>
                  {tr(
                    "Reliable aerial delivery solution for complex terrain, emergency scenarios, and efficient transport management.",
                  )}
                </p>
                <button type="button">{tr("Contact Us")}</button>
                <button type="button">{tr("Learn More")}</button>
              </div>
              <img
                src={
                  index === 0
                    ? D.deliveryProduct
                    : index === 1
                      ? "/banner/7.jpg"
                      : D.deliveryHub
                }
                alt={title}
              />
            </article>
          ),
        )}
      </section>
      <ServiceStrip title="Support" />
      <ContactForm />
    </DjiPage>
  );
}

export function CompanyPage() {
  const tr = useStaticT();
  return (
    <DjiPage>
      <div
        className="ow-company-hero"
        style={{ backgroundImage: `url(${D.companyHero})` }}
      />
      <section className="ow-company-copy">
        <aside>
          <span />
          {tr("About DJI")}
          <br />
          {tr("Contact DJI")}
          <br />
          {tr("Careers")}
        </aside>
        <div>
          <p>
            {tr(
              "Creativity is at the heart of every dream. Every idea, every groundbreaking leap that changes our world starts with the vision of talented creators. At DJI, we give these creators the tools they need to bring their ideas to life.",
            )}
          </p>
          <p>
            {tr(
              "Our platforms empower them to capture images that were once out of reach. Our flying and camera stabilization systems redefine camera placement and motion.",
            )}
          </p>
          <p>
            {tr(
              "Headquartered in Shenzhen, DJI benefits from direct access to suppliers, raw materials, and a young creative talent pool necessary for sustained success.",
            )}
          </p>
        </div>
      </section>
    </DjiPage>
  );
}

export function MediaCenterPage() {
  const tr = useStaticT();
  return (
    <DjiPage>
      <SubBar
        title="Media Center"
        links={[
          "DJI Trust Center",
          "Viewpoints Blog",
          "Announcements",
          "Media Coverage",
          "Insights",
          "Subscribe",
        ]}
      />
      <section className="ow-media-page">
        <h1>{tr("Media Center")}</h1>
        {["News", "Media Coverage", "Insights Blog"].map((title, index) => (
          <MediaSection key={title} title={title} index={index} />
        ))}
      </section>
    </DjiPage>
  );
}

export function TrustCenterPage() {
  return (
    <DjiPage tone="gray">
      <SubBar
        title="DJI Trust Center"
        links={[
          "Overview",
          "Consumer",
          "Enterprise",
          "Bug Bounty",
          "Resources",
        ]}
      />
      <HeroPanel
        title="A Longstanding Commitment to Safety and Security"
        eyebrow="We were the first drone maker to introduce built-in user privacy controls."
        image={D.trustHero}
        buttons={[]}
        eyebrowPosition="below"
      />
      <InfoCards
        title="Discover the Privacy Protections of Your DJI Drone"
        cards={[
          "For Consumers",
          "For Enterprise Operators",
          "Bug Bounty",
          "Resources",
        ]}
      />
      <OverlayGrid
        title="A Principled Approach to Data Security"
        items={[
          "Transparency & Education",
          "Give Users Control",
          "Independent Validation",
          "Community Collaboration",
        ]}
      />
      <LatestAnnouncements />
    </DjiPage>
  );
}

export function SupportPage() {
  const tr = useStaticT();
  return (
    <DjiPage>
      <SubBar title="Support" links={["Service Request and Inquiry"]} />
      <section
        className="ow-support-hero"
        style={{ backgroundImage: `url(${D.supportHero})` }}
      >
        <h1>{tr("Support")}</h1>
        <p>{tr("Welcome to DJI Support")}</p>
        <div>
          <input placeholder={tr("Search for Support")} />
          <button type="button">{tr("Search")}</button>
        </div>
      </section>
      <ServiceCards
        title="Convenient Services"
        items={["Download Center", "GEO Zone Map", "Repair Service"]}
      />
      <SupportProducts />
      <ServiceCards
        title="Service Request and Inquiry"
        items={[
          "Service Progress",
          "Device Info",
          "After-Sales Service Policies",
          "Accessory Price",
          "My Service Portal",
          "Authorized Service Center",
        ]}
        columns={3}
      />
      <ServiceCards
        title="Discover More DJI Services"
        items={["Fly Safe", "DJI Flying Tips"]}
        columns={2}
      />
      <NewsList />
      <ContactUsCards />
    </DjiPage>
  );
}

export function WhereToBuyPage() {
  const tr = useStaticT();
  return (
    <DjiPage>
      <section className="ow-buy-page">
        <p className="ow-breadcrumb">
          {tr("Home / Where To Buy / Official Online Stores")}
        </p>
        <h1>{tr("Where To Buy")}</h1>
        <div className="ow-buy-tabs">
          {[
            "Official Online Stores",
            "Retail Stores",
            "Authorized Dealer",
            "Enterprise Dealers",
            "Agricultural Drone Dealers",
            "Pro Dealers",
            "Delivery Drone Dealers",
          ].map((item, index) => (
            <span key={item} className={index === 0 ? "active" : ""}>
              {tr(item)}
            </span>
          ))}
        </div>
        <div className="ow-official-store">
          <div>
            <h2>{tr("DJI Official Online Store")}</h2>
            <ul>
              <li>
                {tr("Provides official products and comprehensive services")}
              </li>
              <li>{tr("DJI Credit Reward")}</li>
              <li>{tr("Get DJI expert help")}</li>
              <li>{tr("Up to 30-Day Returns")}</li>
            </ul>
            <button type="button">{tr("Buy Now")}</button>
          </div>
          <img src={D.whereToBuyHero} alt="DJI Online Store" />
        </div>
        <div className="ow-store-grid">
          {[
            "DJI Store App",
            "Lazada DJI Official Store",
            "Shopee DJI Official Store",
          ].map((item) => (
            <article key={item}>
              <p>{tr(item.split(" ")[0])}</p>
              <h3>{tr(item)} &gt;</h3>
            </article>
          ))}
        </div>
      </section>
    </DjiPage>
  );
}

function DjiPage({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone?: "gray";
}) {
  return (
    <div className={`ow-page ${tone === "gray" ? "is-gray" : ""}`}>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

function SectionTitle({ title, text }: { title: string; text?: string }) {
  const tr = useStaticT();
  return (
    <section className="ow-section-title">
      <h1>{tr(title)}</h1>
      {text && <p>{tr(text)}</p>}
    </section>
  );
}

function IconStrip({ items }: { items: string[] }) {
  const tr = useStaticT();
  return (
    <div className="ow-icon-strip">
      {items.map((item, index) => (
        <Link to="/products" key={item}>
          <span>
            <img src={iconImages[index % iconImages.length]} alt="" />
          </span>
          <p>{tr(item)}</p>
        </Link>
      ))}
    </div>
  );
}

function ProductMosaic({ products }: { products: [string, string, string][] }) {
  const tr = useStaticT();
  return (
    <section className="ow-mosaic">
      {products.map((product, index) => (
        <Link
          key={product[0]}
          to="/products"
          className={index === 0 ? "wide" : ""}
          style={{ backgroundImage: `url(${product[2]})` }}
        >
          <div>
            <p>
              {tr(
                index === 0
                  ? "Beginner-Friendly Camera Drones"
                  : "Flagship Product",
              )}
            </p>
            <h2>{tr(product[0])}</h2>
            <h3>{tr(product[1])}</h3>
            <button type="button">{tr("Buy Now")}</button>
            <button type="button">{tr("Learn More")}</button>
          </div>
        </Link>
      ))}
    </section>
  );
}

function QuizBlock() {
  const tr = useStaticT();
  return (
    <section className="ow-quiz">
      <div>
        <h3>{tr("Want to choose your perfect drone?")}</h3>
        <p>{tr("Take a quick quiz to find your perfect drone match.")}</p>
        <button type="button">{tr("Take a quiz")}</button>
      </div>
      <img src="/banner/2.jpg" alt="Drone quiz" />
    </section>
  );
}

function Comparison({
  title,
  products,
}: {
  title: string;
  products: string[];
}) {
  const tr = useStaticT();
  const specs = [
    "Takeoff Weight",
    "Max Flight Time",
    "Camera System",
    "Max Video Resolution",
    "Max Photo Resolution",
    "Omnidirectional Obstacle Sensing",
    "Video Transmission",
  ];

  return (
    <section className="ow-comparison">
      <h2>{tr(title)}</h2>
      <div className="ow-tabs">
        <span>{tr("Aerial Imaging")}</span>
        <span>{tr("Immersive Flight")}</span>
        <span>{tr("Starter Flight")}</span>
      </div>
      <div className="ow-compare-grid">
        {products.map((product, index) => (
          <article key={product}>
            <img
              src={
                index === 0
                  ? "/banner/2.jpg"
                  : fallbackImage(`compare-${index}`)
              }
              alt={product}
            />
            <p className="tag">
              {tr(index === 0 ? "Flagship" : index === 3 ? "New" : "Advanced")}
            </p>
            <h3>{product}</h3>
            <button type="button">{tr("Buy Now")}</button>
            {specs.map((spec, specIndex) => (
              <div className="spec" key={spec}>
                <strong>
                  {specIndex === 0
                    ? ["1063 g", "724 g", "249.9 g", "Approx. 455 g"][index] ||
                      "249 g"
                    : specIndex === 4
                      ? ["100 MP", "50 MP", "50 MP", "120 MP"][index] || "50 MP"
                      : "4K"}
                </strong>
                <span>{tr(spec)}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
      <div className="ow-center-actions">
        <button type="button">{tr("Compare Products")}</button>
        <button type="button">{tr("Shop Products")}</button>
      </div>
    </section>
  );
}

function ExploreGrid({
  title,
  cards,
}: {
  title: string;
  cards: [string, string, string][];
}) {
  const tr = useStaticT();
  return (
    <section className="ow-explore">
      <h2>{tr(title)}</h2>
      <div>
        {cards.map((card) => (
          <article key={card[0]}>
            <img src={card[2]} alt={card[0]} />
            <h3>{tr(card[0])}</h3>
            <p>{tr(card[1])}</p>
            <a>{tr("Learn More")} &gt;</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductSupport() {
  return (
    <ExploreGrid
      title="Product Support"
      cards={[
        [
          "Support",
          "Product help and repair services",
          fallbackImage("support"),
        ],
        [
          "Download Center",
          "Apps, software, and manuals",
          fallbackImage("download"),
        ],
      ]}
    />
  );
}

function SceneTiles() {
  const tr = useStaticT();
  const scenes: [string, string][] = [
    ["Vlogging", D.handheldActivity1],
    ["Diving", D.handheldActivity2],
    ["Motorcycle", D.handheldActivity3],
    ["Skiing", D.handheldActivity4],
    ["Explore Major Activities", D.handheldActivity5],
  ];

  return (
    <section className="ow-scene-tiles">
      {scenes.map(([title, image]) => (
        <article key={title} style={{ backgroundImage: `url(${image})` }}>
          <span>{tr(title)}</span>
        </article>
      ))}
    </section>
  );
}

function ServiceStrip({ title }: { title?: string }) {
  const tr = useStaticT();
  return (
    <section className="ow-services">
      {title && <h2>{tr(title)}</h2>}
      <div>
        {["Where to Buy", "Support", "DJI Ronin Instagram"].map((item) => (
          <article key={item}>
            <span>O</span>
            <h3>{tr(item)}</h3>
            <a>{tr("Learn More")} &gt;</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductCard({
  product,
  cta,
}: {
  product: [string, string, string];
  cta: string;
}) {
  const tr = useStaticT();
  return (
    <article className="ow-product-card">
      <img src={product[2]} alt={product[0]} />
      <h3>{tr(product[0])}</h3>
      <p>{tr(product[1])}</p>
      <button type="button">{tr(cta)}</button>
      {cta === "Buy Now" && <button type="button">{tr("Learn More")}</button>}
    </article>
  );
}

function HeroPanel({
  title,
  eyebrow,
  image,
  align = "center",
  dark = true,
  buttons = ["Buy Now", "Learn More"],
  eyebrowPosition = "above",
}: {
  title: string;
  eyebrow: string;
  image: string;
  align?: "left" | "center";
  dark?: boolean;
  buttons?: string[];
  eyebrowPosition?: "above" | "below";
}) {
  const tr = useStaticT();
  return (
    <section
      className={`ow-hero-panel is-${align} ${dark ? "is-dark" : ""}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div>
        {eyebrowPosition === "above" && <p>{tr(eyebrow)}</p>}
        <h1>{tr(title)}</h1>
        {eyebrowPosition === "below" && <p>{tr(eyebrow)}</p>}
        {buttons.map((button) => (
          <button type="button" key={button}>
            {tr(button)}
          </button>
        ))}
      </div>
    </section>
  );
}

function ImageOverlayCard({ title, image }: { title: string; image: string }) {
  const tr = useStaticT();
  return (
    <article
      className="ow-overlay-card"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div>
        <h3>{tr(title)}</h3>
        <p>
          {tr(
            "Efficient deployment, reliable operation, and flexible support for demanding scenarios.",
          )}
        </p>
      </div>
    </article>
  );
}

function ContactForm() {
  const tr = useStaticT();
  return (
    <section className="ow-contact-form">
      <h2>{tr("Contact Us")}</h2>
      <p>
        {tr(
          "If you wish to purchase products or become a dealer, please leave your contact information below.",
        )}
      </p>
      <div>
        {[
          "Name *",
          "Tel *",
          "Email *",
          "Company",
          "Industry *",
          "Asia",
          "Singapore",
          "State *",
        ].map((item) => (
          <input key={item} placeholder={tr(item)} />
        ))}
        <textarea placeholder={tr("Remark")} />
      </div>
      <button type="button">{tr("Submit")}</button>
    </section>
  );
}

function SubBar({ title, links }: { title: string; links: string[] }) {
  const tr = useStaticT();
  return (
    <div className="ow-subbar">
      <strong>{tr(title)}</strong>
      <div>
        {links.map((link) => (
          <span key={link}>{tr(link)}</span>
        ))}
      </div>
    </div>
  );
}

function InfoCards({ title, cards }: { title: string; cards: string[] }) {
  const tr = useStaticT();
  return (
    <section className="ow-info-cards">
      <h2>{tr(title)}</h2>
      <div>
        {cards.map((card) => (
          <article key={card}>
            <h3>{tr(card)}</h3>
            <p>
              {tr(
                "Learn about security measures, privacy controls, and resources for DJI products.",
              )}
            </p>
            <a>{tr("Learn More")} &gt;</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function OverlayGrid({ title, items }: { title: string; items: string[] }) {
  const tr = useStaticT();
  const images = [D.trustCard1, D.trustCard2, D.trustCard3, D.trustCard4];

  return (
    <section className="ow-overlay-grid">
      <h2>{tr(title)}</h2>
      <div>
        {items.map((item, index) => (
          <ImageOverlayCard
            key={item}
            title={item}
            image={images[index] || fallbackImage(item)}
          />
        ))}
      </div>
    </section>
  );
}

function LatestAnnouncements() {
  const tr = useStaticT();
  return (
    <section className="ow-latest">
      <h2>{tr("Latest Announcements")}</h2>
      <div>
        {[
          "OnDefend's Security Assessment",
          "New FTI Cybersecurity Audit",
          "Drone Security White Paper",
          "DJI Drones: Get the Facts",
        ].map((item) => (
          <article key={item}>
            <img src={fallbackImage(item)} alt={item} />
            <h3>{tr(item)}</h3>
            <p>
              {tr("Access the latest updates and security resources from DJI.")}
            </p>
            <a>{tr("Learn More")}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function MediaSection({ title, index }: { title: string; index: number }) {
  const tr = useStaticT();
  const offset = index * 3;

  return (
    <section className="ow-media-section">
      <div className="ow-section-row">
        <h2>{tr(title)}</h2>
        <button type="button">{tr("View All")} &gt;</button>
      </div>
      <div className="ow-media-feature">
        <img src={mediaImages[offset % mediaImages.length]} alt={title} />
        <div>
          <h3>
            {tr(
              "DJI Releases Findings of the Most Comprehensive Independent Security Assessment of Its Drone...",
            )}
          </h3>
          <p>2026-05-28</p>
        </div>
      </div>
      <div className="ow-media-cards">
        {[1, 2, 3].map((item) => (
          <article key={item}>
            <img
              src={mediaImages[(offset + item) % mediaImages.length]}
              alt=""
            />
            <p>{tr("Product Releases")}</p>
            <h3>
              {tr("DJI Delivers Pro Framing and Tracking with Osmo Mobile 8P")}
            </h3>
            <span>2026-05-07</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceCards({
  title,
  items,
  columns = 3,
}: {
  title: string;
  items: string[];
  columns?: number;
}) {
  const tr = useStaticT();
  return (
    <section className="ow-service-cards">
      <h2>{tr(title)}</h2>
      <div
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {items.map((item) => (
          <article key={item}>
            <h3>{tr(item)}</h3>
            <p>{tr("Quick access to helpful DJI services and support.")}</p>
            <a>{tr("Learn More")} &gt;</a>
          </article>
        ))}
      </div>
    </section>
  );
}

function SupportProducts() {
  const tr = useStaticT();
  return (
    <section className="ow-support-products">
      <h2>{tr("Product Support")}</h2>
      <p>{tr("How to guides and technical help")}</p>
      <div className="ow-tabs">
        {[
          "Camera Drones",
          "Handheld",
          "Power",
          "Enterprise",
          "Agriculture",
          "DJI Delivery",
        ].map((item) => (
          <span key={item}>{tr(item)}</span>
        ))}
      </div>
      <div>
        {[
          "DJI Mavic 4 Pro",
          "DJI Mavic 3 Pro",
          "DJI Mavic 3 Classic",
          "DJI Mavic 3",
          "Mavic 2",
          "Mavic Pro Platinum",
          "Mavic Pro",
        ].map((item) => (
          <article key={item}>
            <img src={fallbackImage(item)} alt={item} />
            <h3>{item}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function NewsList() {
  const tr = useStaticT();
  return (
    <section className="ow-news-list">
      <h2>{tr("Newsroom and Events")}</h2>
      {[
        "Osmo Mobile 8P Easy-to-Use Guide for Beginners",
        "DJI Mic Mini 2 Easy-to-Use Guide for Beginners",
        "DJI Flip Easy-to-Use Guide for Beginners",
        "DJI Avata 360 Easy-to-Use Guide for Beginners",
      ].map((item) => (
        <p key={item}>
          <span>{tr(item)}</span>
          <time>2026-05-07</time>
        </p>
      ))}
    </section>
  );
}

function ContactUsCards() {
  const tr = useStaticT();
  return (
    <section className="ow-contact-cards">
      <h2>{tr("Contact Us")}</h2>
      <article>
        <div>
          <h3>{tr("Online Customer Service")}</h3>
          <p>{tr("24-Hour Service")}</p>
          <a>{tr("Contact Online Customer Service")} &gt;</a>
        </div>
        <img src={fallbackImage("customer-service")} alt="" />
      </article>
      <article>
        <h3>{tr("DJI Community")}</h3>
        <p>
          {tr(
            "Connect with DJI enthusiasts to explore your product experiences.",
          )}
        </p>
        <a>{tr("Join DJI Community")} &gt;</a>
      </article>
    </section>
  );
}

function RomoNav() {
  const tr = useStaticT();
  return (
    <header className="romo-nav">
      <Link to="/lifestyle-tech/robot-vacuums" className="romo-brand">
        ROMO
      </Link>
      <nav>
        {["ROMO P", "ROMO A & ROMO S", "Support", "Accessories", "News"].map(
          (item) => (
            <a key={item}>{tr(item)}</a>
          ),
        )}
      </nav>
      <a
        className="romo-store"
        href={getMallUrl("/products")}
        target="_blank"
        rel="noopener"
      >
        {tr("Store")}
      </a>
    </header>
  );
}

function RomoFooter() {
  const tr = useStaticT();
  return (
    <footer className="romo-footer">
      <strong>ROMO</strong>
      <div>
        <span>{tr("Privacy Policy")}</span>
        <span>{tr("Use of Cookies")}</span>
        <span>{tr("Terms of Use")}</span>
      </div>
      <p>{tr("Copyright (c) 2026 ROMO All Rights Reserved.")}</p>
    </footer>
  );
}
