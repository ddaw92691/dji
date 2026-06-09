import request from '@/utils/request'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

export interface CatalogProduct {
  id: number
  brand: string
  name: string
  model: string
  categoryId: number
  categoryName: string
  description: string
  coverImage: string
  merchantPrice: number
  salePrice: number
  originalPrice: number
  profitAmount: number
  profitRate: number
  stockMode: string
  globalStock: number
  sort: number
  status: string
  images: CatalogProductImage[]
  translations: CatalogProductTranslation[]
  createdAt: string
  updatedAt: string
}

export interface CatalogProductImage {
  id: number
  productId: number
  url?: string
  imageUrl: string
  sort: number
}

export interface CatalogProductTranslation {
  id: number
  productId: number
  languageCode: string
  countryCode: string | null
  name: string
  description: string
}

export interface CatalogListing {
  id: number
  merchantId: number
  merchantName: string
  platformProductId: number
  platformProductName: string
  platformProductModel: string
  listingStatus: string
  merchantStock: number
  salePrice: number
  merchantPrice: number
  profitAmount: number
  listedAt: string
  createdAt: string
}

export const catalogApi = {
  getProducts: (params?: any) =>
    request.get<ICommonPageResponse<CatalogProduct[]>>('/admin/catalog/products', { params }),

  getProduct: (id: number) =>
    request.get<ICommonResponse<CatalogProduct>>(`/admin/catalog/products/${id}`),

  createProduct: (data: any) =>
    request.post<ICommonResponse<CatalogProduct>>('/admin/catalog/products', data),

  updateProduct: (id: number, data: any) =>
    request.put<ICommonResponse<CatalogProduct>>(`/admin/catalog/products/${id}`, data),

  updateProductStatus: (id: number, status: string) =>
    request.put<ICommonResponse<any>>(`/admin/catalog/products/${id}/status`, { status }),

  deleteProduct: (id: number) =>
    request.delete<ICommonResponse<any>>(`/admin/catalog/products/${id}`),

  getListings: (params?: any) =>
    request.get<ICommonPageResponse<CatalogListing[]>>('/admin/catalog/listings', { params }),

  disableListing: (id: number) =>
    request.put<ICommonResponse<any>>(`/admin/catalog/listings/${id}/disable`, { status: 'OFF_SALE' }),
}
