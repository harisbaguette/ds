import React from 'react';
// An icon with its meaning printed under it, for icons people have not learned yet.
export function IconLabel({ icon, children }) { return <span className="ds-icon-label">{icon}<span className="ds-icon-name">{children}</span></span>; }
