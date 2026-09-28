import React from 'react';
// Wraps an icon (e.g. an <svg class="ui-icon">) so data-look can change its weight, fill or backing shape.
export function IconMark({ look, children, className = '', ...props }) { return <span {...props} className={`ds-icon ${className}`} data-look={look}>{children}</span>; }
