(() => {
  const icon = name => window.Pattove.iconMarkup[name] || '';
  const check = `<span class="status-check">${icon('check')}</span>`;
  const arrow = icon('arrow');
  // 목록 예시는 읽을 수 있는 최소 장면. 사전 상세 본문과 실제 데모는 후속 범위다.
  const surfaces = {
    toast: `<div class="sample-toast">${check}<div class="toast-copy"><b><span class="wide-label">변경사항 </span>저장됨</b>
      <span class="sample-muted">방금 · 내 컬렉션</span></div><span class="sample-dismiss">${icon('close')}</span></div>`,
    tabs: `<div class="sample-panel tab-panel"><div class="sample-top"><b>프로젝트</b><span>+</span></div>
      <div class="sample-tabs"><b>전체 <i>3</i></b><span>진행 중</span><span>완료</span></div>
      <div class="sample-row"><i class="mini-tile">${icon('file')}</i><span>브랜드 리뉴얼</span>${icon('chevron')}</div>
      <div class="sample-row"><i class="mini-tile">${icon('folder')}</i><span>웹사이트 디자인</span>${icon('chevron')}</div>
      <div class="sample-row extra-row"><i class="mini-tile">${icon('bookmark')}</i><span>마케팅 자료</span>${icon('chevron')}</div></div>`,
    dialog: `<div class="sample-panel sample-confirm"><span class="dialog-symbol">${icon('warning')}</span>
      <b><span class="wide-label">컬렉션을 </span>삭제할까요?</b><p class="sample-muted">이 작업은 되돌릴 수 없습니다.</p>
      <div class="sample-actions"><span>취소</span><strong>삭제</strong></div></div>`,
    progress: `<div class="sample-panel upload-panel"><div class="upload-title"><b>파일 업로드</b>${icon('upload')}</div>
      <div class="upload-meter"><strong>68<span>%</span></strong><span class="sample-muted">잠시만 기다려 주세요</span></div>
      <div class="sample-progress"><i></i></div><div class="sample-row upload-caption"><span>brand-assets.zip</span><span>24.8 MB</span></div></div>`,
    input: `<div class="sample-form"><b>이메일</b><div class="sample-field"><span>hello@</span>${icon('info')}</div>
      <span class="sample-error">이메일 주소를 확인해 주세요.</span></div>`,
    empty: `<div class="sample-empty"><img class="empty-art" src="assets/illustrations/empty-box.svg" width="88" height="82" alt="">
      <b>아직 비어 있어요</b><strong class="sample-action">+ 새 컬렉션</strong></div>`,
    search: `<div class="sample-panel search-panel"><div class="sample-row search-query">${icon('search')}<b>프로젝트</b><i class="text-caret"></i></div>
      <div class="sample-option">${icon('layers')}<span>브랜드 프로젝트</span>${arrow}</div>
      <div class="sample-row">${icon('folder')}<span>웹 프로젝트</span></div>
      <div class="sample-row extra-row">${icon('bookmark')}<span>개인 프로젝트</span></div></div>`,
    accordion: `<div class="sample-panel accordion-panel"><div class="sample-row"><b>수정할 수 있나요?</b><span>−</span></div>
      <p class="sample-muted">설정에서 언제든 변경할 수 있어요.</p>
      <div class="sample-row separated"><b>어디에 보관되나요?</b><span>+</span></div></div>`,
    pagination: '<div class="sample-pagination"><span>‹</span><span>1</span><b>2</b><span>3</span><span>…</span><span>8</span><span>›</span></div>',
    banner: `<div class="sample-panel banner-panel"><div class="sample-row">${icon('info')}<b>읽기 전용 문서</b></div>
      <p class="sample-muted">편집하려면 권한이 필요합니다.</p><span class="sample-link">권한 요청 ${arrow}</span></div>`,
    drawer: `<div class="sample-drawer"><div><b><i class="workspace-symbol">p.</i>Workspace</b><span class="active">${icon('grid')}프로젝트</span>
      <span>${icon('folder')}컬렉션</span><span>${icon('bookmark')}저장</span></div><div class="drawer-background"><i></i><i></i></div></div>`,
    steps: `<div class="sample-panel steps-panel"><div class="sample-top"><b>프로젝트 만들기</b><span>2 / 3</span></div><div class="sample-steps"><b>✓</b><i></i><b>2</b><i></i><span>3</span></div>
      <div class="sample-step-labels"><span>기본 정보</span><span>상세 입력</span><span>완료</span></div></div>`
  };
  function preview(id, style = 'main', large = false) {
    let surface = surfaces[id] || surfaces.empty;
    return `<div class="preview preview-${id} theme-${style}${large ? ' preview-large' : ''}" aria-hidden="true">
      <div class="sample">${surface}</div></div>`;
  }
  window.Pattove.previews = { preview, icon };
})();
