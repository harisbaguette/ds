'use client';
import React,{useEffect,useId,useState} from 'react';
export function Combobox({label='도시',items=['서울','부산','제주'],value,defaultValue='',onValueChange,onSelect,name='city',disabled=false}) {
  const id=useId(),[local,setLocal]=useState(defaultValue),[open,setOpen]=useState(false),[active,setActive]=useState(-1);
  const text=value??local,options=items.filter(i=>i.toLocaleLowerCase().includes(text.toLocaleLowerCase()));
  useEffect(()=>{if(open&&active>=0)document.getElementById(id+'-option-'+active)?.scrollIntoView({block:'nearest'});},[open,active,id]);
  const change=v=>{setLocal(v);onValueChange?.(v);};
  const choose=v=>{change(v);onSelect?.(v);setOpen(false);setActive(-1);};
  return <div className="ds-field ds-combobox" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget)){setOpen(false);setActive(-1);}}}>
    <label htmlFor={id}>{label}</label><input id={id} name={name} className="ds-input" disabled={disabled} autoComplete="off" role="combobox" aria-autocomplete="list" aria-expanded={open&&options.length>0} aria-controls={id+'-list'} aria-activedescendant={open&&active>=0&&options[active]!==undefined?id+'-option-'+active:undefined} value={text} onChange={e=>{change(e.target.value);setOpen(true);setActive(-1);}} onKeyDown={e=>{
      if(e.key==='Escape'||e.key==='Tab'){setOpen(false);setActive(-1);return;}
      if(e.key==='Enter'&&open&&active>=0&&options[active]!==undefined){e.preventDefault();choose(options[active]);}
      if(['ArrowDown','ArrowUp'].includes(e.key)&&options.length){e.preventDefault();setOpen(true);setActive(i=>(i+(e.key==='ArrowDown'?1:i<0?0:-1)+options.length)%options.length);}
    }}/><ul id={id+'-list'} role="listbox" aria-label={label} hidden={!open||!options.length}>{options.map((v,i)=><li id={id+'-option-'+i} key={v} role="option" aria-selected={i===active} onPointerDown={e=>{e.preventDefault();choose(v);}}>{v}</li>)}</ul><span className="ds-help" role="status">{open&&!options.length?'일치하는 항목이 없어요.':''}</span>
  </div>;
}
