import request from './request'

export interface CartItem {
  id: number; productId: number; title: string; coverImage: string
  price: number; originalPrice: number; stock: number; quantity: number
  selected: boolean; subtotal: number; available: boolean; productStatus: string
}

export interface CartData {
  items: CartItem[]; selectedTotalAmount: number; selectedCount: number
}

export const cartApi = {
  getCart: () => request.get<{code:number;data:CartData}>('/customer/cart'),
  addItem: (productId: number, quantity: number) => request.post<{code:number;data:any}>('/customer/cart/items', { productId, quantity }),
  updateItem: (id: number, data: {quantity?: number; selected?: boolean}) => request.put<{code:number;data:any}>(`/customer/cart/items/${id}`, data),
  deleteItem: (id: number) => request.delete<{code:number;data:any}>(`/customer/cart/items/${id}`),
  clearCart: () => request.delete<{code:number;data:any}>('/customer/cart/clear'),
  selectAll: (selected: boolean) => request.put<{code:number;data:any}>('/customer/cart/select-all', { selected }),
}
