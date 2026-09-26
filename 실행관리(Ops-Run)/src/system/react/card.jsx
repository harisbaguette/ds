import React from 'react';
import { Divider } from './divider.jsx';
export function Card({ children, ...props }) { return <article {...props} className="ds-card">{children}</article>; }
export function CardBody({ children }) { return <div className="ds-card-body">{children}</div>; }
export function CardTitle({ children, as: Tag = 'h3' }) { return <Tag>{children}</Tag>; }
export function CardDescription({ children }) { return <p>{children}</p>; }
export function CardActions({ children }) { return <><Divider /><footer className="ds-card-actions">{children}</footer></>; }
