import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useOrder } from '../hooks/useOrder';
import { OrderInfo } from '../components/order/OrderInfo';
import { OrderItems } from '../components/order/OrderItems';
import { OrderActions } from '../components/order/OrderActions';

const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { queries: { useOrderDetail } } = useOrder();
  const { data: order, isLoading, error } = useOrderDetail(Number(orderId));

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 h-48"></div>
          <div className="bg-white rounded-lg shadow-sm p-6 h-64"></div>
          <div className="h-10 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">주문을 찾을 수 없습니다</h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-indigo-600 hover:text-indigo-500"
          >
            주문 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/orders')}
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