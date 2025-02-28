import React from 'react';
import { CartItem as CartItemType } from '../types';
import CartItem from './CartItem';
import CartSkeleton from './skeletons/CartSkeleton';

interface CartListProps {
  items: CartItemType[];
  isLoading: boolean;
  onUpdateQuantity: (cartId: number, quantity: number) => void;
  onRemove: (cartId: number) => void;
  disabled?: boolean;
}

export const CartList: React.FC<CartListProps> = ({ 
  items, 
  isLoading, 
  onUpdateQuantity,
  onRemove,
  disabled = false
}) => {
  if (isLoading) {
    return <CartSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* 테이블 헤더 (데스크톱) */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4 p-4 border-b text-sm font-medium text-gray-500">
        <div className="col-span-2">상품정보</div>
        <div>가격</div>
        <div>수량</div>
        <div>총 금액</div>
        <div>삭제</div>
      </div>
      
      {/* 장바구니 아이템 목록 */}
      <div className="divide-y">
        {items.map((item) => (
          <CartItem 
            key={item.cartId} 
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default CartList;