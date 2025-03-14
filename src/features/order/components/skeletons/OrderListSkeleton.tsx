import React from 'react';

interface OrderListSkeletonProps {
  itemCount?: number;
}

const OrderListSkeleton: React.FC<OrderListSkeletonProps> = ({ itemCount = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: itemCount }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="border-t border-b py-4 mb-4">
              <div className="flex items-center">
                <div className="w-20 h-20 bg-gray-200 rounded"></div>
                <div className="ml-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-32"></div>
              <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderListSkeleton;