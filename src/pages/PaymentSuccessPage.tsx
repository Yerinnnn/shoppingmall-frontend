import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Clock, ChevronRight } from 'lucide-react';

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const orderId = searchParams.get('orderId');
  const paymentKey = searchParams.get('paymentKey');
  const amount = searchParams.get('amount');

  const handleGoToOrderDetail = () => {
    navigate(`/orders/${orderId}`);
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* 결제 완료 상태 */}
        <div className="text-center mb-12">
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">결제가 완료되었습니다</h1>
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
                {Number(amount).toLocaleString()}원
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
          <div className="flex items-start space-x-3">
            <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-gray-600">
                주문하신 상품은 결제 확인 후 2-3일 이내에 출고될 예정입니다.
                배송이 시작되면 알림을 통해 안내해 드리겠습니다.
              </p>
            </div>
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