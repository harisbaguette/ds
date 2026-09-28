import React from 'react';
import { Badge } from './badge.jsx';
// look matches the HTML data-look values; the dashboard look shows the summary numbers under the header.
export function Template({ title = '컬렉션', eyebrow = '나의 작업실', count, children, navigation, look = 'stack', summary = [] }) {
  return <div className="ds-page" data-look={look}><header className="ds-page-header"><div><span className="ds-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{count && <Badge>{count}</Badge>}</header>{look === 'dashboard' && summary.length > 0 && <ul className="ds-page-stats" role="list">{summary.map(([label, value]) => <li key={label}><strong>{value}</strong><span>{label}</span></li>)}</ul>}{children}{navigation}</div>;
}
