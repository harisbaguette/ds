import React from 'react';
import { Divider } from './divider.jsx';
// look: raised (띄움) · filled (면) · outlined (윤곽).
export function Card({ children, look = 'raised', ...props }) { return <article {...props} className="ds-card" data-look={look}>{children}</article>; }
export function CardBody({ children }) { return <div className="ds-card-body">{children}</div>; }
export function CardTitle({ children, as: Tag = 'h3' }) { return <Tag>{children}</Tag>; }
export function CardDescription({ children }) { return <p>{children}</p>; }
export function CardActions({ children }) { return <><Divider /><footer className="ds-card-actions">{children}</footer></>; }
