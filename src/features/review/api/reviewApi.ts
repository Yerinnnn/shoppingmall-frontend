import api from "../../../services/apiClient";
import {
  ReviewRequest,
  ReviewResponse,
  PageReviewResponse,
  PageRequest,
} from "../types";

const REVIEWS_ENDPOINT = "/reviews";

// 리뷰 API 클라이언트
const reviewApi = {
  // 리뷰 생성
  createReview: (data: ReviewRequest): Promise<ReviewResponse> => {
    return api.post<ReviewResponse>(REVIEWS_ENDPOINT, data);
  },

  // 리뷰 수정
  updateReview: (
    reviewId: number,
    data: ReviewRequest
  ): Promise<ReviewResponse> => {
    return api.put<ReviewResponse>(`${REVIEWS_ENDPOINT}/${reviewId}`, data);
  },

  // 리뷰 삭제
  deleteReview: (reviewId: number): Promise<void> => {
    return api.delete<void>(`${REVIEWS_ENDPOINT}/${reviewId}`);
  },

  // 특정 상품의 리뷰 목록 조회 (페이지네이션)
  getProductReviews: (
    productId: number,
    pageable: PageRequest
  ): Promise<PageReviewResponse> => {
    // URL 인코딩 이슈로 인해 정렬 매개변수를 문자열로 변환
    const params: any = {
      page: pageable.page,
      size: pageable.size,
    };

    // 정렬 정보가 있으면 문자열로 변환하여 전송
    if (pageable.sort && pageable.sort.length > 0) {
      // sort[]= 형식이 아닌 sort= 형식으로 전송 (백엔드에서 허용하는 형식에 맞춤)
      params.sort = pageable.sort;
    }

    return api.get<PageReviewResponse>(
      `${REVIEWS_ENDPOINT}/products/${productId}`,
      { params }
    );
  },

  // 상품 평균 평점 조회
  getProductAverageRating: (productId: number): Promise<number> => {
    return api.get<number>(`${REVIEWS_ENDPOINT}/products/${productId}/rating`);
  },

  // 리뷰에 '도움됨' 표시
  markReviewAsHelpful: (reviewId: number): Promise<void> => {
    return api.post<void>(`${REVIEWS_ENDPOINT}/${reviewId}/helpful`);
  },
};

export default reviewApi;
