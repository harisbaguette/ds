'use client';
import React,{useEffect,useRef,useState} from 'react';
const defaults=[{id:'walks',label:'산책',body:'참여할 산책 코스를 확인합니다.'},{id:'notes',label:'기록',body:'함께 걸었던 날의 기록입니다.'},{id:'group',label:'모임',body:'다음 산책에서 만날 사람들입니다.'}];
export function HistoryNavigation({items=defaults,onNavigate}){
 const [history,setHistory]=useState([items[0]?.id]),[index,setIndex]=useState(0),heading=useRef(null),pending=useRef(false),current=items.find(i=>i.id===history[index])??items[0];
 useEffect(()=>{if(pending.current){heading.current?.focus();pending.current=false;}},[index,current?.id]);
 const visit=item=>{if(item.id===current?.id)return;const next=[...history.slice(0,index+1),item.id];pending.current=true;setHistory(next);setIndex(next.length-1);onNavigate?.(item,{direction:'new'});};
 const move=next=>{if(next<0||next>=history.length)return;pending.current=true;setIndex(next);onNavigate?.(items.find(i=>i.id===history[next]),{direction:next<index?'back':'forward'});};
 return <div className="ds-nav ds-history-navigation"><nav aria-label="앱 방문 이력" className="ds-nav-actions"><button type="button" className="ds-nav-button" disabled={index<=0} onClick={()=>move(index-1)}>뒤로</button><button type="button" className="ds-nav-button" disabled={index>=history.length-1} onClick={()=>move(index+1)}>앞으로</button></nav><nav aria-label="작업 화면"><ul className="ds-nav-actions">{items.map(item=><li key={item.id}><button type="button" className="ds-nav-button" aria-current={item.id===current?.id?'page':undefined} onClick={()=>visit(item)}>{item.label}</button></li>)}</ul></nav>{current&&<section><h2 ref={heading} tabIndex={-1}>{current.label}</h2><p>{current.body}</p></section>}</div>;
}
