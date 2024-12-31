import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  description, 
  imageUrl 
}) => {
  const addToCart = () => {
    // TODO: 장바구니 추가 API 호출
    console.log('Add to cart:', id);
  };

  const toggleWishlist = () => {
    // TODO: 위시리스트 추가/제거 API 호출
    console.log('Toggle wishlist:', id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link to={`/products/${id}`}>
        <img
          src={imageUrl || '/api/placeholder/400/400'}
          alt={name}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-medium truncate">{name}</h3>
          <p className="text-gray-600 mt-1">{price.toLocaleString()}원</p>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{description}</p>
        </div>
      </Link>
      <div className="px-4 pb-4 mt-2 flex justify-between items-center">
        <button 
          onClick={addToCart}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          장바구니
        </button>
        <button 
          onClick={toggleWishlist}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;