import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import QuantityInput from './QuantityInput';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (cartId: number, quantity: number) => void;
  onRemove: (cartId: number) => void;
  disabled?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  disabled = false
}) => {
  const handleQuantityChange = (quantity: number) => {
    onUpdateQuantity(item.cartId, quantity);
  };
  
  const handleRemove = () => {
    onRemove(item.cartId);
  };

  return (
    <div className="p-4">
      <div className="lg:grid lg:grid-cols-6 gap-4 items-center">
        {/* 상품 정보 */}
        <div className="col-span-2 flex items-center">
          <img
            src={`https://via.placeholder.com/100x100`}
            alt={item.productName}
            className="w-20 h-20 object-cover rounded"
            loading="lazy"
          />
          <div className="ml-4">
            <Link
              to={`/products/${item.productId}`}
              className="text-lg font-medium hover:text-indigo-600"
            >
              {item.productName}
            </Link>
          </div>
        </div>
        
        {/* 가격 */}
        <div className="mt-4 lg:mt-0">
          {item.price.toLocaleString()}원
        </div>
        
        {/* 수량 */}
        <div className="mt-4 lg:mt-0">
          <QuantityInput
            value={item.quantity}
            onChange={handleQuantityChange}
            disabled={disabled}
          />
        </div>
        
        {/* 총 금액 */}
        <div className="mt-4 lg:mt-0 font-medium">
          {item.totalPrice.toLocaleString()}원
        </div>
        
        {/* 삭제 버튼 */}
        <div className="mt-4 lg:mt-0">
          <button
            onClick={handleRemove}
            disabled={disabled}
            className={`p-2 rounded-full ${
              disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label="상품 삭제"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;