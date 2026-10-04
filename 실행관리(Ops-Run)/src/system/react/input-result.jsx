'use client';
import React,{useState} from 'react';
import { Field } from './field.jsx';
import { Button } from './button.jsx';
export function InputResult({title='금액 계산',initialPrice=12000,initialQuantity=1}) {
  const [result,setResult]=useState('');
  return <form className="ds-workflow" aria-label={title} onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget),value=Number(f.get('price'))*Number(f.get('quantity'));setResult(Number.isFinite(value)?new Intl.NumberFormat('ko-KR',{style:'currency',currency:'KRW',maximumFractionDigits:2}).format(value):'금액을 확인하세요.');}}><h2>{title}</h2><Field label="개당 금액" name="price" type="number" min="0" step="0.01" required defaultValue={initialPrice}/><Field label="수량" name="quantity" type="number" min="1" step="1" required defaultValue={initialQuantity}/><Button type="submit">계산</Button><output aria-label="계산 결과" aria-live="polite">{result}</output></form>;
}
