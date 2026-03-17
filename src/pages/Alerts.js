import React from 'react';
import { alerts } from '../data/sampleData';
import { riskBg, riskTextColor } from '../utils/risk';

const typeMap = { danger: 88, warn: 55, ok: 22 };

export default function Alerts() {
  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <div style={s.title}>이상 징후 알림 내역</div>
        <div style={s.sub}>시스템이 자동 감지한 이상 패턴 알림 목록입니다</div>
      </div>
      <div style={s.card}>
        {alerts.map(a => {
          const score = typeMap[a.type];
          const bg = riskBg(score);
          const tc = riskTextColor(score);
          return (
            <div key={a.id} style={s.row}>
              <div style={{ ...s.icon, background: bg, color: tc }}>
                {a.type === 'danger' ? '!' : a.type === 'warn' ? '~' : '✓'}
              </div>
              <div style={s.body}>
                <div style={s.notifTitle}>{a.name}</div>
                <div style={s.desc}>{a.desc}</div>
              </div>
              <div style={s.time}>{a.time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s = {
  wrap: { padding: 20 },
  header: { marginBottom: 16 },
  title: { fontSize: 16, fontWeight: 600 },
  sub: { fontSize: 13, color: '#5D6D7E', marginTop: 4 },
  card: { background: '#fff', border: '0.5px solid #E0E0E0', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 },
  row: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: '0.5px solid #F0F0F0' },
  icon: { width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, flexShrink: 0 },
  body: { flex: 1 },
  notifTitle: { fontSize: 13, fontWeight: 500 },
  desc: { fontSize: 12, color: '#5D6D7E', marginTop: 3 },
  time: { fontSize: 11, color: '#AAB7B8', whiteSpace: 'nowrap' },
};
