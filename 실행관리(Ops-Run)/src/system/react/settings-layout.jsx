import React from 'react';
import { LayoutAside, LayoutArticle } from './layout-content.jsx';
export function SettingsLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="설정 화면 배치",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-settings-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}><aside className="ds-layout-aside">{aside ?? <LayoutAside/>}</aside><div className="ds-layout-body">{children ?? <LayoutArticle/>}</div></div>;
}
