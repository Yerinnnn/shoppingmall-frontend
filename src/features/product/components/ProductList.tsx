import React from 'react';
import { ProductListParams } from '../types';
import { useProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';
import ProductListSkeleton from './skeletons/ProductListSkeleton';

interface ProductListProps extends ProductListParams {}

export const ProductList: React.FC<ProductListProps> = ({
  categoryId,
  searchQuery = '',
  limit = 20,
  featured = false,
  sortBy = 'default'
}) => {
  const { products, loading, error } = useProducts({
    categoryId,
    searchQuery,
    limit,
    featured,
    sortBy
  });

  if (loading) {
    return <ProductListSkeleton />;
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