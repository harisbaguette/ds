'use client';
import React, { useId, useState } from 'react';
const defaults = [{ value: 'all', label: '전체', content: '모든 컬렉션을 보고 있어요.' }, { value: 'progress', label: '진행 중', content: '진행 중인 컬렉션을 보고 있어요.' }, { value: 'done', label: '완료', content: '완료한 컬렉션을 보고 있어요.' }];
// look matches the HTML data-look values; the vertical look stacks the tabs and moves with the up and down arrows.
export function Tabs({ items = defaults, value, defaultValue, onValueChange, label = '컬렉션 분류', look = 'filled' }) {
  const id = useId(); const [local, setLocal] = useState(defaultValue ?? items[0]?.value);
  const chosen = value ?? local;
  const active = items.some(item => item.value === chosen) ? chosen : items[0]?.value;
  const vertical = look === 'vertical';
  const [back, forward] = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
  function select(next) { setLocal(next); onValueChange?.(next); }
  function keydown(event, index) {
    if (![back, forward, 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === forward ? 1 : -1) + items.length) % items.length;
    event.currentTarget.parentElement.children[next].focus(); select(items[next].value);
  }
  return <div className="ds-tabs" data-look={look}><div role="tablist" className="ds-tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : undefined}>{items.map((item, i) => <button type="button" key={item.value} id={`${id}-tab-${i}`} className="ds-tab" role="tab" aria-selected={active === item.value} aria-controls={`${id}-panel-${i}`} tabIndex={active === item.value ? 0 : -1} onClick={() => select(item.value)} onKeyDown={event => keydown(event, i)}>{item.icon}{item.label}</button>)}</div>{items.map((item, i) => <div key={item.value} id={`${id}-panel-${i}`} className="ds-tabpanel" role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={active !== item.value} tabIndex={0}>{item.content}</div>)}</div>;
}
