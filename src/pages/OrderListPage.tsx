import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderList } from '../components/order/OrderList';
import { OrderStatus } from '../types/order';
import { orderStatusLabels } from '../constants/order'

const OrderListPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const navigate = useNavigate();

  const statuses: (OrderStatus | 'ALL')[] = ['ALL', 'PENDING', 'PAID', 'PREPARING', 'SHIPPING', 'DELIVERED', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">주문 내역</h1>
        <button
          onClick={() => navigate('/cart')}
          className="text-indigo-600 hover:text-indigo-500"
        >
          장바구니로 이동
        </button>
      </div>

      {/* 상태 필터 */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedStatus === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'ALL' ? '전체' : orderStatusLabels[status]}
          </button>
        ))}
      </div>

      {/* 주문 목록 */}
      <OrderList />
    </div>
  );
};

export default OrderListPage;