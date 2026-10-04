import React from 'react';
import {safeLink} from './safe-link.jsx';

export function SummaryList({title='신청 내용',items=[{label:'이름',value:'김하나'},{label:'수업',value:'기초반'}]}) {
  return <section className="ds-summary-list"><h2>{title}</h2><dl>{items.map((item,i)=><div key={i}><dt>{item.label}</dt><dd>{item.value}</dd>{item.href&&<dd><a href={safeLink(item.href)} aria-label={item.label+' 수정'}>수정</a></dd>}</div>)}</dl></section>;
}
