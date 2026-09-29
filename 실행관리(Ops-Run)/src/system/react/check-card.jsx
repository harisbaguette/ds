import React from 'react';
import { Checkbox } from './checkbox.jsx';
// A checkbox whose whole card is the tap area, with a line that explains the choice.
export function CheckCard({ children, description, ...props }) { return <Checkbox {...props} className="ds-choice-card">{description ? <span className="ds-choice-text"><strong>{children}</strong><small>{description}</small></span> : children}</Checkbox>; }
