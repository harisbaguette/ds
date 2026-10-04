import React from 'react';
import { AsyncForm } from './async-form.jsx';
import { Field } from './field.jsx';
export function LoginForm({title='로그인',onAuthenticate}) {return <AsyncForm title={title} submitLabel="로그인" onSubmit={onAuthenticate} successMessage="로그인했어요."><Field label="이메일" name="email" type="email" autoComplete="username" required/><Field label="비밀번호" name="password" type="password" autoComplete="current-password" required/></AsyncForm>;}
