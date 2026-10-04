'use client';
import React,{useEffect,useRef,useState} from 'react';
import {workspaceItems} from './layout-work-content.jsx';
export function StackedPanels({items=workspaceItems,onChange}){
 const [index,setIndex]=useState(0),[direction,setDirection]=useState(''),container=useRef(null),pending=useRef(null),current=Math.min(index,Math.max(0,items.length-1));
 const go=(next,back)=>{pending.current=back?'back':'next';setDirection(pending.current);setIndex(next);onChange?.(next);};
 useEffect(()=>{if(!pending.current)return;const page=container.current.querySelector('[data-layout-stack-page="'+current+'"]');(pending.current==='back'?page?.querySelector('[data-stack-next]')||page:page)?.focus();pending.current=null;},[current]);
 return <div ref={container} className="ds-layout ds-stacked-panels" data-depth={current} data-direction={direction}>{items.map((item,i)=><section key={item.value??i} data-layout-stack-page={i} tabIndex={-1} hidden={i!==current}><h2>{item.label}</h2><p>{item.content}</p><div className="ds-layout-stack-actions">{i>0&&<button type="button" className="ds-layout-control" onClick={()=>go(i-1,true)}>이전</button>}{i<items.length-1&&<button type="button" className="ds-layout-control" data-stack-next onClick={()=>go(i+1,false)}>상세 보기</button>}</div></section>)}</div>;
}
