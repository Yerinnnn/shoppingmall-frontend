export interface Product {
    productId: number;
    name: string;
    price: number;
    description: string;
    stockQuantity: number;
    categoryName: string;
    categoryId?: number;
  }
  
  export interface ProductDetail {
    productDetailId: number;
    content: string;
    imageUrls: string[];
    manufacturer: string;
    origin: string;
    material: string;
    size: string;
    weight: string;
    viewCount: number;
  }
  
  export interface Category {
    categoryId: number;
    name: string;
    description?: string;
    productCount: number;
  }
  
  export interface ProductListParams {
    categoryId?: number | null;
    searchQuery?: string;
    limit?: number;
    featured?: boolean;
    sortBy?: string;
  }
  
  export interface ProductFilterOptions {
    categoryId: number | null;
    searchQuery: string;
  }