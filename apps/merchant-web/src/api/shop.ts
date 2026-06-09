import request from '@/utils/request'

export const shopApi = {
  getProfile: () => request.get('/merchant/profile'),
  updateProfile: (data: Record<string, unknown>) =>
    request.put('/merchant/profile', data),
}
