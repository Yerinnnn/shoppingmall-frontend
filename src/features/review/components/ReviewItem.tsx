import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { ReviewResponse } from '../types';
import ReviewForm from './ReviewForm';
import { useAuth } from '../../auth/hooks/useAuth';

interface ReviewItemProps {
  review: ReviewResponse;
  onMarkHelpful: (reviewId: number) => void;
  onDelete: (reviewId: number) => void;
  productId: number;
  isHelpfulLoading?: boolean;
}

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  onMarkHelpful,
  onDelete,
  productId,
  isHelpfulLoading
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { username } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  
  // 현재 사용자의 리뷰인지 확인 (memberName이 username과 같은지)
  // 테스트를 위해 임시로 항상 true로 설정 (실제 환경에서는 다시 원래대로 돌려놓아야 함)
  const isUserReview = true; // 디버깅을 위해 항상 true로 설정
  
  useEffect(() => {
    // 디버깅 정보 출력
    console.log('Review memberName:', review.memberName);
    console.log('Current username:', username);
    console.log('Is user review?', review.memberName === username);
  }, [review.memberName, username]);
  
  // 작성일 포맷팅
  const formattedDate = new Date(review.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 메뉴 외부 클릭 감지 이벤트 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  // 도움됨 버튼 클릭 핸들러
  const handleHelpfulClick = () => {
    onMarkHelpful(review.reviewId);
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  // 삭제 버튼 클릭 핸들러
  const handleDeleteClick = () => {
    if (window.confirm('리뷰를 삭제하시겠습니까?')) {
      onDelete(review.reviewId);
    }
    setShowMenu(false);
  };

  // 리뷰 수정 취소 핸들러
  const handleEditCancel = () => {
    setIsEditing(false);
  };

  // 리뷰 수정 성공 핸들러
  const handleEditSuccess = () => {
    setIsEditing(false);
    // 성공 메시지나 토스트 알림을 여기에 추가할 수 있습니다
    console.log('리뷰가 성공적으로 수정되었습니다.');
  };

  // 메뉴 토글 핸들러
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // 수정 폼 렌더링
  if (isEditing) {
    return (
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h4 className="font-medium text-lg mb-2">리뷰 수정</h4>
        <ReviewForm
          productId={productId}
          orderItemId={review.reviewId} // 임시: 실제로는 주문 아이템 ID를 알아야 함
          initialData={review}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{review.memberName}</h4>
          <div className="flex items-center mt-1">
            <div className="text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">{formattedDate}</span>
          </div>
        </div>

        {isUserReview && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full bg-gray-100"
              aria-label="리뷰 메뉴"
            >
              <MoreVertical size={16} />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 py-1 w-36 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <button
                  onClick={handleEditClick}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Edit2 size={14} className="mr-2" />
                  수정하기
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <Trash2 size={14} className="mr-2" />
                  삭제하기
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3">
        <p className="text-gray-700">{review.content}</p>

        {review.imageUrls && review.imageUrls.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {review.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`리뷰 이미지 ${index + 1}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleHelpfulClick}
          disabled={isHelpfulLoading}
          className="flex items-center text-sm text-gray-500 hover:text-blue-500"
        >
          <ThumbsUp size={16} className="mr-1" />
          도움됨 ({review.helpfulCount})
        </button>
      </div>
    </div>
  );
};

export default ReviewItem;