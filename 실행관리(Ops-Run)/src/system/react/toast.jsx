import React from 'react';
import { StatusDot } from './status-dot.jsx';
// A brief notice after an action that can be undone: run the action at once and offer undo instead of asking first.
// The status region stays mounted so the message is announced when it appears.
export function Toast({ children, open = true, onUndo, undoLabel = '되돌리기' }) {
  return <div role="status">{open && <div className="ds-toast"><StatusDot>{children}</StatusDot>{onUndo && <button type="button" className="ds-alert-undo" onClick={onUndo}>{undoLabel}</button>}</div>}</div>;
}
