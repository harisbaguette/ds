'use client';
import React,{useRef,useState} from 'react';
import {NavigationLinks,navigationLinks} from './navigation-primitives.jsx';
export function AutoHideNavigation({items=navigationLinks,children,title='산책 기록'}){
 const [hidden,setHidden]=useState(false),previous=useRef(0),header=useRef(null);
 return <div className="ds-nav ds-auto-hide-navigation"><div className="ds-nav-scroll" tabIndex={0} role="region" aria-label="본문" onScroll={e=>{const top=e.currentTarget.scrollTop;if(Math.abs(top-previous.current)>=2){setHidden(top>48&&top>previous.current&&!header.current.contains(document.activeElement));previous.current=top;}}}><header ref={header} className="ds-nav-auto-header" data-hidden={hidden} onFocusCapture={()=>setHidden(false)}><strong>{title}</strong><nav aria-label="주 탐색"><NavigationLinks items={items}/></nav></header>{children??Array.from({length:12},(_,i)=><section className="ds-nav-scroll-section" key={i}><h2>산책 {i+1}구간</h2><p>나무와 꽃을 살펴보며 천천히 걸어갑니다. 물가의 쉼터에서 잠시 쉬어 가세요.</p></section>)}</div></div>;
}
