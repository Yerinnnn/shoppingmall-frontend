import React from 'react';
import { useOrder } from '../../hooks/useOrder';
import { OrderCard } from './OrderCard';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const OrderList: React.FC = () => {
  const navigate = useNavigate();
  const { queries: { useOrders } } = useOrder();
  const { data: orders, isLoading, error } = useOrders();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="border-t border-b py-4 mb-4">
                <div className="flex items-center">
                  <div className="w-20 h-20 bg-gray-200 rounded"></div>
                  <div className="ml-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-red-500 mb-4">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-lg font-medium">주문 내역을 불러오는데 실패했습니다</h3>
        </div>
        <p className="text-gray-600 mb-4">잠시 후 다시 시도해주세요.</p>
        <button
          onClick={() => window.location.reload()}
          className="text-indigo-600 hover:text-indigo-500"
        >
          새로고침
        </button>
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">주문 내역이 없습니다</h3>
        <p className="text-gray-600 mb-4">첫 주문을 시작해보세요!</p>
        <button
          onClick={() => navigate('/products')}
          className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          쇼핑하러 가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.orderId} order={order} />
      ))}
    </div>
  );
};