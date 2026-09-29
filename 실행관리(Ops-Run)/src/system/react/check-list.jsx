import React from 'react';
import { Checkbox } from './checkbox.jsx';
// Settings rows with a checkbox at the end. items: [{ value, label }], value: the picked values, onChange(nextValues).
export function CheckList({ legend, items = [], value = [], onChange, disabled }) {
  const toggle = item => onChange?.(value.includes(item.value) ? value.filter(v => v !== item.value) : [...value, item.value]);
  return <fieldset className="ds-choice-list"><legend>{legend}</legend>{items.map(item => <Checkbox key={item.value} value={item.value} disabled={disabled} checked={value.includes(item.value)} onChange={() => toggle(item)}>{item.label}</Checkbox>)}</fieldset>;
}
