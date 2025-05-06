import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductList from '../../features/admin/components/products/ProductList';
import useProductAdmin from '../../features/admin/hooks/useProductAdmin';
import { Product } from '../../types/product';

// 페이지네이션 응답을 위한 타입 정의
interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

const AdminProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  
  const { 
    useProductList,
    deleteProduct,
    isDeleting
  } = useProductAdmin();
  
  // 상품 목록 쿼리 - 타입을 PageResponse<Product>로 지정
  const { 
    data: productsPage, 
    isLoading, 
    error 
  } = useProductList({
    page: currentPage,
    size: pageSize,
    keyword: searchKeyword,
    categoryId
  }) as { data: PageResponse<Product> | undefined, isLoading: boolean, error: any };

  // 페이지 객체에서 필요한 데이터 추출
  const products = productsPage?.content || [];
  const totalPages = productsPage?.totalPages || 0;
  const totalElements = productsPage?.totalElements || 0;

  // 검색 핸들러
  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    setCurrentPage(0);
  };

  // 카테고리 필터 핸들러
  const handleCategoryFilter = (id: number | undefined) => {
    setCategoryId(id);
    setCurrentPage(0);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 페이지 크기 변경 핸들러
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(0);
  };

  // 상품 삭제 핸들러
  const handleDeleteProduct = (productId: number) => {
    deleteProduct(productId);
  };

  // 에러 처리
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">오류 발생!</strong>
          <span className="block sm:inline"> 상품 목록을 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">상품 관리</h1>
      </div>

      <ProductList
        products={products}
        isLoading={isLoading}
        onDelete={handleDeleteProduct}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminProductListPage;