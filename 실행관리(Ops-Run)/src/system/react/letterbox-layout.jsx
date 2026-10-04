import React from 'react';
import { LayoutMedia } from './layout-content.jsx';
export function LetterboxLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="고정 비율 무대",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-letterbox-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? media ?? <LayoutMedia/>}</div>;
}
