import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { wishlistApi } from "../api/wishlistApi";
import { WishlistItem, UseWishlistReturn } from "../types";

const WISHLIST_QUERY_KEY = ["wishlist"];

export const useWishlist = (): UseWishlistReturn => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 인증 체크
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // 위시리스트 데이터 조회 쿼리
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: wishlistApi.fetchWishlist,
    staleTime: 1000 * 60, // 1분
    enabled: isAuthenticated,
  });

  // 위시리스트 추가 뮤테이션
  const addMutation = useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  // 위시리스트 제거 뮤테이션
  const removeMutation = useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  // 위시리스트 체크 뮤테이션
  const checkMutation = useMutation({
    mutationFn: wishlistApi.checkInWishlist,
  });

  // productId로 wishlistId를 찾아서 삭제하는 기능
  const removeFromWishlistByProductId = async (
    productId: number
  ): Promise<void> => {
    if (!isAuthenticated) {
      return Promise.reject("로그인이 필요합니다");
    }

    // 현재 위시리스트에서 해당 productId를 가진 항목 찾기
    const item = data.find(
      (item: WishlistItem) => item.productId === productId
    );

    if (!item) {
      return Promise.reject("위시리스트 항목을 찾을 수 없습니다");
    }

    // 찾은 항목의 wishlistId로 삭제 실행
    await removeMutation.mutateAsync(item.wishlistId);
  };

  // addToWishlist 함수를 Promise<void> 타입으로 맞추기 위한 래퍼 함수
  const addToWishlistWrapper = async (productId: number): Promise<void> => {
    if (!isAuthenticated) {
      return Promise.reject("로그인이 필요합니다");
    }
    await addMutation.mutateAsync(productId);
    return;
  };

  return {
    items: data,
    isLoading,
    error: error as Error | null,
    addToWishlist: addToWishlistWrapper,
    removeFromWishlist: isAuthenticated
      ? removeMutation.mutateAsync
      : () => Promise.reject("로그인이 필요합니다"),
    removeFromWishlistByProductId: isAuthenticated
      ? removeFromWishlistByProductId
      : () => Promise.reject("로그인이 필요합니다"),
    checkInWishlist: isAuthenticated
      ? checkMutation.mutateAsync
      : () => Promise.reject("로그인이 필요합니다"),
  };
};
