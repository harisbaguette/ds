'use client';
import React,{useId} from 'react';
import {AnchorJump} from './navigation-primitives.jsx';
export function SkipLink({targetId,children,label='본문 바로 가기'}){const id=useId();return <div className="ds-nav ds-skip-link"><AnchorJump targetId={targetId??id}>{label}</AnchorJump>{children??(!targetId&&<section id={id} tabIndex={-1}><h2>산책 안내</h2><p>본문을 읽고 다음 일정을 확인하세요.</p></section>)}</div>;}
