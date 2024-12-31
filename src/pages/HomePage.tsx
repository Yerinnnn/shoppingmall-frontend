import React, { useState } from 'react';
import CategoryList from '../components/product/CategoryList';
import ProductGrid from '../components/product/ProductGrid';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CategoryList onCategorySelect={setSelectedCategory} />
      <ProductGrid 
        categoryId={selectedCategory} 
        searchQuery={searchQuery}
      />
    </main>
  );
};

export default HomePage;