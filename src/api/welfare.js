// ─────────────────────────────────────────────
// 복지서비스 수혜 현황 + 독거노인 통계 API
// 출처: 복지로 API / 통계청 KOSIS API
// ─────────────────────────────────────────────
import { publicDataFetch, ENDPOINTS, PUBLIC_DATA_KEY } from './config';

// ── 1. 복지서비스 목록 조회 ──────────────────

/**
 * 영주시 노인 복지서비스 목록 조회
 * @returns {Promise<WelfareService[]>}
 */
export async function fetchWelfareServices() {
  const raw = await publicDataFetch(ENDPOINTS.WELFARE_SERVICE, {
    sigunguCd: '37070', // 영주시 행정구역코드
    trgterIndvdlCd: '05', // 대상자 코드: 노인
    numOfRows: 100,
  });

  return raw.map(item => ({
    id:          item.servId,
    name:        item.servNm,         // 서비스명
    category:    item.intrsIlhwNm,    // 관심사 분야
    target:      item.trgterIndvdlNm, // 수혜 대상
    applyMethod: item.aplyMthdCd,     // 신청 방법
    contact:     item.inqplCntct,     // 문의처
    url:         item.servDtlLink,    // 상세 링크
  }));
}

// ── 2. KOSIS 독거노인 통계 조회 ──────────────

/**
 * 통계청 독거노인 현황 (읍면동별)
 * KOSIS API: 인구총조사 > 가구 > 1인가구
 * @param {string} year - 기준 연도 (예: '2023')
 * @returns {Promise<ElderlyStats[]>}
 */
export async function fetchElderlyStats(year = '2023') {
  const params = new URLSearchParams({
    method:     'getList',
    apiKey:     PUBLIC_DATA_KEY,
    itmId:      'T10+',            // 항목: 1인가구 합계
    objL1:      'ALL',             // 분류값: 전체
    format:     'json',
    jsonVD:     'Y',
    prdSe:      'Y',               // 연간 통계
    newEstPrdCnt: 1,
    orgId:      '101',             // 통계청
    tblId:      'DT_1IN0001',      // 가구 형태별 가구 및 가구원
    startPrdDe: year,
    endPrdDe:   year,
  });

  const res = await fetch(`${ENDPOINTS.ELDERLY_STATS}?${params}`);
  const data = await res.json();
  return (data || []).map(item => ({
    region:    item.C1_NM,   // 지역명
    count:     Number(item.DT),   // 1인가구 수
    year:      item.PRD_DE,       // 기준 연도
  }));
}

// ── 3. 위험도 점수 계산 알고리즘 ─────────────

/**
 * 독거노인 개인별 위험도 점수 산출 (0~100)
 *
 * 가중치:
 *   - 보건소 미방문 일수: 40점
 *   - 복지서비스 미수혜: 30점
 *   - 나이: 20점
 *   - 응급기관 접근 거리: 10점
 *
 * @param {object} elder
 * @param {number} elder.age           - 나이
 * @param {number} elder.visitGapDays  - 보건소 마지막 방문 이후 경과 일수
 * @param {boolean} elder.hasWelfare   - 복지서비스 수혜 여부
 * @param {number} elder.emergencyKm   - 최근접 응급기관까지 거리(km)
 * @returns {number} 위험도 점수 0~100
 */
export function calcRiskScore({ age, visitGapDays, hasWelfare, emergencyKm }) {
  // 보건소 미방문: 30일 이상이면 만점
  const visitScore = Math.min(visitGapDays / 30, 1) * 40;

  // 복지 미수혜: 미수혜면 30점
  const welfareScore = hasWelfare ? 0 : 30;

  // 나이: 65세 기준, 95세 이상이면 만점
  const ageScore = Math.min(Math.max(age - 65, 0) / 30, 1) * 20;

  // 거리: 10km 이상이면 만점
  const distScore = Math.min(emergencyKm / 10, 1) * 10;

  return Math.round(visitScore + welfareScore + ageScore + distScore);
}

/**
 * 여러 명의 위험도를 한 번에 계산하고 내림차순 정렬
 * @param {object[]} elders
 * @returns {object[]} 위험도 점수가 추가된 배열 (내림차순)
 */
export function calcRiskBatch(elders) {
  return elders
    .map(e => ({ ...e, risk: calcRiskScore(e) }))
    .sort((a, b) => b.risk - a.risk);
}
