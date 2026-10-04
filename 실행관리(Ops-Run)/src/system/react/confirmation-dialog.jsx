import React from 'react';
import { Dialog } from './dialog.jsx';
export function ConfirmationDialog(props) {return <Dialog title="항목을 삭제할까요?" trigger="삭제" confirmLabel="삭제하기" {...props}>{props.children??'삭제한 항목은 복구할 수 없어요.'}</Dialog>;}
