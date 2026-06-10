import { create } from 'zustand'
import { authApi, type GoogleLoginParams, type LoginParams, type RegisterParams, type UserInfo } from '../services/auth'

interface AuthState {
  user: UserInfo | null
  token: string | null
  loading: boolean
  login: (params: LoginParams) => Promise<void>
  googleLogin: (params: GoogleLoginParams) => Promise<void>
  register: (params: RegisterParams) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  login: async (params) => {
    set({ loading: true })
    try {
      const res = await authApi.login(params)
      if (res.data.code === 200) {
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('countryCode', user.countryCode || 'JP')
        localStorage.setItem('languageCode', user.languageCode || 'ja')
        set({ token, user, loading: false })
      } else {
        throw new Error((res.data as any).message || 'Login failed')
      }
    } catch (e) {
      set({ loading: false })
      throw e
    }
  },
  googleLogin: async (params) => {
    set({ loading: true })
    try {
      const res = await authApi.googleLogin(params)
      if (res.data.code === 200) {
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('countryCode', user.countryCode || 'JP')
        localStorage.setItem('languageCode', user.languageCode || 'ja')
        set({ token, user, loading: false })
      } else {
        throw new Error((res.data as any).message || 'Google login failed')
      }
    } catch (e) {
      set({ loading: false })
      throw e
    }
  },
  register: async (params) => {
    set({ loading: true })
    try {
      const res = await authApi.register(params)
      if (res.data.code === 200) {
        const { token, user } = res.data.data
        localStorage.setItem('token', token)
        set({ token, user, loading: false })
      } else {
        throw new Error((res.data as any).message || 'Registration failed')
      }
    } catch (e) {
      set({ loading: false })
      throw e
    }
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
  fetchUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await authApi.getMe()
      if (res.data.code === 200) {
        set({ user: res.data.data })
      }
    } catch {
      localStorage.removeItem('token')
      set({ user: null, token: null })
    }
  },
}))
