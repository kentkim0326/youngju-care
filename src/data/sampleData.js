export const elders = [
  { id: 1, name: '김복순', age: 82, addr: '영주시 풍기읍', risk: 88, gap: 21, welfare: false, visit: '2025-12-03', emergency: '풍기성심의원 0.8km', phone: '010-3421-XXXX', lat: 36.8192, lng: 128.4877 },
  { id: 2, name: '이정자', age: 78, addr: '영주시 이산면', risk: 75, gap: 18, welfare: false, visit: '2025-12-10', emergency: '영주적십자병원 4.2km', phone: '010-5512-XXXX', lat: 36.8843, lng: 128.5501 },
  { id: 3, name: '박순덕', age: 85, addr: '영주시 순흥면', risk: 71, gap: 15, welfare: true,  visit: '2025-12-15', emergency: '순흥보건지소 1.1km',  phone: '010-7823-XXXX', lat: 36.8701, lng: 128.4502 },
  { id: 4, name: '최영자', age: 74, addr: '영주시 평은면', risk: 55, gap: 9,  welfare: true,  visit: '2025-12-22', emergency: '영주의료원 6.3km',    phone: '010-2234-XXXX', lat: 36.9312, lng: 128.5982 },
  { id: 5, name: '정말례', age: 79, addr: '영주시 문수면', risk: 48, gap: 7,  welfare: true,  visit: '2025-12-24', emergency: '문수보건지소 0.5km',  phone: '010-9981-XXXX', lat: 36.7903, lng: 128.4201 },
  { id: 6, name: '한기순', age: 71, addr: '영주시 안정면', risk: 31, gap: 3,  welfare: true,  visit: '2026-01-02', emergency: '안정보건지소 0.7km',  phone: '010-4456-XXXX', lat: 36.7501, lng: 128.5891 },
  { id: 7, name: '윤춘자', age: 77, addr: '영주시 상망동', risk: 22, gap: 2,  welfare: true,  visit: '2026-01-05', emergency: '영주의료원 1.2km',    phone: '010-6634-XXXX', lat: 36.8201, lng: 128.6051 },
];

export const areas = [
  { name: '풍기읍', lat: 36.8192, lng: 128.4877, risk: 88, cnt: 9,  gap: 21 },
  { name: '이산면', lat: 36.8843, lng: 128.5501, risk: 75, cnt: 6,  gap: 18 },
  { name: '순흥면', lat: 36.8701, lng: 128.4502, risk: 71, cnt: 5,  gap: 15 },
  { name: '평은면', lat: 36.9312, lng: 128.5982, risk: 55, cnt: 4,  gap: 9  },
  { name: '문수면', lat: 36.7903, lng: 128.4201, risk: 48, cnt: 4,  gap: 7  },
  { name: '영주동', lat: 36.8057, lng: 128.6241, risk: 38, cnt: 14, gap: 4  },
  { name: '안정면', lat: 36.7501, lng: 128.5891, risk: 28, cnt: 3,  gap: 3  },
  { name: '상망동', lat: 36.8201, lng: 128.6051, risk: 22, cnt: 5,  gap: 2  },
];

export const trendData = {
  months: ['8월', '9월', '10월', '11월', '12월', '1월'],
  high:   [28, 30, 31, 34, 35, 38],
  mid:    [82, 84, 86, 87, 88, 89],
  low:    [137, 133, 130, 126, 124, 120],
  visitRate: [78, 75, 72, 70, 65, 68],
};

export const alerts = [
  { id: 1, type: 'danger', name: '김복순 (82세)', desc: '풍기읍 거주. 21일간 보건소 미방문. 위험도 88점.', time: '방금 전' },
  { id: 2, type: 'danger', name: '이정자 (78세)', desc: '이산면 거주. 복지서비스 미수혜 18일. 위험도 75점.', time: '2시간 전' },
  { id: 3, type: 'warn',   name: '박순덕 (85세)', desc: '순흥면 거주. 방문 공백 15일. 이번 주 방문 권장.', time: '5시간 전' },
  { id: 4, type: 'warn',   name: '최영자 (74세)', desc: '평은면 거주. 위험도 12점 상승 (43→55점).', time: '어제' },
  { id: 5, type: 'ok',     name: '한기순 (71세)', desc: '안정면 거주. 담당 복지사 방문 완료. 건강 상태 양호.', time: '2일 전' },
  { id: 6, type: 'ok',     name: '윤춘자 (77세)', desc: '상망동 거주. 월 2회 정기 방문 완료. 이상 없음.', time: '3일 전' },
];
