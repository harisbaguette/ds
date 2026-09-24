/* 화면 구조 검토용 예시. 전체 사전 레코드와 상세 본문은 확정 후 연결한다. */
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
    { id: 'base', name: '기본' },
    { id: 'ink', name: '선화' },
    { id: 'block', name: '컬러블록' },
    { id: 'landscape', name: '풍경' }
  ],
  // id는 화면 이동·저장에 쓰는 안정적인 키. content가 null이면 빈 본문 자리를 표시한다.
  patterns: [
    { id: 'toast', name: '잠깐 알림', english: 'Toast', category: 'feedback',
      keywords: '저장 완료 성공 알림 토스트', content: null },
    { id: 'tabs', name: '탭', english: 'Tabs', category: 'navigate',
      keywords: '전환 메뉴 분류 이동', content: null },
    { id: 'dialog', name: '확인창', english: 'Confirmation dialog', category: 'recover',
      keywords: '삭제 결정 확인 취소', content: null },
    { id: 'progress', name: '진행률', english: 'Progress', category: 'feedback',
      keywords: '업로드 진행 대기 로딩', content: null },
    { id: 'input', name: '입력 오류', english: 'Input validation', category: 'input',
      keywords: '입력 이메일 오류 검증', content: null },
    { id: 'empty', name: '빈 상태', english: 'Empty state', category: 'recover',
      keywords: '비어 없음 시작', content: null },
    { id: 'search', name: '검색·필터', english: 'Search and filter', category: 'browse',
      keywords: '검색 찾기 항목 목록', content: null },
    { id: 'accordion', name: '아코디언', english: 'Accordion', category: 'browse',
      keywords: '접기 펼치기 질문 목록', content: null },
    { id: 'pagination', name: '페이지 나누기', english: 'Pagination', category: 'browse',
      keywords: '페이지 목록 다음 이전', content: null },
    { id: 'banner', name: '인라인 안내', english: 'Inline alert', category: 'feedback',
      keywords: '안내 저장 완료 권한 배너 알림', content: null },
    { id: 'drawer', name: '서랍 메뉴', english: 'Navigation drawer', category: 'navigate',
      keywords: '메뉴 이동 사이드바', content: null },
    { id: 'steps', name: '단계별 입력', english: 'Stepper', category: 'input',
      keywords: '단계 진행 폼 입력 순서', content: null }
  ]
});
