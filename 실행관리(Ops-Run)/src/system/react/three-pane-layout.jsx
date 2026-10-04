import React from 'react';
import { LayoutAside, LayoutArticle, LayoutRelated } from './layout-content.jsx';
export function ThreePaneLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="목록·상세·보조 배치",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-three-pane-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}><aside className="ds-layout-aside">{aside ?? <LayoutAside/>}</aside><div className="ds-layout-body">{children ?? <LayoutArticle/>}</div><aside className="ds-layout-secondary">{secondary ?? <LayoutRelated/>}</aside></div>;
}
