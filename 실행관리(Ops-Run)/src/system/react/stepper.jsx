'use client';
import React, { useState } from 'react';
import { Input, InputGroup, InputTool } from './input.jsx';
const PlusIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className="ui-icon" width="20" height="20" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
// Small numbers change with − and + instead of the keyboard; the value never goes below min (or above max).
export function Stepper({ defaultValue = 1, value, min = 0, max, onValueChange, disabled, ...props }) {
  const [local, setLocal] = useState(defaultValue); const current = value ?? local;
  const set = n => { const next = Math.max(min, max != null ? Math.min(max, n) : n); setLocal(next); onValueChange?.(next); };
  return <InputGroup className="ds-stepper"><InputTool aria-label="하나 빼기" disabled={disabled || current <= min} onClick={() => set(current - 1)}><span aria-hidden="true">−</span></InputTool><Input {...props} type="number" inputMode="numeric" min={min} max={max} disabled={disabled} value={current} onChange={event => set(Number(event.target.value) || 0)} /><InputTool aria-label="하나 더하기" disabled={disabled || (max != null && current >= max)} onClick={() => set(current + 1)}><PlusIcon /></InputTool></InputGroup>;
}
