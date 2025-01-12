export interface CartItem {
  cartId: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

export interface CartMutations {
  updateQuantity: (cartId: number, quantity: number) => Promise<void>;
  removeItem: (cartId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}