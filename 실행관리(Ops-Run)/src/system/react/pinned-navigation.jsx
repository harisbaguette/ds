'use client';
import React,{useState} from 'react';
import {safeLink} from './safe-link.jsx';
const defaults=[{id:'walks',label:'산책',href:'#walks'},{id:'notes',label:'기록',href:'#notes'},{id:'group',label:'모임',href:'#group'}];
export function PinnedNavigation({items=defaults,defaultPinned=[],pinned:controlled,onChange,label='즐겨찾기 탐색'}){
 const [local,setLocal]=useState(defaultPinned),[message,setMessage]=useState(''),pinned=controlled??local,ordered=[...items.filter(i=>pinned.includes(i.id)),...items.filter(i=>!pinned.includes(i.id))];
 const toggle=item=>{const wasPinned=pinned.includes(item.id),next=wasPinned?pinned.filter(id=>id!==item.id):[...pinned,item.id];setLocal(next);setMessage(item.label+(wasPinned?' 고정을 해제했어요.':'을 고정했어요.'));onChange?.(next);};
 return <nav className="ds-nav ds-pinned-navigation" aria-label={label}><ul>{ordered.map(item=><li key={item.id} data-pinned={pinned.includes(item.id)}><a href={safeLink(item.href)}>{item.label}</a><button type="button" className="ds-nav-button" aria-label={item.label+' 고정'} aria-pressed={pinned.includes(item.id)} onClick={()=>toggle(item)}>{pinned.includes(item.id)?'고정 해제':'고정'}</button></li>)}</ul><p role="status">{message}</p></nav>;
}
