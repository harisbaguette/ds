'use client';
import React,{useId,useState} from 'react';
export function FileUpload({label='파일 선택',accept='',multiple=true,disabled=false,maxBytes=10485760,onFiles,name='files'}) {
  const id=useId(),[status,setStatus]=useState('선택한 파일이 없어요.'),[invalid,setInvalid]=useState(false);
  return <div className="ds-field ds-file-upload"><label htmlFor={id}>{label}</label><input id={id} name={name} type="file" accept={accept} multiple={multiple} disabled={disabled} aria-describedby={id+'-status'} aria-invalid={invalid} onChange={e=>{
    const files=[...e.target.files],types=accept.toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);
    const bad=files.some(f=>(maxBytes>0&&f.size>maxBytes)||(types.length&&!types.some(a=>a.startsWith('.')?f.name.toLowerCase().endsWith(a):a.endsWith('/*')?f.type.startsWith(a.slice(0,-1)):f.type===a)));
    const message=bad?'파일 형식 또는 크기를 확인하세요.':files.length?files.map(f=>f.name).join(', '):'선택한 파일이 없어요.';
    e.target.setCustomValidity(bad?message:'');setInvalid(bad);setStatus(message);if(!bad)onFiles?.(files);
  }}/><p id={id+'-status'} className="ds-help" role="status">{status}</p></div>;
}
