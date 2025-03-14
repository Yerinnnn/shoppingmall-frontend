import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import { useOrder } from "../../features/order/hooks/useOrder";
import OrderInfo from "../../features/order/components/OrderInfo";
import OrderItems from "../../features/order/components/OrderItems";
import OrderActions from "../../features/order/components/OrderActions";
import OrderDetailSkeleton from "../../features/order/components/skeletons/OrderDetailSkeleton";

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { useOrderDetail } = useOrder();
  const {
    data: order,
    isLoading,
    error,
    refetch,
  } = useOrderDetail(Number(orderId));
  // 뒤로 가기 핸들러
  const handleGoBack = () => {
    navigate("/orders");
  };
  // 새로고침 핸들러
  const handleRefresh = () => {
    refetch();
    toast.success("주문 정보가 갱신되었습니다");
  };
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>주문 목록으로</span>
        </button>
        <OrderDetailSkeleton />
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">
            주문을 찾을 수 없습니다
          </h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error
              ? error.message
              : "요청한 주문 정보를 불러올 수 없습니다."}
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              다시 시도
            </button>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              주문 목록으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={handleGoBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>주문 목록으로</span>
      </button>
      <OrderInfo order={order} />
      <OrderItems items={order.items} totalAmount={order.totalAmount} />
      <OrderActions order={order} onSuccess={handleRefresh} />
    </div>
  );
};
export default OrderDetailPage;
