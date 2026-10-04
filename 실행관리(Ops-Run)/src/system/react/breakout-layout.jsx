import React from 'react';
import { LayoutArticle, LayoutMedia, LayoutRelated } from './layout-content.jsx';
export function BreakoutLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="본문 밖 확장",columns=3,className='',...props}){
 return <article {...props} className={'ds-layout ds-breakout-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}><div className="ds-layout-body">{children ?? <LayoutArticle/>}</div><div className="ds-layout-breakout">{media ?? <LayoutMedia/>}</div><div className="ds-layout-body">{secondary ?? <LayoutRelated/>}</div></article>;
}
