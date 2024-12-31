import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  stockQuantity: number;
  categoryName: string;
}

interface ProductGridProps {
  categoryId?: number | null;
  searchQuery?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ categoryId, searchQuery }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [categoryId, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let url = '/api/products';
      if (categoryId) {
        url = `/api/products/category/${categoryId}`;
      } else if (searchQuery) {
        url = `/api/products/search?keyword=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

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

  if (products.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        상품이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          id={product.productId}
          name={product.name}
          price={product.price}
          description={product.description}
        />
      ))}
    </div>
  );
};

export default ProductGrid;