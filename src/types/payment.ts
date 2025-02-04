// 결제 수단 타입 정의
export enum PaymentType {
    CARD = 'CARD',          // 카드결제/간편결제
    VIRTUAL = 'VIRTUAL',    // 무통장입금
    NORMAL = 'NORMAL'       // 일반결제
  }
  
  // 저장된 결제수단 인터페이스
  export interface PaymentMethod {
    paymentMethodId: number;
    paymentType: string;
    cardNumber: string;
    expiryDate: string;
    isDefault: boolean;
  }
  
  // 결제 요약 정보 인터페이스
  export interface PaymentSummary {
    subtotal: number;       // 상품 금액
    shippingFee: number;    // 배송비
    discount: number;       // 할인 금액
    pointsUsed: number;     // 사용 포인트
    total: number;         // 최종 결제 금액
  }
  
  // 결제 응답 인터페이스
  export interface PaymentResponse {
    paymentKey: string;
    orderId: string;
    amount: number;
  }
  
  // 결제 상태 인터페이스
  export interface PaymentStatus {
    processing: boolean;
    error: string | null;
    success: boolean;
  }