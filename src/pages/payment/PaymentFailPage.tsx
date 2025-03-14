import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, ChevronLeft } from 'lucide-react';

const PaymentFailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  const handleRetryPayment = () => {
    navigate('/cart', { replace: true });
  };

  const getErrorMessage = () => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '결제가 취소되었습니다';
      case 'PAY_PROCESS_ABORTED':
        return '결제 진행 중 문제가 발생했습니다';
      case 'INVALID_CARD_COMPANY':
        return '지원하지 않는 카드사입니다';
      case 'INVALID_CARD_NUMBER':
        return '잘못된 카드 번호입니다';
      default:
        return message || '결제 처리 중 오류가 발생했습니다';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* 결제 실패 상태 */}
        <div className="text-center mb-12">
          <XCircle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">결제 실패</h1>
          <p className="mt-2 text-gray-600">
            {getErrorMessage()}
          </p>
        </div>

        {/* 결제 실패 정보 */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">오류 정보</h2>
          <dl className="divide-y">
            <div className="py-3 flex justify-between">
              <dt className="text-gray-600">주문번호</dt>
              <dd className="font-medium">{orderId}</dd>
            </div>
            <div className="py-3 flex justify-between">
              <dt className="text-gray-600">오류 코드</dt>
              <dd className="font-medium text-red-600">{code}</dd>
            </div>
          </dl>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-yellow-800">
            결제가 정상적으로 처리되지 않았습니다. 
            잠시 후 다시 시도해주세요. 
            문제가 지속되면 고객센터로 문의해주시기 바랍니다.
          </p>
        </div>

        {/* 버튼 영역 */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={handleRetryPayment}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg 
                     hover:bg-indigo-700 flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            결제 다시 시도하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailPage;