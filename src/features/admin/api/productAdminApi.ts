import api from '../../../services/apiClient';
import { Product, ProductDetail } from '../../../types/product';

// 관리자용 상품 관리 API
export const productAdminApi = {
  // 모든 상품 목록 조회 (페이지네이션 포함)
  getAllProducts: (page: number = 0, size: number = 10, sort: string = 'createdAt, desc') => 
    api.get<Product[]>('/admin/products', { 
      params: { page, size, sort } 
    }),

  // 상품 상세 정보 조회
  getProduct: (productId: number) => 
    api.get<Product>(`/products/${productId}`),

  // 상품 상세 내용 조회
  getProductDetail: (productId: number) => 
    api.get<ProductDetail>(`/products/${productId}/detail`),

  // 새 상품 등록
  createProduct: (productData: FormData) => 
    api.post<Product>('/products', productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // 상품 정보 수정
  updateProduct: (productId: number, productData: FormData) => 
    api.put<Product>(`/products/${productId}`, productData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  // 상품 삭제
  deleteProduct: (productId: number) => 
    api.delete(`/products/${productId}`),

  // 상품 재고 수정
  updateStock: (productId: number, quantity: number) => 
    api.put(`/admin/products/${productId}/stock`, { quantity }),

  // 카테고리별 상품 조회
  getProductsByCategory: (categoryId: number, page: number = 0, size: number = 10) => 
    api.get<Product[]>(`/products/category/${categoryId}`, {
      params: { page, size }
    }),

  // 상품 검색
  searchProducts: (keyword: string, page: number = 0, size: number = 10) => 
    api.get<Product[]>('/products/search', {
      params: { keyword, page, size }
    }),
};

export default productAdminApi;