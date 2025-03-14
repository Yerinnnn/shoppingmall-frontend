import React, { useState } from "react";

interface PointInputProps {
  maxPoints: number; // 사용 가능한 최대 포인트
  maxAmount: number; // 주문 금액
  onChange: (points: number) => void;
}

const PointInput: React.FC<PointInputProps> = ({
  maxPoints,
  maxAmount,
  onChange,
}) => {
  const [points, setPoints] = useState<number>(0);

  const handlePointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    const validValue = Math.min(value, maxPoints, maxAmount);
    setPoints(validValue);
    onChange(validValue);
  };

  const handleAllPointsClick = () => {
    const maxUsablePoints = Math.min(maxPoints, maxAmount);
    setPoints(maxUsablePoints);
    onChange(maxUsablePoints);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">포인트 사용</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>사용 가능한 포인트</span>
          <span>{maxPoints.toLocaleString()} P</span>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={points || ""}
            onChange={handlePointChange}
            min="0"
            max={Math.min(maxPoints, maxAmount)}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
          <button
            onClick={handleAllPointsClick}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            전액사용
          </button>
        </div>

        {points > 0 && (
          <div className="text-sm text-blue-600">
            {points.toLocaleString()}P 사용 예정
          </div>
        )}
      </div>
    </div>
  );
};

export default PointInput;
