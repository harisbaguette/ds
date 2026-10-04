import React from 'react';
import { LayoutHeader, LayoutArticle, LayoutFooter } from './layout-content.jsx';
export function CoverLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="중앙 표지",columns=3,className='',...props}){
 return <section {...props} className={'ds-layout ds-cover-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}><header>{header ?? <LayoutHeader/>}</header><div className="ds-layout-center">{children ?? <LayoutArticle/>}</div><footer>{footer ?? <LayoutFooter/>}</footer></section>;
}
