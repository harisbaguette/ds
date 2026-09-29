'use client';
import React, { useId } from 'react';
import { Field } from './field.jsx';
import { Button } from './button.jsx';
const statuses = [['all', '전체'], ['진행 중', '진행 중'], ['완료', '완료']];
// Query, status and button share one rounded bar. onSearch({ query, status }) runs on submit.
export function SearchBar({ onSearch, onStatusChange, label = '컬렉션 검색', placeholder = '이름으로 검색', statusOptions = statuses, formRef }) {
  const id = useId();
  function submit(event) { event.preventDefault(); const data = new FormData(event.currentTarget); onSearch?.({ query: String(data.get('query') ?? '').trim(), status: data.get('status') ?? 'all' }); }
  return <form ref={formRef} className="ds-search-bar" role="search" onSubmit={submit}><Field label={label} name="query" placeholder={placeholder} /><label className="ds-select-field" htmlFor={`${id}-status`}><span>상태</span><select id={`${id}-status`} className="ds-input" name="status" onChange={onStatusChange}>{statusOptions.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label><Button type="submit">검색</Button></form>;
}
