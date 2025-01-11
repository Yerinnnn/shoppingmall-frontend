import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductDetail from '../components/product/ProductDetail';
import ProductList from '../components/product/ProductList';

interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  stockQuantity: number;
  categoryName: string;
}

const ProductDetailPage = () => {
  const { id } = useParams();
  
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
            categoryId={null}
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

// 최근 본 상품 컴포넌트
const RecentlyViewedProducts = () => {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    // 로컬 스토리지에서 최근 본 상품 정보 가져오기
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentProducts(recentlyViewed);
  }, []);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {recentProducts.map(product => (
        <Link 
          key={product.productId} 
          to={`/products/${product.productId}`}
          className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <img
            src="/api/placeholder/200/200"
            alt={product.name}
            className="w-full h-32 object-cover rounded-md"
          />
          <h3 className="mt-2 text-sm font-medium text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {product.price.toLocaleString()}원
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ProductDetailPage;