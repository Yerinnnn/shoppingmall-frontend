import React, { useEffect, useState } from 'react';
import { Category } from '../../types/product';

interface CategoryListProps {
  onCategorySelect: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  onCategorySelect,
  selectedCategoryId
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err); // 에러 로깅
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
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