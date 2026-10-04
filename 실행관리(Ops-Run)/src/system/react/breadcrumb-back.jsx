import React from 'react';
import {Breadcrumb} from './breadcrumb.jsx';
import {safeLink} from './safe-link.jsx';
export function BreadcrumbBack({items=[{label:'홈',href:'#home'},{label:'산책',href:'#walks'},{label:'숲길'}]}){const parent=items.at(-2);return <div className="ds-nav ds-breadcrumb-back"><div className="ds-nav-full-path"><Breadcrumb items={items}/></div>{parent&&<a className="ds-nav-back-path" href={safeLink(parent.href)}>이전: {parent.label}</a>}</div>;}
