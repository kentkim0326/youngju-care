import React, { useState } from 'react';
import { useElders } from '../api/hooks';
import { riskLevel, riskLabel, riskBg, riskTextColor } from '../utils/risk';

function StatCard({ label, value, sub, color }) {
  return (
    <div style={s.statCard}>
      <div style={s.statLabel}>{label}</div>
      <div style={{ ...s.statVal, color }}>{value}</div>
      <div style={s.statSub}>{sub}</div>
    </div>
  );
}

function LoadingSpinner() {
  return <div style={s.loading}>데이터 불러오는 중...</div>;
}

function ErrorMsg({ msg, onRetry }) {
  return (
    <div style={s.error}>
      <div>오류: {msg}</div>
      <button style={s.retryBtn} onClick={onRetry}>다시 시도</button>
    </div>
  );
}

export default function Dashboard() {
  const [selected, setSelected] = useState(null);
  const { data: elders, loading, error, refetch } = useElders();

  if (loading) return <LoadingSpinner />;
  if (error)   return <ErrorMsg msg={error} onRetry={refetch} />;

  const sorted = [...elders].sort((a, b) => b.risk - a.risk);
  const sel = elders.find(e => e.id === selected);
  const highCount = elders.filter(e => e.risk >= 70).length;
  const warnCount = elders.filter(e => e.risk >= 40 && e.risk < 70).length;

  return (
    <div style={s.wrap}>
      <div style={s.statGrid}>
        <StatCard label="담당 독거노인" value={`${elders.length}명`} sub="영주시 관내 전체" color="#185FA5" />
        <StatCard label="고위험 (즉시 확인)" value={`${highCount}명`} sub="위험도 70점 이상" color="#A32D2D" />
        <StatCard label="주의 (모니터링)" value={`${warnCount}명`} sub="위험도 40~69점" color="#854F0B" />
        <StatCard label="이번 주 방문 완료" value="11명" sub="방문율 45.8%" color="#3B6D11" />
      </div>

      <div style={s.twoCol}>
        <div style={s.card}>
          <div style={s.cardTitle}>담당 노인 목록 — 위험도 순</div>
          {sorted.map(e => (
            <div
              key={e.id}
              style={{ ...s.row, ...(selected === e.id ? s.rowSelected : {}) }}
              onClick={() => setSelected(e.id)}
            >
              <div style={{ ...s.avatar, background: riskBg(e.risk), color: riskTextColor(e.risk) }}>
                {e.name[0]}
              </div>
              <div style={s.rowInfo}>
                <div style={s.rowName}>{e.name} ({e.age}세)</div>
                <div style={s.rowSub}>{e.addr} · 보건소 미방문 {e.gap}일</div>
              </div>
              <div style={{ ...s.badge, background: riskBg(e.risk), color: riskTextColor(e.risk) }}>
                {riskLabel(e.risk)} {e.risk}점
              </div>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <div style={s.cardTitle}>선택된 노인 상세 정보</div>
          {!sel
            ? <div style={s.empty}>왼쪽 목록에서 노인을 선택하세요</div>
            : <ElderDetail elder={sel} />
          }
        </div>
      </div>
    </div>
  );
}

function ElderDetail({ elder: e }) {
  const tc = riskTextColor(e.risk);
  const bg = riskBg(e.risk);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ ...s.avatar, width: 44, height: 44, fontSize: 18, background: bg, color: tc }}>{e.name[0]}</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{e.name}</div>
          <div style={{ fontSize: 12, color: '#5D6D7E' }}>{e.addr} · {e.age}세</div>
        </div>
        <div style={{ ...s.badge, marginLeft: 'auto', background: bg, color: tc, fontSize: 13, padding: '6px 14px', textAlign: 'center', lineHeight: 1.6 }}>
          {riskLabel(e.risk)}<br />
          <span style={{ fontSize: 20, fontWeight: 700 }}>{e.risk}점</span>
        </div>
      </div>
      <div style={s.detailBox}>
        {[
          ['보건소 미방문',   `${e.gap}일 경과`,                                     tc],
          ['복지서비스 수혜', e.welfare ? '정상 수혜 중' : '미수혜 (확인 필요)',      e.welfare ? '#3B6D11' : '#A32D2D'],
          ['최근 방문일',     e.visit,                                               '#2C3E50'],
          ['연락처',          e.phone,                                               '#2C3E50'],
          ['최근접 응급기관', e.emergency,                                           '#2C3E50'],
        ].map(([k, v, vc]) => (
          <div key={k} style={s.detailRow}>
            <span style={{ color: '#5D6D7E' }}>{k}</span>
            <span style={{ fontWeight: 500, color: vc }}>{v}</span>
          </div>
        ))}
      </div>
      {riskLevel(e.risk) === 'danger' && (
        <button style={s.alertBtn}>응급 대응 절차 확인 →</button>
      )}
    </div>
  );
}

const s = {
  wrap:        { padding: 20 },
  loading:     { padding: 60, textAlign: 'center', color: '#5D6D7E', fontSize: 14 },
  error:       { padding: 40, textAlign: 'center', color: '#A32D2D', fontSize: 14 },
  retryBtn:    { marginTop: 12, padding: '8px 20px', border: '0.5px solid #E0E0E0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13 },
  statGrid:    { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 },
  statCard:    { background: '#fff', border: '0.5px solid #E0E0E0', borderRadius: 12, padding: '14px 16px' },
  statLabel:   { fontSize: 12, color: '#5D6D7E', marginBottom: 6 },
  statVal:     { fontSize: 24, fontWeight: 600 },
  statSub:     { fontSize: 11, color: '#AAB7B8', marginTop: 4 },
  twoCol:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:        { background: '#fff', border: '0.5px solid #E0E0E0', borderRadius: 12, padding: 16 },
  cardTitle:   { fontSize: 13, fontWeight: 500, color: '#5D6D7E', marginBottom: 14 },
  row:         { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, cursor: 'pointer', border: '0.5px solid transparent', marginBottom: 6 },
  rowSelected: { background: '#F0F3F4', borderColor: '#D0D3D4' },
  avatar:      { width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 },
  rowInfo:     { flex: 1, minWidth: 0 },
  rowName:     { fontSize: 13, fontWeight: 500 },
  rowSub:      { fontSize: 11, color: '#5D6D7E', marginTop: 2 },
  badge:       { fontSize: 11, padding: '3px 8px', borderRadius: 99, fontWeight: 500, flexShrink: 0 },
  empty:       { color: '#AAB7B8', fontSize: 13, textAlign: 'center', padding: '40px 0' },
  detailBox:   { background: '#F4F6F8', borderRadius: 8, padding: 14 },
  detailRow:   { display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 0', borderBottom: '0.5px solid #E0E0E0' },
  alertBtn:    { marginTop: 12, width: '100%', padding: 9, border: 'none', borderRadius: 8, background: '#FCEBEB', color: '#A32D2D', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
};
