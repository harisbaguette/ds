import React from 'react';
import {Tabs} from './tabs.jsx';
import {workspaceItems} from './layout-work-content.jsx';
export function ListDetailLayout({items=workspaceItems,title='산책 기록',onChange}){return <div className="ds-layout ds-list-detail-layout"><Tabs items={items} label={title} look="vertical" onValueChange={onChange}/></div>;}
