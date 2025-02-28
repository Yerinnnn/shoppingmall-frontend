import React from 'react';
import { AddressForm } from '../../../common/types';
import { loadDaumPostcode } from '../utils/formUtils';

interface AddressInputProps {
  address: AddressForm;
  onChange: (address: AddressForm) => void;
  errors?: {
    postalCode?: string;
    roadAddress?: string;
    detailAddress?: string;
  };
}

const AddressInput: React.FC<AddressInputProps> = ({ address, onChange, errors }) => {
  const openPostcode = async () => {
    try {
      await loadDaumPostcode();
      
      if (!window.daum) {
        alert('우편번호 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
        return;
      }
      
      new window.daum.Postcode({
        oncomplete: (data: any) => {
          onChange({
            ...address,
            postalCode: data.zonecode,
            roadAddress: data.roadAddress,
          });
        }
      }).open();
    } catch (error) {
      alert('우편번호 서비스를 불러오는데 실패했습니다.');
      console.error(error);
    }
  };

  const handleDetailAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...address,
      detailAddress: e.target.value
    });
  };

  return (
    <div className="mb-6">
      <h3 className="block text-gray-700 font-bold mb-2">Address</h3>
      <div className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              우편번호
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50"
              type="text"
              value={address.postalCode}
              readOnly
              placeholder="우편번호"
            />
          </div>
          <button
            type="button"
            onClick={openPostcode}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            우편번호 검색
          </button>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            도로명 주소
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50"
            type="text"
            value={address.roadAddress}
            readOnly
            placeholder="도로명 주소"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            상세주소
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 ${
              errors?.detailAddress ? 'border-red-500' : ''
            }`}
            type="text"
            value={address.detailAddress}
            onChange={handleDetailAddressChange}
            placeholder="상세주소를 입력하세요"
          />
          {errors?.detailAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.detailAddress}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressInput;