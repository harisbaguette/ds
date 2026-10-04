'use client';
import React,{useId} from 'react';
import {AnchorJump} from './navigation-primitives.jsx';
export function BackToTop({targetId,children,label='맨 위로'}){const id=useId();return <div className="ds-nav ds-back-to-top">{children??(!targetId&&<section id={id} tabIndex={-1}><h2>산책 기록</h2><p>오늘 만난 풍경과 이야기를 남깁니다.</p></section>)}<AnchorJump targetId={targetId??id}>{label}</AnchorJump></div>;}
