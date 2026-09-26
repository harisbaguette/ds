'use client';
import React, { useEffect, useRef, useState, useId } from 'react';
import { Field } from './field.jsx';
import { Button } from './button.jsx';
import { Badge } from './badge.jsx';
import { Card, CardBody, CardTitle, CardDescription, CardActions } from './card.jsx';
const defaults = [{ id: 'spring', title: '봄의 색', description: '연한 초록과 따뜻한 노랑', tag: '진행 중' }, { id: 'weekend', title: '주말의 기록', description: '산책하며 모은 장면들', tag: '완료' }, { id: 'studio', title: '작은 작업실', description: '다음 프로젝트의 첫 아이디어', tag: '진행 중' }];
export function SearchModule({ records = defaults, onSave }) {
  const id = useId(); const form = useRef(null); const opener = useRef(null); const detail = useRef(null);
  const [filter, setFilter] = useState({ query: '', status: 'all' }); const [selected, setSelected] = useState(null); const [saved, setSaved] = useState([]);
  const pending = useRef(new Set());
  const [pendingIds, setPendingIds] = useState([]);
  const [messages, setMessages] = useState({});
  const busy = selected ? pendingIds.includes(selected.id) : false;
  const message = selected ? messages[selected.id] || '' : '';
  const filtered = records.filter(item => filter.query.toLocaleLowerCase().split(/\s+/).every(term => `${item.title} ${item.description}`.toLocaleLowerCase().includes(term)) && (filter.status === 'all' || item.tag === filter.status));
  useEffect(() => { if (selected) detail.current?.focus(); else opener.current?.focus(); }, [selected]);
  function search(event) { event.preventDefault(); const data = new FormData(event.currentTarget); setFilter({ query: String(data.get('query')).trim(), status: data.get('status') }); }
  function open(item, event) { opener.current = event.currentTarget; setSelected(item); }
  function close() { setSelected(null); }
  async function save() {
    const record = selected;
    if (!record || pending.current.has(record.id)) return;
    pending.current.add(record.id);
    setPendingIds([...pending.current]);
    setMessages(old => ({ ...old, [record.id]: '' }));
    try {
      await onSave?.(record);
      setSaved(old => [...new Set([...old, record.id])]);
      setMessages(old => ({ ...old, [record.id]: '보관했어요.' }));
    } catch {
      setMessages(old => ({ ...old, [record.id]: '보관하지 못했어요. 다시 시도해 주세요.' }));
    } finally {
      pending.current.delete(record.id);
      setPendingIds([...pending.current]);
    }
  }
  return <section className="ds-search-module" aria-label="컬렉션 검색"><div hidden={!!selected}><form ref={form} className="ds-search-form" onSubmit={search}><Field label="컬렉션 검색" name="query" placeholder="이름으로 검색" /><label className="ds-select-field" htmlFor={`${id}-status`}><span>상태</span><select id={`${id}-status`} className="ds-input" name="status" onChange={event => setFilter({query:form.current.elements.query.value.trim(),status:event.target.value})}><option value="all">전체</option><option value="진행 중">진행 중</option><option value="완료">완료</option></select></label><Button type="submit">검색</Button></form><p className="ds-result-count" role="status">{filtered.length}개의 컬렉션</p><div className="ds-results">{filtered.map(item => <div key={item.id}><Card><CardBody><Badge>{item.tag}</Badge><CardTitle>{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></CardBody><CardActions><Button variant="outline" size="sm" onClick={event => open(item, event)}>열기</Button></CardActions></Card></div>)}</div>{!filtered.length && <div className="ds-empty"><p>일치하는 컬렉션이 없어요.</p><Button variant="outline" onClick={() => { form.current.reset(); setFilter({ query: '', status: 'all' }); form.current.elements.query.focus(); }}>전체 보기</Button></div>}</div>{selected && <section ref={detail} className="ds-record-detail" aria-label="컬렉션 상세" tabIndex={-1}><h3>{selected.title}</h3><p>{selected.description}</p><div><Button variant="outline" onClick={close}>목록으로</Button><Button loading={busy} aria-pressed={saved.includes(selected.id)} onClick={save}>{saved.includes(selected.id) ? '보관됨' : '컬렉션에 보관'}</Button></div><p role="status">{message}</p></section>}</section>;
}
