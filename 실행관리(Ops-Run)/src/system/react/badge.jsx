import React from 'react';
export function Badge({ children, tone = 'neutral', ...props }) { return <span {...props} className="ds-badge" data-tone={tone}>{children}</span>; }
