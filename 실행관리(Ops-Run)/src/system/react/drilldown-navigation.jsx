'use client';
import React,{useEffect,useRef,useState} from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationGroups} from './navigation-primitives.jsx';
const key=item=>String(item.id??item.href??item.label);
export function DrilldownNavigation({items=navigationGroups,title='전체 탐색',variant='basic',onChange}){
 const [path,setPath]=useState([]),[direction,setDirection]=useState(''),root=useRef(null),pending=useRef(null);
 let rows=items,parent=null;const activePath=[];
 for(const part of path){const found=rows.find(item=>key(item)===part);if(!found?.children?.length)break;parent=found;rows=found.children;activePath.push(part);}
 const signature=JSON.stringify(activePath);
 useEffect(()=>{if(!pending.current)return;const target=pending.current==='heading'?root.current.querySelector('h2'):[...root.current.querySelectorAll('[data-branch-key]')].find(n=>n.dataset.branchKey===pending.current);target?.focus();pending.current=null;},[signature]);
 const go=item=>{const next=[...activePath,key(item)];pending.current='heading';setDirection('next');setPath(next);onChange?.(next);};
 const back=()=>{pending.current=activePath.at(-1);const next=activePath.slice(0,-1);setDirection('back');setPath(next);onChange?.(next);};
 return <nav ref={root} className="ds-nav ds-drilldown-navigation" aria-label={title} data-variant={variant} data-direction={direction}><header>{activePath.length>0&&<button type="button" className="ds-nav-button" onClick={back}>이전</button>}<h2 tabIndex={-1}>{parent?.label??title}</h2>{parent?.href&&<a href={safeLink(parent.href)}>{parent.label} 전체</a>}</header><div className="ds-nav-drill-level" key={signature}><ul>{rows.map(item=><li key={key(item)}>{item.children?.length?<button type="button" className="ds-nav-button" data-branch-key={key(item)} onClick={()=>go(item)}>{item.label}<span aria-hidden="true"> ›</span></button>:<a href={safeLink(item.href)}>{item.label}</a>}</li>)}</ul></div></nav>;
}
