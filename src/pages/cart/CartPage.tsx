import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../../features/cart/hooks/useCart';
import CartList from '../../features/cart/components/CartList';
import CartSummary from '../../features/cart/components/CartSummary';
import EmptyCart from '../../features/cart/components/EmptyCart';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isLoading, 
    error, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCart();

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow p-8">
          <ShoppingBag className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error instanceof Error ? error.message : '장바구니를 불러오는데 실패했습니다'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    );
  }

  if (!cartItems?.length && !isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">장바구니</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartList 
            items={cartItems} 
            isLoading={isLoading}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        </div>
        <div>
          <CartSummary 
            items={cartItems} 
            onClearCart={clearCart}
          />
        </div>
      </div>
    </div>
  );
};

export default CartPage;