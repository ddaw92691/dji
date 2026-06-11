import request from '@/utils/request'
import type { ILoginParams, ILoginResponse, IUserPermissionsResponse } from '@/types/login'
import type { ICommonResponse } from '@/types/common'
import type { IUserItem } from '@/types/system/user'

export const login = (params: ILoginParams) => {
  return request.post<ILoginResponse>('/auth/login', params)
}

export const userPermissions = () => {
  return request.get<IUserPermissionsResponse>('/auth/permissions')
}

export const userInfoRequest = () => {
  return request.get<ICommonResponse<IUserItem>>('/auth/me')
}

export const registerUser = (params: { email: string; phone: string; password: string; countryCode: string; languageCode: string }) => {
  return request.post<ILoginResponse>('/auth/register', params)
}

export type MerchantApplicationPayload = {
  email: string
  phone: string
  password: string
  fullName: string
  age: number
  homeAddress: string
  documentType: 'id_card' | 'passport' | 'driver_license'
  idCardFrontUrl?: string
  idCardBackUrl?: string
  passportPageUrl?: string
  driverLicenseUrl?: string
  handheldDocumentVideoUrl: string
}

export const uploadMerchantApplicationFile = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return request.post('/v1/merchant/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const submitMerchantApplication = (params: MerchantApplicationPayload) => {
  return request.post('/v1/merchant/dealer-applications', params)
}

export const getMerchantApplicationStatus = (id: string | number) => {
  return request.get('/v1/merchant/dealer-applications/' + id + '/status')
}
