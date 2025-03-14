import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Order } from "../types";
import { orderStatusLabels, ORDER_STATUS_COLORS } from "../constants";

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  // 상태에 따른 색상 가져오기
  const getStatusColor = (status: Order["status"]) =>
    ORDER_STATUS_COLORS[status];

  const mainItem = order.items[0];
  const remainingItemsCount = order.items.length - 1;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{order.orderNumber}</h3>
          <p className="text-sm text-gray-500">
            {format(new Date(order.createdAt), "yyyy년 MM월 dd일")}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {orderStatusLabels[order.status]}
        </span>
      </div>

      <div className="border-t border-b py-4 mb-4">
        <div className="flex items-center">
          <img
            src="https://via.placeholder.com/100x100" // 외부 이미지 서비스 사용
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

export default OrderCard;
