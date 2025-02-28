export interface AddressForm {
    postalCode: string;    // 우편번호
    roadAddress: string;   // 도로명 주소
    detailAddress: string; // 상세주소
  }
  
  export interface Address extends AddressForm {
    addressId: number;
    fullAddress: string;
  }
  
  export interface AddressResponse {
    id: number;
    postalCode: string;
    roadAddress: string;
    detailAddress: string;
    fullAddress: string;
  }