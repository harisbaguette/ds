'use client';
import React, { useEffect, useRef } from 'react';
export function Checkbox({ children, look, indeterminate = false, ...props }) {
  const ref = useRef(null);
  useEffect(() => { ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return <label className="ds-choice" data-look={look}><input {...props} ref={ref} type="checkbox" />{children}</label>;
}
