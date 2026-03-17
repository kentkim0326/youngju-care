// ─────────────────────────────────────────────
// 데이터 페칭 커스텀 훅
// API 호출 + 로딩/에러 상태 + 더미 fallback 통합
// ─────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { fetchEmergencyInstitutions, findNearestEmergency } from './emergency';
import { fetchWelfareServices, calcRiskBatch } from './welfare';
import { elders as dummyElders, areas as dummyAreas, alerts as dummyAlerts } from '../data/sampleData';

// 실제 API 사용 여부 (API 키 설정 전에는 더미 데이터 사용)
const USE_REAL_API = process.env.REACT_APP_PUBLIC_DATA_KEY &&
  process.env.REACT_APP_PUBLIC_DATA_KEY !== 'YOUR_API_KEY_HERE';

// ── 공통 훅 ──────────────────────────────────

function useAsync(asyncFn, deps = []) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn();
      setData(result);
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { run(); }, [run]);

  return { data, loading, error, refetch: run };
}

// ── 응급의료기관 훅 ──────────────────────────

/**
 * 영주시 응급의료기관 목록
 * API 키 없으면 더미 데이터 반환
 */
export function useEmergencyInstitutions() {
  return useAsync(async () => {
    if (!USE_REAL_API) {
      // 더미 데이터 (개발용)
      return [
        { id: 'E001', name: '영주의료원',       addr: '영주시 영주로 33', tel: '054-630-3114', erTel: '054-630-3119', lat: 36.8057, lng: 128.6241, type: '지역응급의료센터', erAvail: true },
        { id: 'E002', name: '풍기성심의원',      addr: '영주시 풍기읍',     tel: '054-635-1119', erTel: '054-635-1119', lat: 36.8192, lng: 128.4877, type: '지역응급의료기관', erAvail: true },
        { id: 'E003', name: '영주적십자병원',    addr: '영주시 휴천2동',   tel: '054-630-0114', erTel: '054-630-0100', lat: 36.8100, lng: 128.6150, type: '지역응급의료기관', erAvail: true },
        { id: 'E004', name: '순흥보건지소',      addr: '영주시 순흥면',     tel: '054-639-6741', erTel: '054-639-6741', lat: 36.8701, lng: 128.4502, type: '보건지소', erAvail: false },
        { id: 'E005', name: '안정보건지소',      addr: '영주시 안정면',     tel: '054-639-6751', erTel: '054-639-6751', lat: 36.7501, lng: 128.5891, type: '보건지소', erAvail: false },
      ];
    }
    return fetchEmergencyInstitutions();
  });
}

// ── 독거노인 목록 + 위험도 훅 ────────────────

/**
 * 독거노인 목록 + 위험도 점수 계산
 * 실제 연동 시: 영주시 사회복지과 CSV 업로드 또는 내부 API 사용
 */
export function useElders() {
  const { data: emergencies } = useEmergencyInstitutions();

  return useAsync(async () => {
    if (!USE_REAL_API || !emergencies) {
      return dummyElders;
    }
    // 실제 데이터 연동 시: 각 노인별 위험도 재계산
    return calcRiskBatch(
      dummyElders.map(e => ({
        ...e,
        emergencyKm: emergencies.length
          ? findNearestEmergency(e.lat, e.lng, emergencies).distanceKm
          : 5,
      }))
    );
  }, [emergencies]);
}

// ── 복지서비스 훅 ────────────────────────────

export function useWelfareServices() {
  return useAsync(async () => {
    if (!USE_REAL_API) {
      return [
        { id: 'W001', name: '독거노인 생활관리사 파견', category: '노인돌봄', target: '65세 이상 독거노인', applyMethod: '주민센터 방문', contact: '054-639-6000' },
        { id: 'W002', name: '노인맞춤돌봄서비스',       category: '노인돌봄', target: '65세 이상 독거·취약노인', applyMethod: '주민센터 방문', contact: '054-639-6010' },
        { id: 'W003', name: '긴급복지지원',             category: '긴급지원', target: '위기상황 가구',          applyMethod: '주민센터 방문 / 전화', contact: '129' },
        { id: 'W004', name: '의료급여',                 category: '의료지원', target: '기초생활수급자',         applyMethod: '주민센터 방문', contact: '054-639-6020' },
      ];
    }
    return fetchWelfareServices();
  });
}

// ── 알림 목록 훅 ─────────────────────────────

export function useAlerts() {
  return useAsync(async () => dummyAlerts);
}

// ── 지역 현황 훅 ─────────────────────────────

export function useAreas() {
  return useAsync(async () => dummyAreas);
}
