import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewApi from "../api/reviewApi";
import { ReviewRequest, PageRequest } from "../types";
import { AxiosError } from "axios";

// 리뷰 훅 - 상품 리뷰 관련 쿼리와 뮤테이션을 제공
export const useReviews = (productId: number) => {
  const queryClient = useQueryClient();
  const [pageRequest, setPageRequest] = useState<PageRequest>({
    page: 0,
    size: 10,
    sort: "createdAt,desc", // 배열이 아닌 문자열로 수정
  });

  // 상품 리뷰 목록 쿼리
  const reviewsQuery = useQuery({
    queryKey: ["productReviews", productId, pageRequest],
    queryFn: () => {
      // 페이지 요청 객체를 수정하여 sort[] 대신 sort로 전송
      const params = {
        page: pageRequest.page,
        size: pageRequest.size,
        sort: pageRequest.sort, // 배열 전달 방식 수정
      };
      return reviewApi.getProductReviews(productId, params);
    },
    enabled: !!productId,
  });

  // 상품 평균 평점 쿼리
  const ratingQuery = useQuery({
    queryKey: ['productRating', productId],
    queryFn: () => reviewApi.getProductAverageRating(productId).catch(error => {
      console.error("Error fetching product rating:", error);
      return 0; // 오류 발생 시 기본값 반환
    }),
    enabled: !!productId
  });

  // 리뷰 생성 뮤테이션
  const createReviewMutation = useMutation({
    mutationFn: (data: ReviewRequest) => reviewApi.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
      queryClient.invalidateQueries({ queryKey: ["productRating", productId] });
    },
  });

  // 리뷰 수정 뮤테이션
  const updateReviewMutation = useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: number;
      data: ReviewRequest;
    }) => reviewApi.updateReview(reviewId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
    },
  });

  // 리뷰 삭제 뮤테이션
  const deleteReviewMutation = useMutation({
    mutationFn: (reviewId: number) => reviewApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productReviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['productRating', productId] });
      
    },
    onError: (error) => {
      console.error("Failed to delete review:", error);
    }
  });

  // 리뷰 도움됨 표시 뮤테이션
  const markHelpfulMutation = useMutation({
    mutationFn: (reviewId: number) => reviewApi.markReviewAsHelpful(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["productReviews", productId],
      });
    },
  });

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setPageRequest((prev) => ({ ...prev, page }));
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (size: number) => {
    setPageRequest((prev) => ({ ...prev, size, page: 0 }));
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sort: string | string[]) => {
    setPageRequest((prev) => ({ ...prev, sort, page: 0 }));
  };

  // 안전하게 평균 평점 값 가져오기
  const getAverageRating = (): number => {
    // ratingQuery.data가 있고 숫자 타입인 경우에만 해당 값 반환
    if (ratingQuery.data !== undefined && 
        ratingQuery.data !== null && 
        typeof ratingQuery.data === 'number') {
      return ratingQuery.data;
    }
    // 그 외의 경우 기본값 0 반환
    return 0;
  };

  return {
    // 쿼리 데이터 및 상태
    reviews: reviewsQuery.data?.content || [],
    reviewsPage: reviewsQuery.data,
    isLoadingReviews: reviewsQuery.isLoading,
    isErrorReviews: reviewsQuery.isError,
    errorReviews: reviewsQuery.error as AxiosError,
    
    // 평점 데이터 및 상태 - 안전한 getter 함수 사용
    averageRating: getAverageRating(),
    isLoadingRating: ratingQuery.isLoading,
    isErrorRating: ratingQuery.isError,
    errorRating: ratingQuery.error as AxiosError,
    
    // 뮤테이션 함수 및 상태
    createReview: createReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,
    createError: createReviewMutation.error as AxiosError,
    
    updateReview: updateReviewMutation.mutate,
    isUpdating: updateReviewMutation.isPending,
    updateError: updateReviewMutation.error as AxiosError,
    
    deleteReview: deleteReviewMutation.mutate,
    isDeleting: deleteReviewMutation.isPending,
    deleteError: deleteReviewMutation.error as AxiosError,
    
    markHelpful: markHelpfulMutation.mutate,
    isMarkingHelpful: markHelpfulMutation.isPending,
    markHelpfulError: markHelpfulMutation.error as AxiosError,
    
    // 페이징 및 정렬 핸들러
    pageRequest,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange
  };
};

// 단일 리뷰 생성/수정을 위한 훅
export const useReviewForm = () => {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  // 리뷰 생성 뮤테이션
  const createReviewMutation = useMutation({
    mutationFn: (data: ReviewRequest) => reviewApi.createReview(data),
    onSuccess: (data) => {
      const productId = createReviewMutation.variables?.productId;
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["productReviews", productId],
        });
        queryClient.invalidateQueries({
          queryKey: ["productRating", productId],
        });
      }
      setSuccess(true);
    },
    onError: () => {
      setSuccess(false);
    },
  });

  // 리뷰 수정 뮤테이션
  const updateReviewMutation = useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: number;
      data: ReviewRequest;
    }) => reviewApi.updateReview(reviewId, data),
    onSuccess: (data) => {
      const productId = updateReviewMutation.variables?.data.productId;
      if (productId) {
        queryClient.invalidateQueries({
          queryKey: ["productReviews", productId],
        });
      }
      setSuccess(true);
    },
    onError: () => {
      setSuccess(false);
    },
  });

  // 성공 상태 초기화
  const resetSuccess = () => {
    setSuccess(false);
  };

  return {
    createReview: createReviewMutation.mutate,
    isCreating: createReviewMutation.isPending,
    createError: createReviewMutation.error as AxiosError,

    updateReview: updateReviewMutation.mutate,
    isUpdating: updateReviewMutation.isPending,
    updateError: updateReviewMutation.error as AxiosError,

    success,
    resetSuccess,
  };
};