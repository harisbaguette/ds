'use client';
import React, { useEffect, useRef } from 'react';
export function Checkbox({ children, look, indeterminate = false, ...props }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return <label className="ds-choice" data-look={look}><input {...props} ref={ref} type="checkbox" />{children}</label>;
}
// The all look puts one parent above its children; the parent shows "some" when only part is picked.
// items: [{ value, label }], value: the picked values, onChange(nextValues).
export function CheckboxAll({ legend = '받을 알림', parentLabel = '모두 선택', items = [], value = [], onChange, disabled }) {
  const on = items.filter(item => value.includes(item.value)).length;
  const toggle = item => onChange?.(value.includes(item.value) ? value.filter(v => v !== item.value) : [...value, item.value]);
  return <fieldset className="ds-select-all" data-look="all"><legend>{legend}</legend>
    <Checkbox data-part="select-all" disabled={disabled} checked={on > 0 && on === items.length} indeterminate={on > 0 && on < items.length} onChange={() => onChange?.(on === items.length ? [] : items.map(item => item.value))}>{parentLabel}</Checkbox>
    {items.map(item => <Checkbox key={item.value} value={item.value} disabled={disabled} checked={value.includes(item.value)} onChange={() => toggle(item)}>{item.label}</Checkbox>)}
  </fieldset>;
}
