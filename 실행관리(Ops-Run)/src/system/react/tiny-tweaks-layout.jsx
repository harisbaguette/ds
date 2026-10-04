import React from 'react';
import { LayoutArticle } from './layout-content.jsx';
export function TinyTweaksLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="읽기 폭 미세 조정",columns=3,className='',...props}){
 return <article {...props} className={'ds-layout ds-tiny-tweaks-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}><div className="ds-layout-body">{children ?? <LayoutArticle/>}</div></article>;
}
