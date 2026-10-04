import React from 'react';
import {Drawer} from './drawer.jsx';
import {LayoutWorkContent} from './layout-work-content.jsx';
export function OffCanvasLayout({children=<LayoutWorkContent/>,title='산책 기록',trigger='안내 열기',...props}){return <div className="ds-layout ds-off-canvas-layout"><Drawer title={title} trigger={trigger} {...props}>{children}</Drawer></div>;}
