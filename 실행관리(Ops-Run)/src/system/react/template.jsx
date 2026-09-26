import React from 'react';
import { Badge } from './badge.jsx';
export function Template({ title = '컬렉션', eyebrow = '나의 작업실', count, children, navigation }) { return <div className="ds-page"><header className="ds-page-header"><div><span className="ds-eyebrow">{eyebrow}</span><h2>{title}</h2></div>{count && <Badge>{count}</Badge>}</header>{children}{navigation}</div>; }
