import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useI18nStore } from '../stores/i18nStore'
import { useAuthStore } from '../stores/authStore'
import { getMerchantLoginUrl } from '../utils/merchantUrl'

type AuthMode = 'login' | 'register'

export default function LoginPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login'
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPhone, setRegisterPhone] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [marketingOptIn, setMarketingOptIn] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { t } = useI18nStore()
  const { login, googleLogin, register, loading } = useAuthStore()
  const merchantLoginUrl = getMerchantLoginUrl()
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  useEffect(() => {
    setMode(searchParams.get('mode') === 'register' ? 'register' : 'login')
  }, [searchParams])

  useEffect(() => {
    if (!googleClientId || document.querySelector('script[data-google-identity]')) return
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.dataset.googleIdentity = 'true'
    document.head.appendChild(script)
  }, [googleClientId])

  const switchMode = (nextMode: AuthMode) => {
    setError('')
    setMode(nextMode)
    setSearchParams(nextMode === 'register' ? { mode: 'register' } : {})
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login({ account, password, loginType: 'password' })
      navigate('/')
    } catch (err: any) {
      setError(err.message || t('auth.loginFailed', 'Login failed'))
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await register({
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword,
        countryCode: 'JP',
        languageCode: 'ja',
      })
      navigate('/')
    } catch (err: any) {
      setError(err.message || t('auth.registerFailed', 'Registration failed'))
    }
  }

  const handleGoogleLogin = () => {
    setError('')
    if (!googleClientId) {
      setError(t('auth.googleNotConfigured', 'Google login is not configured. Please set VITE_GOOGLE_CLIENT_ID.'))
      return
    }
    const google = (window as any).google
    if (!google?.accounts?.id) {
      setError(t('auth.googleLoading', 'Google login is still loading. Please try again in a moment.'))
      return
    }
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response: { credential?: string }) => {
        if (!response.credential) {
          setError(t('auth.googleNoCredential', 'Google did not return a credential.'))
          return
        }
        try {
          await googleLogin({
            credential: response.credential,
            countryCode: localStorage.getItem('countryCode') || 'JP',
            languageCode: localStorage.getItem('languageCode') || 'ja',
          })
          navigate('/')
        } catch (err: any) {
          setError(err.message || t('auth.googleLoginFailed', 'Google login failed'))
        }
      },
    })
    google.accounts.id.prompt()
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1f1f1f] text-[#1f1f1f]">
      <img src="/login/banner.webp" alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/10" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-6 lg:justify-end lg:px-[12vw]">
        <div className="login-panel w-full max-w-[464px] bg-white px-8 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.18)] sm:px-12">
          <Link to="/" aria-label="Mall home" className="mb-6 block w-[56px]">
            <img src="/logo-black.webp" alt="Mall" className="block h-auto w-full" />
          </Link>

          <h1 className="mb-5 text-[24px] font-semibold leading-tight tracking-normal text-[#1f1f1f]">
            {mode === 'login' ? t('auth.login.heading', 'Log in to Mall') : t('auth.register.heading', 'Create Your Mall Account')}
          </h1>

          {mode === 'login' ? (
            <LoginForm
              account={account}
              password={password}
              error={error}
              loading={loading}
              marketingOptIn={marketingOptIn}
              onAccountChange={setAccount}
              onPasswordChange={setPassword}
              onMarketingOptInChange={setMarketingOptIn}
              onSubmit={handleLoginSubmit}
              onGoogleLogin={handleGoogleLogin}
              onSwitchToRegister={() => switchMode('register')}
              merchantLoginUrl={merchantLoginUrl}
            />
          ) : (
            <RegisterForm
              email={registerEmail}
              phone={registerPhone}
              password={registerPassword}
              error={error}
              loading={loading}
              onEmailChange={setRegisterEmail}
              onPhoneChange={setRegisterPhone}
              onPasswordChange={setRegisterPassword}
              onSubmit={handleRegisterSubmit}
              onSwitchToLogin={() => switchMode('login')}
            />
          )}
        </div>
      </section>

      <p className="pointer-events-none absolute bottom-4 left-4 z-10 text-[11px] leading-4 text-white/90">
        {t('auth.watermark.brand', 'Shot on Mall System')}
        <br />
        {t('auth.watermark.clientLogin', 'Client Login')}
      </p>

      <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap text-[11px] text-white/90 md:block">
        {t('auth.footer.links', '2026 (c) Mall Privacy Policy Terms of Use Accessibility Statement FAQ Support Site Map')}
      </p>
    </main>
  )
}

