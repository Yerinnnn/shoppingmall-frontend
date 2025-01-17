export const AddressSelect: React.FC<{
  selectedId: number | null;
  onSelect: (id: number) => void;
}> = ({ selectedId, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">배송지 선택</h3>
      {/* 기존 배송지 목록 */}
      {/* 새 배송지 입력 폼 */}
    </div>
  );
};