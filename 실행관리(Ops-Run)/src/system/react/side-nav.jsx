import React from 'react';
import { safeLink } from './safe-link.jsx';
export function SideNav({label='작업 메뉴',items=[{label:'자료',href:'#records'},{label:'보관함',href:'#saved'},{label:'설정',href:'#settings'}],current='#records'}) {return <nav className="ds-side-nav" aria-label={label}>{items.map(i=><a key={i.href} href={safeLink(i.href)} aria-current={i.href===current?'page':undefined}>{i.label}</a>)}</nav>;}
