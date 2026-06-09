import request from '@/utils/request'
import type { ICommonResponse } from '@/types/common'

export interface IProduct {
  id: number; title: string; description: string; coverImage: string
  price: number; originalPrice: number; stock: number; salesCount: number
  categoryId: number; categoryName: string; status: string; auditStatus: string
  createdAt: string; updatedAt: string; images: { id: number; imageUrl: string; sort: number }[]
  translations: { languageCode: string; title: string; description: string }[]
}

export const productApi = {
  getMyProducts: (params: any) => request.get<ICommonResponse<{list:IProduct[],total:number}>>('/merchant/products', { params }),
  createProduct: (data: any) => request.post<ICommonResponse<IProduct>>('/merchant/products', data),
  updateProduct: (id: number, data: any) => request.put<ICommonResponse<IProduct>>(`/merchant/products/${id}`, data),
  deleteProduct: (id: number) => request.delete<ICommonResponse<any>>(`/merchant/products/${id}`),
  submitAudit: (id: number) => request.post<ICommonResponse<any>>(`/merchant/products/${id}/submit-audit`),
  saveTranslations: (id: number, data: any) => request.put<ICommonResponse<any>>(`/merchant/products/${id}/translations`, data),
  getCategories: () => request.get<ICommonResponse<any[]>>('/customer/categories'),
}
