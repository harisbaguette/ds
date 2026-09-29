'use client';
import React, { useState } from 'react';
import { Field } from './field.jsx';
import { ListCard, CardBody, CardTitle, CardDescription, CardActions } from './list-card.jsx';
import { Badge } from './badge.jsx';
import { Button } from './button.jsx';
import { EmptyState } from './empty-state.jsx';
// Narrows the list while typing: one field, no status menu, no search button, each row a face to tap.
// people: [{ id, title, description, tag }], onPick(person).
export function PeoplePicker({ people = [], onPick, label = '사람 찾기' }) {
  const [query, setQuery] = useState('');
  const shown = people.filter(item => query.trim().toLocaleLowerCase().split(/\s+/).every(term => `${item.title} ${item.description}`.toLocaleLowerCase().includes(term)));
  return <section className="ds-search-module ds-people-picker" aria-label="사람 고르기"><Field label={label} type="search" placeholder="이름 한두 글자" value={query} onChange={event => setQuery(event.target.value)} /><p className="ds-result-count" role="status">{shown.length}명</p><div className="ds-results ds-people-list">{shown.map(item => <div key={item.id}><ListCard initial={[...item.title][0]}><CardBody><Badge>{item.tag}</Badge><CardTitle>{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></CardBody><CardActions><Button variant="outline" size="sm" onClick={() => onPick?.(item)}>고르기</Button></CardActions></ListCard></div>)}</div>{!shown.length && <EmptyState onAction={() => setQuery('')}>일치하는 사람이 없어요.</EmptyState>}</section>;
}
