import React from 'react';
import { Card, CardBody, CardTitle, CardDescription, CardActions } from './card.jsx';
import { MediaCard } from './media-card.jsx';
import { Badge } from './badge.jsx';
import { Button } from './button.jsx';
// The first record spans the row as a picture card; the rest follow as cards.
export function FeaturedResults({ records = [], actionLabel = '열기', onAction, unit = '개의 컬렉션' }) {
  const inside = item => <><CardBody><Badge>{item.tag}</Badge><CardTitle>{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></CardBody><CardActions><Button variant="outline" size="sm" onClick={event => onAction?.(item, event)}>{actionLabel}</Button></CardActions></>;
  return <><p className="ds-result-count" role="status">{records.length}{unit}</p><div className="ds-results ds-result-feature">{records.map((item, index) => <div key={item.id}>{index === 0 ? <MediaCard>{inside(item)}</MediaCard> : <Card>{inside(item)}</Card>}</div>)}</div></>;
}
