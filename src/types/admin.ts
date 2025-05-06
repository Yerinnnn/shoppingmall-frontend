import { OrderStatus } from './order';
import { ShippingStatus } from './shipping';
import { Product, ProductDetail } from './product';

// 대시보드 요약 정보 타입
export interface DashboardSummary {
  totalSales: number;
  totalOrders: number;
  newCustomers: number;
  pendingOrders: number;
  productsOutOfStock: number;
}

// 대시보드의 최근 주문 타입
export interface RecentOrder {
  orderId: number;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

// 재고 부족 상품 타입
export interface LowStockProduct {
  productId: number;
  name: string;
  stockQuantity: number;
  threshold: number;
  price: number;
  categoryName: string;
}

// 관리자 권한 확인 응답 타입
export interface AdminAuthResponse {
  isAdmin: boolean;
  permissions?: string[];
}

// 판매 데이터 포인트 타입
export interface SalesDataPoint {
  date: string;
  sales: number;
  orders: number;
}

// 상품 판매 통계 타입
export interface ProductStat {
  productId: number;
  name: string;
  salesCount: number;
  salesAmount: number;
  categoryName: string;
}

export interface AdminProduct extends Product {
  categoryId: number;
  manufacturer?: string;
  origin?: string;
  material?: string;
  size?: string;
  weight?: string;
}

export interface AdminProductDetail extends ProductDetail {
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