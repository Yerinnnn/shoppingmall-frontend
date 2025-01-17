export const PointInput: React.FC<{
  value: number;
  onChange: (value: number) => void;
  maxPoints: number;
}> = ({ value, onChange, maxPoints }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">포인트 사용</h3>
      {/* 포인트 입력 폼 */}
    </div>
  );
};