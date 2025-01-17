import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderForm } from '../components/order/OrderForm';
import { OrderItems } from '../components/order/OrderItems';
import { OrderPaymentSummary } from '../components/order/OrderPaymentSummary';
import { CartItem } from '../types/cart';
import { OrderItem } from '../types/order';

interface LocationState {
  cartItems: CartItem[];
  summary: {
    subtotal: number;
    shippingFee: number;
    total: number;
  };
}

const OrderCreatePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, summary } = (location.state as LocationState) || {
    cartItems: [],
    summary: { subtotal: 0, shippingFee: 0, total: 0 }
  };

  const convertCartItemsToOrderItems = (cartItems: CartItem[]): OrderItem[] => {
    return cartItems.map(item => ({
      orderItemId: item.cartId, // 임시로 cartId 사용
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.totalPrice
    }));
  };

  const orderItems = convertCartItemsToOrderItems(cartItems);

  useEffect(() => {
    if (!cartItems?.length) {
      alert('잘못된 접근입니다.');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">주문/결제</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <OrderItems 
            items={orderItems} 
            totalAmount={summary.total || 0}  // undefined 방지
          />
          <OrderForm />
        </div>
        <div>
          <OrderPaymentSummary
            summary={summary}
            usePoints={0}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderCreatePage;