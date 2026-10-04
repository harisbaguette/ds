import React from 'react';
import { LayoutCards } from './layout-content.jsx';
export function SwitcherLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="가로·세로 전환",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-switcher-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? <LayoutCards/>}</div>;
}
