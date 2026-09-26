import React from 'react';
export function Input({ className = '', ...props }) { return <input {...props} className={`ds-input ${className}`} />; }
