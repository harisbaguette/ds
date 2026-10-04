import React from 'react';
import { LayoutCards } from './layout-content.jsx';
export function EqualColumns({children,aside,secondary,media,secondaryMedia,header,footer,label="같은 폭 단",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-equal-columns '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? <LayoutCards/>}</div>;
}
