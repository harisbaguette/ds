import React from 'react';
// Same markup as the HTML renderer: shapes with a raised center action get a create button between the halves.
const centerVariants = ['float'];
const PlusIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className="ui-icon" width="20" height="20" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>;
export function BottomNav({ items, current, variant = 'line', label = '주 메뉴', onCreate, createLabel = '만들기', createIcon = <PlusIcon /> }) {
  const links = items.map(item => <a key={item.href} href={item.href} aria-current={current === item.href ? 'page' : undefined}>{item.icon}<span>{item.label}</span></a>);
  if (centerVariants.includes(variant)) links.splice(Math.ceil(links.length / 2), 0, <button key="create" type="button" className="ds-bottom-nav-create" aria-label={createLabel} onClick={onCreate}>{createIcon}</button>);
  return <nav className="ds-bottom-nav" data-variant={variant} aria-label={label}>{links}</nav>;
}
