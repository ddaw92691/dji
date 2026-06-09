import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface PlatformProduct {
  id: number
  brand: string
  name: string
  model: string
  categoryId: number
  categoryName: string
  coverImage: string
  merchantPrice: number
  salePrice: number
  originalPrice: number
  profitAmount: number
  profitRate: number
  stockMode: string
  globalStock: number
  status: string
  images: { id: number; imageUrl: string; sort: number }[]
}

export interface ListingItem {
  id: number
  merchantId: number
  platformProductId: number
  platformProductName: string
  listingStatus: string
  merchantStock: number
  salePrice: number
  merchantPrice: number
  profitAmount: number
  listedAt: string
}

export const catalogApi = {
  getPlatformProducts: (params?: any) =>
    request.get<ICommonResponse<{ list: PlatformProduct[]; total: number }>>('/merchant/catalog/products', { params }),

  listProduct: (id: number, data: any) =>
    request.post<ICommonResponse<ListingItem>>(`/merchant/catalog/products/${id}/list`, data),

  getListings: (params?: any) =>
    request.get<ICommonResponse<{ list: ListingItem[]; total: number }>>('/merchant/catalog/listings', { params }),

  updateListing: (id: number, data: any) =>
    request.put<ICommonResponse<ListingItem>>(`/merchant/catalog/listings/${id}`, data),

  delistListing: (id: number) =>
    request.delete<ICommonResponse<any>>(`/merchant/catalog/listings/${id}`),
}
