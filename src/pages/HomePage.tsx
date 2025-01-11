import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import CategoryList from '../components/product/CategoryList';
import ProductList from '../components/product/ProductList';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <div className="min-h-screen">
      {/* 메인 배너 섹션 */}
      <section className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Special Deals
            </h1>
            <p className="text-lg sm:text-xl mb-8">
              최대 50% 할인된 가격으로 제품을 만나보세요
            </p>
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
              할인 상품 보기
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 카테고리 섹션 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">카테고리</h2>
          <CategoryList 
            onCategorySelect={setSelectedCategory} 
            selectedCategoryId={selectedCategory}
          />
        </section>

        {/* 카테고리별 상품 섹션 (카테고리가 선택된 경우만 표시) */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory ? '카테고리 상품' : '전체 상품'}
            </h2>
          </div>
          <ProductList 
            categoryId={selectedCategory}
            searchQuery={searchQuery}
            limit={8}
          />
        </section>

        {/* 추천 상품 섹션 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">추천 상품</h2>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
              더보기
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
          <ProductList 
            categoryId={null}
            searchQuery=""
            limit={4}
            featured={true}
          />
        </section>

        {/* 신상품 섹션 */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">신상품</h2>
            <button className="text-indigo-600 hover:text-indigo-800 flex items-center">
              더보기
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          </div>
          <ProductList 
            categoryId={null}
            searchQuery=""
            limit={4}
            sortBy="createdAt"
          />
        </section>
      </main>
    </div>
  );
};

export default HomePage;