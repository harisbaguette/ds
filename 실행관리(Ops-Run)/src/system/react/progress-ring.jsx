import React from 'react';
// The ring is a picture; the value is read from the progress element kept for screen readers.
export function ProgressRing({ value = 0, label = '파일 업로드' }) {
  const v = Math.min(100, Math.max(0, Number(value) || 0));
  return <div className="ds-progress-block ds-progress-ring-block"><span className="ds-progress-ring" aria-hidden="true" style={{ '--value': v }}><b>{v}%</b></span><div className="ds-progress-label"><span>{label}</span><span>{v}%</span></div><progress className="ds-progress" value={v} max="100" aria-label={label}>{v}%</progress></div>;
}
