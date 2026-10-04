'use client';
import React, {useEffect, useId, useRef, useState} from 'react';
import {Button} from './button.jsx';
import {Field} from './field.jsx';
import {ErrorSummary} from './error-summary.jsx';
import {Checkbox} from './checkbox.jsx';

function fieldError(control,label){
  const v=control.validity;
  const message=v.valueMissing?(control.type==='checkbox'?'체크해 주세요.':control.tagName==='SELECT'?'항목을 선택하세요.':'값을 입력하세요.'):
    v.typeMismatch?(control.type==='email'?'이메일 주소를 확인하세요.':'주소 형식을 확인하세요.'):
    v.rangeUnderflow?control.min+' 이상 입력하세요.':v.rangeOverflow?control.max+' 이하로 입력하세요.':
    v.stepMismatch?(control.step||'1')+' 간격으로 입력하세요.':v.tooLong?control.maxLength+'자 이내로 입력하세요.':
    v.customError?control.validationMessage:'입력 형식을 확인하세요.';
  return label+': '+message;
}

export function DataForm({title='신청하기',submitLabel='제출',successMessage='접수했어요.',fields=[{name:'name',label:'이름',type:'text',required:true,autoComplete:'name'},{name:'email',label:'이메일',type:'email',required:true,autoComplete:'email'}],onSubmit}) {
  const prefix=useId(),flight=useRef(null),alive=useRef(true);
  const [errors,setErrors]=useState([]),[status,setStatus]=useState(''),[pending,setPending]=useState(false),[ready,setReady]=useState(false);
  useEffect(()=>{alive.current=true;setReady(true);return ()=>{alive.current=false;flight.current?.abort();};},[]);
  const submit=async event=>{
    event.preventDefault();if(flight.current)return;
    const form=event.currentTarget;
    const invalid=fields.flatMap(field=>{const control=form.elements.namedItem(field.name);return control&&!control.validity.valid?[{id:control.id,name:field.name,message:fieldError(control,field.label)}]:[];});
    setErrors(invalid);setStatus('');if(invalid.length)return;
    if(!onSubmit){setStatus('요청을 처리할 수 없어요. 잠시 후 다시 시도하세요.');return;}
    const controller=new AbortController();flight.current=controller;
    const values=Object.fromEntries(new FormData(form));
    for(const field of fields)if(field.type==='checkbox')values[field.name]=form.elements.namedItem(field.name).checked;
    setPending(true);setStatus('처리하고 있어요.');
    try{await onSubmit(values,{signal:controller.signal});if(alive.current&&!controller.signal.aborted)setStatus(successMessage);}
    catch(error){if(alive.current&&!controller.signal.aborted){
      const server=fields.flatMap(field=>typeof error?.fieldErrors?.[field.name]==='string'&&error.fieldErrors[field.name]?[{id:prefix+'-'+field.name,name:field.name,message:error.fieldErrors[field.name]}]:[]);
      setErrors(server);setStatus(server.length?'':'처리하지 못했어요. 입력한 내용을 유지했으니 다시 시도하세요.');
    }}
    finally{if(flight.current===controller)flight.current=null;if(alive.current){setPending(false);if(controller.signal.aborted)setStatus('요청을 취소했어요. 다시 시도할 수 있어요.');}}
  };
  return <form method="post" className="ds-workflow ds-data-form" aria-label={title} noValidate aria-busy={pending||undefined} onSubmit={submit}>
    <h2>{title}</h2><ErrorSummary errors={errors} focus/>
    <noscript><p>이 양식을 사용하려면 JavaScript를 켜주세요.</p></noscript><fieldset disabled={!ready||pending}>{fields.map(field=>{
      const {name,label,type='text',value,help,items,required,autoComplete,min,max,step,maxLength}=field;
      const id=prefix+'-'+name,error=errors.find(e=>e.name===name)?.message;
      const props={id,name,required,autoComplete,min,max,step,maxLength,defaultValue:value??'',label,help,error};
      if(type==='checkbox')return <div className="ds-field" key={name}><Checkbox id={id} name={name} required={required} defaultChecked={!!value} aria-invalid={error?true:undefined} aria-describedby={help||error?id+'-help':undefined}>{label}</Checkbox>{(help||error)&&<p className="ds-help" id={id+'-help'}>{error||help}</p>}</div>;
      if(type==='select')return <Field key={name} {...props}>{input=><select {...input} className="ds-input">{items.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select>}</Field>;
      if(type==='textarea')return <Field key={name} {...props}>{input=><textarea {...input} className="ds-input ds-textarea" rows={4}/>}</Field>;
      return <Field key={name} {...props} type={type}/>;
    })}<Button type="submit" loading={pending}>{submitLabel}</Button></fieldset>
    <p role="status" aria-live="polite">{status}</p>
  </form>;
}
