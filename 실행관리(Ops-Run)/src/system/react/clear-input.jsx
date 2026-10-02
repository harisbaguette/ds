'use client';
import React, { useState } from 'react';
import { Input, InputGroup, InputTool } from './input.jsx';
import { CloseIcon } from './ui-icon-close.jsx';
// A value that is rewritten as a whole: the clear button empties it at once and hides while the box is empty (needs a placeholder).
// onValueChange(next) receives the text.
export function ClearInput({ label = '검색어', defaultValue = '', value, onValueChange, disabled, placeholder = '검색어 입력', ...props }) {
  const [local, setLocal] = useState(defaultValue); const current = value ?? local;
  const set = next => { setLocal(next); onValueChange?.(next); };
  return <InputGroup className="ds-clear-input"><Input {...props} placeholder={placeholder} disabled={disabled} value={current} onChange={event => set(event.target.value)} /><InputTool aria-label={`${label} 지우기`} disabled={disabled} onClick={() => set('')}><CloseIcon /></InputTool></InputGroup>;
}
