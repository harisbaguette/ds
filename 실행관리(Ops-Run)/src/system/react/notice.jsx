import React from 'react';
import { StatusDot } from './status-dot.jsx';
// The result of an action, read out as a status.
export function Notice({ children }) { return <div className="ds-alert" role="status"><StatusDot>{children}</StatusDot></div>; }
