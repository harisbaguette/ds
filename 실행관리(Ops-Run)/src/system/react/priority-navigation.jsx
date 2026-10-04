'use client';
import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import {navigationLinks,NavigationDisclosure} from './navigation-primitives.jsx';
import {safeLink} from './safe-link.jsx';
export function PriorityNavigation({items=navigationLinks,current,label='주 탐색'}){
 const root=useRef(null),measure=useRef(null),measureMore=useRef(null),pending=useRef(null),[count,setCount]=useState(items.length);
 useLayoutEffect(()=>{if(pending.current==null)return;const link=[...root.current.querySelectorAll('[data-nav-index]')].find(n=>Number(n.dataset.navIndex)===pending.current);const disclosure=link?.closest('details');if(disclosure)disclosure.open=true;link?.focus({preventScroll:true});pending.current=null;},[count]);
 useEffect(()=>{
  let cancelled=false;
  const fit=()=>{if(cancelled)return;const widths=[...measure.current.querySelectorAll('li')].map(n=>n.getBoundingClientRect().width),gap=parseFloat(getComputedStyle(measure.current).columnGap)||0,available=root.current.clientWidth,all=widths.reduce((sum,n)=>sum+n,0)+Math.max(0,widths.length-1)*gap;let next=items.length;
   if(all>available){const limit=Math.max(0,available-measureMore.current.offsetWidth-gap);let used=0;next=0;while(next<widths.length&&used+widths[next]+(next?gap:0)<=limit){used+=widths[next]+(next?gap:0);next++;}}
   setCount(previous=>{if(previous!==next){const active=document.activeElement;if(root.current.contains(active)&&active.hasAttribute('data-nav-index'))pending.current=Number(active.dataset.navIndex);}return next;});
  };
  const observer=new ResizeObserver(fit);observer.observe(root.current);observer.observe(measure.current);fit();document.fonts.ready.then(fit);return()=>{cancelled=true;observer.disconnect();};
 },[items,current]);
 const link=(item,i,measuring=false)=><li key={item.id??i}><a href={safeLink(item.href)} data-nav-index={measuring?undefined:i} aria-current={current===item.href?'page':undefined}>{item.label}</a></li>;
 return <nav ref={root} className="ds-nav ds-priority-navigation" aria-label={label}><ul className="ds-priority-visible">{items.slice(0,count).map((item,i)=>link(item,i))}</ul>{count<items.length&&<NavigationDisclosure label="더보기"><ul className="ds-priority-overflow">{items.slice(count).map((item,i)=>link(item,count+i))}</ul></NavigationDisclosure>}<div className="ds-nav-measure" aria-hidden="true" inert><ul ref={measure} className="ds-priority-visible">{items.map((item,i)=>link(item,i,true))}</ul><details className="ds-nav-disclosure"><summary ref={measureMore}>더보기</summary></details></div></nav>;
}
