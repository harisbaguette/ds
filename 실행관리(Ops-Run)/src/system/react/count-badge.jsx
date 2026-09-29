import React from 'react';
// How many new items wait on the icon (children). The number is read as "새 알림 N개", hides at zero and shows 99+ above 99.
export function CountBadge({ children, count = 0, ...props }) {
  return <span role="img" aria-label={count > 0 ? `새 알림 ${count}개` : '새 알림 없음'} {...props} className="ds-count-badge">{children}{count > 0 && <span className="ds-badge-count" aria-hidden="true">{count > 99 ? '99+' : count}</span>}</span>;
}
