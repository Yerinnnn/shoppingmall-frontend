import React, { useEffect, useState } from 'react';

interface Category {
  categoryId: number;
  name: string;
  productCount: number;
}

interface CategoryListProps {
  onCategorySelect: (categoryId: number | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedId(categoryId);
    onCategorySelect(categoryId);
  };

  if (loading) {
    return (
      <div className="h-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
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
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">카테고리</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <button
          onClick={() => handleCategoryClick(null)}
          className={`px-4 py-2 text-center rounded-lg transition-all ${
            selectedId === null
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          } shadow-sm hover:shadow-md`}
        >
          전체
        </button>
        {categories.map((category) => (
          <button
            key={category.categoryId}
            onClick={() => handleCategoryClick(category.categoryId)}
            className={`px-4 py-2 text-center rounded-lg transition-all ${
              selectedId === category.categoryId
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } shadow-sm hover:shadow-md`}
          >
            <span>{category.name}</span>
            <span className="text-sm ml-2">({category.productCount})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;