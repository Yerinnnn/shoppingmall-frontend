import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Heart, ShoppingCart, Truck } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { Product } from '../../types/product';

interface ProductDetail {
  productDetailId: number;
  content: string;
  imageUrls: string[];
  manufacturer: string;
  origin: string;
  material: string;
  size: string;
  weight: string;
  viewCount: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [addingToCart, setAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const { mutations: { addToCart } } = useCart();
  const { mutations: { addToWishlist, removeFromWishlistByProductId, checkInWishlist } } = useWishlist();

  // 위시리스트 상태 확인
  const checkWishlistStatus = useCallback(async () => {
    if (!id) return;
    
    try {
      const status = await checkInWishlist(parseInt(id));
      setIsInWishlist(status);
    } catch (error) {
      // 로그인하지 않은 상태에서는 조용히 실패
      if (error !== '로그인이 필요합니다') {
        console.error('Failed to check wishlist status:', error);
      }
    }
  }, [id, checkInWishlist]);

  useEffect(() => {
    checkWishlistStatus();
  }, [checkWishlistStatus]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, detailRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/products/${id}/detail`)
        ]);

        if (!productRes.ok || !detailRes.ok) {
          throw new Error('Failed to fetch product data');
        }

        const productData = await productRes.json();
        const detailData = await detailRes.json();

        setProduct(productData);
        setDetail(detailData);
        if (detailData.imageUrls && detailData.imageUrls.length > 0) {
          setSelectedImage(detailData.imageUrls[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

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

  const tabs = [
    { title: '상품 설명', content: () => (
      <div dangerouslySetInnerHTML={{ __html: detail?.content || '' }} />
    )},
    { title: '상세 정보', content: () => (
      <dl className="space-y-4">
        <div className="flex">
          <dt className="w-24 font-medium">제조사</dt>
          <dd>{detail?.manufacturer}</dd>
        </div>
        <div className="flex">
          <dt className="w-24 font-medium">원산지</dt>
          <dd>{detail?.origin}</dd>
        </div>
        <div className="flex">
          <dt className="w-24 font-medium">소재</dt>
          <dd>{detail?.material}</dd>
        </div>
        <div className="flex">
          <dt className="w-24 font-medium">크기</dt>
          <dd>{detail?.size}</dd>
        </div>
        <div className="flex">
          <dt className="w-24 font-medium">무게</dt>
          <dd>{detail?.weight}</dd>
        </div>
      </dl>
    )},
    { title: '배송/반품 안내', content: () => (
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <Truck className="w-5 h-5" />
          <span>배송 관련 안내사항...</span>
        </div>
      </div>
    )}
  ];

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-200 w-full h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
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
          <div className="mt-8">
            <div className="flex border-b">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 ${
                    activeTab === index
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab(index)}
                >
                  {tab.title}
                </button>
              ))}
            </div>
            <div className="py-4">
              {tabs[activeTab].content()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;