import React from 'react';
export function Radio({ children, look, ...props }) { return <label className="ds-choice" data-look={look}><input {...props} type="radio" />{children}</label>; }
