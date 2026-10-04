import React from 'react';
import { LayoutHeader } from './layout-content.jsx';
export function GenericHeader({children,aside,secondary,media,secondaryMedia,header,footer,label="서비스 머리글",columns=3,className='',...props}){
 return <header {...props} className={'ds-layout ds-generic-header '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? header ?? <LayoutHeader/>}</header>;
}
