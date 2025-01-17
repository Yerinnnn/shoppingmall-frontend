import { useQuery, useMutation, useQueryClient, UseQueryResult, UseQueryOptions } from '@tanstack/react-query';
import { Order, CreateOrderRequest } from '../types/order';
import { useNavigate } from 'react-router-dom';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  detail: (orderId: number) => [...orderKeys.all, 'detail', orderId] as const,
};

// API 호출 함수들
const fetchOrders = async (): Promise<Order[]> => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('로그인이 필요합니다');

  const response = await fetch('/api/orders', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('로그인이 필요합니다');
    throw new Error('Failed to fetch orders');
  }

  return response.json();
};

const fetchOrderDetail = async (orderId: number): Promise<Order> => {
  const token = localStorage.getItem('auth_token');
  if (!token) throw new Error('로그인이 필요합니다');

  const response = await fetch(`/api/orders/${orderId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error('로그인이 필요합니다');
    throw new Error('Failed to fetch order detail');
  }

  return response.json();
};

export const useOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const useOrders = (options?: Omit<UseQueryOptions<Order[], Error>, 'queryKey' | 'queryFn'>): UseQueryResult<Order[], Error> => {
    return useQuery<Order[], Error>({
      queryKey: orderKeys.lists(),
      queryFn: fetchOrders,
      ...options
    });
  };

  const useOrderDetail = (
    orderId: number,
    options?: Omit<UseQueryOptions<Order, Error>, 'queryKey' | 'queryFn'>
  ): UseQueryResult<Order, Error> => {
    return useQuery<Order, Error>({
      queryKey: orderKeys.detail(orderId),
      queryFn: () => fetchOrderDetail(orderId),
      enabled: !!orderId,
      ...options
    });
  };

  // Mutations
  const createOrderMutation = useMutation<Order, Error, CreateOrderRequest>({
    mutationFn: async (orderData) => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('로그인이 필요합니다');

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('로그인이 필요합니다');
        throw new Error('Failed to create order');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      if (error.message === '로그인이 필요합니다') {
        navigate('/login');
      }
    }
  });

  const cancelOrderMutation = useMutation<Order, Error, number>({
    mutationFn: async (orderId) => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('로그인이 필요합니다');

      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('로그인이 필요합니다');
        throw new Error('Failed to cancel order');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      if (error.message === '로그인이 필요합니다') {
        navigate('/login');
      }
    }
  });

  const confirmOrderMutation = useMutation<Order, Error, number>({
    mutationFn: async (orderId) => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('로그인이 필요합니다');

      const response = await fetch(`/api/orders/${orderId}/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('로그인이 필요합니다');
        throw new Error('Failed to confirm order');
      }

      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.orderId) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
    onError: (error) => {
      if (error.message === '로그인이 필요합니다') {
        navigate('/login');
      }
    }
  });

  return {
    queries: {
      useOrders,
      useOrderDetail,
    },
    mutations: {
      createOrder: createOrderMutation.mutateAsync,
      cancelOrder: cancelOrderMutation.mutateAsync,
      confirmOrder: confirmOrderMutation.mutateAsync,
    },
  };
};