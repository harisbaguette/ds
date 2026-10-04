'use client';
import React,{useId} from 'react';
export function ArticlePage({title='기록을 오래 남기는 방법',headingLevel=1,sections=[{title:'먼저 고르기',body:'다시 보고 싶은 장면부터 골라 둡니다.'},{title:'이름 붙이기',body:'나중에 찾을 수 있게 날짜와 대상을 적습니다.'}]}) {
  const id=useId(),Heading=headingLevel===2?'h2':'h1',Subheading=headingLevel===2?'h3':'h2';return <article className="ds-article"><Heading>{title}</Heading><nav aria-label="목차"><ol>{sections.map((s,i)=><li key={i}><a href={'#'+id+'-'+i}>{s.title}</a></li>)}</ol></nav>{sections.map((s,i)=><section key={i} id={id+'-'+i}><Subheading>{s.title}</Subheading><p>{s.body}</p></section>)}</article>;
}
