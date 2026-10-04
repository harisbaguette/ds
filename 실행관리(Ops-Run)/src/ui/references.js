(() => {
  const { library, catalog, systemRegistry: registry, parts } = window.Pattove;
  const esc = parts.esc;
  const entries = new Map([...library.entries, ...library.components].map(item => [item.id, item]));
  const implementations = new Map(registry.items.filter(item => item.entry).map(item => [item.entry, item]));
  const glyphs = new Map(library.glyphs.map(([id, name]) => [id, { id, name, shelf: 'icon', kind: '세트 그림', glyph: [id], ...(library.glyphIllustrations?.[id] && { art: library.glyphIllustrations[id] }) }]));
  const styles = new Map(catalog.styles.map(style => [style.id, style]));
  const shapeID = (item, value) => `${item.id}/${item.gallery.key}/${value}`;
  const shapes = new Map(registry.items.flatMap(item => (item.gallery?.list || []).map(shape => [shapeID(item, shape.id), { item, shape }])));
  const route = (page, params) => '#/' + page + '?' + new URLSearchParams(params);
  const absolute = href => new URL(href, location.href).href;
  function resolve(id) {
    if (id.startsWith('motion/')) {
      const item = window.Pattove.motionUI?.index.get(id.slice(7));
      if (item) return { type:'motion', item };
    }
    if (shapes.has(id)) return { type: 'implementation', ...shapes.get(id) };
    const item = registry.index.get(id) || implementations.get(id);
    if (item) return { type: 'implementation', item };
    if (id.startsWith('style/') && styles.has(id.slice(6))) return { type: 'style', item: styles.get(id.slice(6)) };
    if (id.startsWith('pattern/')) {
      const pattern = catalog.patterns.find(item => item.id === id.slice(8));
      if (pattern) return { type: 'pattern', item: pattern };
    }
    const entry = entries.get(id) || glyphs.get(id);
    return entry ? { type: 'dictionary', item: entry } : null;
  }
  function payload(id, state = {}) {
    const ref = resolve(id);
    if (!ref) throw new Error('알 수 없는 고유 ID: ' + id);
    const { item, shape, type } = ref;
    if (type === 'motion') return { ...window.Pattove.motionUI.payload(item,['html','react','next'].includes(state.copyTarget)?state.copyTarget:undefined), url:absolute('#/motion?detail=' + item.id) };
    const style = styles.get(type === 'style' ? item.id : state.preview || state.style || 'main');
    const result = {
      system: 'Pattove', systemVersion: registry.version, sourceRoot: '실행관리(Ops-Run)', id,
      name: shape ? `${item.name} · ${shape.name}` : item.name,
      style: { id: style.id, name: style.name, source: style.specification, rules: style.rules }
    };
    if (type === 'implementation') {
      const options = registry.normalizeOptions(item.id, shape ? { [item.gallery.key]: shape.id } : state.page === 'system' && state.detail === item.id ? state.options : {});
      const selected = item.gallery?.list.find(v => v.id === options[item.gallery.key]);
      const source = {
        renderer: item.source, css: 'src/system/parts.css', behaviors: 'src/system/behaviors.js',
        ...(item.provenance && {admin:'src/system/admin.js', tableRuntime:'src/system/vendor/table-core.min.js', provenance:item.provenance}), react: item.reactSource, tokens: 'src/tokens/semantic/',
        registry: item.layer === 'Token' ? [`src/registry/r/pattove-${style.id}-${item.id}.json`]
          : item.id === 'icon' ? ['html', 'react'].map(env => `src/registry/r/pattove-icon-${options.icon}-${env}.json`)
          : ['html', 'react'].map(env => `src/registry/r/pattove-${style.id}-${item.id}-${env}.json`)
      };
      Object.assign(result, {
        elementId: item.id, dictionaryId: item.entry || null, status: 'implemented',
        purpose: item.purpose, options,
        ...(selected && { shape: { id: shapeID(item, selected.id), name: selected.name, prop: item.gallery.key, value: selected.id }, reactProps: { [item.gallery.key]: selected.id } }),
        source, dependencies: registry.dependencies(item.id).map(dep => dep.id),
        compatibility: item.compatibility,
        url: absolute(route('system', { detail: item.id, preview: style.id, ...Object.fromEntries(Object.entries(options).map(([key, value]) => ['option-' + key, value])) })),
        rootAttributes: { class: 'ds', 'data-style': style.id },
        html: parts.renderItem(item.id, 'pattove-' + item.id, options),
        instructions: '지정한 요소·모양·스타일을 그대로 사용하세요. source의 기존 소스와 토큰을 먼저 읽고 재사용하세요. HTML 예시는 CSS와 필요한 동작 파일을 함께 연결하고, React는 지정한 소스의 API와 reactProps를 사용하세요. 문구·데이터·이벤트는 작업에 맞게 연결하고 여러 인스턴스의 DOM id는 각각 다르게 만드세요. 소스에 접근할 수 없으면 해당 파일을 요청하세요.'
      });
    } else if (type === 'style') {
      Object.assign(result, { status: 'implemented', source: item.specification, constraints: item.constraints, url: absolute(route('styles', { detail: item.id })), instructions: '이 스타일의 명세와 기존 토큰을 읽고 지정한 표현 규칙을 적용하세요.' });
    } else if (type === 'pattern') {
      Object.assign(result, { status: 'preview-only', dictionaryId: item.entry, source: 'src/ui/previews.js', url: absolute(route('patterns', { style: style.id, detail: item.id })), instructions: '이 항목은 패턴 미리보기입니다. 연결된 사전과 실제 구현을 확인한 뒤 사용하세요.' });
    } else {
      const chapter = library.categories.find(category => category.id === item.category);
      const referenceGlyph = glyphs.has(item.id);
      const guideline = item.kind === '기준';
      Object.assign(result, {
        status: item.art ? 'asset-ready' : guideline ? 'guideline' : 'not-implemented',
        term: item.term, kind: item.kind, purpose: item.usage || item.examples,
        source: chapter?.source || (glyphs.has(item.id) ? '문서/아이콘 그림 분류.json' : '문서/구성요소 계층표.md'),
        ...(item.art && { assets: { webp: item.art.src, png: item.art.png },
          api: { metadata:absolute('/api/illustrations/get?id='+encodeURIComponent(item.id)), search:absolute('/api/illustrations/search?q=') },
          exportCommand: 'npm run icons -- export --id '+item.id+' --out ./pattove-icons',
          mcp: { server:'pattove-illustrations', tools:['search_illustrations','preview_illustration','export_illustrations'] } }),
        ...(item.glyph && { referenceGlyphs: item.glyph }),
        url: absolute(route(item.shelf ? 'dictionary' : 'components', { ...(item.shelf && { shelf: item.shelf }), detail: item.id })),
        instructions: item.art ? 'assets의 완성된 이미지 파일을 그대로 사용하세요. referenceGlyphs는 참고 그림이며 완성 자산을 대신하지 않습니다.' : referenceGlyph ? '이 아이콘의 일러스트는 아직 제작 중입니다. referenceGlyphs는 참고용이며 SVG로 대신하지 마세요.' : guideline ? '이 항목은 디자인 사용 기준입니다. purpose와 source의 규칙을 적용하세요.' : '아직 구현되지 않은 사전 항목입니다. 기존 완성 부품처럼 사용하지 말고, 위 정의와 원문을 확인해 구현이 필요하다고 알려 주세요.'
      });
    }
    const motionExamples = (window.Pattove.motionData?.items || []).filter(example => example.dictionaryRefs?.includes(item.id));
    if (motionExamples.length) {
      result.motionExamples = motionExamples.map(example => ({id:'motion/' + example.id, name:example.name, url:absolute('#/motion?detail=' + example.id)}));
      result.instructions += ' motionExamples에서 연결된 실행 예제를 열고 사용 환경에 맞는 코드와 의존성을 함께 가져올 수 있습니다.';
    }
    return result;
  }
  const text = (id, state) => '아래 패토브 요소를 사용해 주세요. 고유 ID와 지정한 모양·스타일을 기준으로 적용하세요.\n\n' + JSON.stringify(payload(id, state), null, 2);
  const label = id => `<code class="element-id" title="고유 ID: ${esc(id)}">${esc(id)}</code>`;
  const copyIcon = window.Pattove.uiIcon('copy', 'reference-icon reference-icon-copy');
  const checkIcon = window.Pattove.uiIcon('check', 'reference-icon reference-icon-check');
  const copyName = id => { const ref = resolve(id); return ref ? [ref.item.name, ref.shape?.name.replace(/\s*\([^)]*\)\s*$/, '')].filter(Boolean).join(' · ') : id; };
  const control = (id, compact = false) => `<div class="element-reference${compact ? ' reference-compact' : ' ds-surface'}"><div class="reference-identity${compact ? ' sr-only' : ''}"><div class="reference-caption"><span class="reference-kind">${shapes.has(id) ? '모양 ID' : '요소 ID'}</span></div>${label(id)}</div><span class="reference-status sr-only" role="status" aria-live="polite"></span><button type="button" class="reference-copy ds-button" data-variant="outline" data-size="sm" data-copy-reference="${esc(id)}" data-focus="copy-${esc(id)}" aria-label="${esc(copyName(id))} AI용 정보 복사" title="${esc(copyName(id))} · AI에 전달할 모양·스타일·소스 정보 복사">${copyIcon}${checkIcon}<span class="reference-copy-label" aria-hidden="true"><span>복사</span><span>복사됨</span></span></button></div>`;
  const feedbackTimers = new WeakMap();
  async function copyValue(value,button) {
    if(button.getAttribute('aria-busy')==='true')return;
    button.setAttribute('aria-busy','true');
    const status=button.parentElement.querySelector('[role="status"]');
    clearTimeout(feedbackTimers.get(button));button.removeAttribute('data-copied');if(status)status.textContent='';
    try {
      await navigator.clipboard.writeText(value);
      if(!button.isConnected)return;
      const id=button.dataset.recentId||button.closest('[data-component]')?.dataset.component;
      if(id && /^var\(--p-[\w-]+\)$|^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value))window.Pattove.searchUI?.remember(id,{},value);
      clearTimeout(feedbackTimers.get(button));button.setAttribute('data-copied','');
      if(status)status.textContent='복사됨';
      feedbackTimers.set(button,setTimeout(()=>{button.removeAttribute('data-copied');if(status)status.textContent='';},2200));
    } catch {
      if(!button.isConnected)return;
      const dialog=document.getElementById('reference-dialog'),textarea=dialog.querySelector('textarea');
      textarea.value=value;
      dialog.addEventListener('close',()=>{if(button.isConnected)button.focus({preventScroll:true});},{once:true});
      if(!dialog.open)dialog.showModal();textarea.focus();textarea.select();
    } finally {button.removeAttribute('aria-busy');}
  }
  async function copy(button, state) {
    if (button.getAttribute('aria-disabled') === 'true') return;
    if(button.dataset.copyOptions) {
      const ref=resolve(button.dataset.copyReference);
      try {if(ref?.type==='implementation')state={...state,page:'system',detail:ref.item.id,options:JSON.parse(button.dataset.copyOptions)};} catch {}
    }
    const value = text(button.dataset.copyReference, state);
    const panel = button.parentElement, status = panel.querySelector('.reference-status');
    clearTimeout(feedbackTimers.get(panel));
    panel.removeAttribute('data-copied');
    status.textContent = '';
    // Native disabled blurs a focused button. Keep focus while blocking repeated writes.
    button.setAttribute('aria-disabled', 'true');
    button.setAttribute('aria-busy', 'true');
    try {
      await navigator.clipboard.writeText(value);
      if(!button.isConnected)return;
      window.Pattove.searchUI?.remember(button.dataset.copyReference,state);
      status.textContent = '복사됨';
      panel.setAttribute('data-copied', '');
      feedbackTimers.set(panel, setTimeout(() => { panel.removeAttribute('data-copied'); status.textContent = ''; }, 2400));
    } catch {
      if(!button.isConnected)return;
      const dialog = document.getElementById('reference-dialog'), textarea = dialog.querySelector('textarea');
      textarea.value = value;
      dialog.addEventListener('close', () => { if (button.isConnected) button.focus({ preventScroll: true }); }, { once: true });
      dialog.showModal();
      textarea.focus();
      textarea.select();
      status.textContent = '';
    } finally {
      button.removeAttribute('aria-disabled');
      button.removeAttribute('aria-busy');
    }
  }
  window.Pattove.references = { shapeID, resolve, payload, text, label, control, copy, copyValue };
})();
