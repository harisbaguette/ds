import React from 'react';
import { LayoutParagraphs } from './layout-content.jsx';
export function ScrollArea({children,aside,secondary,media,secondaryMedia,header,footer,label="스크롤 영역",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-scroll-area '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))} tabIndex={0} role="region" aria-label={label}>{children ?? <LayoutParagraphs/>}</div>;
}
