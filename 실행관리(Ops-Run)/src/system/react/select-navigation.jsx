'use client';
import React,{useId,useState} from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks} from './navigation-primitives.jsx';
export function SelectNavigation({items=navigationLinks,label='이동할 곳',onNavigate}){const id=useId(),[index,setIndex]=useState(0),selected=items[index]??items[0];return <form className="ds-nav ds-select-navigation" onSubmit={e=>{e.preventDefault();if(!selected)return;if(onNavigate)onNavigate(selected);else location.assign(safeLink(selected.href));}}><label htmlFor={id}>{label}</label><select id={id} value={items[index]?index:0} onChange={e=>setIndex(Number(e.target.value))} disabled={!items.length}>{items.map((item,i)=><option key={i} value={i} lang={item.lang}>{item.label}</option>)}</select><button type="submit" className="ds-nav-button" disabled={!items.length}>이동</button></form>;}
