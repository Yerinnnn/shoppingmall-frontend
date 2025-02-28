import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  loading: boolean;
  login: (token: string, username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 로컬 스토리지의 토큰 확인
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authApi.getCurrentUser();
        setIsAuthenticated(true);
        setUsername(userData.username);
      } catch (error) {
        // 토큰이 유효하지 않으면 로그아웃 처리
        localStorage.removeItem('auth_token');
        setIsAuthenticated(false);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 로그인 함수: 토큰 저장 및 상태 업데이트
  const login = (token: string, username: string) => {
    localStorage.setItem('auth_token', token);
    setIsAuthenticated(true);
    setUsername(username);
  };

  // 로그아웃 함수: 토큰 제거 및 상태 초기화
  const logout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      username, 
      login, 
      logout,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};