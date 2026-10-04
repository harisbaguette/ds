import React from 'react';
export function LayoutArticle(){return <div className="ds-layout-copy"><h2>숲을 천천히 걷는 하루</h2><p>작은 산책로를 따라 계절의 색을 기록합니다. 햇빛이 드는 자리에서 잠시 쉬어 가세요.</p><p>출발 전 물과 편한 신발을 준비하세요. 길에서 만난 풍경은 여행 기록에 남길 수 있습니다.</p></div>;}
export function LayoutCards(){return <>{[['아침 산책','천천히 하루를 시작합니다.'],['점심의 정원','초록 잎 사이에 앉아 가져온 도시락을 나눕니다. 햇볕이 강한 시간에는 그늘에서 쉬어 가세요.'],['저녁의 기록','오늘 만난 풍경을 글로 남깁니다.']].map(([title,body])=><article key={title} className="ds-layout-tile"><h3>{title}</h3><p>{body}</p></article>)}</>;}
export function LayoutMedia(){return <div className="ds-layout-media"><span>산책 기록</span><strong>가을의 숲</strong></div>;}
export function LayoutAside(){return <div className="ds-layout-copy"><h3>준비할 것</h3><ul><li>물과 간식</li><li>편한 신발</li><li>기록할 노트</li></ul></div>;}
export function LayoutRelated(){return <div className="ds-layout-copy"><h3>함께 읽기</h3><p>계절별 산책 안내와 주변 쉼터를 확인하세요.</p></div>;}
export function LayoutHeader(){return <><strong>산책 기록</strong><nav aria-label="주 탐색"><a href="#walks">산책</a><a href="#notes">기록</a></nav></>;}
export function LayoutFooter(){return <p>전체 코스 약 2시간 · 식수대 3곳</p>;}
export function LayoutParagraphs(){return <>{Array.from({length:8},(_,i)=><p key={i}>산책 {i+1}구간 · 나무와 꽃을 살펴보며 천천히 걸어갑니다. 가파른 길에서는 충분히 쉬어 가세요.</p>)}</>;}
export function LayoutThumbnails(){return <>{['동쪽 숲길','작은 정원','물가 산책로'].map((title,i)=><li key={title}><span className="ds-layout-thumb" aria-hidden="true">0{i+1}</span><div><h3>{title}</h3><p>그늘과 쉼터가 있는 한 시간 코스입니다.</p></div></li>)}</>;}
