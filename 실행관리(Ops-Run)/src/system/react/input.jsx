import React from 'react';
export function Input({ look, className = '', ...props }) { return <input {...props} className={`ds-input ${className}`} data-look={look} />; }
