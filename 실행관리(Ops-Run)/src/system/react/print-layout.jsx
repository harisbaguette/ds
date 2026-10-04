import React from 'react';
import { LayoutHeader, LayoutArticle, LayoutRelated } from './layout-content.jsx';
export function PrintLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="인쇄 문서",columns=3,className='',...props}){
 return <article {...props} className={'ds-layout ds-print-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}><div className="ds-layout-no-print">{header ?? <LayoutHeader/>}</div><div className="ds-layout-body">{children ?? <LayoutArticle/>}</div><div className="ds-layout-page-break">{secondary ?? <LayoutRelated/>}</div></article>;
}
