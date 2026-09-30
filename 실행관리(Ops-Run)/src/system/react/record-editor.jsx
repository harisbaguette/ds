'use client';
import React, { useEffect, useId, useRef, useState } from 'react';
import { Button } from './button.jsx';
import { Field } from './field.jsx';
import { savedRecord } from './admin-records.jsx';
const statusesDefault = [{ value: 'draft', label: '초안' }, { value: 'published', label: '발행' }, { value: 'archived', label: '보관' }];
export function RecordEditorDemo() {
  const [open, setOpen] = useState(false), [record, setRecord] = useState({ id: 'example', title: '처음 시작하는 디자인 가이드', status: 'draft', owner: '김하나', description: '' });
  return <div><Button variant="outline" onClick={() => setOpen(true)}>편집 열기</Button>{open && <RecordEditor record={record} onSave={setRecord} onClose={() => setOpen(false)} />}</div>;
}
export function RecordEditor({ record, statuses = statusesDefault, titleLabel = '제목', ownerLabel = '담당자', onSave, onClose }) {
  const id = useId(), dialog = useRef(null), busy = useRef(false), alive = useRef(true);
  const [draft, setDraft] = useState({ ...record }), [pending, setPending] = useState(false), [error, setError] = useState(''), [titleError, setTitleError] = useState(''), [discard, setDiscard] = useState(false);
  useEffect(() => { alive.current = true; dialog.current?.showModal(); return () => { alive.current = false; }; }, []);
  const dirty = ['title', 'status', 'owner', 'description'].some(k => String(draft[k] ?? '') !== String(record[k] ?? ''));
  const close = (confirmDiscard = false) => { if (busy.current) return; if (dirty && !(discard && confirmDiscard)) { setDiscard(true); return; } dialog.current?.close(); onClose?.(); };
  const change = e => { setDraft(d => ({ ...d, [e.target.name]: e.target.value })); setDiscard(false); setError(''); setTitleError(''); };
  const save = async e => {
    e.preventDefault(); if (busy.current) return;
    if (!draft.title?.trim()) { setTitleError(`${titleLabel}을 입력해 주세요.`); dialog.current.querySelector('[name="title"]').focus(); return; }
    if (!statuses.some(s => s.value === draft.status)) { setError('상태를 선택해 주세요.'); return; }
    if (!onSave) { setError('저장 연결이 없습니다. 입력한 내용은 유지됩니다.'); return; }
    busy.current = true; setPending(true); setError('');
    try { const input = { ...draft, title: draft.title.trim() }; savedRecord(await onSave(input), input, statuses); if (alive.current) { dialog.current?.close(); onClose?.(); } }
    catch (err) { if (alive.current) setError(err instanceof Error ? err.message : '저장하지 못했습니다. 다시 시도해 주세요.'); }
    finally { busy.current = false; if (alive.current) setPending(false); }
  };
  return <dialog ref={dialog} className="ds-record-editor" aria-labelledby={`${id}-title`} onCancel={e => { e.preventDefault(); close(); }}>
    <form onSubmit={save} noValidate><h2 id={`${id}-title`}>상세 · 편집</h2><p className="ds-record-id">{record.id}</p>
      <fieldset disabled={pending}>
        <Field label={titleLabel} name="title" value={draft.title ?? ''} onChange={change} error={titleError} maxLength={240} required />
        <Field label="상태">{props => <select {...props} className="ds-input" name="status" value={draft.status} onChange={change}>{statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select>}</Field>
        <Field label={ownerLabel} name="owner" value={draft.owner ?? ''} onChange={change} maxLength={120} />
        <Field label="설명">{props => <textarea {...props} className="ds-input" name="description" value={draft.description ?? ''} onChange={change} rows={4} maxLength={4000} />}</Field>
      </fieldset>
      <p role="alert" className="ds-admin-error">{error}</p>
      {discard && <p role="status">저장하지 않은 변경사항이 있습니다.</p>}
      <div className="ds-editor-actions"><Button variant="ghost" disabled={pending} onClick={() => close(true)}>{discard ? '변경 버리고 닫기' : '취소'}</Button><Button type="submit" loading={pending}>{pending ? '저장 중' : error ? '다시 저장' : '저장'}</Button></div>
    </form>
  </dialog>;
}
