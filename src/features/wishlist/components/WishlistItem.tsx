import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { WishlistItem as WishlistItemType } from '../types';
import { useCart } from '../../cart/hooks/useCart';

interface WishlistItemProps {
  item: WishlistItemType;
  onRemove: (wishlistId: number) => Promise<void>;
}

const WishlistItem: React.FC<WishlistItemProps> = ({ item, onRemove }) => {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addToCart({
        productId: item.productId,
        quantity: 1
      });
      toast.success('장바구니에 추가되었습니다');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '장바구니 추가 실패');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await onRemove(item.wishlistId);
      toast.success('위시리스트에서 삭제되었습니다');
    } catch (error) {
      toast.error('삭제에 실패했습니다');
    }
  };

  return (
    <Link
      to={`/products/${item.productId}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={`https://via.placeholder.com/100x100`}
            alt={item.productName}
            className="w-20 h-20 object-cover rounded"
          />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {item.productName}
            </h3>
            <p className="text-gray-600 mt-1">
              {item.price.toLocaleString()}원
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className={`p-2 rounded-full ${
                loading ? 'bg-gray-100' : 'hover:bg-gray-100'
              } transition-colors`}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <button
              onClick={handleRemove}
              className="p-2 hover:bg-gray-100 rounded-full text-red-500"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default WishlistItem;