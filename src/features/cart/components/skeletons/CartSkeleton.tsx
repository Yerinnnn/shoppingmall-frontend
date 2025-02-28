import React from 'react';

export const CartSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="animate-pulse">
        {/* 테이블 헤더 스켈레톤 */}
        <div className="hidden lg:grid lg:grid-cols-6 gap-4 p-4 border-b">
          <div className="h-4 bg-gray-200 rounded col-span-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
        
        {/* 아이템 스켈레톤 */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border-b">
            <div className="lg:grid lg:grid-cols-6 gap-4">
              <div className="col-span-2 flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartSkeleton;