'use client';
import React,{useId,useState} from 'react';
import {LayoutWorkContent} from './layout-work-content.jsx';
import {safeLink as safeHref} from './safe-link.jsx';
export function CollapsibleSidebar({children=<LayoutWorkContent/>,links=[{label:'산책',href:'#walks'},{label:'기록',href:'#notes'},{label:'모임',href:'#group'}],onChange}){
 const [open,setOpen]=useState(true),id=useId();
 return <div className="ds-layout ds-collapsible-sidebar" data-collapsed={!open}><div className="ds-layout-rail-shell"><aside><button type="button" className="ds-layout-control" aria-expanded={open} aria-controls={id} onClick={()=>{setOpen(!open);onChange?.(!open);}}>{open?'탐색 접기':'탐색 펴기'}</button><nav id={id} aria-label="작업 탐색">{links.map((item,i)=><a key={i} href={safeHref(item.href)} aria-label={item.label}><span aria-hidden="true">{item.icon??item.label.slice(0,1)}</span><span className="ds-layout-rail-label">{item.label}</span></a>)}</nav></aside><div>{children}</div></div></div>;
}
