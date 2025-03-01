import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

const RecentlyViewedProducts: React.FC = () => {
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

export default RecentlyViewedProducts;