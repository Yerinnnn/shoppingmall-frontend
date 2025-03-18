import React, { useState } from "react";
import { loadTossPayments } from "@tosspayments/payment-sdk";
import {
  PaymentType,
  PaymentSummary,
  PaymentResponse,
} from "../../../types/payment";
import api from "../../../services/apiClient";
import { useOrder } from "../hooks/useOrder";
import { CartItem } from "../../cart/types"

// 응답 타입 정의
interface PreparePaymentResponse {
  clientKey: string;
}

interface PaymentResult {
  paymentKey: string;
}

interface OrderPaymentSummaryProps {
  orderId: string;
  orderName: string;
  summary: PaymentSummary;
  selectedPaymentType: PaymentType | null;
  selectedMethodId: number | null;
  onPaymentSuccess: (paymentKey: string) => void;
  onPaymentFail: (error: string) => void;
}

const OrderPaymentSummary: React.FC<OrderPaymentSummaryProps> = ({
  orderId,
  orderName,
  summary,
  selectedPaymentType,
  selectedMethodId,
  onPaymentSuccess,
  onPaymentFail,
}) => {
  const [processing, setProcessing] = useState(false);
  const { useCreateOrder } = useOrder();
  const createOrderMutation = useCreateOrder();

  // 결제 처리 함수들
  const paymentHandlers = {
    // 카드결제
    [PaymentType.CARD]: async (createdOrderId: string) => {
      try {
        console.log("Preparing payment for order:", createdOrderId);
        // 결제 준비 API 호출 - 타입 지정
        const prepareResponse = await api.post<PreparePaymentResponse>(
          `/payments/prepare`,
          {
            orderId: createdOrderId,
            amount: summary.total,
            paymentMethodId: selectedMethodId === -1 ? null : selectedMethodId,
          }
        );

        // 타입 안전한 속성 접근
        const clientKey = prepareResponse.clientKey;
        console.log("Payment preparation successful, client key received:", clientKey);

        // 토스페이먼츠 SDK 초기화
        const tossPayments = await loadTossPayments(clientKey);
        console.log("Toss Payments SDK loaded successfully");

        // 브라우저 주소
        const currentOrigin = window.location.origin;

        // 결제 요청 - 리다이렉트 방식으로 설정
        await tossPayments.requestPayment("카드", {
          amount: summary.total,
          orderId: createdOrderId,
          orderName: orderName,
          // 백엔드 엔드포인트가 아닌 프론트엔드 경로로 리다이렉트
          successUrl: `${currentOrigin}/payments/success`,
          failUrl: `${currentOrigin}/payments/fail`,
        });

        // 리다이렉트가 일어나므로 아래 코드는 실행되지 않음
        console.log("This code will not run due to redirect");
      } catch (error) {
        console.error("Card payment failed:", error);
        onPaymentFail(
          error instanceof Error
            ? error.message
            : "결제 처리 중 오류가 발생했습니다."
        );
      }
    },

    // 가상계좌 결제
    [PaymentType.VIRTUAL]: async (createdOrderId: string) => {
      try {
        const result = await api.post<PaymentResult>(
          "/payments/virtual-account",
          {
            orderId: createdOrderId,
            amount: summary.total,
          }
        );
        onPaymentSuccess(result.paymentKey);
      } catch (error) {
        console.error("Virtual account payment failed:", error);
        onPaymentFail(
          error instanceof Error
            ? error.message
            : "가상계좌 발급 중 오류가 발생했습니다."
        );
      }
    },

    // 일반 결제
    [PaymentType.NORMAL]: async (createdOrderId: string) => {
      try {
        const result = await api.post<PaymentResult>("/payments/normal", {
          orderId: createdOrderId,
          amount: summary.total,
        });
        onPaymentSuccess(result.paymentKey);
      } catch (error) {
        console.error("Normal payment failed:", error);
        onPaymentFail(
          error instanceof Error
            ? error.message
            : "결제 처리 중 오류가 발생했습니다."
        );
      }
    },
  };

  // 결제 실행
  const handlePayment = async () => {
    if (!selectedPaymentType) {
      onPaymentFail('결제 방식을 선택해주세요.');
      return;
    }

    setProcessing(true);

    try {
      console.log(`Starting ${selectedPaymentType} payment process`);
      
      // 1. 먼저 주문 생성 (PENDING 상태)
      const createdOrder = await createOrderMutation.mutateAsync({
        deliveryAddressId: selectedMethodId || 0,
        paymentMethodId: selectedMethodId || -1,
        usePoints: summary.pointsUsed,
        items: JSON.parse(localStorage.getItem('cartItems') || '[]').map((item: CartItem) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });
      
      console.log("Order created successfully:", createdOrder);
      
      // 2. 생성된 주문 ID로 결제 처리
      const createdOrderId = createdOrder.orderId?.toString() || orderId;
      console.log("Using orderID for payment:", createdOrderId);
      
      // 3. 결제 방식에 따른 핸들러 실행
      const handler = paymentHandlers[selectedPaymentType];
      if (!handler) {
        throw new Error('지원하지 않는 결제 방식입니다.');
      }
      
      await handler(createdOrderId);
      
    } catch (error) {
      console.error("Payment process failed:", error);
      onPaymentFail(error instanceof Error ? error.message : '결제 처리 중 오류가 발생했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  // 결제수단이 선택되지 않은 경우
  const isPaymentDisabled = !selectedPaymentType;

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
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : processing
            ? "bg-indigo-400 text-white cursor-not-allowed"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
      >
        {processing
          ? "결제 처리 중..."
          : isPaymentDisabled
          ? "결제수단을 선택해주세요"
          : "결제하기"}
      </button>

      {/* 결제 금액에 대한 동의 문구 */}
      <p className="mt-4 text-sm text-gray-500 text-center">
        위 주문 내용을 확인하였으며,
        <br />
        결제 진행에 동의합니다.
      </p>
    </div>
  );
};

export default OrderPaymentSummary;