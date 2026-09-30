'use client';
// TasksTable adaptation: satnaing/shadcn-admin, MIT, e16c87f213a5ba5e45964e9b67c792105ec74d26.
// Router-specific state and Tailwind wrappers are replaced; TanStack's table pipeline is retained.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from './button.jsx';
import { Checkbox } from './checkbox.jsx';
import { TableToolbar } from './table-toolbar.jsx';
import { TablePagination } from './table-pagination.jsx';
import { validateRecords } from './admin-records.jsx';

const SelectHeader = ({ table }) => <Checkbox aria-label="현재 쪽 모두 선택" disabled={!table.getRowModel().rows.length} checked={table.getIsAllPageRowsSelected()} indeterminate={table.getIsSomePageRowsSelected()} onChange={table.getToggleAllPageRowsSelectedHandler()} />;
const SelectCell = ({ row }) => <Checkbox aria-label={`${row.original.title} 선택`} checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />;
const TitleCell = ({ row, getValue, table }) => table.options.meta.onEdit ? <Button variant="ghost" data-record-edit={row.id} onClick={() => table.options.meta.onEdit(row.original)}>{getValue()}</Button> : getValue();
const StatusCell = ({ getValue, table }) => table.options.meta.statuses.find(s => s.value === getValue())?.label ?? getValue();

export const defaultStatuses = [{ value: 'draft', label: '초안' }, { value: 'published', label: '발행' }, { value: 'archived', label: '보관' }];
export const exampleRecords = [
  { id: 'guide', title: '처음 시작하는 디자인 가이드', owner: '김하나', status: 'published', description: '처음 만드는 화면의 기본 기준' },
  { id: 'icons', title: '아이콘 사용 원칙', owner: '이도윤', status: 'draft', description: '이름과 그림이 함께 전달하는 의미' },
  { id: 'type', title: '긴 한글 제목과 작은 화면에서도 읽기 편한 타이포그래피', owner: '박서연', status: 'draft', description: '한글 문장과 줄바꿈' },
  { id: 'color', title: '색과 상태', owner: '김하나', status: 'published', description: '색만으로 상태를 구분하지 않기' },
  { id: 'forms', title: '입력과 오류 복구', owner: '이도윤', status: 'archived', description: '저장 실패 후 입력 보존' },
  { id: 'mobile', title: '모바일 탐색', owner: '박서연', status: 'draft', description: '좁은 화면의 탐색 순서' },
];
export function DataTable({ records = exampleRecords, statuses = defaultStatuses, titleLabel = '제목', ownerLabel = '담당자', searchLabel = '자료 검색', onEdit, onSelectionChange, loading = false, error = '', onRetry, actions }) {
  useMemo(() => validateRecords(records), [records]);
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const columns = useMemo(() => [
    { id: 'select', header: SelectHeader, cell: SelectCell, enableSorting: false },
    { accessorKey: 'title', header: titleLabel, cell: TitleCell },
    { accessorKey: 'status', header: '상태', filterFn: 'equalsString', cell: StatusCell },
    { accessorKey: 'owner', header: ownerLabel },
  ], [titleLabel, ownerLabel]);
  const resetPage = () => { setPagination(p => ({ ...p, pageIndex: 0 })); setRowSelection({}); };
  const table = useReactTable({
    data: records, columns, meta: { onEdit, statuses }, getRowId: row => String(row.id),
    state: { sorting, rowSelection, columnFilters, globalFilter, pagination },
    onSortingChange: next => { setSorting(next); resetPage(); }, onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: next => { setColumnFilters(next); resetPage(); },
    onGlobalFilterChange: next => { setGlobalFilter(next); resetPage(); }, onPaginationChange: setPagination,
    globalFilterFn: (row, _id, value) => [row.original.id, row.original.title, row.original.owner].some(x => String(x ?? '').toLocaleLowerCase().includes(String(value).trim().toLocaleLowerCase())),
    getCoreRowModel: getCoreRowModel(), getFilteredRowModel: getFilteredRowModel(), getPaginationRowModel: getPaginationRowModel(), getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true, autoResetPageIndex: false,
  });
  const pageCount = table.getPageCount();
  useEffect(() => { if (pagination.pageIndex >= pageCount) setPagination(p => ({ ...p, pageIndex: Math.max(0, pageCount - 1) })); }, [pageCount, pagination.pageIndex]);
  useEffect(() => {
    const ids = new Set(records.map(r => r.id));
    setRowSelection(previous => Object.keys(previous).some(id => !ids.has(id)) ? Object.fromEntries(Object.entries(previous).filter(([id]) => ids.has(id))) : previous);
  }, [records]);
  const selectionCallback = useRef(onSelectionChange);
  useEffect(() => { selectionCallback.current = onSelectionChange; });
  useEffect(() => { selectionCallback.current?.(records.filter(r => rowSelection[String(r.id)])); }, [rowSelection, records]);
  return <section className="ds-data-table" aria-label={`${titleLabel} 목록`} aria-busy={loading}>
    {loading && <p role="status">자료를 불러오는 중입니다.</p>}
    {!loading && error && <div><p role="alert" className="ds-admin-error">{error}</p>{onRetry && <Button variant="outline" data-table-retry onClick={onRetry}>다시 불러오기</Button>}</div>}
    <div data-table-content hidden={loading || !!error}>
    <TableToolbar table={table} statuses={statuses} searchLabel={searchLabel} actions={actions} />
    <div className="ds-table-scroll" tabIndex={0} role="region" aria-label="표 가로 스크롤">
      <table><caption className="ds-sr-only">{titleLabel} 목록</caption><thead>{table.getHeaderGroups().map(group => <tr key={group.id}>{group.headers.map(header => <th key={header.id} scope="col" aria-sort={header.column.getCanSort() ? (header.column.getIsSorted() === 'asc' ? 'ascending' : header.column.getIsSorted() === 'desc' ? 'descending' : 'none') : undefined}>{header.column.getCanSort() ? <Button variant="ghost" onClick={header.column.getToggleSortingHandler()}>{flexRender(header.column.columnDef.header, header.getContext())}<span aria-hidden="true">{header.column.getIsSorted() === 'asc' ? ' ↑' : header.column.getIsSorted() === 'desc' ? ' ↓' : ' ↕'}</span></Button> : flexRender(header.column.columnDef.header, header.getContext())}</th>)}</tr>)}</thead>
        <tbody>{table.getRowModel().rows.length ? table.getRowModel().rows.map(row => <tr key={row.id} data-selected={row.getIsSelected()}>{row.getVisibleCells().map(cell => <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>)}</tr>) : <tr><td colSpan={columns.length}><div className="ds-table-empty">조건에 맞는 자료가 없습니다.<Button variant="outline" onClick={() => { table.setGlobalFilter(''); table.resetColumnFilters(); }}>전체 보기</Button></div></td></tr>}</tbody>
      </table>
    </div>
    <p className="ds-table-selection" role="status">{table.getFilteredSelectedRowModel().rows.length}개 선택</p>
    <TablePagination table={table} />
    </div>
  </section>;
}
