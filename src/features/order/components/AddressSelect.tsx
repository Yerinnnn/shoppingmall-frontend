import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Address } from "../../../types/address"; // 공유 타입 사용
import api from "../../../services/apiClient";

// 단일 컴포넌트에서만 사용하므로 전역 타입 충돌 방지를 위해 인터페이스 변경
interface DaumPostcodeData {
  zonecode: string;
  roadAddress: string;
  [key: string]: any;
}

interface DaumPostcode {
  open: () => void;
}

interface AddressSelectProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const AddressSelect: React.FC<AddressSelectProps> = ({
  selectedId,
  onSelect,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    postalCode: "",
    roadAddress: "",
    detailAddress: "",
  });
  const [error, setError] = useState<string | null>(null);

  // 저장된 주소 목록 불러오기
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // api를 사용하여 직접 데이터에 접근
        const data = await api.get<{ addresses: Address[] }>("/members/me");
        setAddresses(data.addresses);
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError(
          err instanceof Error
            ? err.message
            : "주소 목록을 불러오는데 실패했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  // Daum 우편번호 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const openPostcode = () => {
    if (!(window as any).daum) {
      alert("우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new (window as any).daum.Postcode({
      oncomplete: (data: DaumPostcodeData) => {
        setNewAddress({
          postalCode: data.zonecode,
          roadAddress: data.roadAddress,
          detailAddress: "",
        });
      },
    }).open();
  };

  const handleSubmitNewAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.roadAddress || !newAddress.postalCode) {
      setError("주소를 입력해주세요.");
      return;
    }

    try {
      // api를 사용하여 응답 데이터 타입 명시
      const savedAddress = await api.post<Address>(
        "/members/me/addresses",
        newAddress
      );

      // Address 타입으로 명시적 타입 지정
      setAddresses((prev) => [...prev, savedAddress]);
      setShowNewForm(false);
      setNewAddress({ postalCode: "", roadAddress: "", detailAddress: "" });

      // 새로 추가된 주소를 선택 상태로 만듦
      onSelect(savedAddress.addressId);
    } catch (err) {
      console.error("Error adding address:", err);
      setError(
        err instanceof Error ? err.message : "배송지 추가에 실패했습니다."
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">배송지 선택</h3>

      {/* 기존 배송지 목록 */}
      <div className="space-y-3 mb-4">
        {addresses.map((addr) => (
          <label
            key={addr.addressId}
            className="flex items-start p-4 border rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
          >
            <input
              type="radio"
              name="address"
              className="mt-1"
              checked={selectedId === addr.addressId}
              onChange={() => onSelect(addr.addressId)}
            />
            <div className="ml-4">
              <p className="font-medium">{addr.fullAddress}</p>
              <p className="text-sm text-gray-500">{addr.postalCode}</p>
            </div>
          </label>
        ))}
      </div>

      {/* 새 배송지 추가 버튼 */}
      {!showNewForm && (
        <button
          onClick={() => setShowNewForm(true)}
          className="flex items-center text-indigo-600 hover:text-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />새 배송지 추가
        </button>
      )}

      {/* 새 배송지 입력 폼 */}
      {showNewForm && (
        <form onSubmit={handleSubmitNewAddress} className="mt-4 space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                우편번호
              </label>
              <input
                type="text"
                value={newAddress.postalCode}
                readOnly
                className="w-full p-2 border rounded-lg bg-gray-50"
                placeholder="우편번호"
              />
            </div>
            <button
              type="button"
              onClick={openPostcode}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              우편번호 검색
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              도로명 주소
            </label>
            <input
              type="text"
              value={newAddress.roadAddress}
              readOnly
              className="w-full p-2 border rounded-lg bg-gray-50"
              placeholder="도로명 주소"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              상세주소
            </label>
            <input
              type="text"
              value={newAddress.detailAddress}
              onChange={(e) =>
                setNewAddress({ ...newAddress, detailAddress: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="상세주소를 입력하세요"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              저장
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressSelect;
