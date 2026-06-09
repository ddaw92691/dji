import request from '@/utils/request'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

export interface CategoryItem {
  id: number
  parentId: number | null
  name: string
  icon: string
  image: string
  sort: number
  status: string
  translations: CategoryTranslationItem[]
  createdAt: string
  updatedAt: string
}

export interface CategoryTranslationItem {
  id: number
  categoryId: number
  languageCode: string
  countryCode: string | null
  name: string
  createdAt: string
  updatedAt: string
}

export const categoryApi = {
  getCategories: (params?: any) =>
    request.get<ICommonPageResponse<CategoryItem[]>>('/admin/categories', { params }),

  createCategory: (data: any) =>
    request.post<ICommonResponse<CategoryItem>>('/admin/categories', data),

  updateCategory: (id: number, data: any) =>
    request.put<ICommonResponse<CategoryItem>>(`/admin/categories/${id}`, data),

  updateCategoryStatus: (id: number, status: string) =>
    request.put<ICommonResponse<any>>(`/admin/categories/${id}/status`, { status }),

  deleteCategory: (id: number) =>
    request.delete<ICommonResponse<any>>(`/admin/categories/${id}`),

  saveTranslations: (categoryId: number, data: any[]) =>
    request.post<ICommonResponse<any>>(`/admin/categories/${categoryId}/translations`, data),
}
