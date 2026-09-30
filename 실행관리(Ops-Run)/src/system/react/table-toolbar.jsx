'use client';
// Adapted from satnaing/shadcn-admin (MIT), e16c87f. See design/licenses/shadcn-admin.txt.
import React from 'react';
import { Button } from './button.jsx';
import { Field } from './field.jsx';
export function TableToolbar({ table, statuses = [], searchLabel = '자료 검색', actions }) {
  const filtered = !!table.getState().globalFilter || table.getState().columnFilters.length > 0;
  return <div className="ds-table-toolbar">
    <Field label={searchLabel} type="search" value={table.getState().globalFilter ?? ''} onChange={e => table.setGlobalFilter(e.target.value)} />
    <Field label="상태">{props => <select {...props} className="ds-input" value={table.getColumn('status')?.getFilterValue() ?? ''} onChange={e => table.getColumn('status')?.setFilterValue(e.target.value)}><option value="">전체 상태</option>{statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select>}</Field>
    {filtered && <Button variant="ghost" onClick={() => { table.setGlobalFilter(''); table.resetColumnFilters(); }}>조건 초기화</Button>}
    {actions}
  </div>;
}
