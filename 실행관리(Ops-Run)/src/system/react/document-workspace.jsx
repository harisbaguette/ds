import React from 'react';
import {Tabs} from './tabs.jsx';
import {workspaceItems} from './layout-work-content.jsx';
export function DocumentWorkspace({items=workspaceItems,title='산책 기록',onChange}){return <div className="ds-layout ds-document-workspace"><Tabs items={items} label={title} look="scroll" onValueChange={onChange}/></div>;}
