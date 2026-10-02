import React from 'react';
// Wraps an illustrated icon (an <img className="ui-icon">).
export function IconMark({ children, className = '', ...props }) { return <span {...props} className={`ds-icon ${className}`}>{children}</span>; }
