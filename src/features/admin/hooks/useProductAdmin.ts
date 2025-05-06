import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productAdminApi } from '../api/productAdminApi';
import { Product, ProductDetail } from '../../../types/product';
import { AdminProduct, AdminProductDetail } from '../../../types/admin';
import { useNavigate } from 'react-router-dom';

interface ProductListParams {
  page?: number;
  size?: number;
  sort?: string;
  categoryId?: number;
  keyword?: string;
}

/**
 * 관리자용 상품 관리 기능을 위한 커스텀 훅
 */
export const useProductAdmin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 상품 목록 조회 쿼리
  const useProductList = (params: ProductListParams = {}) => {
    const { page = 0, size = 10, sort = 'createdAt,desc', categoryId, keyword } = params;
    
    const queryFn = () => {
      if (keyword) {
        return productAdminApi.searchProducts(keyword, page, size);
      }
      if (categoryId) {
        return productAdminApi.getProductsByCategory(categoryId, page, size);
      }
      return productAdminApi.getAllProducts(page, size, sort);
    };

    return useQuery<Product[]>({
      queryKey: ['admin', 'products', { page, size, sort, categoryId, keyword }],
      queryFn
    });
  };

  // 상품 상세 정보 조회 쿼리
  const useProductDetail = (productId: number | null) => {
    return useQuery<Product>({
      queryKey: ['admin', 'product', productId],
      queryFn: () => productAdminApi.getProduct(productId as number),
      enabled: !!productId,
    });
  };

  // 상품 상세 내용 조회 쿼리
  const useProductContent = (productId: number | null) => {
    return useQuery<ProductDetail>({
      queryKey: ['admin', 'productDetail', productId],
      queryFn: () => productAdminApi.getProductDetail(productId as number),
      enabled: !!productId,
    });
  };

  // 상품 생성 뮤테이션
  const createProductMutation = useMutation({
    mutationFn: (productData: FormData) => productAdminApi.createProduct(productData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      navigate(`/admin/products/${data.productId}`);
    },
  });

  // 상품 수정 뮤테이션
  const updateProductMutation = useMutation({
    mutationFn: ({ productId, productData }: { productId: number; productData: FormData }) => 
      productAdminApi.updateProduct(productId, productData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', data.productId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'productDetail', data.productId] });
    },
  });

  // 상품 삭제 뮤테이션
  const deleteProductMutation = useMutation({
    mutationFn: (productId: number) => productAdminApi.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      navigate('/admin/products');
    },
  });

  // 상품 재고 수정 뮤테이션
  const updateStockMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) => 
      productAdminApi.updateStock(productId, quantity),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'product', variables.productId] });
    },
  });

  return {
    // 쿼리 훅
    useProductList,
    useProductDetail,
    useProductContent,
    
    // 뮤테이션 함수
    createProduct: createProductMutation.mutate,
    updateProduct: updateProductMutation.mutate,
    deleteProduct: deleteProductMutation.mutate,
    updateStock: updateStockMutation.mutate,
    
    // 뮤테이션 상태
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isUpdatingStock: updateStockMutation.isPending,
    
    // 에러 상태
    createError: createProductMutation.error,
    updateError: updateProductMutation.error,
    deleteError: deleteProductMutation.error,
    updateStockError: updateStockMutation.error,
  };
};

export default useProductAdmin;