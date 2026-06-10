import request from './request'

export interface LoginParams {
  account: string
  password: string
  loginType: string
}

export interface GoogleLoginParams {
  credential: string
  countryCode?: string
  languageCode?: string
}

export interface RegisterParams {
  email: string
  phone: string
  password: string
  countryCode: string
  languageCode: string
}

export interface UserInfo {
  id: string
  email: string
  phone: string
  role: string
  nickname: string
  avatar: string
  countryCode: string
  languageCode: string
}

export interface LoginResult {
  token: string
  user: UserInfo
}

export const authApi = {
  login: (params: LoginParams) => request.post<{ code: number; data: LoginResult }>('/auth/login', params),
  googleLogin: (params: GoogleLoginParams) => request.post<{ code: number; data: LoginResult }>('/auth/google', params),
  register: (params: RegisterParams) => request.post<{ code: number; data: LoginResult }>('/auth/register', params),
  getMe: () => request.get<{ code: number; data: UserInfo }>('/auth/me'),
}
