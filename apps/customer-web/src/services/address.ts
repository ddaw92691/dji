import request from './request'

export interface AddressItem {
  id: number; receiverName: string; phone: string; country: string
  province: string; city: string; detail: string; postalCode: string; isDefault: boolean
}

export const addressApi = {
  getAddresses: () => request.get<{code:number;data:AddressItem[]}>('/customer/addresses'),
  createAddress: (data: any) => request.post<{code:number;data:AddressItem}>('/customer/addresses', data),
  updateAddress: (id: number, data: any) => request.put<{code:number;data:AddressItem}>(`/customer/addresses/${id}`, data),
  deleteAddress: (id: number) => request.delete<{code:number;data:any}>(`/customer/addresses/${id}`),
  setDefault: (id: number) => request.put<{code:number;data:any}>(`/customer/addresses/${id}/default`),
}
