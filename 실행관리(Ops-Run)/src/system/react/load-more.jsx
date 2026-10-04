'use client';
import React,{useEffect,useRef,useState} from 'react';
import {safeLink} from './safe-link.jsx';
const defaults=[{id:'forest',label:'가을 숲',href:'#forest'},{id:'river',label:'물가 산책',href:'#river'}];
export function LoadMore({initialItems=defaults,initialCursor=null,initialHasMore=true,onLoad,label='산책 목록'}){
 const [items,setItems]=useState(initialItems),[cursor,setCursor]=useState(initialCursor),[more,setMore]=useState(initialHasMore),[status,setStatus]=useState(''),[pending,setPending]=useState(false),request=useRef(null),mounted=useRef(true);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;request.current?.abort();};},[]);
 const load=async()=>{
  if(request.current||!more)return;
  const controller=new AbortController();request.current=controller;setPending(true);setStatus('불러오는 중…');
  try{
   if(typeof onLoad!=='function')throw Error('missing handler');
   const aborted=new Promise((_,reject)=>controller.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError')),{once:true}));
   const result=await Promise.race([Promise.resolve().then(()=>onLoad({cursor,signal:controller.signal})),aborted]);
   if(controller.signal.aborted||!mounted.current)return;
   if(!result||!Array.isArray(result.items)||result.items.length>100||result.items.some(i=>!i||typeof i.id!=='string'||!i.id||typeof i.label!=='string'||(i.href!=null&&typeof i.href!=='string')||(i.description!=null&&typeof i.description!=='string'))||new Set(result.items.map(i=>i.id)).size!==result.items.length||typeof result.hasMore!=='boolean'||!(result.cursor==null||typeof result.cursor==='string'))throw Error('Invalid result');
   setItems(previous=>{const map=new Map(previous.map(i=>[i.id,i]));for(const item of result.items)map.set(item.id,item);return [...map.values()];});setCursor(result.cursor??null);setMore(result.hasMore);setStatus(result.hasMore?result.items.length+'개를 불러왔어요.':'모두 불러왔어요.');
  }catch(error){if(mounted.current)setStatus(controller.signal.aborted?'불러오기를 취소했어요.':'불러오지 못했어요. 다시 시도하세요.');}
  finally{if(request.current===controller)request.current=null;if(mounted.current)setPending(false);}
 };
 return <section className="ds-nav ds-load-more" aria-label={label}><ul aria-busy={pending}>{items.map(item=><li key={item.id} data-record-id={item.id}>{item.href?<a href={safeLink(item.href)}>{item.label}</a>:<span>{item.label}</span>}{item.description&&<p>{item.description}</p>}</li>)}</ul><div className="ds-nav-actions">{more&&<button type="button" className="ds-nav-button" onClick={load} disabled={pending}>더 보기</button>}{pending&&<button type="button" className="ds-nav-button" onClick={()=>request.current?.abort()}>취소</button>}</div><p role="status">{status}</p></section>;
}
