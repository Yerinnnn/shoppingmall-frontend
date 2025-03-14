import React from "react";
import { Link } from "react-router-dom";
import { OrderItem } from "../types";

interface OrderItemsProps {
  items: OrderItem[];
  totalAmount: number;
}

const OrderItems: React.FC<OrderItemsProps> = ({ items, totalAmount }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">주문 상품</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.orderItemId}
            className="flex items-center py-4 border-b last:border-b-0"
          >
            <img
              src="https://via.placeholder.com/80x80" // 외부 이미지 서비스 사용
              alt={item.productName}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="ml-4 flex-grow">
              <Link
                to={`/products/${item.productId}`}
                className="text-lg font-medium hover:text-indigo-600"
              >
                {item.productName}
              </Link>
              <div className="text-sm text-gray-600 mt-1">
                {item.quantity}개
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">{item.price.toLocaleString()}원</div>
              <div className="text-sm text-gray-600 mt-1">
                총 {item.subtotal.toLocaleString()}원
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 총 금액 */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center text-lg font-bold">
          <span>총 결제금액</span>
          <span>{totalAmount.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
};

export default OrderItems;
