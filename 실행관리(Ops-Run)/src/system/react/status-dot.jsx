import React from 'react';
export function StatusDot({ children = '연결됨', look }) { return <span className="ds-status" data-look={look}><i aria-hidden="true" />{children}</span>; }
