// ─────────────────────────────────────────────
// 공공데이터포털 API 설정
// https://www.data.go.kr 에서 발급받은 키를 입력하세요
// ─────────────────────────────────────────────

// .env 파일에 REACT_APP_PUBLIC_DATA_KEY=YOUR_KEY 로 설정
export const PUBLIC_DATA_KEY = process.env.REACT_APP_PUBLIC_DATA_KEY || 'YOUR_API_KEY_HERE';

// API 엔드포인트 목록
export const ENDPOINTS = {
  // 1. 응급의료기관 현황 (e-gen 국립중앙의료원)
  EMERGENCY: 'https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytListInfoInqire',

  // 2. 건강보험공단 보건지소·의료기관 위치
  HEALTH_CENTER: 'https://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncListInfoInqire',

  // 3. 복지서비스 목록 (복지로 API)
  WELFARE_SERVICE: 'https://apis.data.go.kr/B460041/intrsIlhwService/getIntrsIlhwList',

  // 4. 통계청 독거노인 현황 (KOSIS API)
  //    https://kosis.kr/openapi 에서 별도 키 발급
  ELDERLY_STATS: 'https://kosis.kr/openapi/statisticsData.do',

  // 5. 카카오맵 주소→좌표 변환 (Kakao REST API)
  //    https://developers.kakao.com 에서 발급
  KAKAO_GEOCODE: 'https://dapi.kakao.com/v2/local/search/address.json',
};

export const KAKAO_REST_KEY = process.env.REACT_APP_KAKAO_REST_KEY || 'YOUR_KAKAO_KEY_HERE';

// 공통 fetch 래퍼 (JSON/XML 자동 파싱)
export async function publicDataFetch(url, params = {}) {
  const query = new URLSearchParams({
    serviceKey: PUBLIC_DATA_KEY,
    _type: 'json',
    numOfRows: 100,
    pageNo: 1,
    ...params,
  });
  const res = await fetch(`${url}?${query}`);
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  const data = await res.json();
  // 공공데이터포털 공통 응답 구조 파싱
  const body = data?.response?.body;
  if (!body) throw new Error('응답 형식 오류');
  return body.items?.item || [];
}
