import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { CartItem } from '../types/cart';
import { useNavigate } from 'react-router-dom';

const CART_QUERY_KEY = ['cart'] as const;

// Auth header helper
const getAuthHeader = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// API functions
const fetchCart = async (): Promise<CartItem[]> => {
  const response = await fetch('/api/cart', {
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('장바구니를 불러오는데 실패했습니다');
  }
  return response.json();
};

const addToCart = async ({ productId, quantity }: { 
  productId: number; 
  quantity: number;
}) => {
  const response = await fetch('/api/cart', {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ productId, quantity }),
  });
  if (!response.ok) {
    throw new Error('상품을 장바구니에 담지 못했습니다');
  }
  return response.json();
};

const updateCartItem = async ({ cartId, quantity }: { 
  cartId: number; 
  quantity: number;
}): Promise<void> => {
  const response = await fetch(`/api/cart/${cartId}?quantity=${quantity}`, {
    method: 'PUT',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('수량 변경에 실패했습니다');
  }
};

const removeCartItem = async (cartId: number): Promise<void> => {
  const response = await fetch(`/api/cart/${cartId}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('상품 삭제에 실패했습니다');
  }
};

const clearCart = async (): Promise<void> => {
  const response = await fetch('/api/cart', {
    method: 'DELETE',
    headers: getAuthHeader()
  });
  if (!response.ok) {
    throw new Error('장바구니 비우기에 실패했습니다');
  }
};

// Custom hook
export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check authentication using useEffect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Query for fetching cart items
  const { data, isLoading, error } = useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: fetchCart,
    staleTime: 1000 * 60, // 1 minute
    enabled: isAuthenticated, // Only fetch if authenticated
  });

  // Mutations
  const updateQuantityMutation = useMutation({
    mutationFn: updateCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEY });
    },
  });

  return {
    data: data ?? [],
    isLoading,
    error,
    mutations: {
      addToCart: isAuthenticated ? addToCartMutation.mutateAsync : () => Promise.reject('로그인이 필요합니다'),
      updateQuantity: isAuthenticated 
        ? (cartId: number, quantity: number) => updateQuantityMutation.mutateAsync({ cartId, quantity })
        : () => Promise.reject('로그인이 필요합니다'),
      removeItem: isAuthenticated 
        ? (cartId: number) => removeItemMutation.mutateAsync(cartId)
        : () => Promise.reject('로그인이 필요합니다'),
      clearCart: isAuthenticated 
        ? () => clearCartMutation.mutateAsync()
        : () => Promise.reject('로그인이 필요합니다'),
    },
  };
};