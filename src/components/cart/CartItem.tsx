import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { CartItem as CartItemType } from '../../types/cart';
import QuantityInput from './QuantityInput';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (cartId: number, quantity: number) => void;
  onRemove: (cartId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="p-4">
      <div className="lg:grid lg:grid-cols-6 gap-4 items-center">
        <div className="col-span-2 flex items-center">
          <img
            src={`/api/placeholder/100/100`}
            alt={item.productName}
            className="w-20 h-20 object-cover rounded"
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
        <div className="mt-4 lg:mt-0">
          {item.price.toLocaleString()}원
        </div>
        <div className="mt-4 lg:mt-0">
          <QuantityInput
            value={item.quantity}
            onChange={(quantity) => onUpdateQuantity(item.cartId, quantity)}
          />
        </div>
        <div className="mt-4 lg:mt-0 font-medium">
          {item.totalPrice.toLocaleString()}원
        </div>
        <div className="mt-4 lg:mt-0">
          <button
            onClick={() => onRemove(item.cartId)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;