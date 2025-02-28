
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { cartApi } from "../api/cartApi";
import { CartItem, AddToCartRequest } from "../types";

export const CART_QUERY_KEY = ["cart"];

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 장바구니 데이터 조회 쿼리
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: cartApi.fetchCart,
    enabled: isAuthenticated,
    staleTime: 1000 * 60, // 1분
  });

  // 로그인 여부 확인 및 리디렉션 처리
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // 장바구니에 상품 추가 뮤테이션
  const addToCartMutation = useMutation({
    mutationFn: cartApi.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // 장바구니 아이템 수량 변경 뮤테이션
  const updateQuantityMutation = useMutation({
    mutationFn: cartApi.updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // 장바구니 아이템 삭제 뮤테이션
  const removeItemMutation = useMutation({
    mutationFn: cartApi.removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // 장바구니 비우기 뮤테이션
  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  // 장바구니 요약 정보 계산
  const calculateSummary = (items: CartItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const FREE_SHIPPING_THRESHOLD = 50000;
    const SHIPPING_FEE = 3000;
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const total = subtotal + shippingFee;

    return {
      subtotal,
      shippingFee,
      total,
    };
  };

  return {
    // 데이터
    cartItems: data,
    summary: calculateSummary(data),
    isLoading,
    error,

    // 액션
    addToCart: (request: AddToCartRequest) => {
      if (!isAuthenticated) {
        navigate("/login");
        return Promise.reject("로그인이 필요합니다");
      }
      return addToCartMutation.mutateAsync(request);
    },

    updateQuantity: (cartId: number, quantity: number) => {
      if (!isAuthenticated) {
        navigate("/login");
        return Promise.reject("로그인이 필요합니다");
      }
      return updateQuantityMutation.mutateAsync({ cartId, quantity });
    },

    removeItem: (cartId: number) => {
      if (!isAuthenticated) {
        navigate("/login");
        return Promise.reject("로그인이 필요합니다");
      }
      return removeItemMutation.mutateAsync(cartId);
    },

    clearCart: () => {
      if (!isAuthenticated) {
        navigate("/login");
        return Promise.reject("로그인이 필요합니다");
      }
      return clearCartMutation.mutateAsync();
    },
  };
};
