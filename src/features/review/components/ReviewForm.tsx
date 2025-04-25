import React, { useState, useEffect } from "react";
import { useReviewForm } from "../hooks/useReviews";
import { ReviewRequest, ReviewResponse } from "../types";

interface ReviewFormProps {
  productId: number;
  orderItemId: number;
  initialData?: ReviewResponse;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  orderItemId,
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ReviewRequest>({
    productId,
    orderItemId: orderItemId || 0, // orderItemId가 없는 경우 0으로 설정
    rating: initialData?.rating || 5,
    content: initialData?.content || "",
    imageUrls: initialData?.imageUrls || [],
  });

  const [formErrors, setFormErrors] = useState<{
    rating?: string;
    content?: string;
  }>({});

  const {
    createReview,
    isCreating,
    createError,
    updateReview,
    isUpdating,
    updateError,
    success,
    resetSuccess,
  } = useReviewForm();

  // 성공 시 콜백 처리
  useEffect(() => {
    if (success) {
      // 성공 콜백 호출
      onSuccess?.();
      // 성공 상태 초기화
      resetSuccess();
    }
  }, [success, onSuccess, resetSuccess]);

  const isEdit = !!initialData;
  const isPending = isCreating || isUpdating;
  const error = createError || updateError;

  // 입력 변경 핸들러
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 에러 상태 초기화
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // 별점 변경 핸들러
  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
    if (formErrors.rating) {
      setFormErrors((prev) => ({ ...prev, rating: undefined }));
    }
  };

  // 폼 검증
  const validateForm = (): boolean => {
    const errors: { rating?: string; content?: string } = {};

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      errors.rating = "평점은 1-5 사이로 선택해주세요.";
    }

    if (!formData.content) {
      errors.content = "리뷰 내용을 입력해주세요.";
    } else if (formData.content.length < 10) {
      errors.content = "리뷰 내용은 최소 10자 이상 입력해주세요.";
    } else if (formData.content.length > 1000) {
      errors.content = "리뷰 내용은 최대 1000자까지 입력 가능합니다.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (isEdit && initialData) {
      updateReview({
        reviewId: initialData.reviewId,
        data: formData,
      });
    } else {
      createReview(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">평점</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(star)}
              className={`text-2xl ${
                star <= formData.rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        {formErrors.rating && (
          <p className="text-red-500 text-sm">{formErrors.rating}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          리뷰 내용
        </label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={5}
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="리뷰 내용을 10자 이상 입력해주세요."
        />
        {formErrors.content && (
          <p className="text-red-500 text-sm">{formErrors.content}</p>
        )}
        <p className="text-sm text-gray-500">{formData.content.length}/1000</p>
      </div>

      {/* 이미지 업로드 기능은 추후 구현 예정 */}

      {error && (
        <div className="text-red-500 text-sm p-2 bg-red-50 rounded border border-red-200">
          {error.message === 'Order item not found' 
            ? '주문 정보를 찾을 수 없습니다. 해당 상품을 구매한 후에 리뷰를 작성할 수 있습니다.'
            : error.message || '오류가 발생했습니다. 다시 시도해주세요.'}
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isPending}
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={isPending}
        >
          {isPending
            ? isEdit
              ? "수정 중..."
              : "등록 중..."
            : isEdit
            ? "리뷰 수정"
            : "리뷰 등록"}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
