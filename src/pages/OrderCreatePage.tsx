import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { OrderForm } from '../components/order/OrderForm';
import { OrderItems } from '../components/order/OrderItems';
import { OrderPaymentSummary } from '../components/order/OrderPaymentSummary';
import { PaymentType, PaymentSummary } from '../types/payment';
import { CartItem } from '../types/cart';
import { OrderItem } from '../types/order';
import { toast } from 'react-hot-toast';

interface LocationState {
  cartItems: CartItem[];
  summary: PaymentSummary;
}

const OrderCreatePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems = [], summary: initialSummary } = 
    (location.state as LocationState) || { cartItems: [], summary: { 
      subtotal: 0, 
      shippingFee: 0, 
      discount: 0, 
      pointsUsed: 0,
      total: 0 
    }};

    const convertCartItemsToOrderItems = (cartItems: CartItem[]): OrderItem[] => {
      return cartItems.map(item => ({
        orderItemId: Date.now() + Math.random(), // 임시 ID 생성
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.totalPrice
      }));
    };

  // 주문 상태
  const [orderId] = useState(`ORDER_${Date.now()}`);
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentType | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [summary, setSummary] = useState<PaymentSummary>(initialSummary);

  // 장바구니에서 넘어온 데이터 검증
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
      // 결제 성공 후 서버에 결제 완료 처리 요청
      const response = await fetch('/api/payments/complete', {
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

      if (!response.ok) {
        throw new Error('결제 완료 처리에 실패했습니다.');
      }

      toast.success('결제가 완료되었습니다.');
      navigate('/orders/complete', { 
        state: { orderId, paymentKey } 
      });
    } catch (error) {
      console.error('Payment completion failed:', error);
      toast.error('결제 완료 처리 중 오류가 발생했습니다.');
    }
  };

  // 결제 실패 처리
  const handlePaymentFail = (error: string) => {
    toast.error(error || '결제 처리 중 오류가 발생했습니다.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">주문/결제</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* 주문 상품 목록 */}
          <OrderItems 
            items={convertCartItemsToOrderItems(cartItems)} 
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