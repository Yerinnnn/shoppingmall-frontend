import { useState, useEffect } from 'react';
import { Product, ProductListParams } from '../types';
import { productApi } from '../api/productApi';

export const useProducts = (params: ProductListParams) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productApi.getProducts(params);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.categoryId, params.searchQuery, params.limit, params.featured, params.sortBy]);

  return { products, loading, error };
};