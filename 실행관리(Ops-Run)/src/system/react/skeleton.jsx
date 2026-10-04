import React from 'react';
export function Skeleton({label='불러오는 중'}) {return <div className="ds-skeleton" role="status" aria-label={label}><span aria-hidden="true"/><span aria-hidden="true"/><span aria-hidden="true"/></div>;}
