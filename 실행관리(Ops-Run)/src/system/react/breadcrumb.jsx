import React from 'react';
import { safeLink } from './safe-link.jsx';
export function Breadcrumb({items=[{label:'홈',href:'#home'},{label:'보관함'}]}) {return <nav className="ds-breadcrumb" aria-label="현재 위치"><ol>{items.map((i,n)=><li key={n}>{n===items.length-1?<span aria-current="page">{i.label}</span>:<a href={safeLink(i.href)}>{i.label}</a>}</li>)}</ol></nav>;}
