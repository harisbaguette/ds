import React from 'react';
// The count look pins how many new items wait on the icon (children); the number is read as "새 알림 N개" and hides at zero.
export function Badge({ children, tone = 'neutral', look, count, ...props }) {
  if (look === 'count') return <span role="img" aria-label={count > 0 ? `새 알림 ${count}개` : '새 알림 없음'} {...props} className="ds-badge" data-tone={tone} data-look="count">{children}{count > 0 && <span className="ds-badge-count" aria-hidden="true">{count > 99 ? '99+' : count}</span>}</span>;
  return <span {...props} className="ds-badge" data-tone={tone} data-look={look}>{children}</span>;
}
