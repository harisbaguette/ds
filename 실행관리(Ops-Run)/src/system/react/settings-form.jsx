import React from 'react';
import { AsyncForm } from './async-form.jsx';
import { Field } from './field.jsx';
import { Textarea } from './textarea.jsx';
import { Select } from './select.jsx';
import { Switch } from './switch.jsx';
export function SettingsForm({title='프로필 설정',initialValues={},onSave}) {return <AsyncForm title={title} onSubmit={onSave}><Field label="표시 이름" name="name" defaultValue={initialValues.name??'하나'}/><Textarea label="소개" name="memo" defaultValue={initialValues.memo??''}/><Select name="visibility" defaultValue={initialValues.visibility??'private'}/><Switch name="notification" value="on" defaultChecked={initialValues.notification??true}>알림 받기</Switch></AsyncForm>;}
