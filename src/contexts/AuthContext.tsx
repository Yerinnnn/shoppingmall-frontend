import React, { createContext, useContext, useState, useEffect } from 'react';

// 인증 관련 상태와 함수들의 타입 정의
interface AuthContextType {
 isAuthenticated: boolean;      // 로그인 여부
 username: string | null;       // 로그인한 사용자명
 login: (token: string, username: string) => void; // 로그인 함수
 logout: () => void;           // 로그아웃 함수
}

// AuthContext 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [username, setUsername] = useState<string | null>(null);

 // 컴포넌트 마운트 시 로컬 스토리지의 토큰 확인
 useEffect(() => {
   const token = localStorage.getItem('auth_token');
   if (token) {
     // 토큰이 있으면 사용자 정보 요청
     fetch('/api/members/me', {
       headers: {
         'Authorization': `Bearer ${token}`
       }
     })
     .then(response => response.json())
     .then(data => {
       setIsAuthenticated(true);
       setUsername(data.username);
     })
     .catch(() => {
       // 토큰이 유효하지 않으면 로그아웃 처리
       localStorage.removeItem('auth_token');
       setIsAuthenticated(false);
       setUsername(null);
     });
   }
 }, []); // 빈 배열: 컴포넌트 마운트 시에만 실행

 // 로그인 함수: 토큰 저장 및 상태 업데이트
 const login = (token: string, username: string) => {
  localStorage.setItem('auth_token', token);
  setIsAuthenticated(true); 
  setUsername(username);  // 즉시 상태 업데이트
};

 // 로그아웃 함수: 토큰 제거 및 상태 초기화
 const logout = () => {
   localStorage.removeItem('auth_token');
   setIsAuthenticated(false);
   setUsername(null);
 };

 // Context Provider를 통해 상태와 함수들을 하위 컴포넌트에 제공
 return (
   <AuthContext.Provider value={{ isAuthenticated, username, login, logout }}>
     {children}
   </AuthContext.Provider>
 );
};

// 커스텀 Hook: 인증 컨텍스트 사용을 쉽게 만듦
export const useAuth = () => {
 const context = useContext(AuthContext);
 if (context === undefined) {
   throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};

export default AuthContext;