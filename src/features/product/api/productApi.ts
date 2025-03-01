import { apiClient } from '../../../services/apiClient';
import { Product, ProductDetail, Category, ProductListParams } from '../types';

const PRODUCT_API_URL = '/products';
const CATEGORY_API_URL = '/categories';

export const productApi = {
  // 상품 목록 조회
  getProducts: async (params: ProductListParams): Promise<Product[]> => {
    let url = PRODUCT_API_URL;
    
    if (params.categoryId) {
      url = `${PRODUCT_API_URL}/category/${params.categoryId}`;
    } else if (params.searchQuery) {
      url = `${PRODUCT_API_URL}/search?keyword=${encodeURIComponent(params.searchQuery)}`;
    }
    
    const response = await apiClient.get<Product[]>(url);
    return response.data;
  },
  
  // 상품 상세 조회
  getProductById: async (id: string | number): Promise<Product> => {
    const response = await apiClient.get<Product>(`${PRODUCT_API_URL}/${id}`);
    return response.data;
  },
  
  // 상품 상세 정보 조회
  getProductDetailById: async (id: string | number): Promise<ProductDetail> => {
    const response = await apiClient.get<ProductDetail>(`${PRODUCT_API_URL}/${id}/detail`);
    return response.data;
  },
  
  // 카테고리 목록 조회
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>(CATEGORY_API_URL);
    return response.data;
  }
};