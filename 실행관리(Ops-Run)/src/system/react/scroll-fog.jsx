import React from 'react';
import { LayoutParagraphs } from './layout-content.jsx';
export function ScrollFog({children,aside,secondary,media,secondaryMedia,header,footer,label="스크롤 가장자리 표시",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-scroll-fog '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))} tabIndex={0} role="region" aria-label={label}>{children ?? <LayoutParagraphs/>}</div>;
}
