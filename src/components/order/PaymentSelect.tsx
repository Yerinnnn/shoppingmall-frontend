import React, { useEffect, useState } from 'react';
import { CreditCard, FileText, Wallet } from 'lucide-react';
import { PaymentMethod, PaymentType } from '../../types/payment';
import { log } from 'console';

interface PaymentSelectProps {
  selectedPaymentType: PaymentType | null;
  selectedMethodId: number | null;
  onSelectPaymentType: (type: PaymentType) => void;
  onSelectMethod: (methodId: number) => void;
}

// 결제 방식별 레이블과 아이콘 매핑
const PAYMENT_TYPE_INFO = {
  [PaymentType.CARD]: {
    label: '카드결제/간편결제',
    // icon: CreditCard,
    description: '신용/체크카드 결제 및 간편결제'
  },
  [PaymentType.VIRTUAL]: {
    label: '무통장입금',
    // icon: FileText,
    description: '가상계좌 발급 후 계좌이체'
  },
  [PaymentType.NORMAL]: {
    label: '일반결제',
    // icon: Wallet,
    description: '일반 결제'
  }
};

export const PaymentSelect: React.FC<PaymentSelectProps> = ({
  selectedPaymentType,
  selectedMethodId,
  onSelectPaymentType,
  onSelectMethod
}) => {
  const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);  // 초기값을 false로 변경
  const [error, setError] = useState<string | null>(null);

  // 저장된 결제수단 조회
  // 저장된 결제수단 조회
useEffect(() => {
  const fetchPaymentMethods = async () => {
    // 카드 결제 타입이 선택된 경우에만 API 호출
    console.log(selectedPaymentType);

    if (selectedPaymentType === PaymentType.CARD) {
      setLoading(true);
      try {
        // 실제 API 호출 대신 임시 데이터 사용
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
        setLoading(false);

        // 실제 API가 준비되면 아래 코드 사용
        /*
        const response = await fetch('/api/payment-methods', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('결제수단을 불러오는데 실패했습니다.');
        }

        const data = await response.json();
        setSavedMethods(data);
        */

      } catch (err) {
        setError(err instanceof Error ? err.message : '결제수단 로딩 실패');
        console.error('Payment methods fetch error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      setSavedMethods([]);
      setLoading(false);
    }
  };

  fetchPaymentMethods();
}, [selectedPaymentType]);

  // 디버깅을 위한 로그 추가
  console.log('Payment Select State:', { 
    loading, 
    selectedPaymentType,
    savedMethods,
    error 
  });

  // 로딩 중이더라도 결제 방식 선택 UI는 보여줌
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-6">결제수단 선택</h3>

      {/* 결제 방식 선택 UI - 항상 표시 */}
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
            {type === PaymentType.CARD && '카드결제'}
            {type === PaymentType.VIRTUAL && '무통장입금'}
            {type === PaymentType.NORMAL && '일반결제'}
          </button>
        ))}
      </div>

      {/* 카드 결제 수단 선택 UI - 카드 결제 선택 시에만 표시
      {selectedPaymentType === PaymentType.CARD && (
        <div className="mt-6">
          {loading ? (
            <div className="space-y-4">
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
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
      )} */}
    </div>
  );
};