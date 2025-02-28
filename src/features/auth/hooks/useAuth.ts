import { useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // 로그아웃 확장 함수 (서버 로그아웃 요청 추가)
  const logout = useCallback(async () => {
    try {
      // 서버에 로그아웃 요청 (토큰 무효화 등)
      await authApi.logout();
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
    } finally {
      // 로컬 로그아웃 처리 (항상 실행)
      context.logout();
    }
  }, [context]);

  // context의 다른 메소드와 값들은 그대로 유지하고, logout만 확장
  return {
    ...context,
    logout
  };
};