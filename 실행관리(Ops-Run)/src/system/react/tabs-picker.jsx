'use client';
import React,{useId,useState} from 'react';
import {Tabs} from './tabs.jsx';
const defaults=['계획','준비물','기록','사진','참여자','설정'].map((label,i)=>({value:String(i),label,content:label+' 내용을 확인하세요.'}));
export function TabsPicker({items=defaults,visibleCount=3,onChange,label='문서 탭'}){
 const id=useId(),[value,setValue]=useState(items[0]?.value),active=items.some(i=>i.value===value)?value:items[0]?.value,count=Math.max(1,Math.floor(Number(visibleCount))||3),extra=items.slice(count);
 const change=next=>{setValue(next);onChange?.(next);};
 return <div className="ds-nav ds-tabs-picker"><Tabs items={items.map((item,i)=>({...item,hidden:i>=count&&item.value!==active}))} label={label} value={active} onValueChange={change} look="scroll"/>{extra.length>0&&<div className="ds-nav-extra-tabs"><label htmlFor={id}>추가 탭</label><select id={id} value={extra.some(i=>i.value===active)?active:''} onChange={e=>{if(e.target.value)change(e.target.value);}}><option value="" disabled>탭 선택</option>{extra.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select></div>}</div>;
}
