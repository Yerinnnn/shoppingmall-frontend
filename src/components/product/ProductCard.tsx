import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';

export interface ProductCardProps {
  productId: number;
  name: string;
  price: number;
  description: string;
  stockQuantity: number;
  categoryName: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  productId,
  name,
  price,
  description,
  stockQuantity,
  categoryName
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이벤트 방지
    setLoading(true);
    try {
      // TODO: 장바구니 API 연동
      console.log('Added to cart:', productId);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이벤트 방지
    setIsLiked(!isLiked);
    // TODO: 위시리스트 API 연동
    console.log('Toggled wishlist:', productId);
  };

  return (
    <Link
      to={`/products/${productId}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="relative">
        <img
          src="/api/placeholder/400/300"
          alt={name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        {stockQuantity === 0 && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">품절</span>
          </div>
        )}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-500'
          } hover:scale-110 transition-transform`}
        >
          <Heart className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-1 text-sm text-gray-500">{categoryName}</div>
        <h3 className="text-lg font-medium text-gray-900 truncate">{name}</h3>
        <p className="mt-1 text-gray-500 text-sm line-clamp-2">{description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {price.toLocaleString()}원
          </span>
          <button
            onClick={addToCart}
            disabled={loading || stockQuantity === 0}
            className={`p-2 rounded-lg ${
              stockQuantity === 0
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white transition-colors`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;