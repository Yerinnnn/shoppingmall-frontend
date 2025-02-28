// features/auth/components/PaymentMethodInput.tsx
import React from 'react';
import { PaymentMethodForm } from '../types';
import { formatCardNumber, formatExpiryDate } from '../utils/formUtils';

interface PaymentMethodInputProps {
  paymentMethod: PaymentMethodForm;
  onChange: (paymentMethod: PaymentMethodForm) => void;
  errors?: {
    cardNumber?: string;
    expiryDate?: string;
  };
}

const PaymentMethodInput: React.FC<PaymentMethodInputProps> = ({ 
  paymentMethod, 
  onChange,
  errors 
}) => {
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    onChange({
      ...paymentMethod,
      cardNumber: formatted
    });
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    onChange({
      ...paymentMethod,
      expiryDate: formatted
    });
  };

  return (
    <div className="mb-6">
      <h3 className="block text-gray-700 font-bold mb-2">Payment Method</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
            Card Number
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors?.cardNumber ? 'border-red-500' : ''
            }`}
            id="cardNumber"
            type="text"
            placeholder="1234 5678 9012 3456"
            value={paymentMethod.cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
          />
          {errors?.cardNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiryDate">
            Expiry Date
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              errors?.expiryDate ? 'border-red-500' : ''
            }`}
            id="expiryDate"
            type="text"
            placeholder="MM/YY"
            value={paymentMethod.expiryDate}
            onChange={handleExpiryDateChange}
            maxLength={5}
          />
          {errors?.expiryDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodInput;