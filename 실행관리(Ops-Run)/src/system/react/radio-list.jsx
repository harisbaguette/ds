'use client';
import React, { useId } from 'react';
import { Radio } from './radio.jsx';
// Settings rows where one is picked. items: [{ value, label }].
export function RadioList({ legend, items = [], value, onValueChange, name, disabled }) {
  const id = useId();
  return <fieldset className="ds-choice-list"><legend>{legend}</legend>{items.map(item => <Radio key={item.value} name={name ?? id} value={item.value} disabled={disabled} checked={value === item.value} onChange={() => onValueChange?.(item.value)}>{item.label}</Radio>)}</fieldset>;
}
