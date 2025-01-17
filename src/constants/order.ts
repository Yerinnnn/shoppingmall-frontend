import { OrderStatus } from '../types/order';

export const orderStatusLabels: Record<OrderStatus, string> = {
  PENDING: '주문 대기',
  PAID: '결제 완료',
  PREPARING: '상품 준비중',
  SHIPPING: '배송중',
  DELIVERED: '배송 완료',
  COMPLETED: '구매 확정',
  CANCELLED: '주문 취소'
};

export const ORDER_STATUS_COLORS = {
  CANCELLED: 'text-red-600 bg-red-50',
  COMPLETED: 'text-green-600 bg-green-50',
  DELIVERED: 'text-blue-600 bg-blue-50',
  SHIPPING: 'text-indigo-600 bg-indigo-50',
  PENDING: 'text-gray-600 bg-gray-50',
  PAID: 'text-gray-600 bg-gray-50',
  PREPARING: 'text-gray-600 bg-gray-50',
} as const;

export const CANCELABLE_STATUSES = ['PENDING', 'PAID', 'PREPARING'] as const;
export const CONFIRMABLE_STATUSES = ['DELIVERED'] as const;

export const ERROR_MESSAGES = {
  ORDER_NOT_FOUND: '주문을 찾을 수 없습니다',
  CANCEL_FAILED: '주문 취소에 실패했습니다',
  CONFIRM_FAILED: '구매 확정에 실패했습니다',
} as const;

export const SUCCESS_MESSAGES = {
  ORDER_CANCELLED: '주문이 취소되었습니다',
  ORDER_CONFIRMED: '구매가 확정되었습니다',
} as const;