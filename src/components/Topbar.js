import React from 'react';

const TABS = [
  { key: 'dashboard', label: '복지사 대시보드' },
  { key: 'map',       label: '위험 지역 지도' },
  { key: 'charts',    label: '통계 분석' },
  { key: 'family',    label: '가족 조회' },
  { key: 'alerts',    label: '알림 내역' },
];

export default function Topbar({ page, setPage }) {
  return (
    <header style={styles.bar}>
      <div style={styles.logo}>
        영주 돌봄이
        <span style={styles.sub}>YoungJu Care</span>
      </div>
      <nav style={styles.nav}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setPage(t.key)}
            style={{ ...styles.btn, ...(page === t.key ? styles.active : {}) }}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

const styles = {
  bar: {
    background: '#fff',
    borderBottom: '0.5px solid #E0E0E0',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    height: 52,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    gap: 16,
  },
  logo: {
    fontSize: 15,
    fontWeight: 600,
    color: '#1A5276',
    whiteSpace: 'nowrap',
  },
  sub: {
    color: '#2E86C1',
    fontSize: 13,
    fontWeight: 400,
    marginLeft: 8,
  },
  nav: {
    display: 'flex',
    gap: 2,
    marginLeft: 'auto',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '6px 14px',
    fontSize: 13,
    border: 'none',
    background: 'transparent',
    borderRadius: 8,
    color: '#5D6D7E',
  },
  active: {
    background: '#F0F3F4',
    color: '#2C3E50',
    fontWeight: 600,
  },
};
