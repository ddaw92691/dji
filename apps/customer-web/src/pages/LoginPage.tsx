import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function LoginPage() {
  const [account, setAccount] = useState('customer@example.com')
  const [password, setPassword] = useState('customer123456')
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login, loading } = useAuthStore()
  const merchantLoginUrl = import.meta.env.VITE_MERCHANT_WEB_URL || 'http://localhost:5174/login'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login({ account, password, loginType: 'password' })
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1f1f1f] text-[#1f1f1f]">
      <img
        src="/login/banner.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-6 lg:justify-end lg:px-[12vw]">
        <form
          onSubmit={handleSubmit}
          className="login-panel w-full max-w-[464px] bg-white px-8 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.18)] sm:px-12"
        >
          <Link to="/" aria-label="Mall home" className="mb-6 block w-[56px]">
            <img src="/logo-black.webp" alt="Mall" className="block h-auto w-full" />
          </Link>

          <h1 className="mb-5 text-[24px] font-semibold leading-tight tracking-normal text-[#1f1f1f]">Log in to Mall</h1>

          <div className="space-y-2">
            <SocialButton provider="Apple" iconClass="bg-[#1f1f1f] text-white" iconText="A" />
            <SocialButton provider="Google" iconClass="bg-white text-[#4285f4] ring-1 ring-black/10" iconText="G" />
            <SocialButton provider="Facebook" iconClass="bg-[#1877f2] text-white" iconText="f" />
          </div>

          <div className="my-4 flex items-center gap-4 text-xs text-[#777]">
            <span className="h-px flex-1 bg-[#ececec]" />
            <span>or</span>
            <span className="h-px flex-1 bg-[#ececec]" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-[14px] font-normal text-[#111]">email address</label>
              <input
                type="text"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="h-10 w-full border border-[#d8d8d8] px-3 text-[14px] outline-none transition focus:border-[#111]"
                placeholder="Email or phone"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-normal text-[#111]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full border border-[#d8d8d8] px-3 text-[14px] outline-none transition focus:border-[#111]"
                placeholder="Password"
                required
              />
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="mt-3">
            <Link to="/register" className="text-[13px] text-[#0066cc] hover:underline">
              Forgot password? Go to reset &gt;
            </Link>
          </div>

          <label className="mt-4 flex cursor-pointer items-start gap-2 text-[13px] leading-5 text-[#666]">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-[2px] h-4 w-4 rounded border-[#d8d8d8] text-[#0066cc] focus:ring-[#0066cc]"
            />
            <span>Click to get exclusive Mall benefits, latest offers, and updates.</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 h-11 w-full border border-[#d8d8d8] bg-[#f7f7f7] text-[14px] font-normal text-[#999] transition hover:border-[#bdbdbd] hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <p className="mt-4 text-center text-[13px] text-[#333]">
            New user?{' '}
            <Link to="/register" className="text-[#0066cc] hover:underline">
              Create Your Mall Account
            </Link>
          </p>

          <a
            href={merchantLoginUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex h-11 w-full items-center justify-center border border-[#1f1f1f] bg-white text-[14px] font-medium text-[#1f1f1f] transition hover:bg-[#1f1f1f] hover:text-white"
          >
            商家后台登录
          </a>

          <p className="mx-auto mt-4 max-w-[310px] text-center text-[12px] leading-5 text-[#777]">
            By continuing, you hereby agree to the Privacy Policy and Terms of Use.
          </p>
        </form>
      </section>

      <p className="pointer-events-none absolute bottom-4 left-4 z-10 text-[11px] leading-4 text-white/90">
        Shot on Mall System
        <br />
        Client Login
      </p>

      <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap text-[11px] text-white/90 md:block">
        2026 (c) Mall Privacy Policy Terms of Use Accessibility Statement FAQ Support Site Map
      </p>
    </main>
  )
}

function SocialButton({
  provider,
  iconClass,
  iconText,
}: {
  provider: string
  iconClass: string
  iconText: string
}) {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center justify-center gap-2 border border-[#d8d8d8] bg-white text-[14px] font-normal text-[#555] transition hover:border-[#b8b8b8] hover:bg-[#fafafa]"
    >
      <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-[12px] font-semibold ${iconClass}`}>
        {iconText}
      </span>
      <span>Continue With {provider}</span>
    </button>
  )
}
