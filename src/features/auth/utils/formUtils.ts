// 카드 번호에서 공백을 제거하고 4자리씩 그룹화하여 포맷팅
export const formatCardNumber = (value: string): string => {
  const cleaned = value.replace(/\s/g, "");
  const groups = cleaned.match(/.{1,4}/g) || [];
  return groups.join(" ");
};

// 유효기간 입력값에서 숫자가 아닌 문자를 제거하고
// 앞 2자리를 월(MM), 뒤 2자리를 연도(YY)로 구분하여 'MM/YY' 형식으로 포맷팅
export const formatExpiryDate = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
  }
  return cleaned;
};

// 다음(Daum) 우편번호 검색 서비스 스크립트를 동적으로 로드
export const loadDaumPostcode = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 이미 로드된 경우 바로 resolve
    if (window.daum && window.daum.Postcode) {
      resolve();
      return;
    }

    // 스크립트 요소 생성 및 속성 설정
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;

    // 로드 성공/실패 처리
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("우편번호 서비스 로드에 실패했습니다."));

    // 문서에 스크립트 추가
    document.head.appendChild(script);
  });
};
