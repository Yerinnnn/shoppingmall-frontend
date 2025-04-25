export interface AdminState {
    isAdmin: boolean;
    loading: boolean;
    error: string | null;
  }
  
  export interface Category {
    id: number;
    name: string;
    description?: string;
    parentId?: number;
    imageUrl?: string;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Discount {
    id: number;
    name: string;
    description?: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    startDate: string;
    endDate: string;
    status: 'ACTIVE' | 'SCHEDULED' | 'EXPIRED' | 'CANCELLED';
    minPurchaseAmount?: number;
    maxDiscountAmount?: number;
    applicableProducts?: number[]; // Product IDs
    applicableCategories?: number[]; // Category IDs
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProductInventory {
    id: number;
    productId: number;
    quantity: number;
    lowStockThreshold?: number;
    sku: string;
    location?: string;
    updatedAt: string;
  }
  
  export interface AdminProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    salePrice?: number;
    cost: number;
    imageUrl?: string;
    category: string;
    categoryId: number;
    status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'OUT_OF_STOCK';
    featured?: boolean;
    discounted?: boolean;
    supplier?: string;
    inventoryDetails: ProductInventory;
    discounts?: Discount[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Member {
    id: number;
    username: string;
    name: string;
    email: string;
    contact: string;
    roles: string[];
    status: 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
    joinDate: string;
    lastLoginDate?: string;
    totalSpent?: number;
    totalOrders?: number;
    membershipTier?: string;
    points?: number;
  }
  
  export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    discount?: number;
    status?: 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED';
  }
  
  export interface Order {
    id: number;
    orderNumber: string;
    memberId: number;
    memberName: string;
    orderDate: string;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
    totalAmount: number;
    paymentMethod: string;
    shippingAddress: string;
    trackingNumber?: string;
    items: OrderItem[];
  }
  
  export interface Review {
    id: number;
    productId: number;
    productName: string;
    memberId: number;
    memberName: string;
    rating: number;
    title: string;
    content: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    updatedAt?: string;
    images?: string[];
  }
  
  export interface Inquiry {
    id: number;
    productId?: number;
    productName?: string;
    memberId: number;
    memberName: string;
    subject: string;
    content: string;
    status: 'PENDING' | 'ANSWERED' | 'CLOSED';
    answer?: string;
    answerDate?: string;
    createdAt: string;
    isPrivate: boolean;
  }
  
  export interface SalesStats {
    period: string;
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    totalCustomers: number;
    newCustomers: number;
  }
  
  export interface ProductStats {
    productId: number;
    productName: string;
    totalSold: number;
    revenue: number;
    profit: number;
    returnRate: number;
  }
  
  export interface AdminSettings {
    siteName: string;
    logoUrl: string;
    contactEmail: string;
    phoneNumber: string;
    address: string;
    socialLinks: Record<string, string>;
    paymentMethods: string[];
    shippingMethods: Record<string, number>;
    returnPolicy: string;
    privacyPolicy: string;
    termsOfService: string;
  }