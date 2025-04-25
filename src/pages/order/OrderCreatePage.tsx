import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { PaymentType } from '../../types/payment';
import { CartItem } from '../../features/cart/types';
import OrderForm from '../../features/order/components/OrderForm';
import OrderItems from '../../features/order/components/OrderItems';
import OrderPaymentSummary from '../../features/order/components/OrderPaymentSummary';
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
    
    // 카트 아이템을 localStorage에 저장 (결제 처리를 위해)
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
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

  // 결제 성공 처리 (주문 생성은 결제 과정 중 먼저 수행하므로 이 함수는 간소화)
  const handlePaymentSuccess = async (paymentKey: string) => {
    // localStorage에서 실제 주문 ID 가져오기
    const actualOrderId = localStorage.getItem('lastOrderId');

    // 실제 주문 ID가 없으면 처리
    if (!actualOrderId) {
      toast.error('주문 정보를 찾을 수 없습니다.');
      return;
    }

    // 결제 성공 시 추가 처리 (로깅 등) 가능
    toast.success('결제가 완료되었습니다.');
    
    // 이제 PaymentSuccessPage에서 결제 확인이 이루어지므로 
    // 여기서는 정보만 전달하고 나머지 처리는 해당 페이지에서 수행
    navigate('/payments/success', { 
      state: { 
        orderId: actualOrderId, 
        paymentKey,
        amount: summary.total
      } 
    });
  };

  // 결제 실패 처리
  const handlePaymentFail = (error: string) => {
    // localStorage에서 실제 주문 ID 가져오기
    const actualOrderId = localStorage.getItem('lastOrderId');
    
    toast.error(error || '결제 처리 중 오류가 발생했습니다.');
    navigate('/payments/fail', {
      state: {
        orderId: actualOrderId,
        message: error || '결제 처리 중 오류가 발생했습니다.'
      }
    });
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
            orderName={`${cartItems[0]?.productName} ${
              cartItems.length > 1 ? `외 ${cartItems.length - 1}건` : ''
            }`}
            summary={summary}
            selectedPaymentType={selectedPaymentType}
            selectedMethodId={selectedMethodId}
            selectedAddressId={selectedAddressId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFail={handlePaymentFail}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderCreatePage;