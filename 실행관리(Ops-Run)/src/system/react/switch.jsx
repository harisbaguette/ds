import React from 'react';
export function Switch({ children, ...props }) { return <label className="ds-choice"><input {...props} type="checkbox" role="switch" className="ds-switch" />{children}</label>; }
