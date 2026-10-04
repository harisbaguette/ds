'use client';
import React,{useId,useRef,useState} from 'react';
import {LayoutWorkContent,LayoutWorkAside} from './layout-work-content.jsx';
const clamp=n=>Math.round(Math.max(0,Math.min(80,Number.isFinite(Number(n))?Number(n):50)));
export function ResizablePanels({children=<LayoutWorkContent/>,aside=<LayoutWorkAside/>,label='본문 영역 크기',defaultValue=50,value:controlled,onChange}){
 const id=useId(),[local,setLocal]=useState(()=>clamp(defaultValue)),saved=useRef(50),box=useRef(null),pointer=useRef(null);
 const value=clamp(controlled??local);
 const change=n=>{const next=clamp(n);setLocal(next);onChange?.(next);};
 const keydown=e=>{
  if(!['ArrowLeft','ArrowRight','Home','End','Enter'].includes(e.key))return;
  e.preventDefault();
  if(e.key==='Home')change(0);else if(e.key==='End')change(80);else if(e.key==='Enter'){if(value)saved.current=value;change(value?0:saved.current);}
  else change(value+((e.key==='ArrowRight')!==(getComputedStyle(box.current).direction==='rtl')?1:-1)*(e.shiftKey?10:1));
 };
 return <div className="ds-layout ds-resizable-panels"><div ref={box} className="ds-layout-resizer"><section id={id+'-primary'} hidden={!value} style={{flex:value+' 1 0%'}}>{children}</section><div className="ds-layout-separator" role="separator" tabIndex={0} aria-label={label} aria-orientation="vertical" aria-controls={id+'-primary'} aria-valuemin={0} aria-valuemax={80} aria-valuenow={value} aria-valuetext={value+'%'} onKeyDown={keydown} onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();e.currentTarget.focus();pointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(pointer.current!==e.pointerId)return;const r=box.current.getBoundingClientRect(),rtl=getComputedStyle(box.current).direction==='rtl';change(((rtl?r.right-e.clientX:e.clientX-r.left)-e.currentTarget.offsetWidth/2)/Math.max(1,r.width-e.currentTarget.offsetWidth)*100);}} onPointerUp={()=>{pointer.current=null;}} onPointerCancel={()=>{pointer.current=null;}} onLostPointerCapture={()=>{pointer.current=null;}}/><aside style={{flex:(100-value)+' 1 0%'}}>{aside}</aside></div></div>;
}
