import React from 'react';
export function BottomNav({ items, current, variant = 'dock', label = '주 메뉴' }) {
  return <nav className="ds-bottom-nav" data-variant={variant} aria-label={label}>{items.map(item => <a key={item.href} href={item.href} aria-current={current === item.href ? 'page' : undefined}>{item.icon}<span>{item.label}</span></a>)}</nav>;
}
