import React from 'react';
import { Button } from './button.jsx';
// Before a decision that is hard to undo: cancel as a quiet text button, the decision filled on the right.
export function ConfirmRow({ confirmLabel = '삭제하기', cancelLabel = '취소', onConfirm, onCancel, loading = false }) {
  return <div className="ds-confirm-row"><Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button><Button loading={loading} onClick={onConfirm}>{confirmLabel}</Button></div>;
}
