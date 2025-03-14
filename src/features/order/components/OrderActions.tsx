import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Order } from '../types';
import { useOrder } from '../hooks/useOrder';
import {
  CANCELABLE_STATUSES,
  CONFIRMABLE_STATUSES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from '../constants';

interface OrderActionsProps {
  order: Order;
  onSuccess?: () => void;
}

type CancelableStatus = typeof CANCELABLE_STATUSES[number];
type ConfirmableStatus = typeof CONFIRMABLE_STATUSES[number];

const isCancelable = (status: Order['status']): status is CancelableStatus => {
  return CANCELABLE_STATUSES.includes(status as CancelableStatus);
};

const isConfirmable = (status: Order['status']): status is ConfirmableStatus => {
  return CONFIRMABLE_STATUSES.includes(status as ConfirmableStatus);
};

const OrderActions: React.FC<OrderActionsProps> = ({ order, onSuccess }) => {
  const navigate = useNavigate();
  const { useCancelOrder, useConfirmOrder } = useOrder();
  const cancelOrderMutation = useCancelOrder();
  const confirmOrderMutation = useConfirmOrder();

  const handleCancel = async () => {
    try {
      await cancelOrderMutation.mutateAsync(order.orderId);
      toast.success(SUCCESS_MESSAGES.ORDER_CANCELLED);
      onSuccess?.();
    } catch (error) {
      toast.error(ERROR_MESSAGES.CANCEL_FAILED);
      console.error('Failed to cancel order:', error);
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmOrderMutation.mutateAsync(order.orderId);
      toast.success(SUCCESS_MESSAGES.ORDER_CONFIRMED);
      onSuccess?.();
    } catch (error) {
      toast.error(ERROR_MESSAGES.CONFIRM_FAILED);
      console.error('Failed to confirm order:', error);
    }
  };

  if (order.status === 'CANCELLED' || order.status === 'COMPLETED') {
    return (
      <div className="flex justify-center">
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-4">
      {isCancelable(order.status) && (
        <button
          onClick={handleCancel}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          주문 취소
        </button>
      )}
      
      {isConfirmable(order.status) && (
        <button
          onClick={handleConfirm}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          구매 확정
        </button>
      )}

      <button
        onClick={() => navigate('/orders')}
        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
      >
        목록으로
      </button>
    </div>
  );
};

export default OrderActions;