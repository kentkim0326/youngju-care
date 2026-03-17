import React from 'react';
import { riskBg, riskTextColor, riskLabel } from '../utils/risk';

const famData = [
  { name: '김복순', age: 82, risk: 88, visits: 1, gap: 21, welfare: '미수혜', guardian: '김민준 (아들)', status: '이상 감지', desc: '21일간 보건소 미방문 — 즉시 확인 필요' },
  { name: '윤춘자', age: 77, risk: 22, visits: 4, gap: 2,  welfare: '정상',   guardian: '윤지연 (딸)',   status: '안전',    desc: '정상적으로 활동 중입니다' },
  { name: '이정자', age: 78, risk: 75, visits: 2, gap: 18, welfare: '미수혜', guardian: '이성호 (아들)', status: '이상 감지', desc: '18일간 복지서비스 미수혜 — 확인 필요' },
  { name: '한기순', age: 71, risk: 31, visits: 3, gap: 3,  welfare: '정상',   guardian: '한미영 (딸)',   status: '안전',    desc: '최근 방문 완료. 건강 상태 양호' },
];

export default function Family() {
  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.headerTitle}>가족 조회 페이지</div>
        <div style={s.headerSub}>보호자별 노인 안전 현황을 확인하세요</div>
      </div>
      <div style={s.grid}>
        {famData.map((f, i) => <FamCard key={i} f={f} />)}
      </div>
    </div>
  );
}

function FamCard({ f }) {
  const tc = riskTextColor(f.risk);
  const bg = riskBg(f.risk);
  return (
    <div style={s.card}>
      <div style={s.cardHeader}>
        <div style={{ ...s.avatar, background: bg, color: tc }}>{f.name[0]}</div>
        <div>
          <div style={s.name}>{f.name} ({f.age}세)</div>
          <div style={s.guardian}>보호자: {f.guardian}</div>
        </div>
      </div>
      <div style={{ ...s.statusBox, background: bg }}>
        <div style={{ ...s.statusTitle, color: tc }}>{f.status}</div>
        <div style={s.statusDesc}>{f.desc}</div>
      </div>
      <div style={s.infoGrid}>
        <div style={s.infoItem}>
          <div style={s.infoVal}>{f.visits}회</div>
          <div style={s.infoLabel}>이번 달 방문</div>
        </div>
        <div style={s.infoItem}>
          <div style={{ ...s.infoVal, color: tc }}>{f.gap}일</div>
          <div style={s.infoLabel}>보건소 미방문</div>
        </div>
        <div style={s.infoItem}>
          <div style={{ ...s.infoVal, fontSize: 14 }}>{riskLabel(f.risk)}</div>
          <div style={s.infoLabel}>현재 상태</div>
        </div>
      </div>
      <div style={s.welfareLine}>복지서비스: <span style={{ fontWeight: 600, color: f.welfare === '정상' ? '#3B6D11' : '#A32D2D' }}>{f.welfare}</span></div>
      <button style={s.btn}>담당 복지사 연결 →</button>
    </div>
  );
}

const s = {
  wrap: { padding: 20 },
  header: { marginBottom: 20 },
  headerTitle: { fontSize: 16, fontWeight: 600 },
  headerSub: { fontSize: 13, color: '#5D6D7E', marginTop: 4 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: { background: '#fff', border: '0.5px solid #E0E0E0', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 12 },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14, borderBottom: '0.5px solid #E0E0E0' },
  avatar: { width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600, flexShrink: 0 },
  name: { fontSize: 15, fontWeight: 600 },
  guardian: { fontSize: 12, color: '#5D6D7E', marginTop: 3 },
  statusBox: { borderRadius: 8, padding: '12px 14px', textAlign: 'center' },
  statusTitle: { fontSize: 14, fontWeight: 600 },
  statusDesc: { fontSize: 12, color: '#5D6D7E', marginTop: 4 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 },
  infoItem: { background: '#F4F6F8', borderRadius: 8, padding: '10px 8px', textAlign: 'center' },
  infoVal: { fontSize: 18, fontWeight: 600 },
  infoLabel: { fontSize: 11, color: '#5D6D7E', marginTop: 2 },
  welfareLine: { fontSize: 12, color: '#5D6D7E', textAlign: 'center' },
  btn: { padding: 10, border: 'none', borderRadius: 8, background: '#1A5276', color: '#fff', fontSize: 13, fontWeight: 500 },
};
