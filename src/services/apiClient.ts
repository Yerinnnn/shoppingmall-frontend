import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export const createApiClient = (config?: AxiosRequestConfig): AxiosInstance => {
  const apiClient = axios.create({
    baseURL: '/api',
    headers: {
      'Content-Type': 'application/json',
    },
    ...config
  });
  
  // 요청 인터셉터 - 인증 토큰 추가
  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // 응답 인터셉터 - 에러 처리
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      // 인증 오류(401) 처리
      if (error.response && error.response.status === 401) {
        // 로그인 페이지로 리다이렉트 등의 처리
      }
      return Promise.reject(error);
    }
  );
  
  return apiClient;
};

export const apiClient = createApiClient();