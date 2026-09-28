import React from 'react';
export function Input({ look, className = '', ...props }) { return <input {...props} className={`ds-input ${className}`} data-look={look} />; }
// The clear, unit and stepper looks keep the helper inside the same box:
// <InputGroup look="clear"><Input /><InputTool aria-label="지우기">…</InputTool></InputGroup>
export function InputGroup({ look, children, ...props }) { return <span {...props} className="ds-input-group" data-look={look}>{children}</span>; }
export function InputTool({ children, ...props }) { return <button type="button" {...props} className="ds-input-tool">{children}</button>; }
// The field row look joins a start and an end value in one box with this mark between them.
export function InputJoin({ children = '~' }) { return <span className="ds-input-join" aria-hidden="true">{children}</span>; }
