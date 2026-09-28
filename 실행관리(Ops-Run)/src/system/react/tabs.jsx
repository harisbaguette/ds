'use client';
import React, { useEffect, useId, useRef, useState } from 'react';
const defaults = [{ value: 'all', label: '전체', content: '모든 컬렉션을 보고 있어요.' }, { value: 'progress', label: '진행 중', content: '진행 중인 컬렉션을 보고 있어요.' }, { value: 'done', label: '완료', content: '완료한 컬렉션을 보고 있어요.' }];
// look matches the HTML data-look values; the vertical look stacks the tabs and moves with the up and down arrows.
// The scroll look keeps one sideways-sliding row and brings the chosen tab fully into view.
// An item's count shows how many wait behind that tab and joins its accessible name ("진행 중 2개").
export function Tabs({ items = defaults, value, defaultValue, onValueChange, label = '컬렉션 분류', look = 'filled' }) {
  const id = useId(); const [local, setLocal] = useState(defaultValue ?? items[0]?.value);
  const chosen = value ?? local;
  const active = items.some(item => item.value === chosen) ? chosen : items[0]?.value;
  const vertical = look === 'vertical';
  const list = useRef(null);
  useEffect(() => {
    // Slide only the tab row; scrollIntoView would also drag the page down on first render.
    const tab = look === 'scroll' && list.current?.querySelector('[aria-selected="true"]');
    if (!tab) return;
    const listEl = list.current;
    const pad = parseFloat(getComputedStyle(listEl).scrollPaddingLeft) || 0, lr = listEl.getBoundingClientRect(), tr = tab.getBoundingClientRect();
    if (tr.left - pad < lr.left) listEl.scrollLeft -= lr.left - tr.left + pad;
    else if (tr.right + pad > lr.right) listEl.scrollLeft += tr.right - lr.right + pad;
  }, [active, look]);
  const [back, forward] = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
  function select(next) { setLocal(next); onValueChange?.(next); }
  function keydown(event, index) {
    if (![back, forward, 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === forward ? 1 : -1) + items.length) % items.length;
    event.currentTarget.parentElement.children[next].focus(); select(items[next].value);
  }
  return <div className="ds-tabs" data-look={look}><div ref={list} role="tablist" className="ds-tablist" aria-label={label} aria-orientation={vertical ? 'vertical' : undefined}>{items.map((item, i) => <button type="button" key={item.value} id={`${id}-tab-${i}`} className="ds-tab" role="tab" aria-selected={active === item.value} aria-controls={`${id}-panel-${i}`} tabIndex={active === item.value ? 0 : -1} onClick={() => select(item.value)} onKeyDown={event => keydown(event, i)} aria-label={item.count != null ? `${item.label} ${item.count}개` : undefined}>{item.icon}{item.label}{item.count != null && <span className="ds-tab-count" aria-hidden="true">{item.count}</span>}</button>)}</div>{items.map((item, i) => <div key={item.value} id={`${id}-panel-${i}`} className="ds-tabpanel" role="tabpanel" aria-labelledby={`${id}-tab-${i}`} hidden={active !== item.value} tabIndex={0}>{item.content}</div>)}</div>;
}
