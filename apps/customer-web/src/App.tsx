import { useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useI18nStore } from './stores/i18nStore'
import { useAuthStore } from './stores/authStore'
import { connectRealtime, disconnectRealtime } from './services/realtime'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import AddressPage from './pages/AddressPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentPage from './pages/PaymentPage'
import PaymentResultPage from './pages/PaymentResultPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import CouponPage from './pages/CouponPage'
import ReviewCreatePage from './pages/ReviewCreatePage'
import NotificationPage from './pages/NotificationPage'
import SupportSessionsPage from './pages/SupportSessionsPage'
import SupportChatPage from './pages/SupportChatPage'
import { StoreCategoryPage } from './pages/StorePages'

const wsEventBus = new EventTarget()
export { wsEventBus }

function App() {
  const { countryCode, languageCode, setLocale, loadCountries } = useI18nStore()
  const { token } = useAuthStore()
  const location = useLocation()
  const isStorePage = [
    '/',
    '/store-day',
    '/camera-drones',
    '/handheld',
    '/robot-vacuum',
    '/services',
    '/accessories',
    '/education-industry',
    '/official-refurbished',
  ].includes(location.pathname)

  const handleWsEvent = useCallback((event: any) => {
    const e = event as { type: string; data?: any }
    if (['PRODUCT_PRICE_UPDATED', 'PRODUCT_STATUS_UPDATED', 'NOTIFICATION_CREATED'].includes(e.type)) {
      wsEventBus.dispatchEvent(new CustomEvent(e.type, { detail: e.data }))
    }
  }, [])

  useEffect(() => {
    loadCountries()
    setLocale(countryCode, languageCode)
  }, [])

  useEffect(() => {
    if (token) {
      connectRealtime(token, handleWsEvent)
    }
    return () => { disconnectRealtime() }
  }, [token, handleWsEvent])

  return (
    <div className={isStorePage ? 'min-h-screen bg-white' : 'min-h-screen bg-gray-50'}>
      <div className={isStorePage ? 'min-h-screen bg-white' : 'mx-auto max-w-[480px] min-h-screen bg-white shadow-sm'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/store-day" element={<StoreCategoryPage section="store-day" />} />
          <Route path="/camera-drones" element={<StoreCategoryPage section="camera-drones" />} />
          <Route path="/handheld" element={<StoreCategoryPage section="handheld" />} />
          <Route path="/robot-vacuum" element={<StoreCategoryPage section="robot-vacuum" />} />
          <Route path="/services" element={<StoreCategoryPage section="services" />} />
          <Route path="/accessories" element={<StoreCategoryPage section="accessories" />} />
          <Route path="/education-industry" element={<StoreCategoryPage section="education" />} />
          <Route path="/official-refurbished" element={<StoreCategoryPage section="refurbished" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/addresses" element={<AddressPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/payment/:orderId" element={<PaymentPage />} />
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/coupons" element={<CouponPage />} />
          <Route path="/reviews/create" element={<ReviewCreatePage />} />
          <Route path="/notifications" element={<NotificationPage />} />
          <Route path="/support" element={<SupportSessionsPage />} />
          <Route path="/support/:id" element={<SupportChatPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
