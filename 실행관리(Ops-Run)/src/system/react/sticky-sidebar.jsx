import React from 'react';
import { LayoutArticle, LayoutAside } from './layout-content.jsx';
export function StickySidebar({children,aside,secondary,media,secondaryMedia,header,footer,label="고정 보조 영역",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-sticky-sidebar '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}><div className="ds-layout-body">{children ?? <LayoutArticle/>}</div><aside className="ds-layout-aside">{aside ?? <LayoutAside/>}</aside></div>;
}
