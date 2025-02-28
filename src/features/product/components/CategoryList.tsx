import React from 'react';
import { useCategories } from '../hooks/useCategories';
import { CategorySkeleton } from './skeletons/CategorySkeleton';

interface CategoryListProps {
  onCategorySelect: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
}

export const CategoryList: React.FC<CategoryListProps> = ({ 
  onCategorySelect,
  selectedCategoryId
}) => {
  const { categories, loading, error } = useCategories();

  if (loading) {
    return <CategorySkeleton />;
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-4 py-2 rounded-lg transition-colors ${
          selectedCategoryId === null
            ? 'bg-indigo-600 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        } shadow-sm`}
      >
        전체
      </button>
      
      {categories.map((category) => (
        <button
          key={category.categoryId}
          onClick={() => onCategorySelect(category.categoryId)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedCategoryId === category.categoryId
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } shadow-sm`}
        >
          <span className="block text-sm font-medium">{category.name}</span>
          <span className="block text-xs mt-1">
            {category.productCount}개
          </span>
        </button>
      ))}
    </div>
  );
};

export default CategoryList;