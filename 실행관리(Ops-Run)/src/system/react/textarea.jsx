'use client';
import React from 'react';
import { Field } from './field.jsx';
export function Textarea({ label='메모', help, error, rows=4, ...props }) {
  return <Field label={label} help={help} error={error} {...props}>{input => <textarea {...input} className={'ds-input ds-textarea '+(props.className||'')} rows={rows}/>}</Field>;
}
