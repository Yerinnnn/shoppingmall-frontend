import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Order } from '../../types/order';
import { orderStatusLabels } from '../../constants/order'

interface OrderCardProps {
  order: Order;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'CANCELLED':
        return 'text-red-600 bg-red-50';
      case 'COMPLETED':
        return 'text-green-600 bg-green-50';
      case 'DELIVERED':
        return 'text-blue-600 bg-blue-50';
      case 'SHIPPING':
        return 'text-indigo-600 bg-indigo-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const mainItem = order.items[0];
  const remainingItemsCount = order.items.length - 1;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(order.createdAt), 'yyyy년 MM월 dd일')}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
          {orderStatusLabels[order.status]}
        </span>
      </div>

      <div className="border-t border-b py-4 mb-4">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/100"  // 수정
            alt={mainItem.productName}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="ml-4">
            <h4 className="font-medium">{mainItem.productName}</h4>
            <p className="text-sm text-gray-600">
              {mainItem.quantity}개 · {mainItem.price.toLocaleString()}원
            </p>
            {remainingItemsCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                외 {remainingItemsCount}개의 상품
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span className="text-sm text-gray-600">총 주문금액</span>
          <span className="ml-2 text-lg font-bold">
            {order.totalAmount.toLocaleString()}원
          </span>
        </div>
        <Link
          to={`/orders/${order.orderId}`}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          주문 상세보기
        </Link>
      </div>
    </div>
  );
};