/* 메인 프런트엔드 스타일 하나를 구축한다. 이전 9개 스타일은 배포하지 않는다. */
window.Pattove = window.Pattove || {};
window.Pattove.catalog = Object.freeze({
  categories: [
    { id: 'all', name: '전체' },
    { id: 'navigate', name: '이동' },
    { id: 'input', name: '입력' },
    { id: 'browse', name: '탐색' },
    { id: 'feedback', name: '피드백' },
    { id: 'recover', name: '복구' }
  ],
  styles: [
    { id: 'main', name: '메인 스타일', description: '둥근 표면, 명확한 행동', origin: '사용자 제공 레퍼런스 4장 · 2026-09-26',
      rules: '흰 바탕과 둥근 양각, 입력 영역의 음각을 사용합니다. 주요 행동은 짙은 색, 선택은 채움과 체크, 초점은 보라색 링으로 구분합니다. 유리 효과는 떠 있는 탐색 영역에만 적용하고 본문 표면은 불투명하게 유지합니다.',
      references: [],
      specification: '문서/메인 스타일 명세.md',
      suitability: '차분한 개인 도구·콘텐츠 보관함·설정 화면. 넓은 표나 긴 문서는 그림자 없는 표면으로 밀도를 조절합니다.',
      materials: ['flat','raised','inset','glass'],
      constraints: ['겹친 패널마다 그림자를 중첩하지 않음','정보와 입력의 대비를 그림자에 의존하지 않음','선택·초점·눌림·비활성 상태를 각각 구분','다른 배경에서도 글자를 읽을 수 있는 불투명 대체 표면 제공'] }
  ],
  // id는 화면 이동·저장에 쓰는 안정적인 키. entry는 사전 원문과 연결한다.
  patterns: [
    { id: 'toast', name: '잠깐 알림', english: 'Toast', category: 'feedback',
      keywords: '저장 완료 성공 알림 토스트', entry: 'STA-03' },
    { id: 'tabs', name: '탭', english: 'Tabs', category: 'navigate',
      keywords: '전환 메뉴 분류 이동', entry: 'NAV-06' },
    { id: 'dialog', name: '확인창', english: 'Confirmation dialog', category: 'recover',
      keywords: '삭제 결정 확인 취소', entry: 'ACT-08' },
    { id: 'progress', name: '진행률', english: 'Progress', category: 'feedback',
      keywords: '업로드 진행 대기 로딩', entry: 'STA-05' },
    { id: 'input', name: '입력 오류', english: 'Input validation', category: 'input',
      keywords: '입력 이메일 오류 검증', entry: 'INP-47' },
    { id: 'empty', name: '빈 상태', english: 'Empty state', category: 'recover',
      keywords: '비어 없음 시작', entry: 'STA-06' },
    { id: 'search', name: '검색·필터', english: 'Search and filter', category: 'browse',
      keywords: '검색 찾기 항목 목록', entry: 'DAT-01' },
    { id: 'accordion', name: '아코디언', english: 'Accordion', category: 'browse',
      keywords: '접기 펼치기 질문 목록', entry: 'EDT-13' },
    { id: 'pagination', name: '페이지 나누기', english: 'Pagination', category: 'browse',
      keywords: '페이지 목록 다음 이전', entry: 'NAV-10' },
    { id: 'banner', name: '인라인 안내', english: 'Inline alert', category: 'feedback',
      keywords: '안내 저장 완료 권한 배너 알림', entry: 'STA-02' },
    { id: 'drawer', name: '서랍 메뉴', english: 'Navigation drawer', category: 'navigate',
      keywords: '메뉴 이동 사이드바', entry: 'NAV-42' },
    { id: 'steps', name: '단계별 입력', english: 'Stepper', category: 'input',
      keywords: '단계 진행 폼 입력 순서', entry: 'INP-19' }
  ]
});
