(() => {
  const e = window.Pattove.parts.esc;
  const cache = new Map();
  const base = () => location.protocol.startsWith('http') ? new URL('src/registry/r/', location.href.split('#')[0]).href : window.Pattove.distribution.base + '/';
  const nameFor = (id, style, environment, icon = 'search') => id === 'icon' ? `pattove-icon-${icon}-${environment}` : id === 'tokens' ? `pattove-${style}-tokens` : `pattove-${style}-${id}-${environment}`;
  async function get(name) {
    const url = base() + name + '.json';
    if (!cache.has(url)) cache.set(url, fetch(url).then(response => { if (!response.ok) throw Error('소스를 가져오지 못했어요.'); return response.json(); }).catch(error => { cache.delete(url); throw error; }));
    return cache.get(url);
  }
  function markup(id, style, icon, environment = 'html') {
    return `<section class="install-panel" data-install-item="${e(id)}" data-install-style="${e(style)}" data-install-icon="${e(icon || 'search')}"><header><h3>프로젝트에 가져오기</h3><label><span class="sr-only">사용 환경</span><select data-install-env><option value="html"${environment==='html'?' selected':''}>HTML · CSS · JS</option><option value="react"${environment==='react'?' selected':''}>React · Next.js</option></select></label></header><div class="install-command"><code data-install-command></code><button type="button" data-install-copy aria-label="설치 명령 복사">복사</button></div><div class="install-actions"><button type="button" data-install-zip>소스 묶음 받기 ↓</button><details><summary>포함된 파일·소스</summary><label><span class="sr-only">소스 파일</span><select data-install-file></select></label><pre tabindex="0"><code data-install-source></code></pre></details></div><p data-install-status role="status"></p></section>`;
  }
  async function refresh(panel) {
    const name = nameFor(panel.dataset.installItem, panel.dataset.installStyle, panel.querySelector('[data-install-env]').value, panel.dataset.installIcon);
    panel.dataset.request = name;
    const command = `npx shadcn@${window.Pattove.distribution.cliVersion} add ${base()}${name}.json`;
    panel.querySelector('[data-install-command]').textContent = command;
    panel.querySelector('[data-install-source]').textContent = '';
    panel.querySelector('[data-install-file]').replaceChildren();
    try {
      const item = await get(name); if (panel.dataset.request !== name || !panel.isConnected) return;
      panel._item = item;
      const selector = panel.querySelector('[data-install-file]');
      item.files.forEach((file, i) => { const option = document.createElement('option'); option.value = i; option.textContent = file.path; selector.append(option); });
      const preferred = item.files.findIndex(file => file.path.includes('/examples/') && !file.path.endsWith('.md'));
      selector.value = String(Math.max(0, preferred));
      showSource(panel);
      panel.querySelector('[data-install-status]').textContent = '';
    } catch (error) { panel.querySelector('[data-install-status]').textContent = location.protocol === 'file:' ? '설치·ZIP은 패토브 실행.exe로 연 사이트에서 사용할 수 있어요. 단독 HTML은 여기서도 받을 수 있어요.' : error.message; }
  }
  function showSource(panel) { panel.querySelector('[data-install-source]').textContent = panel._item?.files[Number(panel.querySelector('[data-install-file]').value)]?.content || ''; }
  async function zip(panel, button) {
    button.disabled = true; const name = panel.dataset.request; const status = panel.querySelector('[data-install-status]');
    try {
      const files = {}; const visited = new Set();
      async function collect(id) { if (visited.has(id)) return; visited.add(id); const item = await get(id); for (const dep of item.registryDependencies || []) await collect(dep.split('/').pop().replace(/\.json$/, '')); for (const file of item.files) files[file.path] = window.PattoveZip.strToU8(file.content); }
      await collect(name);
      const blob = new Blob([window.PattoveZip.zipSync(files)], { type:'application/zip' }); const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = name + '.zip'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 10000);
      status.textContent = '예시·소스·필수 파일을 함께 받았어요.';
    } catch (error) { status.textContent = error.message; } finally { button.disabled = false; }
  }
  document.addEventListener('change', event => { const panel = event.target.closest('.install-panel'); if (!panel) return; if (event.target.matches('[data-install-env]')) refresh(panel); if (event.target.matches('[data-install-file]')) showSource(panel); });
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-install-copy],[data-install-zip]'); if (!button) return;
    const panel = button.closest('.install-panel');
    if (button.hasAttribute('data-install-zip')) return zip(panel,button);
    try { await navigator.clipboard.writeText(panel.querySelector('[data-install-command]').textContent); panel.querySelector('[data-install-status]').textContent = '설치 명령을 복사했어요.'; }
    catch { const selection = window.getSelection(); const range = document.createRange(); range.selectNodeContents(panel.querySelector('[data-install-command]')); selection.removeAllRanges(); selection.addRange(range); panel.querySelector('[data-install-status]').textContent = '선택한 명령을 복사해 주세요.'; }
  });
  function hydrate(root) { root.querySelectorAll('.install-panel').forEach(panel => { if (panel.dataset.ready) return; panel.dataset.ready = 'true'; refresh(panel); }); }
  window.Pattove.installUI = { markup, hydrate, refresh };
})();
