import React from 'react';
// A rule with a short word in the middle (또는·그리고) between two ways of doing the same thing.
export function TextDivider({ children = '또는', ...props }) { return <hr {...props} className="ds-text-divider" data-label={children} />; }