function LoginForm({
  account,
  password,
  error,
  loading,
  marketingOptIn,
  onAccountChange,
  onPasswordChange,
  onMarketingOptInChange,
  onSubmit,
  onGoogleLogin,
  onSwitchToRegister,
  merchantLoginUrl,
}: {
  account: string
  password: string
  error: string
  loading: boolean
  marketingOptIn: boolean
  onAccountChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onMarketingOptInChange: (value: boolean) => void
  onSubmit: (e: React.FormEvent) => void
  onGoogleLogin: () => void
  onSwitchToRegister: () => void
  merchantLoginUrl: string
}) {
  const { t } = useI18nStore()
  return (
    <form onSubmit={onSubmit}>
      <button
        type="button"
        onClick={onGoogleLogin}
        className="flex h-12 w-full items-center justify-center gap-2 border border-[#d8d8d8] bg-white text-[14px] font-normal text-[#555] transition hover:border-[#b8b8b8] hover:bg-[#fafafa]"
      >
        <img src="/login/google-logo.svg" alt="" aria-hidden="true" className="h-[18px] w-[18px]" />
        <span>{t('auth.continueWithGoogle', 'Continue With Google')}</span>
      </button>

      <div className="my-4 flex items-center gap-4 text-xs text-[#777]">
        <span className="h-px flex-1 bg-[#ececec]" />
        <span>{t('auth.or', 'or')}</span>
        <span className="h-px flex-1 bg-[#ececec]" />
      </div>

      <div className="space-y-4">
        <Field label={t('auth.field.email', 'email address')}>
          <input
            type="text"
            value={account}
            onChange={(e) => onAccountChange(e.target.value)}
            autoComplete="off"
            className="h-10 w-full border border-[#d8d8d8] px-3 text-[14px] outline-none transition focus:border-[#111]"
            placeholder={t('auth.placeholder.emailOrPhone', 'Email or phone')}
            required
          />
        </Field>
        <Field label={t('auth.field.password', 'Password')}>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            autoComplete="new-password"
            className="h-10 w-full border border-[#d8d8d8] px-3 text-[14px] outline-none transition focus:border-[#111]"
            placeholder={t('auth.field.password', 'Password')}
            required
          />
        </Field>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <div className="mt-3">
        <button type="button" className="text-[13px] text-[#0066cc] hover:underline">
          {t('auth.forgotPassword', 'Forgot password? Go to reset')} &gt;
        </button>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-2 text-[13px] leading-5 text-[#666]">
        <input
          type="checkbox"
          checked={marketingOptIn}
          onChange={(e) => onMarketingOptInChange(e.target.checked)}
          className="mt-[2px] h-4 w-4 rounded border-[#d8d8d8] text-[#0066cc] focus:ring-[#0066cc]"
        />
        <span>{t('auth.marketingOptIn', 'Click to get exclusive Mall benefits, latest offers, and updates.')}</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 h-11 w-full border border-[#d8d8d8] bg-[#f7f7f7] text-[14px] font-normal text-[#999] transition hover:border-[#bdbdbd] hover:bg-[#f2f2f2] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? t('auth.loggingIn', 'Logging in...') : t('auth.logIn', 'Log In')}
      </button>

      <p className="mt-4 text-center text-[13px] text-[#333]">
        {t('auth.newUser', 'New user?')}{' '}
        <button type="button" onClick={onSwitchToRegister} className="text-[#0066cc] hover:underline">
          {t('auth.register.heading', 'Create Your Mall Account')}
        </button>
      </p>

      <a
        href={merchantLoginUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex h-11 w-full items-center justify-center border border-[#1f1f1f] bg-white text-[14px] font-medium text-[#1f1f1f] transition hover:bg-[#1f1f1f] hover:text-white"
      >
        {t('auth.merchantLogin', 'Merchant Portal Login')}
      </a>

      <p className="mx-auto mt-4 max-w-[310px] text-center text-[12px] leading-5 text-[#777]">
        {t('auth.agreeTerms', 'By continuing, you hereby agree to the Privacy Policy and Terms of Use.')}
      </p>
    </form>
  )
}

function RegisterForm({
  email,
  phone,
  password,
  error,
  loading,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onSubmit,
  onSwitchToLogin,
}: {
  email: string
  phone: string
  password: string
  error: string
  loading: boolean
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onSwitchToLogin: () => void
}) {
  const { t } = useI18nStore()
  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <Field label={t('auth.field.email', 'email address')}>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            autoComplete="off"
            className="h-10 w-full border border-[#d8d8d8] px-3 text-[14px] outline-none transition focus:border-[#111]"
            placeholder={t('auth.placeholder.email', 'your@email.com')}
            required
          />
        </Field>
        <Field label={t('auth.field.phone', 'phone number')}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            autoComplete="off"
            className="h-10 w-full border border-[#d8d8d8] px-3 text-[14px] outline-none transition focus:border-[#111]"
            placeholder="+81 90 0000 0000"
          />
        </Field>
        <Field label={t('auth.field.password', 'Password')}>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            autoComplete="new-password"
            className="h-10 w-full border border-[#d8d8d8] px-3 text-[14px] outline-none transition focus:border-[#111]"
            placeholder={t('auth.placeholder.passwordMin', 'Min 6 characters')}
            required
            minLength={6}
          />
        </Field>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-6 h-11 w-full border border-[#1f1f1f] bg-[#1f1f1f] text-[14px] font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? t('auth.creating', 'Creating...') : t('auth.createAccountBtn', 'Create Account')}
      </button>

      <p className="mt-4 text-center text-[13px] text-[#333]">
        {t('auth.alreadyHaveAccount', 'Already have an account?')}{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-[#0066cc] hover:underline">
          {t('auth.logIn', 'Log In')}
        </button>
      </p>

      <p className="mx-auto mt-5 max-w-[310px] text-center text-[12px] leading-5 text-[#777]">
        {t('auth.agreeTerms', 'By continuing, you hereby agree to the Privacy Policy and Terms of Use.')}
      </p>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-2 block text-[14px] font-normal text-[#111]">{label}</label>
      {children}
    </div>
  )
}
