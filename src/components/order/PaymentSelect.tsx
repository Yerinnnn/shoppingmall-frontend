export const PaymentSelect: React.FC<{
  selectedId: number | null;
  onSelect: (id: number) => void;
}> = ({ selectedId, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">결제수단 선택</h3>
      {/* 저장된 결제수단 목록 */}
      {/* 새 결제수단 입력 폼 */}
    </div>
  );
};