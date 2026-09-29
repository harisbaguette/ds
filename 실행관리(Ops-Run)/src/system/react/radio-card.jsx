import React from 'react';
import { Radio } from './radio.jsx';
// A radio whose whole card is the tap area, with a line that explains the choice. Cards of one group share a name.
export function RadioCard({ children, description, ...props }) { return <Radio {...props} className="ds-choice-card">{description ? <span className="ds-choice-text"><strong>{children}</strong><small>{description}</small></span> : children}</Radio>; }
