import { useState, useEffect } from 'react';
import { Product, ProductDetail } from '../types';
import { productApi } from '../api/productApi';

export const useProduct = (id: string | number | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [detail, setDetail] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [productData, detailData] = await Promise.all([
          productApi.getProductById(id),
          productApi.getProductDetailById(id)
        ]);
        
        setProduct(productData);
        setDetail(detailData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  return { product, detail, loading, error };
};