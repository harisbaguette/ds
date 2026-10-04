'use client';
import React,{useEffect,useState} from 'react';
import { Field } from './field.jsx';
import { Button } from './button.jsx';
export function InputResult({title='금액 계산',initialPrice=12000,initialQuantity=1}) {
  const [result,setResult]=useState(''),[ready,setReady]=useState(false);
  useEffect(()=>setReady(true),[]);
  return <form method="post" className="ds-workflow" aria-label={title} onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget),value=Number(f.get('price'))*Number(f.get('quantity'));setResult(Number.isFinite(value)?new Intl.NumberFormat('ko-KR',{style:'currency',currency:'KRW',maximumFractionDigits:2}).format(value):'금액을 확인하세요.');}}><h2>{title}</h2><noscript><p>이 양식을 사용하려면 JavaScript를 켜주세요.</p></noscript><fieldset disabled={!ready}><Field label="개당 금액" name="price" type="number" min="0" step="0.01" required defaultValue={initialPrice}/><Field label="수량" name="quantity" type="number" min="1" step="1" required defaultValue={initialQuantity}/><Button type="submit">계산</Button></fieldset><output aria-label="계산 결과" aria-live="polite">{result}</output></form>;
}
