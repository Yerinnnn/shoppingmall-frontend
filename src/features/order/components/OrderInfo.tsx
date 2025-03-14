import React from 'react';
import { format } from 'date-fns';
import { Order } from '../types';
import { ORDER_STATUS_COLORS, orderStatusLabels } from '../constants';

interface OrderInfoProps {
  order: Order;
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => {
  const statusColor = ORDER_STATUS_COLORS[order.status];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-sm text-gray-500">주문번호</span>
          <h2 className="text-xl font-bold">{order.orderNumber}</h2>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}>
          {orderStatusLabels[order.status]}
        </span>
      </div>
      
      <div className="border-t pt-4">
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-sm text-gray-500">주문일시</dt>
            <dd className="mt-1">
              {format(new Date(order.createdAt), 'yyyy년 MM월 dd일 HH:mm')}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">결제수단</dt>
            <dd className="mt-1">{order.paymentMethod}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-sm text-gray-500">배송주소</dt>
            <dd className="mt-1">{order.deliveryAddress}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default OrderInfo;