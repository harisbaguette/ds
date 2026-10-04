'use client';
import React,{useState} from 'react';
import { Button } from './button.jsx';
export function Comparison({title='수업 비교',items=[{id:'basic',name:'기초반',price:'30,000원',detail:'주 1회'},{id:'advanced',name:'심화반',price:'50,000원',detail:'주 2회'}],onChoose}) {
  const [selected,setSelected]=useState(null);return <section className="ds-comparison"><h2>{title}</h2><div className="ds-comparison-grid">{items.map(i=><article key={i.id}><h3>{i.name}</h3><p>{i.price}</p><p>{i.detail}</p><Button aria-pressed={selected===i.id} onClick={()=>{setSelected(i.id);onChoose?.(i);}}>{i.name} 선택</Button></article>)}</div><p role="status">{selected?items.find(i=>i.id===selected)?.name+' 선택됨':''}</p></section>;
}
