'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminShell } from './admin-shell.jsx';
import { DataTable, defaultStatuses, exampleRecords } from './data-table.jsx';
import { RecordEditor } from './record-editor.jsx';
import { Button } from './button.jsx';
import { savedRecord, validateRecords } from './admin-records.jsx';
export function AdminPage({ title = '자료 관리', initialRecords = exampleRecords, statuses = defaultStatuses, titleLabel = '제목', ownerLabel = '담당자', searchLabel = '자료 검색', navigation = [], onSave, loadRecords }) {
  const [records, setRecords] = useState(initialRecords), [editing, setEditing] = useState(null), [message, setMessage] = useState('');
  const [loading, setLoading] = useState(!!loadRecords), [loadError, setLoadError] = useState('');
  const root = useRef(null), trigger = useRef(null), request = useRef(null), requestId = useRef(0), editingRef = useRef(null);
  const edit = useCallback(record => { trigger.current = document.activeElement; editingRef.current = record; setEditing(record); setMessage(''); }, []);
  const close = () => {
    const id = editingRef.current?.id; editingRef.current = null; setEditing(null);
    requestAnimationFrame(() => { const target = trigger.current?.isConnected ? trigger.current : root.current?.querySelector(`[data-record-edit="${CSS.escape(String(id))}"]`) || root.current?.querySelector('input'); target?.focus(); });
  };
  const reload = useCallback(async (focusAfter = false) => {
    if (!loadRecords || editingRef.current) return false;
    request.current?.abort(); const controller = new AbortController(); request.current = controller;
    const ownRequest = ++requestId.current;
    const restoreFocus = focusAfter || root.current?.contains(document.activeElement);
    setLoading(true); setLoadError(''); setMessage('');
    try {
      const next = await loadRecords({ signal: controller.signal });
      if (ownRequest !== requestId.current) return false;
      validateRecords(next); setRecords(next); setLoading(false);
      if (restoreFocus) requestAnimationFrame(() => root.current?.querySelector('input')?.focus());
      return true;
    } catch (error) {
      if (ownRequest !== requestId.current) return false;
      setLoading(false); setLoadError(error instanceof Error ? error.message : '자료를 불러오지 못했습니다. 다시 시도해 주세요.');
      if (restoreFocus) requestAnimationFrame(() => root.current?.querySelector('[data-table-retry]')?.focus());
      return false;
    }
  }, [loadRecords]);
  useEffect(() => {
    if (loadRecords) reload(); else { setLoading(false); setLoadError(''); }
    return () => { requestId.current++; request.current?.abort(); };
  }, [loadRecords, reload]);
  const save = async record => {
    const saved = savedRecord(onSave ? await onSave(record) : record, record, statuses);
    setRecords(rows => rows.map(row => row.id === saved.id ? { ...row, ...saved } : row));
    setMessage(`${saved.title} 저장됨`);
  };
  return <div ref={root} className="ds-admin-page"><AdminShell title={title} navigation={navigation} notice={!onSave ? '예제 · 변경사항은 이 화면에서만 유지됩니다.' : undefined}>
    <DataTable records={records} statuses={statuses} titleLabel={titleLabel} ownerLabel={ownerLabel} searchLabel={searchLabel} onEdit={edit} loading={loading} error={loadError} onRetry={() => reload(true)} actions={loadRecords ? <Button variant="ghost" disabled={loading || !!editing} onClick={() => reload(true)}>새로고침</Button> : null} />
    <p role="status" className="ds-admin-message">{message}</p>
    {editing && <RecordEditor key={editing.id} record={editing} statuses={statuses} titleLabel={titleLabel} ownerLabel={ownerLabel} onSave={save} onClose={close} />}
  </AdminShell></div>;
}
