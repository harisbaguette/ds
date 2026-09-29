import React from 'react';
import { FilterChip } from './filter-chip.jsx';
const statuses = [['all', '전체'], ['진행 중', '진행 중'], ['완료', '완료']];
// A row of radio chips for a few statuses. Inside a search form, keep name="status" so the form reads it.
export function FilterChipRow({ legend = '상태', name = 'status', items = statuses, value, defaultValue = 'all', onValueChange }) {
  const own = key => value !== undefined ? { checked: value === key } : { defaultChecked: defaultValue === key };
  return <fieldset className="ds-chip-group"><legend>{legend}</legend>{items.map(([key, label]) => <FilterChip key={key} type="radio" name={name} value={key} {...own(key)} onChange={() => onValueChange?.(key)}>{label}</FilterChip>)}</fieldset>;
}
