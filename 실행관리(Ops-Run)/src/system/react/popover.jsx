'use client';
import React,{useId} from 'react';
import { Button } from './button.jsx';
export function Popover({label='추가 정보',children='링크를 받은 사람만 이 자료를 볼 수 있어요.'}) {
  const id=useId();return <div className="ds-popover-demo"><Button popoverTarget={id}>{label}</Button><div id={id} className="ds-popover" popover="auto"><div>{children}</div><Button popoverTarget={id} popoverTargetAction="hide">닫기</Button></div></div>;
}
