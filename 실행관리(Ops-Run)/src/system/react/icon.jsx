import React from 'react';
// Wraps an icon (e.g. an <svg class="ui-icon">).
export function IconMark({ children, className = '', ...props }) { return <span {...props} className={`ds-icon ${className}`}>{children}</span>; }
