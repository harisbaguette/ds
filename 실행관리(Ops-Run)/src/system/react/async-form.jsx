'use client';
import React,{useEffect,useRef,useState} from 'react';
import { Button } from './button.jsx';
export function AsyncForm({title,submitLabel='저장',onSubmit,successMessage='저장했어요.',children}) {
  const [pending,setPending]=useState(false),[status,setStatus]=useState(''),flight=useRef(null),mounted=useRef(true);
  useEffect(()=>{mounted.current=true;return ()=>{mounted.current=false;flight.current?.abort();};},[]);
  return <form className="ds-workflow" aria-label={title} aria-busy={pending||undefined} onSubmit={async e=>{
    e.preventDefault();if(flight.current)return;
    if(!onSubmit){setStatus('요청을 처리할 수 없어요. 잠시 후 다시 시도하세요.');return;}
    const values=Object.fromEntries(new FormData(e.currentTarget)),controller=new AbortController();flight.current=controller;setPending(true);setStatus('처리하고 있어요.');
    try {await onSubmit(values,{signal:controller.signal});if(mounted.current&&!controller.signal.aborted)setStatus(successMessage);}
    catch {if(mounted.current&&!controller.signal.aborted)setStatus('처리하지 못했어요. 입력한 내용을 유지했으니 다시 시도하세요.');}
    finally {flight.current=null;if(mounted.current)setPending(false);}
  }}><h2>{title}</h2><fieldset disabled={pending}>{children}<Button type="submit" loading={pending}>{submitLabel}</Button></fieldset><p role="status" aria-live="polite">{status}</p></form>;
}
