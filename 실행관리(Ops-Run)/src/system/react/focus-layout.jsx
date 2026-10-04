'use client';
import React,{useRef,useState} from 'react';
import {LayoutWorkContent,LayoutWorkAside} from './layout-work-content.jsx';
export function FocusLayout({children=<LayoutWorkContent/>,aside=<LayoutWorkAside/>,onChange}){
 const [focused,setFocused]=useState(false),button=useRef(null);
 const change=next=>{setFocused(next);onChange?.(next);};
 return <div className="ds-layout ds-focus-layout" data-focused={focused} onKeyDown={e=>{if(e.key==='Escape'&&focused){change(false);button.current.focus();}}}><button type="button" ref={button} className="ds-layout-control" aria-pressed={focused} onClick={()=>change(!focused)}>{focused?'집중 모드 끝내기':'집중 모드'}</button><div className="ds-layout-focus-body"><aside hidden={focused}>{aside}</aside><div>{children}</div></div></div>;
}
