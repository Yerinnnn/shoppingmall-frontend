import { apiClient } from '../../../services/apiClient';
import { 
  CartItem, 
  AddToCartRequest, 
  UpdateCartItemRequest 
} from '../types';

const CART_ENDPOINT = '/cart';

export const cartApi = {
  // 장바구니 조회
  fetchCart: async (): Promise<CartItem[]> => {
    const response = await apiClient.get(CART_ENDPOINT);
    return response.data;
  },

  // 장바구니에 상품 추가
  addToCart: async (request: AddToCartRequest): Promise<CartItem> => {
    const response = await apiClient.post(CART_ENDPOINT, request);
    return response.data;
  },

  // 장바구니 아이템 수량 변경
  updateCartItem: async ({ cartId, quantity }: UpdateCartItemRequest): Promise<void> => {
    await apiClient.put(`${CART_ENDPOINT}/${cartId}`, { quantity });
  },

  // 장바구니 아이템 삭제
  removeCartItem: async (cartId: number): Promise<void> => {
    await apiClient.delete(`${CART_ENDPOINT}/${cartId}`);
  },

  // 장바구니 비우기
  clearCart: async (): Promise<void> => {
    await apiClient.delete(CART_ENDPOINT);
  }
};