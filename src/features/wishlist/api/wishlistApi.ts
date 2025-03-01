import { api } from "../../../services/apiClient";
import { WishlistItem } from "../types";

const WISHLIST_ENDPOINT = "/wishlist";

export const wishlistApi = {
  // 위시리스트 목록 조회
  fetchWishlist: async (): Promise<WishlistItem[]> => {
    return api.get<WishlistItem[]>(WISHLIST_ENDPOINT);
  },

  // 위시리스트에 상품 추가
  addToWishlist: async (productId: number): Promise<WishlistItem> => {
    return api.post<WishlistItem>(`${WISHLIST_ENDPOINT}/${productId}`);
  },

  // 위시리스트에서 상품 제거
  removeFromWishlist: async (wishlistId: number): Promise<void> => {
    return api.delete(`${WISHLIST_ENDPOINT}/${wishlistId}`);
  },

  // 상품이 위시리스트에 있는지 확인
  checkInWishlist: async (productId: number): Promise<boolean> => {
    return api.get<boolean>(`${WISHLIST_ENDPOINT}/${productId}/exists`);
  },
};
