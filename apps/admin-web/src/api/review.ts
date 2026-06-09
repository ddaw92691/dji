import request from '@/utils/request'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

export interface ReviewItem {
  id: number
  productId: number
  productTitle: string
  userId: number
  userName: string
  merchantId: number
  merchantName: string
  rating: number
  content: string
  images: string[]
  status: string
  replyContent: string
  replyAt: string
  createdAt: string
  updatedAt: string
}

export const reviewApi = {
  getReviews: (params?: any) =>
    request.get<ICommonPageResponse<ReviewItem[]>>('/admin/reviews', { params }),

  updateReviewStatus: (id: number, status: string) =>
    request.put<ICommonResponse<any>>(`/admin/reviews/${id}/status`, { status }),

  deleteReview: (id: number) =>
    request.delete<ICommonResponse<any>>(`/admin/reviews/${id}`),
}
