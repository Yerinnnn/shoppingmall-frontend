export interface Product {
  productId: number;
  name: string;
  price: number;
  description: string;
  stockQuantity: number;
  categoryName: string;
  createdAt: string;
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
  updatedAt: string;
  createdAt: string;
}

export interface Category {
  categoryId: number;
  name: string;
  description: string;
  productCount: number;
}

export interface CartItem {
  productId: number;
  quantity: number;
}