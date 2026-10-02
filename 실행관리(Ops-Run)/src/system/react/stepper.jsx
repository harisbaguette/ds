'use client';
import React, { useState } from 'react';
import { Input, InputGroup, InputTool } from './input.jsx';
import { PlusIcon } from './ui-icon-plus.jsx';
import { MinusIcon } from './ui-icon-minus.jsx';
// Small numbers change with − and + instead of the keyboard; the value never goes below min (or above max).
export function Stepper({ defaultValue = 1, value, min = 0, max, onValueChange, disabled, ...props }) {
  const [local, setLocal] = useState(defaultValue); const current = value ?? local;
  const set = n => { const next = Math.max(min, max != null ? Math.min(max, n) : n); setLocal(next); onValueChange?.(next); };
  return <InputGroup className="ds-stepper"><InputTool aria-label="하나 빼기" disabled={disabled || current <= min} onClick={() => set(current - 1)}><MinusIcon /></InputTool><Input {...props} type="number" inputMode="numeric" min={min} max={max} disabled={disabled} value={current} onChange={event => set(Number(event.target.value) || 0)} /><InputTool aria-label="하나 더하기" disabled={disabled || (max != null && current >= max)} onClick={() => set(current + 1)}><PlusIcon /></InputTool></InputGroup>;
}
