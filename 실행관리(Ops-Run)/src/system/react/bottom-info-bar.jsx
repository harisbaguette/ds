import React from 'react';
import { LayoutFooter } from './layout-content.jsx';
export function BottomInfoBar({children,aside,secondary,media,secondaryMedia,header,footer,label="하단 정보 바",columns=3,className='',...props}){
 return <aside {...props} className={'ds-layout ds-bottom-info-bar '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? footer ?? <LayoutFooter/>}</aside>;
}
