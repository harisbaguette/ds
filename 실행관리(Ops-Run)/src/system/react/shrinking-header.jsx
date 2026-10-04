'use client';
import React,{useState} from 'react';
export function ShrinkingHeader({title='산책 기록',children,text='나무와 꽃을 살펴보며 천천히 걸어갑니다. 가파른 길에서는 충분히 쉬어 가세요.'}){
 const [shrunk,setShrunk]=useState(false);
 return <div className="ds-layout ds-shrinking-header"><div className="ds-layout-scroll" tabIndex={0} role="region" aria-label="문서" data-shrunk={shrunk} onScroll={e=>setShrunk(e.currentTarget.scrollTop>40)}><header className="ds-layout-shrinking"><h2>{title}</h2></header>{children??Array.from({length:8},(_,i)=><p key={i} className="ds-layout-scroll-copy">{text}</p>)}</div></div>;
}
