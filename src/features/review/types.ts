// 리뷰 상태 enum
export enum ReviewStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DELETED = "DELETED",
}

// 리뷰 생성 요청 타입
export interface ReviewRequest {
  productId: number;
  orderItemId: number;
  rating: number; // 1-5 사이 값
  content: string; // 10-1000자 사이
  imageUrls?: string[]; // 선택적 이미지 URL 배열
}

// 리뷰 응답 타입
export interface ReviewResponse {
  reviewId: number;
  memberName: string;
  productName: string;
  rating: number;
  content: string;
  imageUrls: string[];
  status: ReviewStatus;
  helpfulCount: number;
  createdAt: string; // ISO 형식 날짜 문자열
}

// 페이지네이션된 리뷰 응답 타입
export interface PageReviewResponse {
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  size: number;
  content: ReviewResponse[];
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

// 페이지네이션 요청 타입 (Pageable 타입에 해당)
export interface PageRequest {
  page: number;
  size: number;
  sort?: string | string[]; // 문자열 또는 문자열 배열 모두 허용
}
