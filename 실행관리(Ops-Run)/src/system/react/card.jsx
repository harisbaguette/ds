import React from 'react';
import { Divider } from './divider.jsx';
// look matches the HTML data-look values; the media and row looks put a picture area before the body.
export function Card({ children, look = 'raised', ...props }) { return <article {...props} className="ds-card" data-look={look}>{(look === 'media' || look === 'row') && <div className="ds-card-media" aria-hidden="true" />}{children}</article>; }
export function CardBody({ children }) { return <div className="ds-card-body">{children}</div>; }
export function CardTitle({ children, as: Tag = 'h3' }) { return <Tag>{children}</Tag>; }
export function CardDescription({ children }) { return <p>{children}</p>; }
export function CardActions({ children }) { return <><Divider /><footer className="ds-card-actions">{children}</footer></>; }
