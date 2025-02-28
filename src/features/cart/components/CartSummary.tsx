import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../types';

interface CartSummaryProps {
  items: CartItem[];
  onClearCart: () => void;
  disabled?: boolean;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ 
  items, 
  onClearCart,
  disabled = false
}) => {
  const navigate = useNavigate();
  
  const FREE_SHIPPING_THRESHOLD = 50000;
  const SHIPPING_FEE = 3000;
  
  const subtotal = items?.reduce((sum, item) => sum + item.totalPrice, 0) || 0;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const handleOrderClick = () => {
    // 장바구니가 비어있는 경우 처리
    if (!items?.length) {
      alert('장바구니에 상품을 담아주세요.');
      return;
    }

    // 주문 생성 페이지로 이동하면서 장바구니 데이터 전달
    navigate('/orders/new', {
      state: {
        cartItems: items,
        summary: {
          subtotal,
          shippingFee,
          total
        }
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">주문 요약</h2>
      <div className="space-y-4">
        {/* 상품 금액 */}
        <div className="flex justify-between">
          <span className="text-gray-600">상품 금액</span>
          <span>{subtotal.toLocaleString()}원</span>
        </div>
        
        {/* 배송비 */}
        <div className="flex justify-between">
          <span className="text-gray-600">배송비</span>
          <span>{shippingFee.toLocaleString()}원</span>
        </div>
        
        {/* 무료 배송 안내 */}
        {subtotal < FREE_SHIPPING_THRESHOLD && (
          <div className="text-sm text-gray-500">
            {FREE_SHIPPING_THRESHOLD.toLocaleString()}원 이상 구매 시 무료 배송
          </div>
        )}
        
        {/* 총 결제 금액 */}
        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>총 결제금액</span>
            <span>{total.toLocaleString()}원</span>
          </div>
        </div>
        
        {/* 주문 버튼 */}
        <button
          onClick={handleOrderClick}
          disabled={disabled || !items?.length}
          className={`w-full py-3 rounded-lg ${
            disabled || !items?.length
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          주문하기
        </button>
        
        {/* 장바구니 비우기 버튼 */}
        <button
          onClick={onClearCart}
          disabled={disabled || !items?.length}
          className={`w-full py-3 ${
            disabled || !items?.length
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          장바구니 비우기
        </button>
      </div>
    </div>
  );
};

export default CartSummary;