export interface Address {
    addressId: number;
    postalCode: string;
    roadAddress: string;
    detailAddress: string;
    fullAddress: string;
}
  
// 주소 폼 데이터 타입
export interface AddressForm {
    postalCode: string;    // 우편번호
    roadAddress: string;   // 도로명 주소
    detailAddress: string; // 상세주소
}

// 주소 응답 데이터 타입
export interface AddressResponse {
    id: number;
    postalCode: string;
    roadAddress: string;
    detailAddress: string;
    fullAddress: string;
}