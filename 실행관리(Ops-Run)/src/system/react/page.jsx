'use client';
import React from 'react';
import { Template } from './template.jsx';
import { SearchModule } from './search-module.jsx';
// Each screen look brings the bottom bar shape and search look that suit it, the same pairs the HTML renderer uses.
// Pass a <BottomNav variant={pageLooks[look].navigation} /> as navigation to complete the screen.
export const pageLooks = { stack: { navigation: 'dock', search: 'grid' }, hero: { navigation: 'pill', search: 'pill' }, appbar: { navigation: 'line', search: 'list' }, sheet: { navigation: 'curve', search: 'chips' }, magazine: { navigation: 'minimal', search: 'feature' }, dashboard: { navigation: 'float', search: 'list' } };
export function CollectionPage({ title = '컬렉션', records, onSave, look = 'stack', navigation }) {
  const pair = pageLooks[look] ?? pageLooks.stack;
  const list = records ?? [{ tag: '진행 중' }, { tag: '완료' }, { tag: '진행 중' }];
  const summary = [['전체', `${list.length}개`], ...['진행 중', '완료'].map(tag => [tag, `${list.filter(item => item.tag === tag).length}개`])];
  return <Template title={title} count={`${list.length}개`} look={pageLooks[look] ? look : 'stack'} summary={summary} navigation={navigation}><SearchModule records={records} onSave={onSave} look={pair.search} /></Template>;
}
