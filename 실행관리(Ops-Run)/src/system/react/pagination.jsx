'use client';
import React,{useState} from 'react';
import { Button } from './button.jsx';
export function Pagination({page:controlled,defaultPage=1,total=8,onPageChange}) {
  const [local,setLocal]=useState(defaultPage);total=Math.max(1,Math.floor(Number(total)||1));const page=Math.max(1,Math.min(total,Number(controlled??local)||1));
  const change=next=>{setLocal(next);onPageChange?.(next);};
  return <nav className="ds-pagination" aria-label="페이지 이동"><Button disabled={page<=1} onClick={()=>change(page-1)}>이전</Button><span role="status">{page} / {total}</span><Button disabled={page>=total} onClick={()=>change(page+1)}>다음</Button></nav>;
}
