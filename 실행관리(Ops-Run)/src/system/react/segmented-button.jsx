'use client';
import React, { useId } from 'react';
// Two to four options side by side; the chosen one is filled and carries a check. items: [{ value, label }].
const defaults = [{ value: 'day', label: '일' }, { value: 'week', label: '주' }, { value: 'month', label: '월' }];
export function SegmentedButton({ legend = '보기 단위', items = defaults, value, defaultValue, onValueChange, name, disabled }) {
  const id = useId();
  const own = item => value !== undefined ? { checked: value === item.value } : { defaultChecked: (defaultValue ?? items[0]?.value) === item.value };
  return <fieldset className="ds-segmented" disabled={disabled}><legend>{legend}</legend>{items.map(item => <label key={item.value} className="ds-segment"><input type="radio" name={name ?? id} value={item.value} {...own(item)} onChange={() => onValueChange?.(item.value)} /><span>{item.label}</span></label>)}</fieldset>;
}
