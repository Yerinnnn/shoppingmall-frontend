import React from "react";

interface ReviewSkeletonProps {
  count?: number;
}

const ReviewSkeleton: React.FC<ReviewSkeletonProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {/* 평점 및 총 리뷰 수 스켈레톤 */}
      <div className="flex items-center mb-4">
        <div className="animate-pulse flex items-center">
          <div className="h-6 bg-gray-200 rounded w-32 mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>

      {/* 리뷰 아이템 스켈레톤 */}
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="animate-pulse">
            <div className="flex justify-between items-start">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="flex items-center mt-1">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="ml-2 h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewSkeleton;
