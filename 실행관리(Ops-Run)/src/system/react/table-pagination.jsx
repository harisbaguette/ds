'use client';
// Adapted from satnaing/shadcn-admin (MIT), e16c87f. See design/licenses/shadcn-admin.txt.
import React from 'react';
import { Button } from './button.jsx';
export function TablePagination({ table }) {
  const count = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  return <nav className="ds-table-pagination" aria-label="표 페이지">
    <span role="status">{count}개 · {count ? pageIndex + 1 : 0} / {table.getPageCount()}쪽</span>
    <label>쪽당 <select className="ds-input" value={pageSize} onChange={e => table.setPageSize(Number(e.target.value))}>{[5, 10, 20].map(n => <option key={n} value={n}>{n}개</option>)}</select></label>
    <Button variant="outline" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>이전</Button>
    <Button variant="outline" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>다음</Button>
  </nav>;
}
