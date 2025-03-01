import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleDecrease = () => {
    if (disabled || localValue <= min) return;
    
    const newValue = localValue - 1;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleIncrease = () => {
    if (disabled || localValue >= max) return;
    
    const newValue = localValue + 1;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const value = parseInt(e.target.value) || min;
    const newValue = Math.max(min, Math.min(max, value));
    
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={handleDecrease}
        className={`p-2 rounded-full ${
          disabled || localValue <= min 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        disabled={disabled || localValue <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="w-4 h-4" />
      </button>
      
      <input
        type="number"
        value={localValue}
        onChange={handleInputChange}
        min={min}
        max={max}
        disabled={disabled}
        className={`w-16 text-center border-gray-200 rounded-lg mx-2 ${
          disabled ? 'bg-gray-100 text-gray-400' : ''
        }`}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        className={`p-2 rounded-full ${
          disabled || localValue >= max 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        disabled={disabled || localValue >= max}
        aria-label="Increase quantity"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantityInput;