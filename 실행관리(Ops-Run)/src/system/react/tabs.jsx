'use client';
import React, { useId, useState } from 'react';
const defaults = [{ value: 'all', label: '전체', content: '모든 컬렉션을 보고 있어요.' }, { value: 'progress', label: '진행 중', content: '진행 중인 컬렉션을 보고 있어요.' }, { value: 'done', label: '완료', content: '완료한 컬렉션을 보고 있어요.' }];
export function Tabs({ items = defaults, value, defaultValue, onValueChange, label = '컬렉션 분류' }) {
  const id = useId(); const [local, setLocal] = useState(defaultValue ?? items[0]?.value);
  const chosen = value ?? local;
  const active = items.some(item => item.value === chosen) ? chosen : items[0]?.value;
  function select(next) { setLocal(next); onValueChange?.(next); }
  function keydown(event, index) {
    if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    event.currentTarget.parentElement.children[next].focus(); select(items[next].value);
  }
  return <div className="ds-tabs"><div role="tablist" className="ds-tablist" aria-label={label}>{items.map((item, i) => <button type="button" key={item.value} id={`${id}-tab-${i}`} className="ds-tab" role="tab" aria-selected={active === item.value} aria-controls={`${id}-panel-${i}`} tabIndex={active === item.value ? 0 : -1} onClick={() => select(item.value)} onKeyDown={event => keydown(event, i)}>{item.label}</button>)}</div>{items.map((item, i) => <div key={item.value} id={`${id}-panel-${i}`} className="ds-tabpanel" role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={active !== item.value} tabIndex={0}>{item.content}</div>)}</div>;
}
