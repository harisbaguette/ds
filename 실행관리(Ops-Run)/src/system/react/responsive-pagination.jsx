'use client';
import React,{useState} from 'react';
import {NavigationDisclosure} from './navigation-primitives.jsx';
export function pageNumbers(page,total){return [...new Set([1,total,...Array.from({length:5},(_,i)=>page-2+i).filter(n=>n>0&&n<=total)])].sort((a,b)=>a-b).flatMap((n,i,a)=>i&&n>a[i-1]+1?[null,n]:[n]);}
export function ResponsivePagination({page:controlled,defaultPage=1,total=8,onPageChange,conditional=false}){
 const [local,setLocal]=useState(defaultPage),count=Math.min(10000,Math.max(1,Math.floor(Number(total))||1)),page=Math.min(count,Math.max(1,Math.floor(Number(controlled??local))||1));
 const change=next=>{setLocal(next);onPageChange?.(next);};
 const numbers=<div className="ds-nav-pages">{pageNumbers(page,count).map((n,i)=>n===null?<span key={'gap-'+i} aria-hidden="true">…</span>:<button key={n} type="button" className="ds-nav-button" aria-current={n===page?'page':undefined} aria-label={n+'쪽'} onClick={()=>change(n)}>{n}</button>)}</div>;
 return <nav className={'ds-nav ds-responsive-pagination'+(conditional?' ds-conditional-pagination':'')} aria-label="페이지 이동"><button type="button" className="ds-nav-button" disabled={page<=1} onClick={()=>change(page-1)}>이전</button>{conditional?<NavigationDisclosure label={page+' / '+count}>{numbers}</NavigationDisclosure>:numbers}<output aria-live="polite">{page} / {count}</output><button type="button" className="ds-nav-button" disabled={page>=count} onClick={()=>change(page+1)}>다음</button></nav>;
}
