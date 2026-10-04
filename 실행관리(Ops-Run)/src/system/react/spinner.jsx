import React from 'react';
export function Spinner({label='불러오는 중'}) {return <span className="ds-loading" role="status"><span className="ds-spinner" aria-hidden="true"/>{label}</span>;}
