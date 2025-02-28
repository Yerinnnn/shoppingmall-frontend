import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

export const EmptyCart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow p-8">
      <ShoppingBag className="w-16 h-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold mb-2">장바구니가 비어있습니다</h2>
      <p className="text-gray-600 mb-4">원하는 상품을 장바구니에 담아보세요!</p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        쇼핑 계속하기
      </button>
    </div>
  );
};

export default EmptyCart;