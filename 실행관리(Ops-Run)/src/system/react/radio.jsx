import React from 'react';
export function Radio({ children, className = '', ...props }) { return <label className={`ds-choice ${className}`}><input {...props} type="radio" />{children}</label>; }
