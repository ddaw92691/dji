import request from '@/utils/request';
export const couponApi = {
    getCoupons: (params) => request.get('/admin/coupons', { params }),
    createCoupon: (data) => request.post('/admin/coupons', data),
    updateCoupon: (id, data) => request.put('/admin/coupons/' + id, data),
    updateCouponStatus: (id, status) => request.put('/admin/coupons/' + id + '/status', { status }),
    deleteCoupon: (id) => request.delete('/admin/coupons/' + id),
    getRecords: (id, params) => request.get('/admin/coupons/' + id + '/records', { params }),
};
