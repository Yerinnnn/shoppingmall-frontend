import React, { useState } from "react";
import AddressSelect from "./AddressSelect";
import PaymentSelect from "./PaymentSelect";
import PointInput from "./PointInput";
import { PaymentType } from "../../../types/payment"; // 공유 타입 사용

interface OrderFormProps {
  summary: {
    subtotal: number;
    shippingFee: number;
    discount: number;
    pointsUsed: number;
    total: number;
  };
  onPaymentMethodSelect: (
    paymentType: PaymentType,
    methodId: number | null
  ) => void;
  onPointsUseChange: (points: number) => void;
  onAddressSelect: (addressId: number) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  summary,
  onPaymentMethodSelect,
  onPointsUseChange,
  onAddressSelect,
}) => {
  const [selectedPaymentType, setSelectedPaymentType] =
    useState<PaymentType | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );

  // 결제 방식 선택 핸들러
  const handlePaymentTypeSelect = (type: PaymentType) => {
    setSelectedPaymentType(type);
    setSelectedMethodId(null); // 결제 방식이 변경되면 선택된 결제수단 초기화
    onPaymentMethodSelect(type, null);
  };

  // 결제수단 선택 핸들러
  const handleMethodSelect = (methodId: number) => {
    setSelectedMethodId(methodId);
    if (selectedPaymentType) {
      onPaymentMethodSelect(selectedPaymentType, methodId);
    }
  };

  // 주소 선택 핸들러
  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId);
    onAddressSelect(addressId);
  };

  return (
    <div className="space-y-8">
      {/* 배송지 선택 */}
      <AddressSelect
        selectedId={selectedAddressId}
        onSelect={handleAddressSelect}
      />

      {/* 결제 수단 선택 */}
      <PaymentSelect
        selectedPaymentType={selectedPaymentType}
        selectedMethodId={selectedMethodId}
        onSelectPaymentType={handlePaymentTypeSelect}
        onSelectMethod={handleMethodSelect}
      />

      {/* 포인트 사용 */}
      <PointInput
        maxPoints={10000} // TODO: 실제 사용자의 보유 포인트로 대체 - 사용자 정보에서 가져오도록 변경
        maxAmount={summary.total}
        onChange={onPointsUseChange}
      />
    </div>
  );
};

export default OrderForm;
