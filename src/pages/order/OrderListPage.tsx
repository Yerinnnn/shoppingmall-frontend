import React from "react";
import { OrderList } from "../../features/order";

const OrderListPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">주문 내역</h1>
      <OrderList />
    </div>
  );
};

export default OrderListPage;
