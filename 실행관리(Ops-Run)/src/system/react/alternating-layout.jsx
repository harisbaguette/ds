import React from 'react';
import { LayoutMedia, LayoutArticle, LayoutRelated } from './layout-content.jsx';
export function AlternatingLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="교차 배치",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-alternating-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}><section className="ds-layout-pair">{media ?? <LayoutMedia/>}<div>{children ?? <LayoutArticle/>}</div></section><section className="ds-layout-pair">{secondaryMedia ?? <LayoutMedia/>}<div>{secondary ?? <LayoutRelated/>}</div></section></div>;
}
