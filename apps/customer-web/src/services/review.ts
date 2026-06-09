import request from './request'

export interface ReviewItem {
  id: number
  productId: number
  productTitle: string
  orderId: number
  orderItemId: number
  userId: number
  userName: string
  rating: number
  content: string
  images: string[]
  status: string
  createdAt: string
  updatedAt: string
}

export const reviewApi = {
  createReview: (data: {
    productId: number
    orderId: number
    orderItemId: number
    rating: number
    content: string
    images?: string[]
  }) => request.post('/customer/reviews', data),

  getProductReviews: (productId: number, params?: { page?: number; pageSize?: number }) =>
    request.get(`/customer/products/${productId}/reviews`, { params }),

  getMyReviews: (params?: { page?: number; pageSize?: number }) =>
    request.get('/customer/reviews', { params }),
}
