const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const escapeText = value => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ART={milk:'../../../영감보관함/이미지/그래픽포스터/2026-09-22-우유병-단색-포스터-pinterest.jpg',melon:'../../../영감보관함/이미지/그래픽포스터/2026-09-22-비닐봉지-수박-파랑바탕-pinterest.jpg'};
const icons = {
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5z"/>',
 edit:'<path d="M13 5H5v15h15v-8M10 14l1-5 7-7 4 4-7 7z"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8zm-9 9 9 5 9-5m-18 5 9 5 9-5"/>',
 bell:'<path d="M6 10a6 6 0 0 1 12 0c0 6 3 6 3 8H3c0-2 3-2 3-8m4 11h4"/>',
 rotate:'<path d="M3 4v6h6M3 10a9 9 0 1 1 1 8"/>',
 check:'<circle cx="12" cy="12" r="9"/><path d="m7.5 12 3 3 6-6"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 warning:'<path d="m12 3 10 18H2zm0 6v5m0 3v1"/>',
 box:'<path d="m3 8 4-5h10l4 5v13H3zm0 0h5l2 4h4l2-4h5"/>',
 bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 chevron:'<path d="m9 6 6 6-6 6"/>'
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.grid}</svg>`;
const styleName = key => STYLES[key]?.name || STYLES.clear.name;
function readSaved(){
 try { const data=JSON.parse(localStorage.getItem('pattove-saved')||'[]');
   return Array.isArray(data)?data.filter(x=>PATTERNS.some(p=>p.id===x.id)&&Object.hasOwn(STYLES,x.style)).filter((x,i,a)=>a.findIndex(v=>v.id===x.id&&v.style===x.style)===i):[];
 } catch { return []; }
}
const state={page:'patterns',category:'all',device:'all',status:'all',style:'clear',query:'',compact:false,compareMode:false,compare:[],saved:readSaved(),detailId:null,detailStyle:'clear',lastOpener:null};
let noticeTimer, searchTimer, demoTimer;
function announce(text){$('#announcer').textContent=text;}
function notify(text){clearTimeout(noticeTimer);$('#notice').textContent=text;$('#notice').hidden=false;noticeTimer=setTimeout(()=>$('#notice').hidden=true,3500);}
function persistSaved(){
 try{localStorage.setItem('pattove-saved',JSON.stringify(state.saved));return true;}
 catch{notify('이 브라우저에서는 저장을 유지할 수 없어요. 지금 열린 화면에서만 보관합니다.');return false;}
}
function line(short=false){return `<div class="mini-line ${short?'short':''}"></div>`;}
function miniature(type){
 const surfaces={
 toast:`<div class="mini-alert"><span class="mini-status">${icon('check')}</span><div><strong>변경사항 저장됨</strong><span class="mini-muted">모든 변경사항이 반영됐어요.</span></div><span class="mini-dismiss">×</span></div>`,
 banner:`<div class="mini-notice">${icon('info')}<div><b>읽기 전용 문서</b><p>편집하려면 권한이 필요합니다.</p><span class="mini-inline-link">권한 요청 ↗</span></div></div>`,
 dialog:`<div class="mini-surface mini-dialog"><span class="mini-dialog-icon">${icon('box')}</span><b>컬렉션을 삭제할까요?</b><p class="mini-muted">이 작업은 되돌릴 수 없습니다.</p><div class="mini-actions"><span class="mini-secondary">취소</span><span class="mini-button">삭제</span></div></div>`,
 progress:`<div class="mini-surface mini-upload"><div class="mini-row"><div class="mini-file">${icon('layers')}</div><div class="mini-file-name"><b>brand-assets.zip</b><span class="mini-muted">24.8 MB</span></div><span class="mini-percent">68%</span></div><div class="mini-progress"><i></i></div><div class="mini-row"><span class="mini-muted">업로드 중</span><span class="mini-muted">잠시 남음</span></div></div>`,
 skeleton:`<div class="mini-surface mini-skeleton"><div class="mini-row"><div class="mini-avatar"></div><div style="flex:1">${line(true)}${line()}</div></div><div class="skeleton-cover"></div>${line()}${line(true)}</div>`,
 empty:`<div class="mini-empty"><div class="empty-sheets"><i></i><i></i>${icon('box')}</div><b>아직 비어 있어요</b><span class="mini-button">+ 새 컬렉션</span></div>`,
 error:`<div class="mini-surface mini-error">${icon('warning')}<b>연결이 끊겼어요</b><p class="mini-muted">입력한 내용은 보관됩니다.</p><span class="mini-secondary">${icon('rotate')}다시 시도</span></div>`,
 undo:`<div class="mini-alert">${icon('box')}<strong>컬렉션 삭제됨</strong><span class="mini-inline-link">되돌리기</span></div>`,
 pagination:`<div class="mini-pagination"><span>‹</span><span>1</span><span class="on">2</span><span>3</span><span>…</span><span>8</span><span>›</span></div>`,
 infinite:`<div class="mini-feed"><img src="${ART.milk}" alt=""><img src="${ART.melon}" alt=""><div class="mini-feed-next"></div></div>`,
 tabs:`<div class="mini-surface mini-tab-panel"><div class="mini-tabs"><span class="on">전체</span><span>진행 중</span><span>완료</span></div><div class="mini-task">${icon('check')}<span>브랜드 리뉴얼</span><i></i></div><div class="mini-task">${icon('check')}<span>웹사이트 디자인</span><i></i></div></div>`,
 drawer:`<div class="mini-drawer"><div><b class="mini-workspace">Workspace</b><p class="active">${icon('grid')}프로젝트</p><p>${icon('box')}컬렉션</p><p>${icon('bookmark')}저장</p></div><div class="mini-drawer-back">${line()}${line(true)}</div></div>`,
 accordion:`<div class="mini-surface mini-accordion"><div class="mini-row"><b>수정할 수 있나요?</b><span>−</span></div><p class="mini-muted">설정에서 언제든 변경할 수 있어요.</p><div class="mini-row"><b>어디에 보관되나요?</b><span>+</span></div></div>`,
 form:`<div class="mini-form"><b>이메일</b><div class="mini-input error">hello@<span>!</span></div><p>이메일 주소를 확인해 주세요.</p></div>`,
 search:`<div class="mini-surface mini-command"><div class="mini-command-query">${icon('search')}<span>프로젝트</span><i></i></div><div class="mini-command-row selected">${icon('layers')}브랜드 프로젝트<span>↵</span></div><div class="mini-command-row">${icon('layers')}웹 프로젝트</div></div>`,
 stepper:`<div class="mini-stepper"><div class="mini-steps"><span class="done">✓</span><i></i><span class="on">2</span><i></i><span>3</span></div><div class="mini-step-names"><span>기본 정보</span><span>상세 입력</span><span>완료</span></div></div>`
 };
 return `<div class="mini">${surfaces[type]||surfaces.toast}</div>`;
}
function preview(p,style=state.style){return `<div class="preview theme-${style} preview-${p.type}" aria-hidden="true">${miniature(p.type)}</div>`;}
function renderSidebar(){
 const focusedCategory=document.activeElement?.dataset.category;
 $('#sidebar').innerHTML=CATEGORIES.map(([id,label])=>`<button class="category" data-category="${id}" aria-pressed="${state.category===id}"><span>${label}</span><b>${PATTERNS.filter(p=>id==='all'||p.cat===id).length}</b></button>`).join('');
 $('#category-mobile').innerHTML=CATEGORIES.map(([id,label])=>`<option value="${id}" ${state.category===id?'selected':''}>${label}</option>`).join('');
 if(focusedCategory)$(`[data-category="${focusedCategory}"]`).focus();
}
function score(p,query){
 const q=query.toLocaleLowerCase().replace(/\s/g,'');
 if(!q)return 1;
 const exact=[p.name,p.en,p.id].some(t=>t.toLocaleLowerCase().replace(/\s/g,'').includes(q));
 const words=[...new Set((p.search+' '+p.name+' '+p.en).toLowerCase().split(/\s+/))].filter(t=>t.length>1);
 return (exact?8:0)+words.reduce((n,w)=>n+(q.includes(w)?Math.min(w.length,4):0),0);
}
function results(){
 const scored=PATTERNS.map(p=>({p,score:score(p,state.query)}));
 const max=Math.max(0,...scored.map(x=>x.score));
 const threshold=state.query?Math.max(1,max*.32):0;
 return scored.filter(x=>x.score>=threshold&&(state.category==='all'||x.p.cat===state.category)&&(state.device==='all'||x.p.device.includes(state.device))&&(state.status==='all'||x.p.status.includes(state.status))).sort((a,b)=>b.score-a.score).map(x=>x.p);
}
function patternCard(p){
 return `<article class="pattern-card" data-pattern="${p.id}"><button class="card-main" data-open="${p.id}" aria-label="${p.name} 상세 열기">${preview(p)}<div class="card-copy"><h3>${p.name}</h3></div></button><label class="card-compare" title="비교 선택"><input type="checkbox" data-compare="${p.id}" ${state.compare.includes(p.id)?'checked':''} aria-label="${p.name} 비교 선택"><span class="compare-check" aria-hidden="true">${icon('check')}</span></label></article>`;
}
function renderPatterns(){
 const list=results();
 $('#pattern-grid').innerHTML=list.map(patternCard).join('');
 $('#pattern-grid').classList.toggle('compact',state.compact);
 $('#result-title').textContent=state.query?'검색 결과':CATEGORIES.find(c=>c[0]===state.category)[1];
 $('#result-count').textContent=`${list.length}`;
 $('#empty-results').hidden=list.length>0;
 $('#clear-query').hidden=!state.query;
 $('#reset-filters').hidden=!state.query&&state.category==='all'&&state.device==='all'&&state.status==='all';
 $('#view-gallery').setAttribute('aria-pressed',String(!state.compact));
 $('#view-compact').setAttribute('aria-pressed',String(state.compact));
 announce(`${list.length}개의 패턴을 찾았습니다.`);
}
function setPage(page){
 state.page=page;
 document.body.dataset.page=page;
 for(const [id,p] of [['pattern-page','patterns'],['style-page','styles'],['saved-page','saved']])$('#'+id).hidden=p!==page;
 $$('.top-nav button').forEach(b=>b.toggleAttribute('aria-current',false));
 $(`.top-nav button[data-page="${page}"]`).setAttribute('aria-current','page');
 $('#sidebar').style.visibility=page==='patterns'?'visible':'hidden';
 if(page==='styles')renderStyles();
 if(page==='saved')renderSaved();
 renderTray();
}
function resetFilters(){
 clearTimeout(searchTimer);$('#search-suggestions').hidden=true;
 state.query='';state.category='all';state.device='all';state.status='all';
 $('#query').value='';$('#device').value='all';$('#status').value='all';
 setPage('patterns');renderSidebar();renderPatterns();
}
function setQuery(value){state.query=value.trim();$('#query').value=value;$('#search-suggestions').hidden=true;setPage('patterns');renderPatterns();}
function setCompare(id,checked){
 if(checked&&!state.compare.includes(id)){
   if(state.compare.length===2){notify('두 패턴을 비교할 수 있어요. 선택한 패턴 하나를 먼저 빼주세요.');syncCompare();return;}
   state.compare.push(id);
 }else if(!checked)state.compare=state.compare.filter(x=>x!==id);
 syncCompare();renderTray();
}
function syncCompare(){$$('[data-compare]').forEach(el=>el.checked=state.compare.includes(el.dataset.compare));}
function renderTray(){
 const tray=$('#compare-tray');tray.hidden=!state.compare.length||state.page!=='patterns';
 tray.innerHTML=`<strong>${state.compare.length}/2</strong><div class="tray-items">${state.compare.map(id=>`<button data-remove-compare="${id}" aria-label="${PATTERNS.find(p=>p.id===id).name} 비교에서 빼기">${PATTERNS.find(p=>p.id===id).name} ×</button>`).join('')}</div>${state.compare.length===1?'<small>하나 더 선택</small>':''}<button class="primary" data-open-compare ${state.compare.length<2?'disabled':''}>비교</button>`;
}
function detailDemo(p){
 let html='';
 if(p.id==='toast'||p.id==='banner')html=`<h3>팀 회의 메모</h3><p>다음 주 회의는 화요일 오후 2시입니다.</p><button class="demo-primary" data-demo="save">저장</button><div class="demo-output" aria-live="polite"></div>`;
 else if(p.id==='dialog')html=`<h3>오래된 문서</h3><p>삭제 전 확인하는 예시입니다.</p><button data-demo="confirm">삭제</button><div class="demo-output" aria-live="polite"></div><dialog id="demo-confirm-dialog" aria-labelledby="demo-confirm-title"><h3 id="demo-confirm-title">예시 문서를 삭제할까요?</h3><p>이 체험 안의 문서만 지워집니다.</p><div class="demo-confirm-actions"><button data-demo="confirm-no" autofocus>취소</button><button class="demo-primary" data-demo="confirm-yes">삭제 확인</button></div></dialog>`;
 else if(p.id==='empty')html=`<h3>나의 메모</h3><div class="demo-output" aria-live="polite"><p>작성한 메모가 아직 없어요.</p></div><button class="demo-primary" data-demo="add">메모 작성</button>`;
 else if(p.id==='error')html=`<h3>문서를 불러오지 못했어요</h3><p>입력한 내용은 그대로 보관되어 있어요.</p><button class="demo-primary" data-demo="retry">다시 시도</button><div class="demo-output" aria-live="polite"></div>`;
 else if(p.id==='undo')html=`<h3>오늘 할 일</h3><div class="demo-output" aria-live="polite"><p>발표 자료 검토하기</p></div><button data-demo="delete">삭제</button>`;
 else if(p.id==='pagination')html=`<h3>프로젝트 목록</h3><div class="demo-output" aria-live="polite"><p>1페이지 · 프로젝트 1–3</p></div><button class="demo-primary" data-demo="next-page">다음 페이지 보기</button>`;
 else if(p.id==='infinite')html=`<h3>새로운 이야기</h3><div class="demo-output" aria-live="polite"><p>오늘의 이야기 1–3</p></div><button class="demo-primary" data-demo="more">더 보기</button>`;
 else if(p.id==='tabs')html=`<h3>내 작업</h3><div class="demo-tab-buttons" role="tablist" aria-label="작업 상태"><button id="demo-tab-all" role="tab" aria-selected="true" aria-controls="demo-tab-panel" data-demo="tab-all">전체</button><button id="demo-tab-done" role="tab" aria-selected="false" aria-controls="demo-tab-panel" tabindex="-1" data-demo="tab-done">완료</button></div><div class="demo-output" id="demo-tab-panel" role="tabpanel" tabindex="0" aria-labelledby="demo-tab-all"><p>진행 중 2개 · 완료 1개</p></div>`;
 else if(p.id==='accordion')html=`<h3>자주 묻는 질문</h3><details><summary>나중에 수정할 수 있나요?</summary><p>설정에서 언제든 변경할 수 있어요.</p></details><details><summary>어디에 보관되나요?</summary><p>이 예시는 기기에 아무것도 저장하지 않아요.</p></details>`;
 else if(p.id==='drawer')html=`<h3>프로젝트 화면</h3><button data-demo="drawer">메뉴 열기</button><div class="demo-output" aria-live="polite"></div>`;
 else if(p.id==='form')html=`<label for="demo-email">이메일</label><input id="demo-email" type="email" value="hello@" aria-describedby="demo-validation"><button class="demo-primary" data-demo="validate">확인</button><div class="demo-output" id="demo-validation" aria-live="polite"></div>`;
 else if(p.id==='stepper')html=`<h3>프로필 만들기</h3><div class="demo-output" aria-live="polite"><p>1 / 3 · 기본 정보</p></div><div data-step-panel="1"><label for="demo-name">이름</label><input id="demo-name" value="디자인 팀"></div><div data-step-panel="2" hidden><label for="demo-team">팀 이름</label><input id="demo-team" value="패토브"></div><div data-step-panel="3" hidden><p class="demo-summary"></p></div><div class="demo-step-actions"><button data-demo="step-back" disabled>이전</button><button class="demo-primary" data-demo="step" data-step="1">다음</button></div>`;
 else if(p.id==='search')html=`<h3>프로젝트 찾기</h3><label for="demo-filter">상태</label><select id="demo-filter"><option value="all">전체</option><option value="done">완료</option></select><div class="demo-output" aria-live="polite"><p>리뉴얼 · 진행 중<br>소개 페이지 · 완료</p></div>`;
 else if(p.id==='progress')html=`<h3>사진 업로드</h3><div class="demo-output" aria-live="polite"><p>시작하면 예시 진행률을 보여줍니다.</p></div><progress id="demo-progress" max="100" value="0" aria-label="예시 업로드 진행률"></progress><button class="demo-primary" data-demo="progress">업로드</button>`;
 else html=`<h3>자료 불러오기</h3><div class="demo-output" aria-live="polite">${miniature(p.type)}</div><button class="demo-primary" data-demo="load">불러오기</button>`;
 return `<div class="demo-app demo-${p.id}">${html}</div>`;
}
function openDetail(id,style=state.style){
 const p=PATTERNS.find(x=>x.id===id);if(!p)return;
 clearTimeout(demoTimer);
 const dialog=$('#detail-dialog');
 if(!dialog.open)state.lastOpener=document.activeElement;
 state.detailId=id;state.detailStyle=style;
 dialog.innerHTML=`<div class="dialog-head"><h2 id="detail-title" tabindex="-1">${p.name}<span>${p.en}</span></h2><button class="close-dialog" data-close="detail-dialog" aria-label="상세 닫기">${icon('close')}</button></div><div class="detail-layout"><div class="demo-column"><div class="demo-toolbar"><span>데모</span><div class="style-buttons">${Object.entries(STYLES).map(([key,v])=>`<button data-detail-style="${key}" aria-pressed="${key===style}">${v.name}</button>`).join('')}</div></div><div class="demo-stage theme-${style}" aria-label="체험용 예시">${detailDemo(p)}</div></div><div class="decision-column"><section class="decision-block"><h3>용도</h3><p>${p.when}</p></section><section class="decision-block"><h3>피할 때</h3><p>${p.avoid}</p></section><details class="design-note"><summary>설계 메모</summary><p>${p.caution}</p></details><section class="decision-block related-block"><h3>관련</h3>${p.alternatives.map(other=>{const a=PATTERNS.find(x=>x.id===other);return `<button class="alternative" data-open="${other}"><span>${a.name}</span>${icon('chevron')}</button>`}).join('')}</section></div></div><div class="dialog-foot"><span class="saved-style-label">${styleName(style)}</span><label><input type="checkbox" data-compare="${id}" ${state.compare.includes(id)?'checked':''}>비교</label><button class="primary" id="detail-save" data-save="${id}">${icon('bookmark')}${isSaved(id,style)?'저장됨':'패턴 저장'}</button></div>`;
 if(!dialog.open)dialog.showModal();
 $('#detail-title').focus();
}
function isSaved(id,style){return state.saved.some(x=>x.id===id&&x.style===style);}
function savePattern(id,style){
 if(isSaved(id,style)){notify('이미 같은 스타일로 저장한 패턴이에요.');return;}
 state.saved.push({id,style});const persisted=persistSaved();
 updateSavedCount();
 if($('#detail-save'))$('#detail-save').textContent='저장됨';
 if(persisted)notify('저장됨');
 announce('패턴과 스타일을 저장했습니다. 저장한 패턴에서 확인할 수 있습니다.');
}
function updateSavedCount(){$$('.saved-count').forEach(e=>e.textContent=state.saved.length);}
function openCompare(){
 if(state.compare.length!==2)return;
 const ps=state.compare.map(id=>PATTERNS.find(p=>p.id===id));
 const dlg=$('#compare-dialog');
 dlg.innerHTML=`<div class="dialog-head"><h2 id="compare-title" tabindex="-1">비교</h2><button class="close-dialog" data-close="compare-dialog" aria-label="비교 닫기">${icon('close')}</button></div><div class="comparison"><div class="comparison-head">${ps.map(p=>`<div class="compare-pattern">${preview(p)}<h3>${p.name}</h3></div>`).join('')}</div>${[['용도','when'],['사용자 확인','confirm'],['위치','placement'],['피할 때','avoid']].map(([name,key])=>`<section class="compare-row"><h3>${name}</h3><div>${ps.map(p=>`<p>${p[key]}</p>`).join('')}</div></section>`).join('')}<div class="compare-actions">${ps.map(p=>`<button class="secondary" data-compare-detail="${p.id}">${p.name} ${icon('arrow')}</button>`).join('')}</div></div>`;
 dlg.showModal();$('#compare-title').focus();
}
function sampleScreen(){return `<div class="sample-app"><div class="sample-top"><b>Collection</b><span class="sample-avatar">J</span></div><div class="sample-body"><div class="sample-heading"><h3>내 컬렉션</h3><span class="mini-button">+ 만들기</span></div><div class="sample-nav"><span class="active">전체</span><span>최근</span><span>공유</span></div><div class="sample-projects"><div><img src="${ART.milk}" alt=""><b>색과 형태</b><span>12개</span></div><div><img src="${ART.melon}" alt=""><b>여름의 기록</b><span>8개</span></div></div><div class="sample-setting"><div><b>링크 공유</b><span>초대받은 멤버</span></div><i class="mini-toggle"></i></div><div class="sample-bottom"><span>멤버 3명</span><span class="mini-button">초대</span></div></div></div>`;}
function renderStyles(){
 $('#style-page').innerHTML=`<div class="page-heading"><h1>스타일</h1><span>3</span></div><div class="style-grid">${Object.entries(STYLES).map(([key,v])=>`<article class="style-card ${state.style===key?'selected':''}"><div class="style-sample theme-${key}" aria-hidden="true">${sampleScreen()}</div><div class="style-meta"><h2>${v.name}</h2><button class="style-apply" data-apply-style="${key}" aria-label="${v.name} 적용" aria-pressed="${state.style===key}">${state.style===key?icon('check'):icon('arrow')}</button></div></article>`).join('')}</div>`;
}
function renderSaved(){
 $('#saved-page').innerHTML=`<div class="saved-intro page-heading"><h1>저장</h1><span>${state.saved.length}</span></div>${!state.saved.length?'<div class="empty-results"><h2>저장한 패턴 없음</h2><button class="secondary" data-page="patterns">패턴 찾기</button></div>':`<div class="saved-list">${state.saved.map(({id,style})=>{const p=PATTERNS.find(x=>x.id===id);return `<article class="saved-item"><button class="saved-preview" data-saved-open="${id}" data-saved-style="${style}" aria-label="${p.name} 다시 보기">${preview(p,style)}</button><div class="saved-copy"><div><h3>${p.name}</h3><p>${styleName(style)}</p></div><button class="icon-button" data-unsave="${id}" data-unsave-style="${style}" aria-label="${p.name} ${styleName(style)} 저장 취소">${icon('close')}</button></div></article>`}).join('')}</div>`}`;
}
function changeDetailStyle(style){
 state.detailStyle=style;
 const stage=$('#detail-dialog .demo-stage');stage.className=`demo-stage theme-${style}`;
 $$('[data-detail-style]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.detailStyle===style)));
 $('.saved-style-label').textContent=styleName(style);
 $('#detail-save').textContent=isSaved(state.detailId,style)?'저장됨':'패턴 저장';
 announce(`${styleName(style)}을 예시 전체에 적용했습니다.`);
}
function runDemo(action,button){
 const stage=$('#detail-dialog .demo-stage');const output=$('.demo-output',stage);clearTimeout(demoTimer);
 const say=text=>output.innerHTML=`<div class="demo-message">${icon('check')}${text}</div>`;
 if(action==='save'){say('문서가 저장됐어요.');if(state.detailId==='toast')demoTimer=setTimeout(()=>{if(output.isConnected)output.innerHTML='';announce('체험용 알림이 닫혔습니다. 다시 저장을 눌러볼 수 있습니다.');},4500);}
 if(action==='confirm')$('#demo-confirm-dialog').showModal();
 if(action==='confirm-no'){$('#demo-confirm-dialog').close();say('취소했어요. 문서는 그대로예요.');}
 if(action==='confirm-yes'){$('#demo-confirm-dialog').close();say('예시 문서가 삭제됐어요.');}
 if(action==='add'){say('첫 메모가 생겼어요.');button.textContent='한 번 더 작성해보기';}
 if(action==='retry')say('다시 연결되어 문서를 불러왔어요.');
 if(action==='delete'){say('항목을 지웠어요.');button.dataset.demo='undo';button.textContent='되돌려보기';}
 if(action==='undo'){say('발표 자료 검토하기 — 복원했어요.');button.dataset.demo='delete';button.textContent='삭제';}
 if(action==='next-page'){const n=Number(button.dataset.step||1)+1;button.dataset.step=n;say(`${n}페이지 · 프로젝트 ${(n-1)*3+1}–${n*3}`);}
 if(action==='more'){const n=Number(button.dataset.step||3)+3;button.dataset.step=n;say(`이야기 1–${n} · 3개를 더 불러왔어요.`);}
 if(action==='tab-all'||action==='tab-done'){say(action==='tab-all'?'진행 중 2개 · 완료 1개':'완료한 작업 1개');$$('.demo-tab-buttons button').forEach(b=>{b.setAttribute('aria-selected',String(b===button));b.tabIndex=b===button?0:-1;});output.setAttribute('aria-labelledby',button.id);}
 if(action==='drawer'){output.innerHTML=output.innerHTML?'':'<nav class="demo-side-menu" aria-label="체험용 메뉴"><strong>내 공간</strong><button data-demo="menu-home">홈</button><button data-demo="menu-docs">내 문서</button><button data-demo="menu-settings">설정</button></nav>';button.textContent=output.innerHTML?'메뉴 닫기':'메뉴 열기';}
 if(action.startsWith('menu-')){$('h3',stage).textContent={'menu-home':'홈','menu-docs':'내 문서','menu-settings':'설정'}[action];output.innerHTML='';const trigger=$('[data-demo="drawer"]',stage);trigger.textContent='메뉴 열기';trigger.focus();}
 if(action==='validate'){const input=$('#demo-email');const ok=input.checkValidity()&&input.value.length>0;input.setAttribute('aria-invalid',String(!ok));output.innerHTML=`<p style="color:${ok?'#286344':'#a43131'}">${ok?'올바른 이메일 형식이에요.':'주소를 끝까지 입력해 주세요. 예: hello@example.com'}</p>`;}
 if(action==='step'||action==='step-back'){const next=$('[data-demo="step"]',stage);const current=Number(next.dataset.step);const n=action==='step-back'?Math.max(1,current-1):current===3?1:current+1;next.dataset.step=n;say(`${n} / 3 · ${['','기본 정보','상세 입력','확인'][n]}`);$$('[data-step-panel]',stage).forEach(el=>el.hidden=Number(el.dataset.stepPanel)!==n);$('.demo-summary',stage).textContent=`${$('#demo-name').value} · ${$('#demo-team').value}`;$('[data-demo="step-back"]',stage).disabled=n===1;next.textContent=n===3?'처음으로 돌아가기':'다음';}
 if(action==='progress'){button.disabled=true;let value=0;const tick=()=>{if(!output.isConnected)return;value=Math.min(100,value+20);$('#demo-progress').value=value;output.textContent=`예시 업로드 ${value}%`;if(value<100)demoTimer=setTimeout(tick,200);else button.disabled=false;};tick();}
 if(action==='load'){output.innerHTML=miniature('skeleton')+'<p>자료를 불러오고 있어요…</p>';button.disabled=true;demoTimer=setTimeout(()=>{if(output.isConnected){say('자료를 불러왔어요.');button.disabled=false;}},1000);}
}
document.addEventListener('click',event=>{
 const b=event.target.closest('button,a.brand');if(!b)return;
 if(b.matches('a.brand')){event.preventDefault();resetFilters();}
 if(b.dataset.page){clearTimeout(searchTimer);state.query=$('#query').value.trim();setPage(b.dataset.page);if(b.dataset.page==='patterns')renderPatterns();}
 if(b.dataset.category){state.category=b.dataset.category;renderSidebar();renderPatterns();}
 if(b.dataset.query){resetFilters();setQuery(b.dataset.query);$('#query').focus();$('#search-suggestions').hidden=true;}
 if(b.dataset.open)openDetail(b.dataset.open);
 if(b.dataset.close)$('#'+b.dataset.close).close();
 if(b.hasAttribute('data-reset')||b.id==='reset-filters')resetFilters();
 if(b.id==='clear-query'){setQuery('');$('#query').focus();}
 if(b.id==='compare-mode'){state.compareMode=!state.compareMode;document.body.classList.toggle('is-comparing',state.compareMode);b.setAttribute('aria-pressed',String(state.compareMode));if(!state.compareMode){state.compare=[];syncCompare();renderTray();}}
 if(b.id==='view-gallery'||b.id==='view-compact'){state.compact=b.id==='view-compact';renderPatterns();}
 if(b.dataset.removeCompare)setCompare(b.dataset.removeCompare,false);
 if(b.hasAttribute('data-open-compare'))openCompare();
 if(b.dataset.compareDetail){$('#compare-dialog').close();openDetail(b.dataset.compareDetail);}
 if(b.dataset.detailStyle)changeDetailStyle(b.dataset.detailStyle);
 if(b.dataset.save)savePattern(b.dataset.save,state.detailStyle);
 if(b.dataset.applyStyle){state.style=b.dataset.applyStyle;$('#preview-style').value=state.style;setPage('patterns');renderPatterns();notify(`${styleName(state.style)} 적용됨`);}
 if(b.dataset.savedOpen)openDetail(b.dataset.savedOpen,b.dataset.savedStyle);
 if(b.dataset.unsave){state.saved=state.saved.filter(x=>!(x.id===b.dataset.unsave&&x.style===b.dataset.unsaveStyle));persistSaved();updateSavedCount();renderSaved();announce('저장을 취소했습니다.');}
 if(b.dataset.demo)runDemo(b.dataset.demo,b);
});
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.dataset.compare)setCompare(el.dataset.compare,el.checked);
 if(el.id==='category-mobile'){state.category=el.value;renderSidebar();renderPatterns();}
 if(el.id==='device'||el.id==='status'){state[el.id]=el.value;renderPatterns();}
 if(el.id==='preview-style'){state.style=el.value;renderPatterns();}
 if(el.id==='demo-filter')$('.demo-output',$('#detail-dialog')).innerHTML=`<p>${el.value==='done'?'소개 페이지 · 완료':'리뉴얼 · 진행 중<br>소개 페이지 · 완료'}</p>`;
});
$('#query').addEventListener('input',e=>{$('#search-suggestions').hidden=true;clearTimeout(searchTimer);const value=e.target.value;searchTimer=setTimeout(()=>setQuery(value),120);});
$('#search-form').addEventListener('submit',e=>{e.preventDefault();clearTimeout(searchTimer);setQuery($('#query').value);});
$('#detail-dialog').addEventListener('close',()=>{clearTimeout(demoTimer);const opener=state.lastOpener;const fallback=$(`[data-open="${state.detailId}"]`)||$('button[data-page="patterns"]');(opener?.isConnected?opener:fallback).focus();});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key==='k'&&!$('dialog[open]')){e.preventDefault();setPage('patterns');$('#query').focus();}});
document.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;
 const dialog=$$('dialog[open]').at(-1);if(!dialog)return;
 const items=$$('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),summary,[tabindex="0"]',dialog).filter(el=>el.getClientRects().length);
 const first=items[0],last=items.at(-1);if(!first)return;
 if(e.shiftKey&&(document.activeElement===first||document.activeElement.tabIndex<0)){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});
document.addEventListener('keydown',e=>{if(!e.target.matches('.demo-tab-buttons [role=tab]')||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=$$('.demo-tab-buttons [role=tab]');const next=e.key==='Home'?tabs[0]:e.key==='End'?tabs.at(-1):tabs[(tabs.indexOf(e.target)+1)%tabs.length];next.focus();next.click();});
$('#query').addEventListener('focus',()=>{$('#search-suggestions').hidden=!!$('#query').value;});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#search-form'))$('#search-suggestions').hidden=true;});
document.addEventListener('focusin',e=>{if(!e.target.closest('#search-form'))$('#search-suggestions').hidden=true;});
document.addEventListener('keydown',e=>{if(e.key==='Escape')$('#search-suggestions').hidden=true;});
document.body.dataset.page='patterns';$('#search-icon').innerHTML=icon('search');renderSidebar();renderPatterns();updateSavedCount();renderTray();
