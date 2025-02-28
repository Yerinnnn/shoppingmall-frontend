import { api } from "../../../services/apiClient";
import { LoginRequest, AuthResponse, SignupFormData } from "../types";

export const authApi = {
  // 로그인 API 호출 함수
  // 사용자 아이디/비밀번호를 서버로 전송하고 인증 응답을 받음
  login: (credentials: LoginRequest): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/login", credentials);
  },

  // 회원가입 API 호출 함수
  // 신규 사용자 데이터를 서버로 전송하고 가입 완료 후 인증 응답을 받음
  signup: (userData: SignupFormData): Promise<AuthResponse> => {
    return api.post<AuthResponse>("/auth/signup", userData);
  },

  // 현재 로그인된 사용자 정보 조회 API 호출 함수
  // 토큰 기반으로 현재 인증된 사용자의 정보를 가져옴
  getCurrentUser: (): Promise<{ username: string; name?: string }> => {
    return api.get("/members/me");
  },

  logout: (): Promise<void> => {
    // 서버에 로그아웃 요청 (토큰 무효화 등)
    return api.post("/auth/logout");
  },
};
