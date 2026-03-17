import React, { useState } from 'react';
import Topbar from './components/Topbar';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import Charts from './pages/Charts';
import Family from './pages/Family';
import Alerts from './pages/Alerts';
import './index.css';

export default function App() {
  const [page, setPage] = useState('dashboard');
  return (
    <div>
      <Topbar page={page} setPage={setPage} />
      {page === 'dashboard' && <Dashboard />}
      {page === 'map'       && <MapPage />}
      {page === 'charts'    && <Charts />}
      {page === 'family'    && <Family />}
      {page === 'alerts'    && <Alerts />}
    </div>
  );
}
