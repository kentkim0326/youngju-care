// ─────────────────────────────────────────────
// 응급의료기관 현황 API
// 출처: 국립중앙의료원 e-gen (공공데이터포털)
// API명: 응급의료기관 목록 정보 조회
// ─────────────────────────────────────────────
import { publicDataFetch, ENDPOINTS } from './config';

/**
 * 영주시 응급의료기관 전체 목록 조회
 * @returns {Promise<EmergencyInstitution[]>}
 */
export async function fetchEmergencyInstitutions() {
  const raw = await publicDataFetch(ENDPOINTS.EMERGENCY, {
    Q0: '경상북도',   // 시도
    Q1: '영주시',     // 시군구
    numOfRows: 50,
  });

  // 응답 필드 → 앱 모델로 정규화
  return raw.map(normalizeEmergency);
}

/**
 * 특정 위치 기준 가장 가까운 응급기관 찾기
 * @param {number} lat - 위도
 * @param {number} lng - 경도
 * @param {EmergencyInstitution[]} institutions - 전체 목록
 * @returns {EmergencyInstitution & { distanceKm: number }}
 */
export function findNearestEmergency(lat, lng, institutions) {
  return institutions
    .map(inst => ({
      ...inst,
      distanceKm: haversine(lat, lng, inst.lat, inst.lng),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

// ── 내부 헬퍼 ──────────────────────────────────

function normalizeEmergency(item) {
  return {
    id:       item.hpid,
    name:     item.dutyName,        // 기관명
    addr:     item.dutyAddr,        // 주소
    tel:      item.dutyTel1,        // 대표 전화
    erTel:    item.dutyTel3,        // 응급실 직통
    lat:      parseFloat(item.wgs84Lat),
    lng:      parseFloat(item.wgs84Lon),
    type:     item.dutyDivNam,      // 기관 구분 (응급의료기관/보건지소 등)
    erAvail:  item.hvec !== '0',    // 응급실 가용 여부
  };
}

// Haversine 공식으로 두 좌표 간 거리(km) 계산
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg) { return deg * (Math.PI / 180); }
