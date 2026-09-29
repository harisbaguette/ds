import React from 'react';
export { CardBody, CardTitle, CardDescription, CardActions } from './card.jsx';
// A picture area above the card body; the picture is decoration, the title carries the meaning.
export function MediaCard({ children, media = null, ...props }) { return <article {...props} className="ds-card ds-media-card"><div className="ds-card-media" aria-hidden="true">{media}</div>{children}</article>; }
