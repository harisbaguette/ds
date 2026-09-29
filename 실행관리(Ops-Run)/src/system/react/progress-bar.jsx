import React from 'react';
export function ProgressBar({ value = 0, label = '파일 업로드' }) {
  const v = Math.min(100, Math.max(0, Number(value) || 0));
  return <div className="ds-progress-block"><div className="ds-progress-label"><span>{label}</span><span>{v}%</span></div><progress className="ds-progress" value={v} max="100" aria-label={label}>{v}%</progress></div>;
}
