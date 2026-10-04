import React from 'react';
import {SelectNavigation} from './select-navigation.jsx';
export function VersionSwitcher({items=[{label:'현재 버전',href:'#current'},{label:'이전 버전',href:'#previous'}],...props}){return <SelectNavigation items={items} label="문서 버전" {...props}/>;}
