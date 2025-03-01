// 위시리스트 타입 정의
export interface WishlistItem {
  wishlistId: number;
  productId: number;
  productName: string;
  price: number;
  addedAt: string;
}

// 위시리스트 API 응답 타입
export interface WishlistApiResponse {
  items: WishlistItem[];
}

// 위시리스트 API 요청 타입
export interface AddToWishlistRequest {
  productId: number;
}

// 위시리스트 커스텀 훅 반환 타입
export interface UseWishlistReturn {
  items: WishlistItem[];
  isLoading: boolean;
  error: Error | null;
  addToWishlist: (productId: number) => Promise<void>; // void 반환으로 수정
  removeFromWishlist: (wishlistId: number) => Promise<void>;
  removeFromWishlistByProductId: (productId: number) => Promise<void>;
  checkInWishlist: (productId: number) => Promise<boolean>;
}
