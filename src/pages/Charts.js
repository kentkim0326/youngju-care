import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, BubbleController,
  Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line, Doughnut, Bubble } from 'react-chartjs-2';
import { areas, trendData } from '../data/sampleData';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, BubbleController,
  Title, Tooltip, Legend, Filler
);

const DANGER = '#E24B4A', WARN = '#EF9F27', OK = '#639922', BLUE = '#2E86C1';
const DF = 'rgba(226,75,74,0.15)', WF = 'rgba(239,159,39,0.15)', OF = 'rgba(99,153,34,0.15)', BF = 'rgba(46,134,193,0.15)';

const baseOpts = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, padding: 12, font: { size: 11 } } } },
};

const TABS = ['현황 개요', '위험도 추이', '지역별 분석'];

export default function Charts() {
  const [tab, setTab] = useState(0);

  return (
    <div style={s.wrap}>
      <div style={s.tabRow}>
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{ ...s.tabBtn, ...(tab === i ? s.tabActive : {}) }}>{t}</button>
        ))}
      </div>

      <div style={s.statGrid}>
        {[
          ['전체 독거노인', '247명', '#185FA5'],
          ['고위험 (70점↑)', '38명', '#A32D2D'],
          ['이번 달 방문율', '68%', '#3B6D11'],
          ['평균 위험도', '51점', '#854F0B'],
        ].map(([l, v, c]) => (
          <div key={l} style={s.statCard}>
            <div style={s.statLabel}>{l}</div>
            <div style={{ ...s.statVal, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      {tab === 0 && <OverviewTab />}
      {tab === 1 && <TrendTab />}
      {tab === 2 && <RegionTab />}
    </div>
  );
}

function OverviewTab() {
  const regionNames = areas.map(a => a.name);
  return (
    <div style={s.grid2}>
      <div style={s.card}>
        <div style={s.cardTitle}>위험도 분포 (전체 247명)</div>
        <div style={s.chartH}>
          <Doughnut
            data={{ labels: ['고위험', '주의', '안전'], datasets: [{ data: [38, 89, 120], backgroundColor: [DANGER, WARN, OK], borderWidth: 2 }] }}
            options={{ ...baseOpts, cutout: '68%' }}
          />
        </div>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>읍면동별 독거노인 수 및 위험도</div>
        <div style={s.chartH}>
          <Bar
            data={{
              labels: regionNames,
              datasets: [
                { label: '독거노인 수', data: areas.map(a => a.cnt), backgroundColor: BF, borderColor: BLUE, borderWidth: 1.5, yAxisID: 'y' },
                { label: '위험도 점수', data: areas.map(a => a.risk), type: 'line', borderColor: DANGER, backgroundColor: 'transparent', borderWidth: 2, pointRadius: 3, yAxisID: 'y2' },
              ],
            }}
            options={{ ...baseOpts, scales: { y: { beginAtZero: true, title: { display: true, text: '명' } }, y2: { position: 'right', min: 0, max: 100, title: { display: true, text: '점' }, grid: { drawOnChartArea: false } } } }}
          />
        </div>
      </div>
      <div style={{ ...s.card, gridColumn: '1 / -1' }}>
        <div style={s.cardTitle}>복지서비스 수혜 현황 vs 미수혜</div>
        <div style={{ ...s.chartH, height: 200 }}>
          <Bar
            data={{
              labels: regionNames,
              datasets: [
                { label: '수혜 중', data: [4,2,4,3,4,12,3,5], backgroundColor: OF, borderColor: OK, borderWidth: 1.5, stack: 's' },
                { label: '미수혜', data: [5,4,1,1,0,2,0,0], backgroundColor: DF, borderColor: DANGER, borderWidth: 1.5, stack: 's' },
              ],
            }}
            options={{ ...baseOpts, scales: { x: { stacked: true }, y: { stacked: true, title: { display: true, text: '명' } } } }}
          />
        </div>
      </div>
    </div>
  );
}

function TrendTab() {
  const { months, high, mid, low, visitRate } = trendData;
  return (
    <div style={s.grid2}>
      <div style={{ ...s.card, gridColumn: '1 / -1' }}>
        <div style={s.cardTitle}>월별 위험도 그룹별 인원 추이</div>
        <div style={{ ...s.chartH, height: 220 }}>
          <Line
            data={{
              labels: months,
              datasets: [
                { label: '고위험', data: high, borderColor: DANGER, backgroundColor: DF, fill: true, tension: 0.4, pointRadius: 4 },
                { label: '주의',   data: mid,  borderColor: WARN,   backgroundColor: WF, fill: true, tension: 0.4, pointRadius: 4 },
                { label: '안전',   data: low,  borderColor: OK,     backgroundColor: OF, fill: true, tension: 0.4, pointRadius: 4 },
              ],
            }}
            options={{ ...baseOpts, scales: { y: { beginAtZero: false, title: { display: true, text: '명' } } } }}
          />
        </div>
        <div style={s.insight}>최근 3개월간 고위험 인원이 꾸준히 증가하는 추세입니다. 겨울철 외출 감소로 보건소 방문율이 낮아진 것이 주요 원인으로 분석됩니다.</div>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>월별 방문 완료율 (%)</div>
        <div style={s.chartH}>
          <Bar
            data={{
              labels: months,
              datasets: [{ label: '방문율', data: visitRate, backgroundColor: months.map((_, i) => i === 5 ? BF : BF), borderColor: BLUE, borderWidth: 1.5 }],
            }}
            options={{ ...baseOpts, scales: { y: { min: 50, max: 100, title: { display: true, text: '%' } } }, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>보건소 미방문 기간 분포</div>
        <div style={s.chartH}>
          <Bar
            data={{
              labels: ['1~7일', '8~14일', '15~21일', '22일↑'],
              datasets: [{ label: '인원', data: [142, 58, 31, 16], backgroundColor: [OF, WF, DF, 'rgba(163,45,45,0.25)'], borderColor: [OK, WARN, DANGER, '#791F1F'], borderWidth: 1.5 }],
            }}
            options={{ ...baseOpts, scales: { y: { beginAtZero: true, title: { display: true, text: '명' } } }, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>
    </div>
  );
}

function RegionTab() {
  const sorted = [...areas].sort((a, b) => b.risk - a.risk);
  const rColor = r => r >= 70 ? DANGER : r >= 40 ? WARN : OK;
  const rFill = r => r >= 70 ? DF : r >= 40 ? WF : OF;
  return (
    <div style={s.grid2}>
      <div style={s.card}>
        <div style={s.cardTitle}>읍면동별 위험도 순위</div>
        <div style={{ ...s.chartH, height: 240 }}>
          <Bar
            data={{
              labels: sorted.map(a => a.name),
              datasets: [{ label: '위험도', data: sorted.map(a => a.risk), backgroundColor: sorted.map(a => rFill(a.risk)), borderColor: sorted.map(a => rColor(a.risk)), borderWidth: 1.5 }],
            }}
            options={{ ...baseOpts, indexAxis: 'y', scales: { x: { min: 0, max: 100, title: { display: true, text: '점' } } }, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>
      <div style={s.card}>
        <div style={s.cardTitle}>지역별 응급기관 접근 시간 (분)</div>
        <div style={{ ...s.chartH, height: 240 }}>
          <Bar
            data={{
              labels: areas.map(a => a.name),
              datasets: [{ label: '접근시간(분)', data: [8,22,12,28,6,5,15,7], backgroundColor: [WF,DF,WF,DF,OF,OF,WF,OF], borderColor: [WARN,DANGER,WARN,DANGER,OK,OK,WARN,OK], borderWidth: 1.5 }],
            }}
            options={{ ...baseOpts, scales: { y: { beginAtZero: true, title: { display: true, text: '분' } } }, plugins: { legend: { display: false } } }}
          />
        </div>
      </div>
      <div style={{ ...s.card, gridColumn: '1 / -1' }}>
        <div style={s.cardTitle}>위험도 × 독거노인 밀도 버블 차트</div>
        <div style={{ ...s.chartH, height: 220 }}>
          <Bubble
            data={{
              datasets: areas.map(a => ({
                label: a.name,
                data: [{ x: a.risk, y: a.cnt, r: Math.max(6, a.cnt * 1.8) }],
                backgroundColor: rFill(a.risk),
                borderColor: rColor(a.risk),
                borderWidth: 1.5,
              })),
            }}
            options={{ ...baseOpts, scales: { x: { min: 0, max: 100, title: { display: true, text: '위험도 점수' } }, y: { beginAtZero: true, title: { display: true, text: '독거노인 수 (명)' } } } }}
          />
        </div>
      </div>
    </div>
  );
}

const s = {
  wrap: { padding: 20 },
  tabRow: { display: 'flex', gap: 4, marginBottom: 16 },
  tabBtn: { padding: '7px 16px', fontSize: 13, border: '0.5px solid #E0E0E0', background: '#fff', borderRadius: 99, color: '#5D6D7E' },
  tabActive: { background: '#1A5276', color: '#fff', borderColor: '#1A5276', fontWeight: 600 },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 },
  statCard: { background: '#fff', border: '0.5px solid #E0E0E0', borderRadius: 12, padding: '14px 16px' },
  statLabel: { fontSize: 12, color: '#5D6D7E', marginBottom: 6 },
  statVal: { fontSize: 22, fontWeight: 600 },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card: { background: '#fff', border: '0.5px solid #E0E0E0', borderRadius: 12, padding: 16 },
  cardTitle: { fontSize: 13, fontWeight: 500, color: '#5D6D7E', marginBottom: 14 },
  chartH: { position: 'relative', height: 200 },
  insight: { background: '#F4F6F8', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#5D6D7E', borderLeft: '3px solid #2E86C1', marginTop: 10 },
};
