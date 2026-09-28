'use client';
import React, { useState } from 'react';
import { Button } from './button.jsx';
import { StatusDot } from './status-dot.jsx';
// look matches the HTML data-look values; the ring look draws the progress as a circle beside the same progress bar.
export function Feedback({ progress = 68, onSave, look = 'card' }) {
  const [status, setStatus] = useState(''); const [loading, setLoading] = useState(false);
  const value = Math.min(100, Math.max(0, Number(progress) || 0));
  async function save() { setLoading(true); setStatus(''); try { await onSave?.(); setStatus('변경사항을 저장했어요.'); } catch { setStatus('저장하지 못했어요. 다시 시도해 주세요.'); } finally { setLoading(false); } }
  return <div className="ds-feedback-example" data-look={look}><Button loading={loading} onClick={save}>저장</Button><div role="status">{status && <div className="ds-alert"><StatusDot>{status}</StatusDot></div>}</div>{look === 'ring' && <span className="ds-progress-ring" aria-hidden="true" style={{ '--value': value }}><b>{value}%</b></span>}<div className="ds-progress-label"><span>파일 업로드</span><span>{value}%</span></div><progress className="ds-progress" value={value} max="100" aria-label="파일 업로드">{value}%</progress></div>;
}
