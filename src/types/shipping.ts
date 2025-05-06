// 배송 상태 타입
export type ShippingStatus = 
  | 'PREPARING'   // 배송 준비중
  | 'SHIPPED'     // 발송됨
  | 'DELIVERING'  // 배송중
  | 'DELIVERED'   // 배송 완료
  | 'CANCELLED';  // 취소됨

// 배송 응답 타입
export interface ShippingResponse {
  shippingId: number;
  trackingNumber: string;
  carrier: string;
  status: ShippingStatus;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  shippingMessage?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  createdAt: string;
}

// 배송 요청 타입
export interface ShippingRequest {
  trackingNumber: string;
  carrier: string;
  shippingMessage?: string;
}