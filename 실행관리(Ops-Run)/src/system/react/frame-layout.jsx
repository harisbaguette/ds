import React from 'react';
import { LayoutMedia } from './layout-content.jsx';
export function FrameLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="비율 프레임",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-frame-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? media ?? <LayoutMedia/>}</div>;
}
