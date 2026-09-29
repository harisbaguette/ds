import React from 'react';
// One filter turned on or off. type="checkbox" for several at once, type="radio" (with a shared name) for one of a set.
export function FilterChip({ children, type = 'checkbox', ...props }) { return <label className="ds-chip"><input {...props} type={type} /><span>{children}</span></label>; }
