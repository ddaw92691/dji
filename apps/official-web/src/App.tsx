import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProductDetailPage from './pages/ProductDetailPage'
import ProductListPage from './pages/ProductListPage'
import {
  CameraDronesPage,
  CompanyPage,
  DeliveryPage,
  HandheldPage,
  MediaCenterPage,
  PowerStationsPage,
  RobotVacuumsPage,
  SupportPage,
  TrustCenterPage,
  WhereToBuyPage,
} from './pages/StaticPages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/camera-drones" element={<CameraDronesPage />} />
      <Route path="/handheld" element={<HandheldPage />} />
      <Route path="/lifestyle-tech/power-stations" element={<PowerStationsPage />} />
      <Route path="/lifestyle-tech/robot-vacuums" element={<RobotVacuumsPage />} />
      <Route path="/delivery" element={<DeliveryPage />} />
      <Route path="/company" element={<CompanyPage />} />
      <Route path="/media-center" element={<MediaCenterPage />} />
      <Route path="/trust-center" element={<TrustCenterPage />} />
      <Route path="/support" element={<SupportPage />} />
      <Route path="/where-to-buy" element={<WhereToBuyPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
