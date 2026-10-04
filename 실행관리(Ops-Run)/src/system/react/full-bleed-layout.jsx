import React from 'react';
import { LayoutMedia } from './layout-content.jsx';
export function FullBleedLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="너비를 채우는 배치",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-full-bleed-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? media ?? <LayoutMedia/>}</div>;
}
