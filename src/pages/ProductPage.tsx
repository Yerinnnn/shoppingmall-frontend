import React, { useState } from 'react';
import { Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import ProductList from '../components/product/ProductList';
import ProductDetail from '../components/product/ProductDetail';
import CategoryList from '../components/product/CategoryList';

const ProductPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // URL 쿼리 파라미터에서 카테고리 ID와 검색어를 가져옴
  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : null;
  const searchQuery = searchParams.get('q') || '';

  // 카테고리 선택 핸들러
  const handleCategorySelect = (selectedCategoryId: number | null) => {
    if (selectedCategoryId) {
      setSearchParams({ category: selectedCategoryId.toString() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Routes>
        <Route index element={
          <>
            <CategoryList 
              onCategorySelect={handleCategorySelect}
              selectedCategoryId={categoryId}
            />
            <div className="mt-8">
              <ProductList 
                categoryId={categoryId}
                searchQuery={searchQuery}
                limit={20}
              />
            </div>
          </>
        } />
        <Route path=":id" element={<ProductDetail />} />
      </Routes>
    </div>
  );
};

export default ProductPage;