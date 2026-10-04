import React from 'react';
import { ErrorState } from './error-state.jsx';
export function OfflineState(props) {return <ErrorState title="인터넷에 연결되지 않았어요." message="작성한 내용은 이 화면에 남아 있어요." {...props}/>;}
