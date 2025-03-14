import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  fetchOrders, 
  fetchOrderDetail, 
  createOrder, 
  cancelOrder, 
  confirmOrder, 
  orderKeys 
} from '../api/orderApi';
import { CreateOrderRequest } from '../types';

export const useOrder = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Queries
  const useOrderList = (options = {}) => {
    return useQuery({
      queryKey: orderKeys.lists(),
      queryFn: fetchOrders,
      ...options
    });
  };

  const useOrderDetail = (orderId: number, options = {}) => {
    return useQuery({
      queryKey: orderKeys.detail(orderId),
      queryFn: () => fetchOrderDetail(orderId),
      enabled: !!orderId,
      ...options
    });
  };

  // Mutations
  const useCreateOrder = () => {
    return useMutation({
      mutationFn: (orderData: CreateOrderRequest) => createOrder(orderData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      },
      onError: (error: Error) => {
        if (error.message === '로그인이 필요합니다') {
          navigate('/login');
        }
      }
    });
  };

  const useCancelOrder = () => {
    return useMutation({
      mutationFn: (orderId: number) => cancelOrder(orderId),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.orderId) });
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      },
      onError: (error: Error) => {
        if (error.message === '로그인이 필요합니다') {
          navigate('/login');
        }
      }
    });
  };

  const useConfirmOrder = () => {
    return useMutation({
      mutationFn: (orderId: number) => confirmOrder(orderId),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: orderKeys.detail(data.orderId) });
        queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      },
      onError: (error: Error) => {
        if (error.message === '로그인이 필요합니다') {
          navigate('/login');
        }
      }
    });
  };

  return {
    useOrderList,
    useOrderDetail,
    useCreateOrder,
    useCancelOrder,
    useConfirmOrder
  };
};