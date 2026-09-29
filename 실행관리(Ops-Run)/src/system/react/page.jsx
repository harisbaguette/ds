'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Template } from './template.jsx';
import { SearchForm } from './search-form.jsx';
import { SearchBar } from './search-bar.jsx';
import { FilterChipRow } from './filter-chip-row.jsx';
import { ResultGrid } from './result-grid.jsx';
import { ResultList } from './result-list.jsx';
import { EmptyState } from './empty-state.jsx';
import { Button } from './button.jsx';
const defaults = [{ id: 'spring', title: '봄의 색', description: '연한 초록과 따뜻한 노랑', tag: '진행 중' }, { id: 'weekend', title: '주말의 기록', description: '산책하며 모은 장면들', tag: '완료' }, { id: 'studio', title: '작은 작업실', description: '다음 프로젝트의 첫 아이디어', tag: '진행 중' }];
// Each screen look brings the bottom bar shape and the search blocks that suit it, the same pairs the HTML renderer uses.
// search: grid (form + result grid), bar (search bar + result grid), list (form + result list), chips (form with a filter-chip row + result grid).
// Pass a <BottomNav variant={pageLooks[look].navigation} /> as navigation to complete the screen.
export const pageLooks = { stack: { navigation: 'minimal', search: 'grid' }, hero: { navigation: 'pill', search: 'bar' }, appbar: { navigation: 'line', search: 'list' }, sheet: { navigation: 'glass', search: 'chips' }, dashboard: { navigation: 'float', search: 'list' } };
// The collection search composed from the small blocks, plus the record detail it opens. onSave(record) may be async and may throw.
export function CollectionSearch({ records = defaults, onSave, search = 'grid' }) {
  const form = useRef(null); const opener = useRef(null); const detail = useRef(null);
  const [filter, setFilter] = useState({ query: '', status: 'all' }); const [selected, setSelected] = useState(null); const [saved, setSaved] = useState([]);
  const pending = useRef(new Set());
  const [pendingIds, setPendingIds] = useState([]);
  const [messages, setMessages] = useState({});
  const busy = selected ? pendingIds.includes(selected.id) : false;
  const message = selected ? messages[selected.id] || '' : '';
  const filtered = records.filter(item => filter.query.toLocaleLowerCase().split(/\s+/).every(term => `${item.title} ${item.description}`.toLocaleLowerCase().includes(term)) && (filter.status === 'all' || item.tag === filter.status));
  useEffect(() => { if (selected) detail.current?.focus(); else opener.current?.focus(); }, [selected]);
  function open(item, event) { opener.current = event.currentTarget; setSelected(item); }
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
  const query = () => form.current.elements.query.value.trim();
  const status = next => setFilter({ query: query(), status: next });
  const Form = search === 'bar' ? SearchBar : SearchForm;
  const Results = search === 'list' ? ResultList : ResultGrid;
  const chips = search === 'chips' ? <FilterChipRow name="status" onValueChange={status} /> : undefined;
  return <section className="ds-search-module" aria-label="컬렉션 검색"><div hidden={!!selected}><Form formRef={form} onSearch={setFilter} onStatusChange={event => status(event.target.value)} filter={chips} /><Results records={filtered} onAction={open} />{!filtered.length && <EmptyState onAction={() => { form.current.reset(); setFilter({ query: '', status: 'all' }); form.current.elements.query.focus(); }} />}</div>{selected && <section ref={detail} className="ds-record-detail" aria-label="컬렉션 상세" tabIndex={-1}><h3>{selected.title}</h3><p>{selected.description}</p><div><Button variant="outline" onClick={() => setSelected(null)}>목록으로</Button><Button loading={busy} aria-pressed={saved.includes(selected.id)} onClick={save}>{saved.includes(selected.id) ? '보관됨' : '컬렉션에 보관'}</Button></div><p role="status">{message}</p></section>}</section>;
}
export function CollectionPage({ title = '컬렉션', records, onSave, look = 'stack', navigation }) {
  const pair = pageLooks[look] ?? pageLooks.stack;
  const list = records ?? defaults;
  const summary = [['전체', `${list.length}개`], ...['진행 중', '완료'].map(tag => [tag, `${list.filter(item => item.tag === tag).length}개`])];
  return <Template title={title} count={`${list.length}개`} look={pageLooks[look] ? look : 'stack'} summary={summary} navigation={navigation}><CollectionSearch records={list} onSave={onSave} search={pair.search} /></Template>;
}
