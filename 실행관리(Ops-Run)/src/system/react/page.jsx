'use client';
import React from 'react';
import { Template } from './template.jsx';
import { SearchModule } from './search-module.jsx';
export function CollectionPage({ title = '컬렉션', records, onSave }) { return <Template title={title} count={records ? `${records.length}개` : '3개'}><SearchModule records={records} onSave={onSave} /></Template>; }
