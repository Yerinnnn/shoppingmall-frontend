import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Heart, ShoppingCart, Truck } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../../cart/hooks/useCart';
import { useWishlist } from '../../wishlist/hooks/useWishlist';
import ProductDetailSkeleton from './skeletons/ProductDetailSkeleton';
import ProductDetailTabs from './ProductDetailTabs';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product, detail, loading, error } = useProduct(id);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlistByProductId, checkInWishlist } = useWishlist();

  // 위시리스트 상태 확인
  React.useEffect(() => {
    if (!id) return;
    
    const checkWishlistStatus = async () => {
      try {
        const status = await checkInWishlist(parseInt(id));
        setIsInWishlist(status);
      } catch (error) {
        if (error !== '로그인이 필요합니다') {
          console.error('Failed to check wishlist status:', error);
        }
      }
    };

    checkWishlistStatus();
  }, [id, checkInWishlist]);

  // 상품 이미지 선택
  React.useEffect(() => {
    if (detail?.imageUrls && detail.imageUrls.length > 0) {
      setSelectedImage(detail.imageUrls[0]);
    }
  }, [detail]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = async () => {
    if (!product || addingToCart) return;
    
    setAddingToCart(true);
    try {
      await addToCart({
        productId: product.productId,
        quantity: quantity
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
      setAddingToCart(false);
    }
  };

  const toggleWishlist = async () => {
    if (wishlistLoading || !id) return;
    
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await removeFromWishlistByProductId(parseInt(id));
        setIsInWishlist(false);
        toast.success('위시리스트에서 삭제되었습니다');
      } else {
        await addToWishlist(parseInt(id));
        setIsInWishlist(true);
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

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error || !product || !detail) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-600">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 상품 이미지 섹션 */}
        <div>
          <img
            src={selectedImage || '/api/placeholder/600/600'}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          <div className="grid grid-cols-4 gap-2 mt-4">
            {detail.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`${product.name} ${index + 1}`}
                className={`w-full h-24 object-cover rounded-lg cursor-pointer ${
                  selectedImage === url ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        </div>

        {/* 상품 정보 섹션 */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-gray-900">
            {product.price.toLocaleString()}원
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="quantity" className="text-gray-700">수량</label>
              <select
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                className="border rounded-md py-2 px-4"
                disabled={product.stockQuantity === 0}
              >
                {[...Array(Math.min(10, product.stockQuantity))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || product.stockQuantity === 0}
                className={`flex-1 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 ${
                  product.stockQuantity === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : addingToCart
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } text-white transition-colors`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {product.stockQuantity === 0
                    ? '품절'
                    : addingToCart
                    ? '담는 중...'
                    : '장바구니 담기'}
                </span>
              </button>
              <button
                onClick={toggleWishlist}
                disabled={wishlistLoading}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  isInWishlist 
                    ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart 
                  className={`w-5 h-5 ${wishlistLoading ? 'animate-pulse' : ''}`}
                  fill={isInWishlist ? 'currentColor' : 'none'} 
                />
              </button>
            </div>

            {/* 재고 상태 표시 */}
            <div className="text-sm">
              {product.stockQuantity > 0 ? (
                <span className="text-green-600">
                  재고 {product.stockQuantity}개 남음
                </span>
              ) : (
                <span className="text-red-600">품절</span>
              )}
            </div>
          </div>

          {/* 상세 정보 탭 */}
          <ProductDetailTabs product={product} detail={detail} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;