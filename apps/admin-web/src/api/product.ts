import request from '@/utils/request'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

export interface ProductItem {
  id: number
  merchantId: number
  categoryId: number
  title: string
  description: string
  coverImage: string
  price: number
  originalPrice: number
  stock: number
  salesCount: number
  status: string
  auditStatus: string
  auditRemark: string
  auditBy: number | null
  auditAt: string | null
  merchantName: string
  categoryName: string
  images: ProductImageItem[]
  translations: ProductTranslationItem[]
  createdAt: string
  updatedAt: string
}

export interface ProductImageItem {
  id: number
  productId: number
  imageUrl: string
  sort: number
  isMain: boolean
}

export interface ProductTranslationItem {
  id: number
  productId: number
  languageCode: string
  countryCode: string | null
  title: string
  description: string
  createdAt: string
  updatedAt: string
}

export const productApi = {
  getProducts: (params?: any) =>
    request.get<ICommonPageResponse<ProductItem[]>>('/admin/products', { params }),

  getProductDetail: (id: number) =>
    request.get<ICommonResponse<ProductItem>>(`/admin/products/${id}`),

  updateProductStatus: (id: number, status: string) =>
    request.put<ICommonResponse<any>>(`/admin/products/${id}/status`, { status }),

  getAuditList: (params?: any) =>
    request.get<ICommonPageResponse<ProductItem[]>>('/admin/products/audit', { params }),

  auditProduct: (id: number, data: { auditStatus: string; auditRemark?: string }) =>
    request.put<ICommonResponse<any>>(`/admin/products/${id}/audit`, data),
}
