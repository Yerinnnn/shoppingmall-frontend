import React, { useEffect, useState } from 'react';
import { PaymentMethod, PaymentType } from '../../../types/payment'; // 공유 타입 사용
import { apiClient } from '../../../services/apiClient';

// 결제 방식별 레이블과 설명
const PAYMENT_TYPE_INFO = {
  [PaymentType.CARD]: {
    label: '카드결제',
    description: '신용/체크카드 결제 및 간편결제'
  },
  [PaymentType.VIRTUAL]: {
    label: '무통장입금',
    description: '가상계좌 발급 후 계좌이체'
  },
  [PaymentType.NORMAL]: {
    label: '일반결제',
    description: '일반 결제'
  }
};

interface PaymentSelectProps {
  selectedPaymentType: PaymentType | null;
  selectedMethodId: number | null;
  onSelectPaymentType: (type: PaymentType) => void;
  onSelectMethod: (methodId: number) => void;
}

const PaymentSelect: React.FC<PaymentSelectProps> = ({
  selectedPaymentType,
  selectedMethodId,
  onSelectPaymentType,
  onSelectMethod
}) => {
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 저장된 결제수단 조회
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      // 카드 결제 타입이 선택된 경우에만 API 호출
      if (selectedPaymentType === PaymentType.CARD) {
        setLoading(true);
        try {
          // 개발 단계에서는 mock 데이터 사용
          // TODO: 실제 API 연동으로 대체
          const mockData: PaymentMethod[] = [
            {
              paymentMethodId: 1,
              paymentType: 'CREDIT_CARD',
              cardNumber: '****-****-****-1234',
              expiryDate: '12/25',
              isDefault: true
            },
            {
              paymentMethodId: 2,
              paymentType: 'CREDIT_CARD',
              cardNumber: '****-****-****-5678',
              expiryDate: '06/24',
              isDefault: false
            }
          ];
          
          setSavedMethods(mockData);
          
          // 실제 API 연동 코드
          // const data = await apiClient.get('/api/payment-methods');
          // setSavedMethods(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : '결제수단 로딩 실패');
          console.error('Payment methods fetch error:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setSavedMethods([]);
      }
    };

    fetchPaymentMethods();
  }, [selectedPaymentType]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-6">결제수단 선택</h3>

      {/* 결제 방식 선택 UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {Object.values(PaymentType).map((type) => (
          <button
            key={type}
            onClick={() => onSelectPaymentType(type)}
            className={`p-4 border rounded-lg transition-all ${
              selectedPaymentType === type
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
          >
            <div className="font-medium">{PAYMENT_TYPE_INFO[type].label}</div>
            <div className="text-sm text-gray-500 mt-1">{PAYMENT_TYPE_INFO[type].description}</div>
          </button>
        ))}
      </div>

      {/* 저장된 카드 선택 UI (향후 구현) */}
      {selectedPaymentType === PaymentType.CARD && savedMethods.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">저장된 카드</h4>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {savedMethods.map((method) => (
                <button
                  key={method.paymentMethodId}
                  onClick={() => onSelectMethod(method.paymentMethodId)}
                  className={`w-full p-4 border rounded-lg text-left ${
                    selectedMethodId === method.paymentMethodId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="font-medium">{method.cardNumber}</div>
                  <div className="text-sm text-gray-500">
                    유효기간: {method.expiryDate}
                  </div>
                </button>
              ))}
              
              <button
                onClick={() => onSelectMethod(-1)}
                className={`w-full p-4 border rounded-lg text-left ${
                  selectedMethodId === -1
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                <div className="font-medium">새 카드로 결제</div>
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentSelect;