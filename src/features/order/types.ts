export type OrderStatus = 
  | 'PENDING'      // 주문 대기
  | 'PAID'         // 결제 완료
  | 'PREPARING'    // 상품 준비중
  | 'SHIPPING'     // 배송중
  | 'DELIVERED'    // 배송 완료
  | 'COMPLETED'    // 주문 완료
  | 'CANCELLED';   // 주문 취소

export interface OrderItem {
  orderItemId?: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
}

export interface CreateOrderRequest {
  deliveryAddressId: number;
  paymentMethodId: number;
  usePoints: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface OrderResponse {
  orderId: number;
  status: OrderStatus;
  totalAmount: number;
  // 기타 필요한 필드들
}

export interface PaymentProcessRequest {
  orderId: number;
  paymentToken: string;
  amount: number;
}