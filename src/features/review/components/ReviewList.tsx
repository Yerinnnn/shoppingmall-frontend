import React, { useState } from 'react';
import { useReviews } from '../hooks/useReviews';
import ReviewItem from './ReviewItem';
import ReviewForm from './ReviewForm';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';

interface ReviewListProps {
  productId: number;
  showReviewForm?: boolean;
  orderItemId?: number; // 주문 상품 ID (리뷰 작성 시 필요)
}

const ReviewList: React.FC<ReviewListProps> = ({
  productId,
  showReviewForm = false,
  orderItemId
}) => {
  const {
    reviews,
    reviewsPage,
    isLoadingReviews,
    isErrorReviews,
    averageRating,
    isLoadingRating,
    deleteReview,
    isDeleting,
    markHelpful,
    isMarkingHelpful,
    handlePageChange,
    pageRequest
  } = useReviews(productId);

  const { isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(showReviewForm);

  // 리뷰 작성 성공 핸들러
  const handleReviewSuccess = () => {
    setShowForm(false);
  };

  // 페이지네이션 변수
  const totalPages = reviewsPage?.totalPages || 0;
  const currentPage = pageRequest.page;

  // 리뷰 작성 취소 핸들러
  const handleCancelReview = () => {
    setShowForm(false);
  };

  // 로딩 상태 처리
  if (isLoadingReviews || isLoadingRating) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (isErrorReviews) {
    return (
      <div className="p-4 text-red-500">
        리뷰를 불러오는 중 오류가 발생했습니다. 다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">고객 리뷰</h3>
        
        <div className="flex items-center mb-4">
          <div className="text-2xl text-yellow-400 mr-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i}>
                {typeof averageRating === 'number' && averageRating > 0 && i < Math.floor(averageRating) 
                  ? '★' 
                  : typeof averageRating === 'number' && averageRating > 0 && i < averageRating 
                    ? '★' 
                    : '☆'}
              </span>
            ))}
          </div>
          <span className="text-lg font-bold">
            {typeof averageRating === 'number' ? Number(averageRating).toFixed(1) : '0.0'}
          </span>
          <span className="text-gray-500 ml-2">({reviewsPage?.totalElements || 0}개 리뷰)</span>
        </div>

        {/* 리뷰 작성 버튼 및 폼 - 로그인한 사용자만 표시 */}
        {isAuthenticated && (
          <div className="mb-6">
            {showForm ? (
              <div className="bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-lg mb-2">리뷰 작성</h4>
                <ReviewForm
                  productId={productId}
                  orderItemId={orderItemId || 0} // orderItemId가 없으면 임시 값 사용
                  onSuccess={handleReviewSuccess}
                  onCancel={handleCancelReview}
                />
              </div>
            ) : (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus size={16} className="mr-1" /> 리뷰 작성하기
              </button>
            )}
          </div>
        )}

        {/* 리뷰 목록 */}
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map(review => (
              <ReviewItem
                key={review.reviewId}
                review={review}
                onMarkHelpful={markHelpful}
                onDelete={deleteReview}
                productId={productId}
                isHelpfulLoading={isMarkingHelpful}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
            {isAuthenticated && !showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
              >
                첫 리뷰 작성하기
              </button>
            )}
          </div>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className={`p-2 rounded-md ${
                  currentPage === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={20} />
              </button>
              
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === i
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className={`p-2 rounded-md ${
                  currentPage === totalPages - 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;