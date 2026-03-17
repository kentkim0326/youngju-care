import React, { useState } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { areas } from '../data/sampleData';
import { riskLabel, riskColor, riskBg, riskTextColor } from '../utils/risk';

// Leaflet 기본 아이콘 경로 수정
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function makeIcon(area) {
  const color = riskColor(area.risk);
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};color:#fff;font-size:11px;font-weight:600;padding:4px 8px;border-radius:99px;white-space:nowrap;box-shadow:0 1px 4px rgba(0,0,0,0.2)">${area.name} ${area.cnt}명</div>`,
    iconAnchor: [30, 10],
  });
}

export default function MapPage() {
  const [selected, setSelected] = useState(null);
  const sorted = [...areas].sort((a, b) => b.risk - a.risk);

  return (
    <div style={s.wrap}>
      <div style={s.mapBox}>
        <MapContainer center={[36.8057, 128.5241]} zoom={12} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {areas.map((a, i) => (
            <React.Fragment key={i}>
              <Circle
                center={[a.lat, a.lng]}
                radius={800 + a.cnt * 120}
                pathOptions={{
                  color: riskColor(a.risk),
                  fillColor: riskColor(a.risk),
                  fillOpacity: 0.18,
                  weight: 2,
                }}
                eventHandlers={{ click: () => setSelected(i) }}
              />
              <Marker
                position={[a.lat, a.lng]}
                icon={makeIcon(a)}
                eventHandlers={{ click: () => setSelected(i) }}
              >
                <Popup>
                  <div style={{ fontFamily: 'inherit', minWidth: 150 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 2 }}>독거노인: <b>{a.cnt}명</b></div>
                    <div style={{ fontSize: 12, color: riskColor(a.risk), marginBottom: 2 }}>위험도: <b>{a.risk}점 ({riskLabel(a.risk)})</b></div>
                    <div style={{ fontSize: 12, color: '#666' }}>보건소 미방문: <b>{a.gap}일</b></div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>

      <div style={s.sidebar}>
        <div style={s.sideTitle}>전체 현황</div>
        <div style={s.statRow}>
          {[['고위험', 3, '#A32D2D'], ['주의', 3, '#854F0B'], ['안전', 2, '#3B6D11']].map(([l, v, c]) => (
            <div key={l} style={s.scard}><div style={{ fontSize: 18, fontWeight: 600, color: c }}>{v}</div><div style={s.scardLabel}>{l}</div></div>
          ))}
        </div>

        <div style={s.legend}>
          <div style={s.sideTitle}>범례</div>
          {[['#E24B4A', '고위험 (70점↑)'], ['#EF9F27', '주의 (40~69점)'], ['#639922', '안전 (40점 미만)']].map(([c, l]) => (
            <div key={l} style={s.legendRow}><div style={{ ...s.ldot, background: c }} /><span style={{ fontSize: 12 }}>{l}</span></div>
          ))}
        </div>

        <div style={s.sideTitle}>읍면동 목록</div>
        {sorted.map((a, i) => {
          const origIdx = areas.indexOf(a);
          return (
            <div
              key={i}
              style={{ ...s.areaCard, ...(selected === origIdx ? s.areaSelected : {}) }}
              onClick={() => setSelected(origIdx)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</span>
                <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 500, background: riskBg(a.risk), color: riskTextColor(a.risk) }}>
                  {riskLabel(a.risk)} {a.risk}점
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#5D6D7E', marginTop: 3 }}>독거노인 {a.cnt}명 · 미방문 {a.gap}일</div>
            </div>
          );
        })}

        {selected !== null && (
          <div style={s.detailBox}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#1A5276' }}>{areas[selected].name} 상세</div>
            {[
              ['독거노인 수', `${areas[selected].cnt}명`],
              ['위험도', `${areas[selected].risk}점 (${riskLabel(areas[selected].risk)})`],
              ['보건소 미방문', `${areas[selected].gap}일`],
            ].map(([k, v]) => (
              <div key={k} style={s.drow}>
                <span style={{ color: '#5D6D7E' }}>{k}</span>
                <span style={{ fontWeight: 500, color: riskTextColor(areas[selected].risk) }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  wrap: { display: 'grid', gridTemplateColumns: '1fr 280px', height: 'calc(100vh - 52px)' },
  mapBox: { width: '100%', height: '100%' },
  sidebar: { background: '#fff', borderLeft: '0.5px solid #E0E0E0', overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 12 },
  sideTitle: { fontSize: 13, fontWeight: 500, color: '#5D6D7E', marginBottom: 4 },
  statRow: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 },
  scard: { background: '#F4F6F8', borderRadius: 8, padding: 9, textAlign: 'center' },
  scardLabel: { fontSize: 10, color: '#5D6D7E', marginTop: 2 },
  legend: { background: '#F4F6F8', borderRadius: 8, padding: '10px 12px' },
  legendRow: { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5, fontSize: 12 },
  ldot: { width: 10, height: 10, borderRadius: '50%', flexShrink: 0 },
  areaCard: { border: '0.5px solid #E0E0E0', borderRadius: 8, padding: '10px 12px', cursor: 'pointer' },
  areaSelected: { borderColor: '#2E86C1', background: '#EBF5FB' },
  detailBox: { background: '#F4F6F8', borderRadius: 8, padding: '12px 14px', fontSize: 12 },
  drow: { display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid #E0E0E0' },
};
