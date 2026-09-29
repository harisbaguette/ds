import React from 'react';
import { Button } from './button.jsx';
// The decision at the end of a long phone screen, across the whole width where the thumb rests.
export function ActionBar({ label, onClick, loading = false, disabled }) { return <div className="ds-action-bar"><Button loading={loading} disabled={disabled} onClick={onClick}>{label}</Button></div>; }
