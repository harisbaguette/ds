import React from 'react';
import {SelectNavigation} from './select-navigation.jsx';
export function LocaleSwitcher({items=[{label:'한국어',lang:'ko',href:'#ko'},{label:'English',lang:'en',href:'#en'},{label:'日本語',lang:'ja',href:'#ja'}],...props}){return <SelectNavigation items={items} label="언어" {...props}/>;}
