import React from 'react';
import { Card, CardBody, CardTitle, CardDescription, CardActions } from './card.jsx';
import { Badge } from './badge.jsx';
import { Button } from './button.jsx';
// A count line and a grid of cards. records: [{ id, title, description, tag }], onAction(record, event).
export function ResultGrid({ records = [], actionLabel = '열기', onAction, unit = '개의 컬렉션', className = '' }) {
  return <><p className="ds-result-count" role="status">{records.length}{unit}</p><div className={`ds-results ${className}`}>{records.map(item => <div key={item.id}><Card><CardBody><Badge>{item.tag}</Badge><CardTitle>{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></CardBody><CardActions><Button variant="outline" size="sm" onClick={event => onAction?.(item, event)}>{actionLabel}</Button></CardActions></Card></div>)}</div></>;
}
