import React from 'react';
import {SelectNavigation} from './select-navigation.jsx';
export function WorkspaceSwitcher({items=[{label:'디자인팀',href:'#design'},{label:'개발팀',href:'#development'}],...props}){return <SelectNavigation items={items} label="작업 공간" {...props}/>;}
