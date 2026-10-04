'use client';
import React,{useLayoutEffect,useRef} from 'react';
import {LayoutWorkContent,LayoutWorkAside} from './layout-work-content.jsx';
export function AppendAround({children=<LayoutWorkContent/>,aside=<LayoutWorkAside/>}){
 const narrow=useRef(null),wide=useRef(null),movable=useRef(null);
 useLayoutEffect(()=>{const query=matchMedia('(max-width:760px)'),node=movable.current,origin=wide.current;const place=()=>{const target=query.matches?narrow.current:origin;if(node.parentElement===target)return;const focus=node.contains(document.activeElement)?document.activeElement:null;target.append(node);focus?.focus({preventScroll:true});};place();query.addEventListener('change',place);return()=>{query.removeEventListener('change',place);origin.append(node);};},[]);
 return <div className="ds-layout ds-append-around"><div className="ds-layout-append-grid"><div><div ref={narrow} data-layout-narrow-slot/>{children}</div><aside ref={wide} data-layout-wide-slot><div ref={movable} data-layout-movable>{aside}</div></aside></div></div>;
}
