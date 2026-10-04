import React from 'react';
import { Button } from './button.jsx';
export function ErrorState({title='불러오지 못했어요.',message='연결 상태를 확인한 뒤 다시 시도하세요.',action='다시 시도',onRetry}) {return <section className="ds-error-state"><h3>{title}</h3><p>{message}</p><Button onClick={onRetry}>{action}</Button></section>;}
