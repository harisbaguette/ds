import React from 'react';
import { Badge } from './badge.jsx';
import { StatRow } from './stat-row.jsx';
// look matches the HTML data-look values; the dashboard look shows the summary numbers under the header.
export function Template({ title = '컬렉션', eyebrow = '나의 작업실', count, children, navigation, look = 'stack', summary = [] }) {
  return <div className="ds-page" data-look={look}><header className="ds-page-header"><div><span className="ds-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{count && <Badge>{count}</Badge>}</header>{look === 'dashboard' && summary.length > 0 && <StatRow items={summary} />}{children}{navigation}</div>;
}
