import React from 'react';
export function AdminShell({ title = '자료 관리', navigation = [], children, notice }) {
  return <section className="ds-admin-shell">
    {navigation.length > 0 && <nav aria-label="관리 메뉴">{navigation.map(item => <a key={item.href} href={item.href} aria-current={item.current ? 'page' : undefined}>{item.label}</a>)}</nav>}
    <div className="ds-admin-content"><header><h2>{title}</h2>{notice && <p>{notice}</p>}</header>{children}</div>
  </section>;
}
