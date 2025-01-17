interface OrderPaymentSummaryProps {
  summary: {
    subtotal: number;
    shippingFee: number;
    total: number;
  };
  usePoints: number;
}

const handleOrder = async () => {
  // 주문 생성 로직
};

export const OrderPaymentSummary: React.FC<{
  summary: { subtotal: number; shippingFee: number; total: number };
  usePoints: number;
}> = ({ summary, usePoints }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h3 className="text-lg font-semibold mb-4">결제 금액</h3>
      {/* 금액 정보 표시 */}
      <button
        onClick={handleOrder}
        className="w-full py-3 bg-indigo-600 text-white rounded-lg"
      >
        결제하기
      </button>
    </div>
  );
};