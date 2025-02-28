import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API 클라이언트 설정 타입
interface ApiClientConfig extends AxiosRequestConfig {
  withCredentials?: boolean;
  baseURL?: string;
}

// API 에러 응답 타입
export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

// 기본 설정
const defaultConfig: ApiClientConfig = {
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초
  withCredentials: true
};

// API 클라이언트 생성 함수
export const createApiClient = (config?: ApiClientConfig): AxiosInstance => {
  const apiClient = axios.create({
    ...defaultConfig,
    ...config
  });
  
  // 요청 인터셉터 - 인증 토큰 추가
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // 응답 인터셉터 - 에러 처리
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      // 인증 오류(401) 처리
      if (error.response?.status === 401) {
        // 인증 토큰이 만료된 경우
        localStorage.removeItem('auth_token');
        
        // 로그인 페이지로 리다이렉트 (이 로직은 앱의 요구사항에 따라 조정 가능)
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // 에러 응답 메시지 처리
      const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다';
      
      // 커스텀 에러 객체 반환
      return Promise.reject({
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
        originalError: error
      });
    }
  );
  
  return apiClient;
};

// 기본 인스턴스 생성
export const apiClient = createApiClient();

// 유틸리티 함수 - 데이터만 추출
export const extractData = <T>(response: AxiosResponse<T>): T => response.data;

// HTTP 메소드별 래퍼 함수들
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config).then(extractData),
    
  post: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config).then(extractData),
    
  put: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config).then(extractData),
    
  patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config).then(extractData),
    
  delete: <T>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config).then(extractData),
};

export default api;