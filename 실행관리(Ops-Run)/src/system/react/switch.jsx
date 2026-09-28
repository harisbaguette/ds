import React from 'react';
export function Switch({ children, look, ...props }) { return <label className="ds-choice" data-look={look}><input {...props} type="checkbox" role="switch" className="ds-switch" />{children}</label>; }
