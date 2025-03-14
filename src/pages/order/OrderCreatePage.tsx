import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PaymentType } from '../../types/payment';
import { CartItem } from '../../features/cart/types';
import OrderForm from '../../features/order/components/OrderForm';
import OrderItems from '../../features/order/components/OrderItems';
import OrderPaymentSummary from '../../features/order/components/OrderPaymentSummary';
import { useOrder } from '../../features/order/hooks/useOrder';
import { OrderItem } from '../../features/order/types';

interface LocationState {
  cartItems: CartItem[];
  summary: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    total: number;
  };
}

const OrderCreatePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { useCreateOrder } = useOrder();
  const createOrderMutation = useCreateOrder();

  // 장바구니 데이터 및 요약 정보
  const { cartItems = [], summary: initialSummary } = 
    (location.state as LocationState) || { 
      cartItems: [], 
      summary: { 
        subtotal: 0, 
        shippingFee: 0, 
        discount: 0,
        total: 0 
      }
    };

  // 상태 관리
  const [orderId] = useState(`ORDER_${Date.now()}`);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [summary, setSummary] = useState({
    ...initialSummary,
    pointsUsed: 0,
    total: initialSummary.total
  });

  // 장바구니 아이템을 주문 아이템으로 변환
  const convertCartItemsToOrderItems = (cartItems: CartItem[]): OrderItem[] => {
    return cartItems.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.totalPrice
    }));
  };

  // 장바구니 데이터 검증
  useEffect(() => {
    if (!cartItems?.length) {
      toast.error('잘못된 접근입니다.');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // 결제수단 선택 처리
  const handlePaymentMethodSelect = (paymentType: PaymentType, methodId: number | null) => {
    setSelectedPaymentType(paymentType);
    setSelectedMethodId(methodId);
  };

  // 포인트 사용 처리
  const handlePointsUseChange = (points: number) => {
    setPointsUsed(points);
    setSummary(prev => ({
      ...prev,
      pointsUsed: points,
      total: prev.subtotal + prev.shippingFee - prev.discount - points
    }));
  };

  // 배송지 선택 처리
  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId);
  };

  // 결제 성공 처리
  const handlePaymentSuccess = async (paymentKey: string) => {
    try {
      // 결제 성공 후 주문 생성
      await createOrderMutation.mutateAsync({
        deliveryAddressId: selectedAddressId!,
        paymentMethodId: selectedMethodId || -1,
        usePoints: pointsUsed,
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      });

      // 결제 완료 처리
      const paymentCompleteResponse = await fetch('/api/payments/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: summary.total
        })
      });

      if (!paymentCompleteResponse.ok) {
        throw new Error('결제 완료 처리에 실패했습니다.');
      }

      toast.success('결제가 완료되었습니다.');
      navigate('/payments/success', { 
        state: { 
          orderId, 
          paymentKey,
          amount: summary.total
        } 
      });
    } catch (error) {
      console.error('Order creation failed:', error);
      toast.error(error instanceof Error ? error.message : '주문 처리 중 오류가 발생했습니다.');
      navigate('/payments/fail', {
        state: {
          orderId,
          message: error instanceof Error ? error.message : '주문 처리 중 오류가 발생했습니다.'
        }
      });
    }
  };

  // 결제 실패 처리
  const handlePaymentFail = (error: string) => {
    toast.error(error || '결제 처리 중 오류가 발생했습니다.');
  };

  // 주문 항목 렌더링
  const orderItems = convertCartItemsToOrderItems(cartItems);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">주문/결제</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 주문 상품 목록 */}
          <OrderItems 
            items={orderItems} 
            totalAmount={summary.total}
          />

          {/* 주문 폼 */}
          <OrderForm
            summary={summary}
            onPaymentMethodSelect={handlePaymentMethodSelect}
            onPointsUseChange={handlePointsUseChange}
            onAddressSelect={handleAddressSelect}
          />
        </div>

        {/* 결제 금액 및 결제하기 */}
        <div>
          <OrderPaymentSummary
            orderId={orderId}
            orderName={`${cartItems[0]?.productName} ${
              cartItems.length > 1 ? `외 ${cartItems.length - 1}건` : ''
            }`}
            summary={summary}
            selectedPaymentType={selectedPaymentType}
            selectedMethodId={selectedMethodId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFail={handlePaymentFail}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderCreatePage;