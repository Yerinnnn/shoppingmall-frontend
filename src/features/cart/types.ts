export interface CartItem {
    cartId: number;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }
  
  export interface CartSummary {
    subtotal: number;
    shippingFee: number;
    total: number;
  }
  
  export interface CartApiResponse {
    items: CartItem[];
    summary: CartSummary;
  }
  
  export interface AddToCartRequest {
    productId: number;
    quantity: number;
  }
  
  export interface UpdateCartItemRequest {
    cartId: number;
    quantity: number;
  }