'use client';
import React, { useId } from 'react';
import { Input, InputGroup } from './input.jsx';
import { FieldLabel, FieldDescription } from './field.jsx';
// A start and an end value share one box, so the eye stops once instead of twice. startProps/endProps go to each input.
export function DateRange({ label = '기간', help, error, disabled, startProps = {}, endProps = {} }) {
  const id = useId(); const description = error || help;
  const own = { disabled, 'aria-invalid': error ? true : undefined, 'aria-describedby': description ? `${id}-help` : undefined };
  return <div className="ds-field ds-date-range" data-state={error ? 'error' : disabled ? 'disabled' : undefined}><FieldLabel htmlFor={id}>{label}</FieldLabel><InputGroup><Input placeholder="시작" {...startProps} {...own} id={id} /><span className="ds-input-join" aria-hidden="true">~</span><Input placeholder="끝" {...endProps} {...own} aria-label={`${label} 끝`} /></InputGroup>{description && <FieldDescription id={`${id}-help`}>{description}</FieldDescription>}</div>;
}
