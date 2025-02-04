import React, { useState } from 'react';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import { PaymentType, PaymentSummary, PaymentResponse } from '../../types/payment';

interface OrderPaymentSummaryProps {
  orderId: string;
  orderName: string;
  summary: PaymentSummary;
  selectedPaymentType: PaymentType | null;
  selectedMethodId: number | null;
  onPaymentSuccess: (paymentKey: string) => void;
  onPaymentFail: (error: string) => void;
}

// 결제 타입별 처리 함수 타입
type PaymentHandler = () => Promise<void>;

export const OrderPaymentSummary: React.FC<OrderPaymentSummaryProps> = ({
  orderId,
  orderName,
  summary,
  selectedPaymentType,
  selectedMethodId,
  onPaymentSuccess,
  onPaymentFail
}) => {
  const [processing, setProcessing] = useState(false);

  // 토스페이먼츠 카드 결제 처리
  const handleCardPayment: PaymentHandler = async () => {
    try {
      // 결제 준비 API 호출
      const prepareResponse = await fetch(`/api/payments/prepare?orderId=${orderId}&amount=${summary.total}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          orderId,
          amount: summary.total,
          paymentMethodId: selectedMethodId === -1 ? null : selectedMethodId
        })
      });

      console.log(prepareResponse.json)

      if (!prepareResponse.ok) {
        throw new Error('결제 준비에 실패했습니다.');
      }

      const { clientKey } = await prepareResponse.json();

      // 토스페이먼츠 SDK 초기화
      const tossPayments = await loadTossPayments(clientKey);

      // 결제 요청
      const paymentResult = await tossPayments.requestPayment('카드', {
        amount: summary.total,
        orderId: orderId,
        orderName: orderName,
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
      }) as unknown as PaymentResponse;

      // 결제 성공 처리
      if ((paymentResult as PaymentResponse).paymentKey) {
        onPaymentSuccess((paymentResult as PaymentResponse).paymentKey);
      }
    } catch (error) {
      console.error('Card payment failed:', error);
      onPaymentFail(error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.');
    }
  };

  // 가상계좌 결제 처리
  const handleVirtualAccountPayment: PaymentHandler = async () => {
    try {
      const response = await fetch('/api/payments/virtual-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          orderId,
          amount: summary.total
        })
      });

      if (!response.ok) {
        throw new Error('가상계좌 발급에 실패했습니다.');
      }

      const result = await response.json();
      onPaymentSuccess(result.paymentKey);
    } catch (error) {
      console.error('Virtual account payment failed:', error);
      onPaymentFail(error instanceof Error ? error.message : '가상계좌 발급 중 오류가 발생했습니다.');
    }
  };

  // 일반 결제 처리
  const handleNormalPayment: PaymentHandler = async () => {
    try {
      const response = await fetch('/api/payments/normal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          orderId,
          amount: summary.total
        })
      });

      if (!response.ok) {
        throw new Error('결제 처리에 실패했습니다.');
      }

      const result = await response.json();
      onPaymentSuccess(result.paymentKey);
    } catch (error) {
      console.error('Normal payment failed:', error);
      onPaymentFail(error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.');
    }
  };

  // 결제 실행
  const handlePayment = async () => {
    if (!selectedPaymentType) {
      onPaymentFail('결제 방식을 선택해주세요.');
      return;
    }

    // if (selectedPaymentType === PaymentType.CARD && selectedMethodId === null) {
    //   onPaymentFail('결제 수단을 선택해주세요.');
    //   return;
    // }

    setProcessing(true);

    try {
      switch (selectedPaymentType) {
        case PaymentType.CARD:
          await handleCardPayment();
          break;
        case PaymentType.VIRTUAL:
          await handleVirtualAccountPayment();
          break;
        case PaymentType.NORMAL:
          await handleNormalPayment();
          break;
        default:
          throw new Error('지원하지 않는 결제 방식입니다.');
      }
    } catch (error) {
      onPaymentFail(error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  // 결제수단이 선택되지 않은 경우
  const isPaymentDisabled = !selectedPaymentType;
  //  || 
  //   (selectedPaymentType === PaymentType.CARD && selectedMethodId === null);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h3 className="text-lg font-semibold mb-4">결제 정보</h3>
      
      {/* 금액 정보 */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>상품 금액</span>
          <span>{summary.subtotal.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>배송비</span>
          <span>{summary.shippingFee.toLocaleString()}원</span>
        </div>
        {summary.discount > 0 && (
          <div className="flex justify-between text-red-500">
            <span>할인 금액</span>
            <span>-{summary.discount.toLocaleString()}원</span>
          </div>
        )}
        {summary.pointsUsed > 0 && (
          <div className="flex justify-between text-blue-500">
            <span>포인트 사용</span>
            <span>-{summary.pointsUsed.toLocaleString()}P</span>
          </div>
        )}
        <div className="border-t pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>최종 결제 금액</span>
            <span>{summary.total.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 결제 버튼 */}
      <button
        onClick={handlePayment}
        disabled={isPaymentDisabled || processing}
        className={`w-full py-3 rounded-lg transition-colors ${
          isPaymentDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : processing
            ? 'bg-indigo-400 text-white cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {processing 
          ? '결제 처리 중...' 
          : isPaymentDisabled 
            ? '결제수단을 선택해주세요' 
            : '결제하기'
        }
      </button>

      {/* 결제 금액에 대한 동의 문구 */}
      <p className="mt-4 text-sm text-gray-500 text-center">
        위 주문 내용을 확인하였으며,<br />
        결제 진행에 동의합니다.
      </p>
    </div>
  );
};