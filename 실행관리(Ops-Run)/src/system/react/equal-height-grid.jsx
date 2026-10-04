import React from 'react';
import { LayoutCards } from './layout-content.jsx';
export function EqualHeightGrid({children,aside,secondary,media,secondaryMedia,header,footer,label="같은 높이 격자",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-equal-height-grid '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? <LayoutCards/>}</div>;
}
