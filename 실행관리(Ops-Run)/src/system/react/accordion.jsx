import React from 'react';
export function Accordion({items=[{title:'보관한 자료는 어디에서 보나요?',body:'보관함에서 다시 열 수 있어요.'}]}) {return <div className="ds-accordion">{items.map((i,n)=><details key={i.id??n}><summary>{i.title}</summary><div>{i.body}</div></details>)}</div>;}
