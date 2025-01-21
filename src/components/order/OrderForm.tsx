import React, { useState } from 'react';
import AddressSelect from './AddressSelect';
import { PaymentSelect } from './PaymentSelect';
import { PointInput } from './PointInput';

export const OrderForm: React.FC = () => {
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const [usePoints, setUsePoints] = useState<number>(0);

  return (
    <div className="space-y-8">
      <AddressSelect
        selectedId={selectedAddressId}
        onSelect={setSelectedAddressId}
      />
      <PaymentSelect
        selectedId={selectedPaymentId}
        onSelect={setSelectedPaymentId}
      />
      <PointInput
        value={usePoints}
        onChange={setUsePoints}
        maxPoints={10000} // 사용자의 보유 포인트
      />
    </div>
  );
};