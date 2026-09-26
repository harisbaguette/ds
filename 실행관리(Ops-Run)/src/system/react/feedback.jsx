'use client';
import React, { useState } from 'react';
import { Button } from './button.jsx';
import { StatusDot } from './status-dot.jsx';
export function Feedback({ progress = 68, onSave }) {
  const [status, setStatus] = useState(''); const [loading, setLoading] = useState(false);
  async function save() { setLoading(true); setStatus(''); try { await onSave?.(); setStatus('변경사항을 저장했어요.'); } catch { setStatus('저장하지 못했어요. 다시 시도해 주세요.'); } finally { setLoading(false); } }
  return <div className="ds-feedback-example"><Button loading={loading} onClick={save}>저장</Button><div role="status">{status && <div className="ds-alert"><StatusDot>{status}</StatusDot></div>}</div><div className="ds-progress-label"><span>파일 업로드</span><span>{progress}%</span></div><progress className="ds-progress" value={progress} max="100" aria-label="파일 업로드">{progress}%</progress></div>;
}
