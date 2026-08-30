import React, { useState } from 'react';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Charts from './pages/Charts';
import Family from './pages/Family';
import Alerts from './pages/Alerts';
import './index.css';

// 화면에 나오는 어르신은 전부 가상 인물이다. 실명·나이·주소·전화번호가
// 함께 보이는 형태라, 밝히지 않으면 실제 개인정보로 오해받는다.
function DemoBanner() {
  return (
    <div style={{
      background: '#7A2E1E', color: '#FFE0D0',
      fontSize: 12.5, lineHeight: 1.55,
      padding: '9px 20px', textAlign: 'center',
    }}>
      <b style={{ color: '#fff' }}>시연용 화면입니다</b> — 아래 어르신은 모두 가상 인물이며,
      위험도·방문일·통계는 샘플 데이터입니다.<br />
      공공데이터포털 인증키를 넣으면 복지로·통계청·응급의료기관 실데이터로 동작합니다.
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('dashboard');
  return (
    <div>
      <DemoBanner />
      <Topbar page={page} setPage={setPage} />
      {page === 'dashboard' && <Dashboard />}
      {page === 'map'       && <MapPage />}
      {page === 'charts'    && <Charts />}
      {page === 'family'    && <Family />}
      {page === 'alerts'    && <Alerts />}
    </div>
  );
}
