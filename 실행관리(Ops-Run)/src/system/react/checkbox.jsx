'use client';
import React, { useEffect, useRef } from 'react';
export function Checkbox({ children, className = '', indeterminate = false, ...props }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return <label className={`ds-choice ${className}`}><input {...props} ref={ref} type="checkbox" />{children}</label>;
}
