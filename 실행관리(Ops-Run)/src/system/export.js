(() => {
  const { systemRegistry: registry, parts } = window.Pattove;
  let fontsRequest;
  function loadFonts() {
    if (window.Pattove.systemFonts) return Promise.resolve(window.Pattove.systemFonts);
    if (!fontsRequest) fontsRequest = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let settled = false;
      const fail = () => {
        if (settled) return;
        settled = true; clearTimeout(timer); fontsRequest = null; script.remove();
        reject(new Error('글꼴 파일을 불러오지 못했어요. 다시 시도해 주세요.'));
      };
      const timer = setTimeout(fail, 15000);
      script.src = 'src/data/system-fonts.js';
      script.onload = () => {
        if (settled) return;
        if (!window.Pattove.systemFonts?.Pretendard?.data) { fail(); return; }
        settled = true; clearTimeout(timer); resolve(window.Pattove.systemFonts);
      };
      script.onerror = fail;
      document.head.append(script);
    });
    return fontsRequest;
  }
  function tokenCSS(element) {
    const style = getComputedStyle(element);
    const names = [...window.Pattove.systemSource.shared.matchAll(/(--ds-[\w-]+)\s*:/g)].map(match => match[1]);
    return `.ds[data-style="${CSS.escape(element.dataset.style)}"] {\n` + [...new Set(names)].map(name => `  ${name}: ${style.getPropertyValue(name).trim()};`).join('\n') + '\n}';
  }
  let exportInstance = 0;
  function namespaceMarkup(markup) {
    const prefix = 'pattove-' + Date.now().toString(36) + '-' + (++exportInstance);
    const template = document.createElement('template'); template.innerHTML = markup;
    const ids = new Map([...template.content.querySelectorAll('[id]')].map(n => [n.id, prefix + '-' + n.id]));
    template.content.querySelectorAll('*').forEach(node => {
      if (node.id) node.id = ids.get(node.id);
      for (const attr of ['for','aria-controls','aria-labelledby','aria-describedby']) if (node.hasAttribute(attr)) node.setAttribute(attr, node.getAttribute(attr).split(/\s+/).map(id => ids.get(id) || id).join(' '));
      if (node.matches('input[type="radio"][name]')) node.name = prefix + '-' + node.name;
    });
    return template.innerHTML;
  }
  function componentCSS(id) {
    const items = [registry.index.get(id), ...registry.dependencies(id)];
    const selected = new Set(['shared', ...items.flatMap(item => item.css).filter(name => name !== 'tokens' || id === 'tokens')]);
    for (const name of selected) if (!window.Pattove.systemSource[name]) throw new Error('필요한 CSS가 없어요: ' + name);
    return Object.entries(window.Pattove.systemSource).filter(([name]) => selected.has(name)).map(([,css]) => css).join('\n\n');
  }
  function download(name, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement('a'); link.href = url; link.download = name;
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function html(state, element, markup) {
    const item = registry.index.get(state.detail);
    const dependencies = registry.dependencies(item.id);
    const css = componentCSS(item.id) + '\n' + tokenCSS(element);
    const background = getComputedStyle(element).getPropertyValue('--ds-bg').trim();
    const content = namespaceMarkup(markup);
    const fonts = await loadFonts();
    const fontNames = item.id === 'tokens' ? ['Pretendard','Outfit'] : ['Pretendard'];
    const fontCSS = fontNames.map(name => `/* ${fonts[name].license.replaceAll('*/', '* /')} */\n@font-face { font-family: ${name}; font-style: normal; font-weight: 100 900; font-display: swap; src: url(data:font/woff2;base64,${fonts[name].data}) format('woff2'); }`).join('\n');
    const behavior = [item,...dependencies].some(i => i.behavior) ? `<script>(${window.Pattove.mountParts.toString()})(document);<\/script>` : '';
    const manifest = { id: item.id, style: state.style, version: item.version, styleVersion: registry.version, sourceRevision: window.Pattove.systemSourceRevision, lifecycle: item.lifecycle, environment: 'HTML', options: state.options || {}, dependencies: dependencies.map(i => ({ id: i.id, version: i.version })) };
    return `<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${parts.esc(item.name)}</title><style>\n${fontCSS}\nbody { margin: 0; padding: 24px; background: ${background}; }\n${css}\n</style></head><body>\n${content}\n<script type="application/json" data-pattove-manifest>${JSON.stringify(manifest)}<\/script>\n${behavior}\n</body></html>`;
  }
  async function save(state) {
    const snapshot = { ...state, options: { ...state.options } };
    const root = document.querySelector('.system-inspector');
    const button = document.querySelector('[data-system-download]');
    const status = root.querySelector('.export-status');
    button.disabled = true; status.textContent = '파일을 준비하고 있어요…';
    try {
      if (snapshot.detail === 'icon') {
        const icon = root.querySelector('[data-part-option="icon"]').value;
        const svg = root.querySelector('.part-demo svg').cloneNode(true);
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.removeAttribute('class'); svg.removeAttribute('aria-hidden');
        download('pattove-' + icon + '.svg', svg.outerHTML, 'image/svg+xml');
      } else {
        const content = await html(snapshot, root.querySelector('.part-demo > .ds'), root.querySelector('#part-source').value);
        download(`pattove-${snapshot.style}-${snapshot.detail}.html`, content, 'text/html;charset=utf-8');
      }
      status.textContent = '파일을 준비했어요.';
    } catch (error) { status.textContent = error.message || '파일을 만들지 못했어요. 다시 시도해 주세요.'; }
    finally { button.disabled = false; }
  }
  async function copy() {
    const source = document.querySelector('#part-source');
    const status = document.querySelector('.export-status');
    try { await navigator.clipboard.writeText(namespaceMarkup(source.value)); status.textContent = '마크업을 복사했어요.'; }
    catch { const disclosure=source.closest('details'); if(disclosure) disclosure.open=true; source.focus(); source.select(); status.textContent = '선택된 마크업을 Ctrl+C로 복사해 주세요.'; }
  }
  window.Pattove.systemExport = { save, copy, html, tokenCSS, componentCSS, namespaceMarkup };
})();
