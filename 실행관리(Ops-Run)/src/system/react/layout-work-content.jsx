import React from 'react';
export const workspaceItems=[{value:'plan',label:'계획',content:'동쪽 입구에서 오전 9시에 출발합니다.'},{value:'packing',label:'준비물',content:'물, 편한 신발, 노트를 준비합니다.'},{value:'notes',label:'기록',content:'산책 후 이곳에 모여 기록을 나눕니다.'}];
export function LayoutWorkContent(){return <div className="ds-layout-copy"><h2>숲길 탐방 계획</h2><p>가을 숲을 따라 걸으며 계절의 변화를 살펴봅니다.</p><label>여행 메모 <textarea aria-label="여행 메모" defaultValue="물과 노트를 챙기기"/></label></div>;}
export function LayoutWorkAside(){return <p>출발 09:00 · 동쪽 입구</p>;}
