import React from 'react';

export function ToolbarSpacer({children,aside,secondary,media,secondaryMedia,header,footer,label="도구 사이 간격",columns=3,className='',...props}){
 return <span {...props} className={'ds-layout ds-toolbar-spacer '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}></span>;
}
