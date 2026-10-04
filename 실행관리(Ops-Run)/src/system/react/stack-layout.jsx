import React from 'react';
import { LayoutCards } from './layout-content.jsx';
export function StackLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="세로 간격 묶음",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-stack-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? <LayoutCards/>}</div>;
}
