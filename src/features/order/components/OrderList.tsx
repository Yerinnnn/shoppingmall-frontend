import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import OrderCard from './OrderCard';
import OrderListSkeleton from './skeletons/OrderListSkeleton';
import { useOrder } from '../hooks/useOrder';

// 리스트 빈 상태 컴포넌트
const EmptyOrderList = ({ onNavigateToProducts }: { onNavigateToProducts: () => void }) => (
  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
    <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
    <h3 className="text-lg font-medium mb-2">주문 내역이 없습니다</h3>
    <p className="text-gray-600 mb-4">첫 주문을 시작해보세요!</p>
    <button
      onClick={onNavigateToProducts}
      className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
    >
      쇼핑하러 가기
    </button>
  </div>
);

// 에러 상태 컴포넌트
const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
    <div className="text-red-500 mb-4">
      <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
      <h3 className="text-lg font-medium">주문 내역을 불러오는데 실패했습니다</h3>
    </div>
    <p className="text-gray-600 mb-4">잠시 후 다시 시도해주세요.</p>
    <button
      onClick={onRetry}
      className="text-indigo-600 hover:text-indigo-500"
    >
      새로고침
    </button>
  </div>
);

const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const { useOrderList } = useOrder();
  const { data: orders, isLoading, error, refetch } = useOrderList();

  const handleNavigateToProducts = () => navigate('/products');

  if (isLoading) {
    return <OrderListSkeleton itemCount={3} />;
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  if (!orders?.length) {
    return <EmptyOrderList onNavigateToProducts={handleNavigateToProducts} />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.orderId} order={order} />
      ))}
    </div>
  );
};

export default OrderList;