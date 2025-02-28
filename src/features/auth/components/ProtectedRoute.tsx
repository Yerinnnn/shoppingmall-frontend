import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectPath = '/login',
}) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 인증 상태 확인 중일 때 로딩 표시
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 인증되지 않은 경우 리다이렉트
  if (!isAuthenticated) {
    // 현재 위치를 state에 저장하여 로그인 후 원래 접근하려던 페이지로 돌아갈 수 있게 함
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // children이 있으면 children 렌더링, 없으면 Outlet 렌더링
  // Outlet은 중첩 라우트의 자식 라우트를 렌더링함
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;