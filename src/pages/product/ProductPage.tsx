import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryList from '../../features/product/components/CategoryList';
import ProductList from '../../features/product/components/ProductList';
import { ProductFilterOptions } from '../../features/product/types';

const ProductPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterOptions, setFilterOptions] = useState<ProductFilterOptions>({
    categoryId: searchParams.get('category') ? Number(searchParams.get('category')) : null,
    searchQuery: searchParams.get('q') || '',
  });

  // 카테고리 선택 핸들러
  const handleCategorySelect = (selectedCategoryId: number | null) => {
    const newOptions = { ...filterOptions, categoryId: selectedCategoryId };
    setFilterOptions(newOptions);
    
    if (selectedCategoryId) {
      setSearchParams({ category: selectedCategoryId.toString() });
    } else {
      // 검색어만 있는 경우
      if (filterOptions.searchQuery) {
        setSearchParams({ q: filterOptions.searchQuery });
      } else {
        setSearchParams({});
      }
    }
  };

  // 검색 핸들러
  const handleSearch = (query: string) => {
    const newOptions = { ...filterOptions, searchQuery: query };
    setFilterOptions(newOptions);
    
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (filterOptions.categoryId) params.category = filterOptions.categoryId.toString();
    
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">상품 목록</h1>
      
      <CategoryList 
        onCategorySelect={handleCategorySelect}
        selectedCategoryId={filterOptions.categoryId}
      />
      
      <div className="mt-8">
        <ProductList 
          categoryId={filterOptions.categoryId}
          searchQuery={filterOptions.searchQuery}
          limit={20}
        />
      </div>
    </div>
  );
};

export default ProductPage;