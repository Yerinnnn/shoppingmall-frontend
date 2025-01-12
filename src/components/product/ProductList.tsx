import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Product } from '../../types/product';

interface ProductListProps {
  categoryId: number | null;
  searchQuery: string;
  limit?: number;
  featured?: boolean;
  sortBy?: string;
}

const ProductList: React.FC<ProductListProps> = ({
  categoryId,
  searchQuery,
  limit = 20,
  featured = false,
  sortBy = 'default'
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let url = '/api/products';
        
        if (categoryId) {
          url = `/api/products/category/${categoryId}`;
        } else if (searchQuery) {
          url = `/api/products/search?keyword=${encodeURIComponent(searchQuery)}`;
        }

        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        console.log('Fetched products:', data); // API 응답 확인
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err); // 에러 로깅
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId, searchQuery, limit, featured, sortBy]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-48 rounded-lg"></div>
            <div className="mt-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        {error}
      </div>
    );
  }

  if (!loading && products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.productId} {...product} />
      ))}
    </div>
  );
};

export default ProductList;