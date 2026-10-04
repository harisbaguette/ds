import React from 'react';
import { LayoutMedia, LayoutAside } from './layout-content.jsx';
export function ImposterLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="겹침 배치",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-imposter-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}><div className="ds-layout-body">{children ?? media ?? <LayoutMedia/>}</div><div className="ds-layout-overlay">{aside ?? <LayoutAside/>}</div></div>;
}
