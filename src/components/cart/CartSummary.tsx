import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../types/cart';

interface CartSummaryProps {
  items: CartItem[];
  onClearCart: () => void;
}

const SHIPPING_FEE = 3000;
const FREE_SHIPPING_THRESHOLD = 50000;

const CartSummary: React.FC<CartSummaryProps> = ({ items, onClearCart }) => {
  const navigate = useNavigate();
  
  const subtotal = items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">주문 요약</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span>{subtotal.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">배송비</span>
          <span>{shippingFee.toLocaleString()}원</span>
        </div>
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="text-sm text-gray-500">
            {FREE_SHIPPING_THRESHOLD.toLocaleString()}원 이상 구매 시 무료 배송
          </div>
        )}
        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>총 결제금액</span>
            <span>{total.toLocaleString()}원</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/checkout')}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          주문하기
        </button>
        <button
          onClick={onClearCart}
          className="w-full py-3 text-gray-600 hover:text-gray-800"
        >
          장바구니 비우기
        </button>
      </div>
    </div>
  );
};

export default CartSummary;