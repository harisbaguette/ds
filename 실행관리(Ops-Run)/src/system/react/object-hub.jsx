import React from 'react';
import {Tabs} from './tabs.jsx';
import {workspaceItems} from './layout-work-content.jsx';
export function ObjectHub({title='산책 기록',description='함께 걷고 기록하는 모임',items=workspaceItems,onChange}){return <div className="ds-layout ds-object-hub"><header className="ds-layout-object"><h2>{title}</h2><p>{description}</p></header><Tabs items={items} label={title} look="scroll" onValueChange={onChange}/></div>;}
