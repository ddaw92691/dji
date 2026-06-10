import { type CSSProperties, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import './StorePages.css'

type StoreSection = 'store-day' | 'camera-drones' | 'handheld' | 'robot-vacuum' | 'services' | 'accessories' | 'education' | 'refurbished'

type NavKey = Exclude<StoreSection, 'store-day'>

type Product = {
  name: string
  image: string
  gallery?: string[]
  bgImage?: string
  bgColor?: string
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
  eyebrow?: string
  title: string
  subtitle: string
  image: string
  cta?: string
  light?: boolean
  baked?: boolean
}

type StoreBenefit = {
  title: string
  image: string
  imageClass?: string
  detail: string
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

const home = (name: string) => `/home/${name}`

const homeAsset = {
  heroHome: home('imgi_5_532172b83ae3c25d346ed0cc73ef7077.jpg'),
  storeDay: home('imgi_98_3782c873c0074415de3cd195fb78a9fe.jpg'),
  icons: [
    home('imgi_7_5b4238efcb259a43ccffd7dbb0cd1372.png'),
    home('imgi_8_ff29737b15146791a385905ab937df57.png'),
    home('imgi_9_5156524c9dbc46b978ff4410bd01205b.png'),
    home('imgi_10_f1e315635b354d69a14c94c4499fbdbf.png'),
    home('imgi_11_8e688f77665dfa02897bbe214ed2ac09.png'),
    home('imgi_12_c9691ed1af5d83886df9349f79747996.png'),
    home('imgi_13_f5ee8a4c286ac8367844f1025f6339d4.png'),
    home('imgi_14_9adfb26a7d23e56b772b85ccb26eb804.png'),
    home('imgi_15_97139517020a637dbd6a42dcf39a9f1c.png'),
    home('imgi_16_60df9a600e879d18afaa9851e59e590e.png'),
    home('imgi_17_9c558e62e4230ccd702f8bf7c331c31d.png'),
    home('imgi_18_cb162ac9da339f3ab757f8934550a1cd.png'),
    home('imgi_19_303f36e91b21ef018be5aad928658579.png'),
    home('imgi_20_d75dda1d0d14c83524e53943418b4e89.png'),
    home('imgi_21_2ee459ea07317dfa44b020226c310434.png'),
    home('imgi_22_1d487982d0e652a9194e68c6c4104f9b.png'),
    home('imgi_23_0a1b9e8a363b7ffb80c34cba83f33a7f.png'),
    home('imgi_24_cbb91eec48665b197479fa641c5c507d.png'),
    home('imgi_25_2d41ae9454d78459ffe0d4eb655420ee.png'),
    home('imgi_26_a2cc75ea42e8b2b2cf00ecfcb0f86bf1.png'),
  ],
  whatsNew: [
    { product: home('imgi_32_df537d7b13fd5aada161c63416d2b905.png'), bg: home('imgi_33_16f3c4fc8f2fb372fa111240ec9ad141.jpg'), color: '#b8c451' },
    { product: home('imgi_34_4f349c761d049befad1545deb0f26621.png'), bg: home('imgi_35_4f99c42b87409f04533c0f352412cb94.jpg'), color: '#e1ae76' },
    { product: home('imgi_36_8a285ec398e3d92c2486a053f1674196.png'), bg: home('imgi_37_a6f97e37a70582aac62af4b1fdca06a6.jpg'), color: '#466941' },
    { product: home('imgi_38_f56e1f1f6cecb5cae9b35c83741ce0f4.png'), bg: home('imgi_39_6d914404e9305ee8de67b96a6b23d1e7.jpg'), color: '#595959' },
    { product: home('imgi_40_92434972b8204f999dff70ee525186c9.png'), bg: home('imgi_41_b056ac45fedb8d842f3490c97015ab22.jpg'), color: '#bca98b' },
    { product: home('imgi_42_4109a4a17cc7dcd14533f2cbf470b3c3.png'), bg: home('imgi_43_cc0b9edb1544694908e0cfe22563cef2.jpg'), color: '#152d3a' },
    { product: home('imgi_44_13a80d3f7ae7d04d629d49c8c2f8de35.png'), bg: home('imgi_45_594718eef1712bcb732def7522ed8c90.jpg'), color: '#a6a7a3' },
    { product: home('imgi_46_fe2569ab4447bec2c1d01e608885c8bc.png'), bg: home('imgi_47_046b7ca3308fd9d3fdbb0578577a9c96.png'), color: '#222a31' },
    { product: home('imgi_48_23433c6c5d1a5b113fab3a09ae6ab4bb.png'), bg: home('imgi_49_ca589a93d582796deda317af6f240438.jpg'), color: '#3d5054' },
    { product: home('imgi_50_00bbe483cfd95d3a77ea02d039c8f1e3.png'), bg: home('imgi_51_fbb3f29648098572226888c630239d69.jpg'), color: '#213e68' },
    { product: home('imgi_52_718f51e3a6c29211b8b20a1bed1d355a.png'), bg: home('imgi_53_d996f7284ad9a9649ceefabb8de2c97b.jpg'), color: '#71856a' },
    { product: home('imgi_54_cb57f4d055dcf2d6ae49f108c46afef9.png'), bg: home('imgi_55_36d6bbfe6aa4ab62028020c5ab49ceac.jpg'), color: '#5d8cad' },
    { product: home('imgi_56_dc0ca202cc69b2225d069a037c68be81.png'), bg: home('imgi_57_da670c7bc0945e9114981a0c11a1d7e0.jpg'), color: '#786e5a' },
    { product: home('imgi_58_f196207b671b11ed0058c564db36a27f.png'), bg: home('imgi_59_48dcbe933707bd002135e996991f2d30.jpg'), color: '#59631f' },
    { product: home('imgi_60_3ca38a32bb60e912e6cde193d5020efb.png'), bg: home('imgi_61_bd9122cf0ef1c48df453d139375baa79.jpg'), color: '#435b78' },
    { product: home('imgi_62_f99b0ba96368d16b8ea0cab30a65f778.png'), bg: home('imgi_63_8a716f8a5e48393fdd418e322287102c.jpg'), color: '#44484f' },
    { product: home('imgi_64_8f37773e59b31264f628582aca294258.png'), bg: home('imgi_65_2d2e6e86fd57794e1c8129d4ddbbb12b.jpg'), color: '#41406b' },
    { product: home('imgi_66_7f2a68230c09649ca7aab99e08d6653f.png'), bg: home('imgi_67_4ebd26fe63352cc5720de0bf5a7030f9.jpg'), color: '#22252c' },
    { product: home('imgi_68_12782f885af1c6d77a8354966bbb7db7.png'), bg: home('imgi_69_1539cd998476aa0f24975a8f6518ca2f.jpg'), color: '#c7a16f' },
    { product: home('imgi_70_c12fec95401abda9189e1ee81f6a3b2e.png'), bg: home('imgi_71_e760589ea6a7b283e54ea5fac728a49e.jpg'), color: '#4b321e' },
    { product: home('imgi_72_b8e67d929c6f67a4725afc339bf2a1c9.png'), bg: home('imgi_73_2bc4a5def9f2844ad2f891ac1bd59594.jpg'), color: '#b7ab9b' },
    { product: home('imgi_74_9d1176e01e3ff93b4e3bf4bd02ff0c4c.png'), bg: home('imgi_75_f9aa534e609d00e9a09fc99a48bc441f.jpg'), color: '#879bb1' },
    { product: home('imgi_76_33d8abbc43b9ebaa71fc527aed4ff4a8.png'), bg: home('imgi_77_d7ae82a057c5d428cd8dbf4dba0abf7b.jpg'), color: '#0a0b0d' },
    { product: home('imgi_78_72387a7f52a9c399fbfd3950f671cdaa.png'), bg: home('imgi_79_5d555f4809eb315598b75347e82d9e80.jpg'), color: '#5c697d' },
    { product: home('imgi_80_42e0e653629399c88a880c43b5d442c0.png'), bg: home('imgi_81_75373b758b45d987edea90b2f45318bc.jpg'), color: '#477994' },
    { product: home('imgi_82_85c7b1b1d3b47bd875005d9a880a610a.png'), bg: home('imgi_83_c8afb3ce395866e06079b5426842748b.jpg'), color: '#84afd0' },
    { product: home('imgi_84_642fdc118455d3b719384b7f990d90f5.png'), bg: home('imgi_85_01cb1cffcc87488bfdbe695a0d972fbf.jpg'), color: '#16240f' },
    { product: home('imgi_86_167aa78d106cd7ead497bb84fa123b70.png'), bg: home('imgi_87_283090155090a61b7051d6d3ae4d54a5.jpg'), color: '#111113' },
    { product: home('imgi_88_5167560f1e39d3c81ee682629e4b49b1.png'), bg: home('imgi_89_7bfcc25f3c38828ba9500ea27e783caa.jpg'), color: '#2f3d48' },
    { product: home('imgi_90_1ddba51d0a90aa701a1a66523692e651.png'), bg: home('imgi_91_674073269ae2a3f41855acbc1c813832.jpg'), color: '#0d0e12' },
  ],
  credit: home('imgi_92_b32772747fa866ff571cd1f570b996ce.jpg'),
  returns: home('imgi_93_e5c1adb68470ba79cb867f69f9c7cf88.jpg'),
  expert: home('imgi_94_56176753665d35ce447d6e0bf054f2f8.jpg'),
  freeShipping: home('imgi_95_d6f1d760fc255d23fb457ad14b869343.jpg'),
  refurbished: home('imgi_96_59cad53548ba55cbd2a8a31cbdc89fea.png'),
  accessories: home('imgi_97_0a7a57ecac39bd197bb0045564fe2bfc.jpg'),
  cameraWide: home('imgi_99_d3ba356b8130a6f0f8b5fde214d7836f.jpg'),
  dailyWide: home('imgi_110_3fc9361c1f9eec315f56ddb4fa429e0e.jpg'),
  proWide: home('imgi_121_4048945693033536766234ce05dc0243.jpg'),
  droneGuide: home('imgi_109_23a70dac05dead196619dea78b50f200.png'),
  dailyGuide: home('imgi_120_7b1b81a5280ff6bd5c3948e294158747.png'),
  proGuide: home('imgi_131_dbda4b753f39f307589dc62b30a0dd47.png'),
  educationEnterprise: home('imgi_132_c97c45b0e3727897dc32c72ca662f59b.jpg'),
  educationClassroom: home('imgi_133_e568d74cda4b2a8d40b13d8fd36cfe9d.jpg'),
  buyingGuides: [
    home('imgi_134_3d0af363b0d0a410766c45e78b9ec050.jpg'),
    home('imgi_135_fcc75db9143a73805269a95060f68b4c.jpg'),
    home('imgi_136_224e4cc8e5346be0ba6b581f6dc9de10.jpg'),
    home('imgi_137_46799f30907d418cf688775c860a3d7f.jpg'),
    home('imgi_138_221c49a0f37adc12a0fa9111b5c735b7.jpg'),
    home('imgi_139_17bbdda0fb4afb93fc972b81065900e8.jpg'),
    home('imgi_140_8b8a93f27f2fc4408834a0973fb20d95.jpg'),
    home('imgi_141_eb561680edeae1a10fecb5f43d76de1c.jpg'),
    home('imgi_142_41856bb7eb8e615493fbc36e64322421.jpg'),
    home('imgi_143_e8077951923ef0415d7be0759320bd22.jpg'),
    home('imgi_144_6aae637b167b98422bb990912f19255b.jpg'),
    home('imgi_145_bc556c804fb8abf78c92dec9af280b42.jpg'),
    home('imgi_146_fbda6a1814991a55748bb3bd58072301.jpg'),
    home('imgi_147_4e1f0214fea2a18d3266fa75d45a7b52.jpg'),
    home('imgi_148_49595f893dc76ae46ae205e9c2a1e532.jpg'),
    home('imgi_149_23d1581e7b36b505cc7c5b2f01c16812.jpg'),
    home('imgi_150_2b46fe66bd1088860d70fac0b0115dc5.jpg'),
    home('imgi_151_cd02a655fed1b6fdac7d2baa05fe0e32.jpg'),
    home('imgi_152_a3c319a8f4e2d07403a11bd3c695cd41.jpg'),
    home('imgi_153_c3e201b260aa026ea3b8b45b3d606a61.jpg'),
  ],
  rail: {
    camera: [
      home('imgi_101_82db54204716294bef78a1e1f034b650.png'),
      home('imgi_104_1d52bfda8119fb92cfe6bd44ef4f3bc7.png'),
      home('imgi_107_662cf598075a63b645c2e8801cf4a295.png'),
      home('imgi_100_94e5948052963832cdbf2d32cb18f930.jpg'),
    ],
    daily: [
      home('imgi_112_a39b913a06c74d5b2361e37b74dc0252.png'),
      home('imgi_115_f37c811af72448e6af4f191beebae0d7.png'),
      home('imgi_118_c1ba0ac967aa600919861af9ba6a604d.png'),
      home('imgi_111_b057f520a24c0fbe8f4d9f78502d346d.jpg'),
    ],
    pro: [
      home('imgi_122_fbde6ad1a4fbefcc990b5f38ec790243.jpg'),
      home('imgi_123_533dbcd0bb5368cc672c0e81b5c481ee.png'),
      home('imgi_129_eba0befc0de6d12bb208c6184fac5097.png'),
      home('imgi_124_5022397088e5a7092de7a72c0503d955.jpg'),
    ],
  },
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
  const cameraRail = [
    { ...p('DJI Lito 1', homeAsset.rail.camera[0], '299', 'Beginner-Friendly Camera Drone', 'New'), gallery: [homeAsset.rail.camera[0], homeAsset.rail.camera[1], homeAsset.rail.camera[2]] },
    { ...p('DJI Avata 360', homeAsset.rail.camera[1], '399', '8K Flagship 360° Drone', 'New'), gallery: [homeAsset.rail.camera[1], homeAsset.rail.camera[2], homeAsset.rail.camera[3]] },
    { ...p('DJI Neo 2', homeAsset.rail.camera[2], '209', 'Follow Me Camera Drone'), gallery: [homeAsset.rail.camera[2], homeAsset.rail.camera[0], homeAsset.rail.camera[3]] },
    { ...p('DJI Mini 5 Pro', homeAsset.rail.camera[3], '739', 'Advanced Mini Camera Drone'), gallery: [homeAsset.rail.camera[3], homeAsset.rail.camera[0], homeAsset.rail.camera[1]] },
  ]
  const dailyRail = [
    { ...p('Osmo Mobile 8P', homeAsset.rail.daily[0], '129', 'Pro Framing and Tracking Phone Gimbal', 'New'), gallery: [homeAsset.rail.daily[0], homeAsset.rail.daily[1], homeAsset.rail.daily[2]] },
    { ...p('Osmo Action 6', homeAsset.rail.daily[1], '439', 'All-In-One Flagship Action Camera'), gallery: [homeAsset.rail.daily[1], homeAsset.rail.daily[2], homeAsset.rail.daily[3]] },
    { ...p('Osmo Mobile 8', homeAsset.rail.daily[2], '83', '360° Tracking Phone Gimbal'), gallery: [homeAsset.rail.daily[2], homeAsset.rail.daily[0], homeAsset.rail.daily[3]] },
    { ...p('Osmo Nano', homeAsset.rail.daily[3], '299', 'Wearable Camera for Versatile Perspectives'), gallery: [homeAsset.rail.daily[3], homeAsset.rail.daily[0], homeAsset.rail.daily[1]] },
  ]
  const proRail = [
    { ...p('DJI RS 4 Mini', homeAsset.rail.pro[0], '268', 'Compact and Lightweight Gimbal'), gallery: [homeAsset.rail.pro[0], homeAsset.rail.pro[1], homeAsset.rail.pro[2]] },
    { ...p('DJI RS 4 Pro', homeAsset.rail.pro[1], '889', 'Expansive Flagship Stabilizer'), gallery: [homeAsset.rail.pro[1], homeAsset.rail.pro[2], homeAsset.rail.pro[3]] },
    { ...p('DJI Ronin 4D-6K', homeAsset.rail.pro[2], '5,299', 'Cinema Camera'), gallery: [homeAsset.rail.pro[2], homeAsset.rail.pro[3], homeAsset.rail.pro[0]] },
    { ...p('DJI SDR Transmission', homeAsset.rail.pro[3], '309', 'Portable Dual-Mode Video Transmission System'), gallery: [homeAsset.rail.pro[3], homeAsset.rail.pro[0], homeAsset.rail.pro[1]] },
  ]

  return (
    <StoreShell home>
      <main className="store-home-main">
        <HomeHero />
        <HomeIconStrip />
        <HomeCarousel />
        <h2 className="home-section-title">Camera Drones</h2>
        <HomeBand title="DJI Lito X1" image={homeAsset.cameraWide} to="/camera-drones" />
        <ProductRail
          products={cameraRail}
          guideImage={homeAsset.droneGuide}
          guideTitle="Which Drone Is Right for Me?"
        />
        <h2 className="home-section-title">Handheld · Daily Vlogging</h2>
        <HomeBand title="Osmo Pocket 4" image={homeAsset.dailyWide} to="/handheld" />
        <ProductRail
          products={dailyRail}
          guideImage={homeAsset.dailyGuide}
          guideTitle="Which Handheld Is Right for Me?"
        />
        <h2 className="home-section-title">Handheld · Pro Shooting</h2>
        <HomeBand title="DJI RS 5" image={homeAsset.proWide} to="/handheld" />
        <ProductRail
          products={proRail}
          guideImage={homeAsset.proGuide}
          guideTitle="Which Handheld Is Right for Me?"
        />
        <section className="home-education-block">
          <div className="home-module-heading">
            <h2 className="home-section-title">Education & Industry</h2>
            <ScrollButtons target="home-education" />
          </div>
          <div data-scroll="home-education">
            <ArticleCard title="Enterprise" subtitle="Integrated drone-based industrial solutions" image={homeAsset.educationEnterprise} />
            <ArticleCard title="Education" subtitle="Programming education solutions" image={homeAsset.educationClassroom} />
          </div>
        </section>
        <section className="store-playbook">
          <div className="home-module-heading">
            <h2>Buying Guides</h2>
            <ScrollButtons target="home-guides" variant="side" />
          </div>
          <div data-scroll="home-guides">
            {homeAsset.buyingGuides.map((image, index) => (
              <ArticleCard
                key={`${image}-home-guide-${index}`}
                title={['DJI Mini 4 Pro vs. DJI Air 3S vs. DJI Mavic 3 Pro', 'Follow Me Drones 2024', 'DJI Air 3S vs DJI Air 3', 'Osmo Action 5 Pro Unboxing', 'DJI Power 1000 V2 vs. DJI Power 1000', 'Follow Me Drones 2025', 'DJI Neo vs. DJI Flip', 'Osmo 360 vs. X5', 'Vlogging Reinvented', 'FPV Drones 2024', 'DJI Mini 4 Pro vs. Mini 3 Pro', 'Mini Drones: The Definitive Guide', 'Best Action Camera in 2024', 'DJI Air 3 vs Air 2S vs Mini 3 Pro', 'DJI Mavic 3 Pro vs. Mavic 3 vs. Mavic 3 Classic', 'Mavic 3 Pro: EPIC ROBOTIC SHOTS', 'DJI Mini 2 SE vs DJI Mini SE vs DJI Mini 3', 'Must-Have Gear for Camping Photographers', 'Best Action Cameras: In-depth Buying Guide', 'DJI RS 3 Mini: Unboxing & Highlights'][index] || 'Buying Guide'}
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
  const logoSrc = home ? '/logo-black.webp' : transparent ? '/logo-white.webp' : '/logo-black.webp'
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
  const gallery = product.gallery?.length ? product.gallery : [product.image]
  const [mediaIndex, setMediaIndex] = useState(0)
  const changeMedia = (direction: number) => {
    setMediaIndex((current) => (current + direction + gallery.length) % gallery.length)
  }

  return (
    <Link to="/products" className={`store-product-card ${featured ? 'featured' : ''}`}>
      <div className="product-card-media">
        <img src={gallery[mediaIndex]} alt={product.name} />
        {gallery.length > 1 && (
          <>
            <button className="product-media-arrow left" type="button" aria-label={`Previous ${product.name} image`} onClick={(event) => { event.preventDefault(); changeMedia(-1) }}>‹</button>
            <button className="product-media-arrow right" type="button" aria-label={`Next ${product.name} image`} onClick={(event) => { event.preventDefault(); changeMedia(1) }}>›</button>
            <div className="product-media-progress" aria-label={`${product.name} image pagination`}>
              {gallery.map((image, index) => (
                <button
                  key={`${product.name}-${image}`}
                  type="button"
                  className={index === mediaIndex ? 'active' : ''}
                  aria-label={`Show ${product.name} image ${index + 1}`}
                  onClick={(event) => { event.preventDefault(); setMediaIndex(index) }}
                />
              ))}
            </div>
          </>
        )}
      </div>
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

function HomeHero() {
  const slides: HomeBannerItem[] = [
    { eyebrow: 'June 1 - June 14', title: 'DJI STORE DAY', subtitle: 'Up to 30% Off', image: home('imgi_1_3e2f77565f1e91253031790a6844338d.png'), cta: 'Buy Now', light: true },
    { eyebrow: 'Stay Tuned', title: 'OSMO POCKET 4P', subtitle: 'See More. Tell More.', image: homeAsset.heroHome, cta: 'Learn More' },
    { eyebrow: 'Internal Recording Mini Wireless Mic', title: 'DJI MIC MINI 2S', subtitle: 'Capture Every Detail', image: home('imgi_3_ae9b431ffcb2bc8ba2b3d086a3b60938.jpg'), cta: 'Learn More' },
    { title: 'My Pocket View', subtitle: 'Claim up to $800 DJI Credit.', image: home('imgi_2_78c4ee1b728cbcbec7047a91822ee991.jpg'), cta: 'Learn more', light: true },
  ]
  const [index, setIndex] = useState(0)
  const active = slides[index]
  const move = (direction: number) => setIndex((current) => (current + direction + slides.length) % slides.length)

  return (
    <section className={`store-hero home-hero-slide ${active.light ? 'light-copy' : ''}`} style={{ backgroundImage: `url(${active.image})` }}>
      <button className="home-hero-arrow left" type="button" aria-label="Previous banner" onClick={() => move(-1)}>‹</button>
      <button className="home-hero-arrow right" type="button" aria-label="Next banner" onClick={() => move(1)}>›</button>
      <div>
        {active.eyebrow && <p>{active.eyebrow}</p>}
        <h1>{active.title}</h1>
        <span>{active.subtitle}</span>
        <Link to="/products">{active.cta || 'Learn More'}</Link>
      </div>
      <div className="home-hero-progress" aria-label="Banner pagination">
        {slides.map((slide, slideIndex) => (
          <button key={slide.title} type="button" className={slideIndex === index ? 'active' : ''} aria-label={`Show ${slide.title}`} onClick={() => setIndex(slideIndex)} />
        ))}
      </div>
    </section>
  )
}

function HomeCarousel() {
  const benefits: StoreBenefit[] = [
    { title: '1% DJI Credit Reward', image: homeAsset.credit, detail: 'Earn DJI Credit with eligible DJI Store purchases and redeem it toward future orders.' },
    { title: 'Up to 30-Day Returns', image: homeAsset.returns, imageClass: 'benefit-symbol returns', detail: 'Enjoy up to 30-day returns on eligible products purchased from DJI Store.' },
    { title: 'Over USD $45 Ships Free', image: homeAsset.freeShipping, imageClass: 'benefit-symbol free', detail: 'Orders over USD $45 ship free, with tracking provided after dispatch.' },
    { title: 'Get DJI Expert Help', image: homeAsset.expert, detail: 'Chat with DJI experts for product selection, order questions, and setup guidance.' },
    { title: 'Official Refurbished', image: homeAsset.refurbished, detail: 'Shop certified refurbished DJI products inspected to official quality standards.' },
    { title: 'Official Accessories', image: homeAsset.accessories, detail: 'Choose genuine DJI accessories designed for reliable compatibility and performance.' },
  ]
  const [activeBenefit, setActiveBenefit] = useState<StoreBenefit | null>(null)
  const fresh = [
    { name: 'Osmo Pocket 3', price: '358', desc: '1″ CMOS Pocket Gimbal Camera' },
    { name: 'Osmo Mobile 8P', price: '129', desc: 'Pro Framing and Tracking Phone Gimbal' },
    { name: 'DJI Mic Mini 2', price: '54', desc: 'Mini Wireless Microphone' },
    { name: 'DJI Lito X1', price: '369', desc: 'Beginner-Friendly Premium Camera Drone' },
    { name: 'DJI Lito 1', price: '299', desc: 'Beginner-Friendly Camera Drone' },
    { name: 'Osmo Pocket 4', price: '473', desc: '1″ CMOS Pocket Gimbal Camera' },
    { name: 'DJI Avata 360', price: '399', desc: '8K Flagship 360° Drone' },
    { name: 'DJI ROMO', price: '899', desc: 'Flagship Robot Vacuum With Advanced Sensing' },
    { name: 'DJI RS 5', price: '519', desc: 'Lightweight Commercial Stabilizer' },
    { name: 'Osmo Action 6', price: '439', desc: 'All-In-One Flagship Action Camera' },
    { name: 'DJI Neo 2', price: '209', desc: 'Follow Me Camera Drone' },
    { name: 'Osmo Mobile 8', price: '83', desc: '360 Tracking Phone Gimbal' },
    { name: 'Osmo Nano', price: '299', desc: 'Wearable Camera for Versatile Perspectives' },
    { name: 'DJI Mini 5 Pro', price: '739', desc: 'All-In-One 1-Inch Large CMOS Mini Camera Drone' },
    { name: 'DJI Mic 3', price: '149', desc: 'Advanced Mini Wireless Microphone' },
    { name: 'Osmo 360', price: '357', desc: '8K Revolutionary 360 Camera' },
    { name: 'DJI Mavic 4 Pro', price: '2,049', desc: 'Triple-Lens Flagship Camera Drone' },
    { name: 'DJI RS 4 Mini', price: '268', desc: 'Compact and Lightweight Gimbal for Content Creators' },
    { name: 'DJI Flip', price: '329', desc: 'All-in-One Vlog Camera Drone' },
    { name: 'Osmo Mobile 7P', price: '94', desc: 'Flagship Intelligent Tracking Phone Gimbal' },
    { name: 'DJI Mic Mini', price: '39', desc: 'Mini Wireless Microphone' },
    { name: 'DJI O4 Air Unit Pro', price: '100', desc: 'Flagship FHD FPV Digital Video Transmission' },
    { name: 'Osmo Action 5 Pro', price: '306', desc: 'The Action Camera With Revolutionary Image Quality' },
    { name: 'DJI Neo', price: '139', desc: 'A Palm-Sized Drone for Vlogs' },
    { name: 'DJI Mini 4K', price: '226', desc: 'In Stock - Easy-To-Use Mini Camera Drone' },
    { name: 'DJI Mini 3', price: '227', desc: 'In Stock - Premier Entry-Level Camera Drone' },
    { name: 'DJI Mini 4 Pro', price: '629', desc: 'All-In-One Omni Obstacle Sensing Mini Camera Drone' },
    { name: 'DJI Air 3S', price: '926', desc: 'Dual-Camera Drone for Travel Photography' },
    { name: 'DJI Avata 2', price: '729', desc: 'FPV Drone' },
    { name: 'DJI RS 4 Pro', price: '889', desc: 'Expansive Flagship Stabilizer' },
  ].map((item, itemIndex) => ({
    ...p(item.name, homeAsset.whatsNew[itemIndex].product, item.price, item.desc),
    bgColor: homeAsset.whatsNew[itemIndex].color,
    bgImage: homeAsset.whatsNew[itemIndex].bg,
  }))
  return (
    <>
      <section className="whats-new">
        <div className="home-module-heading">
          <h2>What's New</h2>
          <ScrollButtons target="whats-new" variant="side" />
        </div>
        <div data-scroll="whats-new">
          {fresh.map((product) => <HomeNewCard key={product.name} product={product} />)}
        </div>
      </section>
      <h2 className="home-section-title compact">Why shop with DJI Store</h2>
      <section className="home-benefits">
        {benefits.map((benefit) => (
          <button key={benefit.title} className="benefit-card" type="button" onClick={() => setActiveBenefit(benefit)}>
            <h3>{benefit.title}</h3>
            <img className={benefit.imageClass || ''} src={benefit.image} alt="" />
          </button>
        ))}
      </section>
      {activeBenefit && <HomeBenefitModal benefit={activeBenefit} onClose={() => setActiveBenefit(null)} />}
      <Link className="home-sale-banner" to="/store-day" style={{ backgroundImage: `url(${homeAsset.storeDay})` }}>
        <span>Up to 30% Off</span>
        <strong>DJI Store Day</strong>
      </Link>
    </>
  )
}

function HomeBenefitModal({ benefit, onClose }: { benefit: StoreBenefit; onClose: () => void }) {
  return (
    <div className="benefit-modal" role="dialog" aria-modal="true" aria-label={benefit.title}>
      <div className="benefit-modal-panel">
        <button className="benefit-modal-close" type="button" aria-label="Close" onClick={onClose}>×</button>
        <img src={benefit.image} alt="" />
        <h3>{benefit.title}</h3>
        <p>{benefit.detail}</p>
        <Link to="/products" onClick={onClose}>Learn More</Link>
      </div>
    </div>
  )
}

function HomeNewCard({ product }: { product: Product }) {
  return (
    <Link
      to="/products"
      className={`home-new-card ${product.bgImage ? 'has-product' : ''}`}
      style={{ backgroundImage: `url(${product.bgImage || product.image})`, '--card-color': product.bgColor || '#575857' } as CSSProperties}
    >
      {product.bgImage && <img className="home-new-product" src={product.image} alt="" />}
      <h3>{product.name}</h3>
      <p>{product.desc}</p>
      <span>From USD ${product.price}</span>
      <button>Buy Now</button>
    </Link>
  )
}

function ScrollButtons({ target, variant = 'compact' }: { target: string; variant?: 'compact' | 'side' }) {
  const [state, setState] = useState({ left: false, right: true })
  const update = () => {
    const el = document.querySelector<HTMLElement>(`[data-scroll="${target}"]`)
    if (!el) return
    const styles = getComputedStyle(el)
    const startOffset = Number.parseFloat(styles.paddingLeft || '0') || 0
    const max = Math.max(0, el.scrollWidth - el.clientWidth)
    setState({
      left: el.scrollLeft > startOffset + 2,
      right: el.scrollLeft < max - 2,
    })
  }

  useEffect(() => {
    update()
    const el = document.querySelector<HTMLElement>(`[data-scroll="${target}"]`)
    if (!el) return
    let frame = 0
    const handle = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }
    const handleWheel = () => {
      handle()
      window.setTimeout(update, 180)
      window.setTimeout(update, 420)
    }
    el.addEventListener('scroll', handle, { passive: true })
    el.addEventListener('wheel', handleWheel, { passive: true })
    el.addEventListener('touchmove', handleWheel, { passive: true })
    window.addEventListener('resize', handle)
    const interval = window.setInterval(update, 500)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      el.removeEventListener('scroll', handle)
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('touchmove', handleWheel)
      window.removeEventListener('resize', handle)
      window.clearInterval(interval)
    }
  }, [target])

  const scroll = (direction: number) => {
    const el = document.querySelector<HTMLElement>(`[data-scroll="${target}"]`)
    if (!el) return
    const first = el.querySelector<HTMLElement>(':scope > *')
    const styles = getComputedStyle(el)
    const gap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0
    const step = first ? first.getBoundingClientRect().width + gap : el.clientWidth * 0.82
    el.scrollBy({ left: direction * Math.round(step), behavior: 'smooth' })
    window.setTimeout(update, 120)
    window.setTimeout(update, 360)
    window.setTimeout(update, 620)
  }

  return (
    <div className={`home-scroll-buttons ${variant}`}>
      {state.left && <button className="left" type="button" aria-label="Scroll left" onClick={() => scroll(-1)}>‹</button>}
      {state.right && <button className="right" type="button" aria-label="Scroll right" onClick={() => scroll(1)}>›</button>}
    </div>
  )
}

function HomeIconStrip() {
  const icons = ['DJI Mavic', 'DJI Air', 'DJI Mini', 'DJI Lito', 'DJI Flip', 'DJI Avata', 'DJI Neo', 'DJI Inspire', 'DJI ROMO', 'Osmo Nano', 'Osmo 360', 'Osmo Action', 'Osmo Pocket', 'DJI Mic', 'Osmo Mobile', 'Ronin Stabilizers', 'Ronin Cinema Cameras', 'Pro Accessories', 'Enterprise', 'Education']
  return (
    <section className="home-icon-strip-wrap">
      <ScrollButtons target="home-icons" variant="side" />
      <div className="home-icon-strip" data-scroll="home-icons">
        {icons.map((label, index) => (
          <Link key={label} to="/products">
            <img src={homeAsset.icons[index]} alt="" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

function HomeBand({ title, image, to }: { title: string; image: string; to: string }) {
  return (
    <Link to={to} className="home-band">
      <video className="home-band-video" poster={image} muted loop playsInline aria-hidden="true" />
      <div>
        <h2>{title}</h2>
        <button>Buy Now</button>
      </div>
    </Link>
  )
}

function ProductRail({ products, guideImage, guideTitle = 'All Accessories' }: { products: Product[]; guideImage?: string; guideTitle?: string }) {
  const target = `rail-${`${guideTitle}-${products[0]?.name || 'products'}`.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`
  return (
    <section className="home-product-rail-wrap">
      <ScrollButtons target={target} variant="side" />
      <div className="product-rail" data-scroll={target}>
        {products.map((product) => <ProductCard key={product.name} product={product} />)}
        <div className="rail-guide-stack">
          <Link className={`guide-card ${guideImage ? 'with-image' : ''}`} to="/products" style={guideImage ? { backgroundImage: `url(${guideImage})` } : undefined}>
            <small>Buying guides</small>
            <span>{guideTitle}</span>
            <i aria-hidden="true">›</i>
          </Link>
          <Link className="all-accessories-card" to="/products">
            <span>All Accessories</span>
            <i aria-hidden="true">›</i>
          </Link>
        </div>
      </div>
    </section>
  )
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
  const items = [
    { icon: <TruckIcon />, content: <>Free shipping on orders over USD $45</> },
    { icon: <CardIcon />, content: <>We accept credit cards, PayPal, and bank wires</> },
    { icon: <ChatIcon />, content: <>Order Service: <Link to="/support">Live Chat</Link></> },
  ]
  return <section className="trust-strip">{items.map((item, index) => <article key={index}><span className="trust-icon">{item.icon}</span><span>{item.content}</span></article>)}</section>
}

function TruckIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h3.5L21 13v3h-7zM7 19a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 7 19Zm10 0a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2Z" strokeLinejoin="round" /></svg>
}

function CardIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3 9.5h18M6.5 14.5h4" strokeLinecap="round" /></svg>
}

function ChatIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 5.5h16v10H9.5L5.5 19v-3.5H4z" strokeLinejoin="round" /></svg>
}

function StoreFooter() {
  const cols = [
    ['Product Categories', 'Camera Drones', 'Handheld', 'Education & Industry', 'Accessory'],
    ['Help & Support', 'Payment Methods', 'Order Information', 'Shipping & Delivery', 'Return Policy', 'Technical Support', 'Repair Services', 'After-Sales Service Policies'],
    ['Programs', 'DJI Credit', 'Official Refurbished', 'DJI Store App'],
    ['Explore', 'SkyPixel', 'DJI Forum', 'Buying Guides', 'Fly Safe', 'DJI Flying Tips'],
  ]
  return (
    <footer className="store-footer">
      <div className="store-footer-top">
        <strong>Product Categories</strong>
        <nav>
          {cols.map((col) => <Link key={col[0]} to="/products">{col[0]}</Link>)}
        </nav>
        <span>Singapore / English</span>
      </div>
      <div className="store-footer-grid">
        {cols.map((col) => (
          <section key={col[0]}>
            <h3>{col[0]}</h3>
            {col.slice(1).map((item) => <Link key={item} to="/products">{item}</Link>)}
          </section>
        ))}
        <section className="store-footer-subscribe">
          <h3>Subscribe</h3>
          <p>Be the first to find out about our newest offerings and hottest deals, and what's new.</p>
          <form className="footer-subscribe-form" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="Your Email Address" aria-label="Your Email Address" />
            <button type="submit" aria-label="Subscribe">›</button>
          </form>
        </section>
      </div>
      <div className="store-footer-bottom">
        <Link className="footer-logo" to="/"><img src="/logo-black.webp" alt="DJI" /></Link>
        <nav>
          {['Who We Are', 'Contact Us', 'Careers', 'Flagship Stores'].map((item) => <Link key={item} to="/products">{item}</Link>)}
        </nav>
        <div className="store-social-links" aria-label="Social links">
          {[
            { label: 'Facebook', icon: <FacebookIcon /> },
            { label: 'X', icon: <XIcon /> },
            { label: 'YouTube', icon: <YouTubeIcon /> },
            { label: 'Vimeo', icon: <VimeoIcon /> },
            { label: 'Instagram', icon: <InstagramIcon /> },
          ].map((item) => (
            <Link key={item.label} to="/products" aria-label={item.label}>{item.icon}</Link>
          ))}
        </div>
      </div>
      <div className="store-footer-legal">
        <small>
          <span>Copyright © 2026 DJI All Rights Reserved.</span>
          {['Privacy Policy', 'Accessibility Statement', 'Terms of Use', 'Site Map'].map((item) => <Link key={item} to="/products">{item}</Link>)}
        </small>
        <Link to="/support">Feedback on web experience? Click here</Link>
      </div>
    </footer>
  )
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
  return (
    <div className="floating-help">
      <button type="button" aria-label="Back to top"><ChevronUpIcon /></button>
      <button type="button" aria-label="Customer service"><SupportAvatarIcon /></button>
      <button type="button" aria-label="Support center"><SupportBoxIcon /></button>
    </div>
  )
}

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.3 8.1h2.1V4.8a27 27 0 0 0-3-.1c-3 0-5 1.8-5 5v2.8H5.1v3.7h3.3v7.6h4v-7.6h3.3l.5-3.7h-3.8V10c0-1.1.3-1.9 1.9-1.9Z" /></svg>
}

function XIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.8 10.4 6.4-7.1h-2.1l-5.2 5.8-4.2-5.8H3.3l6.7 9.1-6.8 7.6h2.1l5.6-6.2 4.5 6.2h5.4l-7-9.6Zm-2.2 2.4-.9-1.2-4-5.7h1.2l3.3 4.6.9 1.2 4.3 6h-1.2l-3.6-4.9Z" /></svg>
}

function YouTubeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 7.2a2.6 2.6 0 0 0-1.8-1.8C18 5 12 5 12 5s-6 0-7.6.4a2.6 2.6 0 0 0-1.8 1.8A27 27 0 0 0 2.2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C6 19 12 19 12 19s6 0 7.6-.4a2.6 2.6 0 0 0 1.8-1.8 27 27 0 0 0 .4-4.8 27 27 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" /></svg>
}

function VimeoIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 7.4c-.1 2.8-2.1 6.7-6 11.6-1.6 2-3 3-4.2 3-.7 0-1.4-.7-1.9-2L7.8 12c-.4-1.3-.9-2-1.4-2-.1 0-.5.2-1.2.7l-.7-.9 2.1-1.9c1-.9 1.8-1.4 2.4-1.4 1.3-.1 2.1.8 2.4 2.4.4 1.8.6 3 .8 3.4.4 1.5.9 2.2 1.4 2.2.4 0 1-.6 1.8-1.9.8-1.2 1.2-2.2 1.3-2.8.1-1.1-.3-1.7-1.3-1.7-.5 0-.9.1-1.4.3.9-3 2.7-4.5 5.3-4.4 1.9 0 2.8 1.1 2.7 3.4Z" /></svg>
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 2.8h9.2a4.6 4.6 0 0 1 4.6 4.6v9.2a4.6 4.6 0 0 1-4.6 4.6H7.4a4.6 4.6 0 0 1-4.6-4.6V7.4a4.6 4.6 0 0 1 4.6-4.6Zm0 1.8a2.8 2.8 0 0 0-2.8 2.8v9.2a2.8 2.8 0 0 0 2.8 2.8h9.2a2.8 2.8 0 0 0 2.8-2.8V7.4a2.8 2.8 0 0 0-2.8-2.8H7.4Zm4.6 3.1a4.3 4.3 0 1 1 0 8.6 4.3 4.3 0 0 1 0-8.6Zm0 1.8a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm4.5-2.3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z" /></svg>
}

function ChevronUpIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m7 14 5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function SupportAvatarIcon() {
  return <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#edf1f4" /><circle cx="20" cy="14" r="6" fill="#27323a" /><path d="M9 35c1.6-7.4 5.2-11 11-11s9.4 3.6 11 11" fill="#27323a" /><path d="M12 33c2.2-4.8 4.8-7.2 8-7.2s5.8 2.4 8 7.2" fill="#f0c7a1" opacity=".9" /></svg>
}

function SupportBoxIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 7.4 12 4l6 3.4v7.2L12 18l-6-3.4V7.4Z" strokeLinejoin="round" /><path d="m6 7.5 6 3.5 6-3.5M12 11v7M9.2 14.8h5.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
