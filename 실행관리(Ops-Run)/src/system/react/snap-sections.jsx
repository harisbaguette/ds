import React from 'react';
import {workspaceItems} from './layout-work-content.jsx';
export function SnapSections({items=workspaceItems,title='산책 기록'}){return <div className="ds-layout ds-snap-sections"><div className="ds-layout-snap" tabIndex={0} role="region" aria-label={title}>{items.map((item,i)=><section key={item.value??i}><h2>{item.label}</h2><p>{item.content}</p></section>)}</div></div>;}
