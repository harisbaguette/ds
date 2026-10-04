import React from 'react';
import { LayoutThumbnails } from './layout-content.jsx';
export function ThumbnailList({children,aside,secondary,media,secondaryMedia,header,footer,label="섬네일 목록",columns=3,className='',...props}){
 return <ul {...props} className={'ds-layout ds-thumbnail-list '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? <LayoutThumbnails/>}</ul>;
}
