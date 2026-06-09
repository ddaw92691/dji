import request from '@/utils/request'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

export interface BannerItem {
  id: number
  title: string
  subtitle: string
  imageUrl: string
  linkUrl: string
  linkType: string
  sort: number
  position: string
  status: string
  translations: BannerTranslationItem[]
  createdAt: string
  updatedAt: string
}

export interface BannerTranslationItem {
  id: number
  bannerId: number
  languageCode: string
  countryCode: string | null
  title: string
  subtitle: string
  createdAt: string
  updatedAt: string
}

export const bannerApi = {
  getBanners: (params?: any) =>
    request.get<ICommonPageResponse<BannerItem[]>>('/admin/banners', { params }),

  createBanner: (data: any) =>
    request.post<ICommonResponse<BannerItem>>('/admin/banners', data),

  updateBanner: (id: number, data: any) =>
    request.put<ICommonResponse<BannerItem>>(`/admin/banners/${id}`, data),

  updateBannerStatus: (id: number, status: string) =>
    request.put<ICommonResponse<any>>(`/admin/banners/${id}/status`, { status }),

  deleteBanner: (id: number) =>
    request.delete<ICommonResponse<any>>(`/admin/banners/${id}`),

  saveTranslations: (bannerId: number, data: any[]) =>
    request.post<ICommonResponse<any>>(`/admin/banners/${bannerId}/translations`, data),
}
