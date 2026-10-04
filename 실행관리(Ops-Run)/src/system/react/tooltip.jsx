'use client';
import React,{useId,useState} from 'react';
import { Button } from './button.jsx';
export function Tooltip({label='보관',text='다음에 다시 볼 수 있게 보관해요.',onClick}) {
  const id=useId(),[dismissed,setDismissed]=useState(false);
  return <span className="ds-tooltip" data-dismissed={dismissed?'':undefined} onKeyDown={e=>{if(e.key==='Escape')setDismissed(true);}} onPointerEnter={()=>setDismissed(false)} onBlur={()=>setDismissed(false)}><Button aria-describedby={id} onClick={onClick}>{label}</Button><span id={id} role="tooltip">{text}</span></span>;
}
