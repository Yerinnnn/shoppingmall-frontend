import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductDetail from '../../features/product/components/ProductDetail';
import RecentlyViewedProducts from '../../features/product/components/RecentlyViewedProducts';
import ProductList from '../../features/product/components/ProductList';
import { useProduct } from '../../features/product/hooks/useProduct';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { product } = useProduct(id);
  
  // 최근 본 상품에 추가
  useEffect(() => {
    if (product) {
      const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      // 이미 있으면 제거 후 맨 앞에 추가 (최신 순)
      const filtered = recentlyViewed.filter((p: any) => p.productId !== product.productId);
      const newRecentlyViewed = [product, ...filtered].slice(0, 6); // 최대 6개까지만 저장
      
      localStorage.setItem('recentlyViewed', JSON.stringify(newRecentlyViewed));
    }
  }, [product]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 py-4 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">홈</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link to="/products" className="text-gray-500 hover:text-gray-700">상품</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">상품상세</span>
          </div>
        </div>
      </nav>

      {/* 상품 상세 정보 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ProductDetail />
      </div>

      {/* 추천 상품 섹션 */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">추천 상품</h2>
          <ProductList 
            categoryId={product?.categoryId || null}
            searchQuery=""
            limit={4}
            featured={true}
          />
        </div>
      </section>

      {/* 최근 본 상품 */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">최근 본 상품</h2>
          <RecentlyViewedProducts />
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;