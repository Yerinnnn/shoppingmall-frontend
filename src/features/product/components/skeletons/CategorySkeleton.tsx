import React from 'react';

export const CategorySkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};

export default CategorySkeleton;