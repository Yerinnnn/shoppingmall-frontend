import React from 'react';
import CartItem from './CartItem';
import CartSkeleton from './CartSkeleton';
import { CartItem as CartItemType } from '../../types/cart';

interface CartListProps {
  items: CartItemType[];
  isLoading: boolean;
  onUpdateQuantity: (cartId: number, quantity: number) => void;
  onRemove: (cartId: number) => void;
}

const CartList: React.FC<CartListProps> = ({ 
  items, 
  isLoading, 
  onUpdateQuantity,
  onRemove 
}) => {
  if (isLoading) {
    return <CartSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="hidden lg:grid lg:grid-cols-6 gap-4 p-4 border-b text-sm font-medium text-gray-500">
        <div className="col-span-2">상품정보</div>
        <div>가격</div>
        <div>수량</div>
        <div>총 금액</div>
        <div>삭제</div>
      </div>
      <div className="divide-y">
        {items.map((item) => (
          <CartItem 
            key={item.cartId} 
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
};

export default CartList;