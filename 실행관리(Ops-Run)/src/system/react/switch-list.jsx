import React from 'react';
import { Switch } from './switch.jsx';
// Settings that apply at once, one switch per row. items: [{ name, label, checked }], onChange(name, checked).
export function SwitchList({ legend, items = [], onChange, disabled }) {
  return <fieldset className="ds-choice-list"><legend>{legend}</legend>{items.map(item => <Switch key={item.name} name={item.name} disabled={disabled} checked={item.checked} onChange={event => onChange?.(item.name, event.target.checked)}>{item.label}</Switch>)}</fieldset>;
}
