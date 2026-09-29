import React from 'react';
import { Button } from './button.jsx';
import { IconButton } from './icon-button.jsx';
// One wide main action with its count, then the other actions as quiet icon buttons: actions = [{ label, icon, onClick }].
export function ActionRow({ label, count, onClick, actions = [], size = 'md', disabled }) {
  return <div className="ds-action-row"><Button size={size} count={count} disabled={disabled} onClick={onClick}>{label}</Button>{actions.map(action => <IconButton key={action.label} label={action.label} size={size} disabled={disabled} onClick={action.onClick}>{action.icon}</IconButton>)}</div>;
}
