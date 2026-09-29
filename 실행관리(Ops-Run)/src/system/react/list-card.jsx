import React from 'react';
export { CardBody, CardTitle, CardDescription, CardActions } from './card.jsx';
// A picture well on the left (initial prints a letter when there is no picture), the card body on the right.
export function ListCard({ children, initial = '', ...props }) { return <article {...props} className="ds-card ds-list-card"><div className="ds-card-media" aria-hidden="true">{initial}</div>{children}</article>; }
