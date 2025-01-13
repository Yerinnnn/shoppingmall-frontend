import React from 'react';
import { useNavigate } from 'react-router-dom';
import WishlistList from '../components/wishlist/WishlistList';
import { useWishlist } from '../hooks/useWishlist';
import { Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const WishlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    data: wishlistItems, 
    isLoading, 
    error,
    mutations: {
      removeFromWishlist
    }
  } = useWishlist();

  if (error instanceof Error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow p-8">
          <Heart className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 상단 네비게이션 */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 py-4 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">홈</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900">위시리스트</span>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">위시리스트</h1>
          <span className="text-gray-500">
            {wishlistItems.length}개의 상품
          </span>
        </div>

        {/* 위시리스트 목록 */}
        <WishlistList 
          items={wishlistItems}
          isLoading={isLoading}
          onRemove={removeFromWishlist}
        />

        {/* 쇼핑 계속하기 버튼 */}
        {!isLoading && wishlistItems.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white text-indigo-600 rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              쇼핑 계속하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;