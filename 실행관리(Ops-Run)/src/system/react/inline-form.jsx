import React from 'react';
import { Field } from './field.jsx';
// Short settings in rows: label on the left, value on the right. fields: [{ label, ...input props }].
export function InlineForm({ fields = [] }) { return <div className="ds-inline-form">{fields.map(({ label, ...props }) => <Field key={label} label={label} {...props} />)}</div>; }
