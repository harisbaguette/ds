(() => {
  const icon = name => window.Pattove.iconMarkup[name] || '';
  let instance = 0;
  // Pattern examples compose the exported parts. Only the scene layout belongs to previews.css.
  function preview(id, style = 'main', large = false) {
    const p = window.Pattove.parts, prefix = `pattern-${id}-${++instance}`;
    const button = options => p.button({ action: '', ...options });
    const panel = body => `<div class="sample-panel ds-surface">${body}</div>`;
    const scenes = {
      toast: () => p.toast({ text: '변경사항을 저장했어요.' }),
      tabs: () => p.tabs(prefix),
      dialog: () => panel(`<h3>컬렉션을 삭제할까요?</h3><p class="ds-help">이 작업은 되돌릴 수 없습니다.</p><div class="ds-confirm-row">${button({ label: '취소', variant: 'ghost' })}${button({ label: '삭제' })}</div>`),
      progress: () => panel(p.progressBar({ value: 68, label: '파일 업로드' }) + '<p class="ds-help">brand-assets.zip · 24.8 MB</p>'),
      input: () => p.field({ id: prefix + '-email', label: '이메일', type: 'email', value: 'hello@', state: 'error', help: '이메일 주소를 확인해 주세요.' }),
      empty: () => panel(`<h3>아직 비어 있어요</h3>${button({ label: '새 컬렉션', iconName: 'plus' })}`),
      search: () => p.searchBar(prefix),
      accordion: () => panel('<details open><summary>수정할 수 있나요?</summary><p class="ds-help">설정에서 언제든 변경할 수 있어요.</p></details>' + p.divider() + '<details><summary>어디에 보관되나요?</summary><p class="ds-help">내 컬렉션에서 찾을 수 있어요.</p></details>'),
      pagination: () => `<div class="sample-pagination">${[1, 2, 3].map(n => button({ label: String(n), size: 'sm', variant: n === 2 ? 'primary' : 'outline' })).join('')}${button({ label: '다음', iconName: 'chevron', iconOnly: true, size: 'sm', variant: 'outline' })}</div>`,
      banner: () => p.notice('읽기 전용 문서입니다.') + button({ label: '권한 요청', variant: 'outline' }),
      drawer: () => panel(`<h3>Workspace</h3><div class="sample-menu">${['프로젝트', '컬렉션', '저장'].map((name, i) => `<span class="ds-tab"${i === 0 ? ' aria-current="page"' : ''}>${name}</span>`).join('')}</div>`),
      steps: () => panel(p.stepBar({ step: 2, steps: 3, label: '프로젝트 만들기' }) + '<p class="ds-help">기본 정보 → 상세 입력 → 완료</p>')
    };
    const scene = (scenes[id] || scenes.empty)();
    return `<div class="preview preview-${p.esc(id)} ds theme-${p.esc(style)}${large ? ' preview-large' : ''}" inert aria-hidden="true"><div class="sample" data-preview-scene data-preview-fit="both">${scene}</div></div>`;
  }
  window.Pattove.previews = { preview, icon };
})();
