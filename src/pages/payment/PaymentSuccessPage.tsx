import React from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface LocationState {
  orderId?: string;
  paymentKey?: string;
}

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // 경로 상태의 타입을 명시적으로 지정
  const state = location.state as LocationState | null;

  // URL 파라미터나 상태에서 주문 ID 가져오기
  const orderId = state?.orderId || searchParams.get('orderId');
  const paymentKey = state?.paymentKey || searchParams.get('paymentKey');
  const amount = searchParams.get('amount');

  const handleGoToOrderDetail = () => {
    if (orderId) {
      navigate(`/orders/${orderId}`);
    } else {
      alert('주문 정보를 찾을 수 없습니다.');
    }
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  // 예상 배송일 계산 (현재일 + 3일)
  const estimatedDeliveryDate = new Date();
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 3);
  const formatDate = (date: Date) => {
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* 결제 완료 상태 */}
        <div className="text-center mb-12">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            결제가 완료되었습니다
          </h1>
          <p className="mt-2 text-gray-600">
            주문하신 상품의 결제가 정상적으로 완료되었습니다
          </p>
        </div>

        {/* 결제 정보 */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">결제 정보</h2>
          <dl className="divide-y">
            <div className="py-3 flex justify-between">
              <dt className="text-gray-600">주문번호</dt>
              <dd className="font-medium">{orderId}</dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-gray-600">결제금액</dt>
              <dd className="font-medium">
                {amount ? Number(amount).toLocaleString() : '0'}원
              </dd>
            </div>
            <div className="py-3 flex items-center justify-between">
              <dt className="text-gray-600">결제상태</dt>
              <dd className="flex items-center text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                결제완료
              </dd>
            </div>
          </dl>
        </div>

        {/* 배송 안내 */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">배송 안내</h2>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span>배송은 영업일 기준 1-3일 내에 시작됩니다.</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>예상 배송일: {formatDate(estimatedDeliveryDate)}</span>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleGoToOrderDetail}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg 
                     hover:bg-indigo-700 flex items-center justify-center"
          >
            주문 상세보기
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
          <button
            onClick={handleGoToHome}
            className="w-full py-3 bg-white text-gray-700 font-medium rounded-lg 
                     border border-gray-300 hover:bg-gray-50"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;