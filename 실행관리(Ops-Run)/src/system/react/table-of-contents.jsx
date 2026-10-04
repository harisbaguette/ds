'use client';
import React,{useId} from 'react';
import {AnchorJump} from './navigation-primitives.jsx';
const defaults=[{title:'출발 전',body:'물과 편한 신발을 준비합니다.'},{title:'산책 코스',body:'동쪽 입구에서 시작해 물가 쉼터까지 걸어갑니다.'},{title:'돌아오는 길',body:'함께 기록을 나누고 다음 산책을 준비합니다.'}];
export function TableOfContents({items=defaults,title='이 글의 순서',children}){
 const prefix=useId();const rows=items.map((item,i)=>({...item,id:item.id??prefix+'-'+i}));
 return <div className="ds-nav ds-table-of-contents"><nav aria-label={title}><h2>{title}</h2><ol>{rows.map(item=><li key={item.id}><AnchorJump targetId={item.id}>{item.title??item.label}</AnchorJump></li>)}</ol></nav><div className="ds-nav-sections">{children??rows.map(item=><section key={item.id} id={item.id} tabIndex={-1}><h2>{item.title??item.label}</h2><p>{item.body}</p></section>)}</div></div>;
}
