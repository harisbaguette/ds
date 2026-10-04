import React from 'react';
import { LayoutCards } from './layout-content.jsx';
export function FluidLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="유동 열 배치",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-fluid-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? <LayoutCards/>}</div>;
}
