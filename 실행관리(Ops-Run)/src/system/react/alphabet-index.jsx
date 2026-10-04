'use client';
import React,{useId} from 'react';
import {AnchorJump,NavigationLinks} from './navigation-primitives.jsx';
const defaults=[{label:'ㄱ',items:[{label:'가을 숲',href:'#autumn'},{label:'강변 길',href:'#river'}]},{label:'ㄴ',items:[{label:'나무 정원',href:'#trees'}]},{label:'ㅅ',items:[{label:'산책 학교',href:'#school'}]}];
export function AlphabetIndex({groups=defaults,label='가나다 색인'}){const id=useId();return <div className="ds-nav ds-alphabet-index"><nav aria-label={label}><ul>{groups.map((g,i)=><li key={i}><AnchorJump targetId={id+'-'+i}>{g.label}</AnchorJump></li>)}</ul></nav>{groups.map((g,i)=><section key={i} id={id+'-'+i} tabIndex={-1}><h2>{g.label}</h2><NavigationLinks items={g.items}/></section>)}</div>;}
