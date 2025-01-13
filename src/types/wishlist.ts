export interface WishlistItem {
  wishlistId: number;
  productId: number;
  productName: string;
  price: number;
  addedAt: string;
}

export interface WishlistMutations {
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (wishlistId: number) => Promise<void>;
  checkInWishlist: (productId: number) => Promise<boolean>;
}