import React from 'react';

const OrderDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Order Info 스켈레톤 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
        
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-40"></div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="col-span-2">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-5 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items 스켈레톤 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
        
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center py-4 border-b">
              <div className="w-20 h-20 bg-gray-200 rounded"></div>
              <div className="ml-4 flex-grow">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="text-right">
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
        </div>
      </div>

      {/* 버튼 영역 스켈레톤 */}
      <div className="flex justify-center space-x-4">
        <div className="h-10 bg-gray-200 rounded w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
    </div>
  );
};

export default OrderDetailSkeleton;