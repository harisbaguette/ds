(() => {
  const icon = name => window.Pattove.iconMarkup[name] || '';
  const check = `<span class="status-check">${icon('check')}</span>`;
  const cat = '<img class="cat-art" src="assets/illustrations/cat-resting-alpha.png" width="1536" height="1024" alt="">';
  const sea = '<img class="sea-art" src="assets/illustrations/seascape.svg" width="400" height="440" alt="">';
  const seaBanner = '<img class="sea-banner" src="assets/illustrations/seascape-banner.svg" width="400" height="140" alt="">';
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
  function preview(id, style = 'base', large = false) {
    let surface = surfaces[id] || surfaces.empty;
    if (id === 'empty' && ['base', 'ink'].includes(style)) surface = `<div class="sample-empty">${cat}<b>아직 비어 있어요</b><strong class="sample-action">+ 새 컬렉션</strong></div>`;
    return `<div class="preview preview-${id} theme-${style}${large ? ' preview-large' : ''}" aria-hidden="true">
      <div class="sample">${surface}</div></div>`;
  }
  const tasks = `<div class="style-example-foot"><div class="task-heading"><b>오늘 할 일</b><span>1 / 2</span></div>
    <div class="style-task"><i class="task-check"></i><span>브랜드 리뉴얼</span><small>25분</small></div>
    <div class="style-task done"><i class="task-check">✓</i><span>레퍼런스 정리</span><small>10분</small></div></div>`;
  function stylePreview(style, scene) {
    const ornament = style === 'ink' ? cat : style === 'landscape' ? sea : '';
    const scenes = {
      focus: `<div class="style-example-title"><b>집중</b><span>9월 23일</span></div>
        <div class="focus-hero">${ornament}<div class="style-durations"><b>25분</b><span>50분</span><span>90분</span></div>
          <div class="style-clock">25:00</div><div class="focus-subject">브랜드 리뉴얼</div>
          <div class="style-start"><span>시작</span>${arrow}</div></div>${tasks}`,
      input: `<div class="style-example-title"><b>새 컬렉션</b></div><div class="style-form-art">${style === 'landscape' ? seaBanner : ornament}</div>
        <div class="style-example-body"><span class="example-label">이름</span><div class="style-input-line">여름의 색</div>
          <span class="example-label">공개 범위</span><div class="style-radio"><span><i class="radio-dot selected"></i>나만 보기</span>
            <span><i class="radio-dot"></i>링크로 공유</span></div><div class="style-start"><span>만들기</span>${arrow}</div>
          <div class="style-form-result">${check}<span>컬렉션이 만들어졌어요.</span></div></div>`,
      feedback: `<div class="style-example-title"><b>컬렉션</b><span>2개</span></div><div class="style-example-body">
        <div class="style-collection"><strong>01</strong><b>여름의 색</b><span>12개</span></div>
        <div class="style-collection"><strong>02</strong><b>좋아하는 장면</b><span>8개</span></div>
        <div class="style-start"><span>저장</span>${arrow}</div><div class="sample-toast">${check}<b>변경사항 저장됨</b>
          <span class="sample-dismiss">${icon('close')}</span></div></div>`,
      components: `<div class="style-example-title"><b>컴포넌트</b></div>
        <div class="component-sheet"><section><span class="component-label">버튼</span><div class="component-actions"><span class="component-primary">계속하기 ${arrow}</span><span class="component-secondary">취소</span></div></section>
        <section><span class="component-label">입력</span><div class="component-field">컬렉션 이름<span class="input-cursor"></span></div><div class="component-field is-error">hello@${icon('info')}</div><small>이메일 주소를 확인해 주세요.</small></section>
        <section><span class="component-label">선택</span><div class="component-segments"><b>전체</b><span>진행 중</span><span>완료</span></div><div class="component-options"><span><i class="task-check">✓</i>알림 받기</span><i class="component-switch"></i><span class="component-badge">진행 중</span></div></section>
        <section><span class="component-label">피드백</span><div class="component-progress"><span></span></div><div class="sample-toast">${check}<b>저장 완료</b>${icon('close')}</div></section></div>`
    };
    return `<div class="style-example theme-${style} scene-${scene}" aria-hidden="true">${scenes[scene]}</div>`;
  }
  window.Pattove.previews = { preview, stylePreview, icon };
})();
