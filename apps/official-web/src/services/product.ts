import request from './request'

export interface ProductItem {
  id: number; title: string; description: string; coverImage: string
  price: number; originalPrice: number; salesCount: number
  categoryId: number; categoryName: string; images: { imageUrl: string }[]
}

export interface BannerItem {
  id: number; title: string; subtitle: string; imageUrl: string; linkUrl: string
}

export interface CategoryItem {
  id: number; name: string; icon: string
}

export interface HomeData {
  banners: BannerItem[]; categories: CategoryItem[]
  recommendedProducts: ProductItem[]; hotProducts: ProductItem[]
}

export const api = {
  getHome: () => request.get<{ code: number; data: HomeData }>('/customer/home'),
  getCategories: () => request.get<{ code: number; data: CategoryItem[] }>('/customer/categories'),
  getProducts: (params: any) => request.get<{ code: number; data: { list: ProductItem[]; total: number } }>('/customer/products', { params }),
  getProductDetail: (id: number) => request.get<{ code: number; data: ProductItem }>('/customer/products/' + id),
}
