import request from '@/utils/request'
import type { ICommonResponse, ICommonPageResponse } from '@/types/common'

export interface ReviewItem {
  id: number
  productId: number
  productTitle: string
  userId: number
  userName: string
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
    request.get<ICommonPageResponse<ReviewItem[]>>('/merchant/reviews', { params }),

  replyReview: (id: number, replyContent: string) =>
    request.put<ICommonResponse<any>>(`/merchant/reviews/${id}/reply`, { replyContent }),
}
