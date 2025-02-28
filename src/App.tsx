import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import Layout from './common/components/layout/Layout';

// 페이지 임포트
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ProductPage from './pages/product/ProductPage';
import ProductDetailPage from './pages/product/ProductDetailPage';
// import CartPage from './pages/cart/CartPage';
// import OrderListPage from './pages/order/OrderListPage';
// import OrderDetailPage from './pages/order/OrderDetailPage';
// import WishlistPage from './pages/wishlist/WishlistPage';

// 보호된 라우트 컴포넌트
import ProtectedRoute from './features/auth/components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* 공개 라우트 */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            
            {/* 보호된 라우트 */}
            {/* 인증이 필요한 경로를 보호하는 컴포넌트 */}
            {/* 사용자가 로그인하지 않은 상태에서 인증이 필요한 페이지(예: 장바구니, 주문 내역 등)에 접근하려고 할 때 로그인 페이지로 리다이렉트 */}
            <Route element={<ProtectedRoute />}>
              {/* <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailPage />} />
              <Route path="/wishlist" element={<WishlistPage />} /> */}
            </Route>
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;