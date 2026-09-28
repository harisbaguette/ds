import React from 'react';
export function Divider({ look, label = '또는', ...props }) { return <hr {...props} className="ds-divider" data-look={look} data-label={look === 'label' ? label : undefined} />; }
