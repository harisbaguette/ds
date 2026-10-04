'use client';
import React, {useEffect, useRef} from 'react';

export function ErrorSummary({title='입력한 내용을 확인하세요.', errors=[{message:'필수 항목을 확인하세요.'}], focus=false}) {
  const ref=useRef(null);
  useEffect(()=>{if(focus&&errors.length)ref.current?.focus();},[focus,errors]);
  if(!errors.length)return null;
  return <div className="ds-error-summary" ref={ref} tabIndex={-1} role="region" aria-label={title}>
    <h3>{title}</h3><ul>{errors.map((error,i)=><li key={i}>{error.id?<a href={'#'+encodeURIComponent(error.id)} onClick={event=>{const input=document.getElementById(error.id);if(input){event.preventDefault();input.focus();input.scrollIntoView({block:'center'});}}}>{error.message}</a>:error.message}</li>)}</ul>
  </div>;
}
