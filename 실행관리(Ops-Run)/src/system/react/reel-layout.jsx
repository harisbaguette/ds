import React from 'react';
import { LayoutCards } from './layout-content.jsx';
export function ReelLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="가로 탐색 띠",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-reel-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))} tabIndex={0} role="region" aria-label={label}>{children ?? <LayoutCards/>}</div>;
}
