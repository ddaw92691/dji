import request from '@/utils/request';
export const reviewApi = {
    getReviews: (params) => request.get('/admin/reviews', { params }),
    updateReviewStatus: (id, status) => request.put(`/admin/reviews/${id}/status`, { status }),
    deleteReview: (id) => request.delete(`/admin/reviews/${id}`),
};
