import React, { useState, useEffect } from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  min = 1,
  max = 99
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleDecrease = () => {
    if (localValue > min) {
      const newValue = localValue - 1;
      setLocalValue(newValue);
      onChange(newValue);
    }
  };

  const handleIncrease = () => {
    if (localValue < max) {
      const newValue = localValue + 1;
      setLocalValue(newValue);
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    if (newValue >= min && newValue <= max) {
      setLocalValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleDecrease}
        className="p-2 hover:bg-gray-100 rounded-full"
        disabled={localValue <= min}
      >
        <Minus className="w-4 h-4" />
      </button>
      <input
        type="number"
        value={localValue}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-16 text-center border-gray-200 rounded-lg mx-2"
      />
      <button
        onClick={handleIncrease}
        className="p-2 hover:bg-gray-100 rounded-full"
        disabled={localValue >= max}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
};

export default QuantityInput;