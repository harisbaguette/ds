import React from 'react';
// Counts first: the number big, its name small. items: [[label, value]].
export function StatRow({ items = [] }) { return <ul className="ds-page-stats" role="list">{items.map(([label, value]) => <li key={label}><strong>{value}</strong><span>{label}</span></li>)}</ul>; }
