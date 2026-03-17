export const riskLevel = (score) =>
  score >= 70 ? 'danger' : score >= 40 ? 'warn' : 'ok';

export const riskLabel = (score) =>
  score >= 70 ? '고위험' : score >= 40 ? '주의' : '안전';

export const riskColor = (score) =>
  score >= 70 ? '#E24B4A' : score >= 40 ? '#EF9F27' : '#639922';

export const riskBg = (score) =>
  score >= 70 ? '#FCEBEB' : score >= 40 ? '#FAEEDA' : '#EAF3DE';

export const riskTextColor = (score) =>
  score >= 70 ? '#A32D2D' : score >= 40 ? '#854F0B' : '#3B6D11';
