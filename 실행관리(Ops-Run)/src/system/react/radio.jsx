import React from 'react';
export function Radio({ children, ...props }) { return <label className="ds-choice"><input {...props} type="radio" />{children}</label>; }
