import React from 'react';
import {LayoutWorkContent} from './layout-work-content.jsx';
export function StickyActionLayout({children=<LayoutWorkContent/>,actionLabel='일정 저장',onAction}){return <div className="ds-layout ds-sticky-action-layout"><div className="ds-layout-scroll" tabIndex={0} role="region" aria-label="문서">{children}<div className="ds-layout-action"><button type="button" className="ds-layout-control" onClick={onAction}>{actionLabel}</button></div></div></div>;}
