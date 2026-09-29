import React from 'react';
import { Input, InputGroup } from './input.jsx';
// A number and its unit in one box; the unit menu has its own name ("금액 단위").
export function UnitInput({ label = '금액', units = ['원', '달러'], unit, onUnitChange, disabled, ...props }) {
  return <InputGroup className="ds-unit-input"><Input inputMode="numeric" {...props} disabled={disabled} /><select className="ds-input-unit" aria-label={`${label} 단위`} disabled={disabled} {...(unit !== undefined ? { value: unit } : {})} onChange={event => onUnitChange?.(event.target.value)}>{units.map(name => <option key={name}>{name}</option>)}</select></InputGroup>;
}
