import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { toast } from 'react-hot-toast';

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
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { mutations: { addToCart } } = useCart();
  const { mutations: { addToWishlist, removeFromWishlistByProductId, checkInWishlist } } = useWishlist();

  // 상품의 위시리스트 포함 여부 확인
  useEffect(() => {
    const checkWishlistStatus = async () => {
      try {
        const isInWishlist = await checkInWishlist(productId);
        setIsLiked(isInWishlist);
      } catch (error) {
        // 로그인하지 않은 상태에서는 조용히 실패
        if (error !== '로그인이 필요합니다') {
          console.error('Failed to check wishlist status:', error);
        }
      }
    };
    
    checkWishlistStatus();
  }, [productId, checkInWishlist]);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이벤트 방지
    if (stockQuantity === 0) return;
    
    setLoading(true);
    try {
      await addToCart({
        productId,
        quantity: 1
      });
      toast.success('장바구니에 추가되었습니다');
    } catch (error) {
      if (error === '로그인이 필요합니다') {
        toast.error('로그인이 필요한 서비스입니다');
      } else {
        toast.error('장바구니 추가에 실패했습니다');
      }
      console.error('Failed to add to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Link 이벤트 방지
    
    if (wishlistLoading) return;
    setWishlistLoading(true);
    
    try {
      if (isLiked) {
        await removeFromWishlistByProductId(productId);
        setIsLiked(false);
        toast.success('위시리스트에서 삭제되었습니다');
      } else {
        await addToWishlist(productId);
        setIsLiked(true);
        toast.success('위시리스트에 추가되었습니다');
      }
    } catch (error) {
      if (error === '로그인이 필요합니다') {
        toast.error('로그인이 필요한 서비스입니다');
      } else {
        toast.error('위시리스트 처리 중 오류가 발생했습니다');
      }
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
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
          disabled={wishlistLoading}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-500'
          } hover:scale-110 transition-transform ${
            wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Heart 
            className={`w-5 h-5 ${wishlistLoading ? 'animate-pulse' : ''}`} 
            fill={isLiked ? 'currentColor' : 'none'} 
          />
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
            onClick={handleAddToCart}
            disabled={loading || stockQuantity === 0}
            className={`p-2 rounded-lg ${
              stockQuantity === 0
                ? 'bg-gray-200 cursor-not-allowed'
                : loading
                ? 'bg-indigo-400 cursor-not-allowed'
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