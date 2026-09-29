'use client';
import React, { useState } from 'react';
import { Input, InputGroup, InputTool } from './input.jsx';
// The show button flips the typed secret to plain text in place, so a typo is seen instead of retyped.
export function PasswordInput({ label = '비밀번호', disabled, ...props }) {
  const [shown, setShown] = useState(false);
  return <InputGroup className="ds-password-input"><Input {...props} disabled={disabled} type={shown ? 'text' : 'password'} /><InputTool aria-label={`${label} ${shown ? '숨기기' : '보기'}`} disabled={disabled} onClick={() => setShown(!shown)}>{shown ? '숨기기' : '보기'}</InputTool></InputGroup>;
}
