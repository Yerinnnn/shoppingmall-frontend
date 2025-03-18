import { apiClient } from '../../../services/apiClient';
import { Order, CreateOrderRequest } from '../types';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  detail: (orderId: number) => [...orderKeys.all, 'detail', orderId] as const,
};

export const fetchOrders = async (): Promise<Order[]> => {
  return apiClient.get('/orders');
};

export const fetchOrderDetail = async (orderId: number): Promise<Order> => {
  return apiClient.get(`/orders/${orderId}`);
};

export const createOrder = async (orderData: CreateOrderRequest): Promise<Order> => {
  return apiClient.post('/orders', orderData);
};

export const cancelOrder = async (orderId: number): Promise<Order> => {
  return apiClient.post(`/orders/${orderId}/cancel`);
};

export const confirmOrder = async (orderId: number): Promise<Order> => {
  return apiClient.post(`/orders/${orderId}/confirm`);
};