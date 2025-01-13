import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { WishlistItem } from '../types/wishlist';
import { useNavigate } from 'react-router-dom';

const WISHLIST_QUERY_KEY = ['wishlist'] as const;

// Auth header helper
const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// API functions
const fetchWishlist = async (): Promise<WishlistItem[]> => {
  const response = await fetch('/api/wishlist', {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('위시리스트를 불러오는데 실패했습니다');
  }
  return response.json();
};

const addToWishlist = async (productId: number): Promise<WishlistItem> => {
  const response = await fetch(`/api/wishlist/${productId}`, {
    method: 'POST',
    headers: getAuthHeader(),
  });
  if (!response.ok) {
    throw new Error('위시리스트에 추가하지 못했습니다');
  }
  return response.json();
};

const removeFromWishlist = async (wishlistId: number): Promise<void> => {
  const response = await fetch(`/api/wishlist/${wishlistId}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('위시리스트에서 삭제하지 못했습니다');
  }
};

const checkInWishlist = async (productId: number): Promise<boolean> => {
  const response = await fetch(`/api/wishlist/${productId}/exists`, {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('위시리스트 확인에 실패했습니다');
  }
  return response.json();
};

// Custom hook
export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Query for fetching wishlist items
  const { data, isLoading, error } = useQuery({
    queryKey: WISHLIST_QUERY_KEY,
    queryFn: fetchWishlist,
    staleTime: 1000 * 60, // 1 minute
    enabled: isAuthenticated,
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
    },
  });

  const checkMutation = useMutation({
    mutationFn: checkInWishlist,
  });

  // productId로 wishlistId를 찾아서 삭제하는 기능 추가
  const removeFromWishlistByProductId = async (productId: number): Promise<void> => {
    // 1. 현재 위시리스트 목록을 조회
    const response = await fetch('/api/wishlist', {
      headers: getAuthHeader()
    });
    if (!response.ok) {
      throw new Error('위시리스트 조회에 실패했습니다');
    }
    const wishlist = await response.json();
    
    // 2. productId에 해당하는 wishlistId 찾기
    const item = wishlist.find((item: WishlistItem) => item.productId === productId);
    if (!item) {
      throw new Error('위시리스트 항목을 찾을 수 없습니다');
    }

    // 3. wishlistId로 삭제 실행
    const deleteResponse = await fetch(`/api/wishlist/${item.wishlistId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    if (!deleteResponse.ok) {
      throw new Error('위시리스트 삭제에 실패했습니다');
    }
  };

  return {
    data: data ?? [],
    isLoading,
    error,
    mutations: {
      addToWishlist: isAuthenticated 
        ? addMutation.mutateAsync 
        : () => Promise.reject('로그인이 필요합니다'),
      removeFromWishlist: isAuthenticated 
        ? removeMutation.mutateAsync 
        : () => Promise.reject('로그인이 필요합니다'),
      removeFromWishlistByProductId: isAuthenticated
        ? async (productId: number) => {
            await removeFromWishlistByProductId(productId);
            queryClient.invalidateQueries({ queryKey: WISHLIST_QUERY_KEY });
          }
        : () => Promise.reject('로그인이 필요합니다'),
      checkInWishlist: isAuthenticated 
        ? checkMutation.mutateAsync 
        : () => Promise.reject('로그인이 필요합니다'),
    },
  };
};