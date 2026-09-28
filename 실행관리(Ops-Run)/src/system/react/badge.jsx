import React from 'react';
export function Badge({ children, tone = 'neutral', look, ...props }) { return <span {...props} className="ds-badge" data-tone={tone} data-look={look}>{children}</span>; }
