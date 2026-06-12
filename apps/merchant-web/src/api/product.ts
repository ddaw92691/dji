import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IProduct {
  id: number
  merchantId?: number
  platformProductId?: number | null
  productSource?: 'PLATFORM_LIBRARY' | 'MERCHANT_CUSTOM'
  title: string
  description: string
  coverImage: string
  price: number
  salePrice?: number
  originalPrice: number
  stock: number
  merchantStock?: number
  salesCount: number
  merchantPrice?: number
  profitAmount?: number
  profitRate?: number
  categoryId: number
  categoryName: string
  status: string
  listingStatus?: string
  auditStatus: string
  createdAt: string
  updatedAt: string
  images: { id?: number; imageUrl: string; sort: number }[]
  translations: { languageCode: string; title: string; description: string }[]
}

export const productApi = {
  getMyProducts: (params: any) => request.get<ICommonResponse<{list:IProduct[],total:number}>>('/merchant/products', { params }),
  getProduct: (id: number) => request.get<ICommonResponse<IProduct>>(`/merchant/products/${id}`),
  createProduct: (data: any) => request.post<ICommonResponse<IProduct>>('/merchant/products', data),
  updateProduct: (id: number, data: any) => request.put<ICommonResponse<IProduct>>(`/merchant/products/${id}`, data),
  deleteProduct: (id: number) => request.delete<ICommonResponse<any>>(`/merchant/products/${id}`),
  submitAudit: (id: number) => request.post<ICommonResponse<any>>(`/merchant/products/${id}/submit-audit`),
  saveTranslations: (id: number, data: any) => request.put<ICommonResponse<any>>(`/merchant/products/${id}/translations`, data),
  getCategories: () => request.get<ICommonResponse<any[]>>('/customer/categories'),
}
