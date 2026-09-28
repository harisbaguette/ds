/* Self-contained so the exact same behavior can travel with an exported HTML file. */
window.Pattove.mountParts = function mountParts(root) {
  root.querySelectorAll('[data-indeterminate]').forEach(input => {
    if (!input.__pattoveInitialized) { input.indeterminate = true; input.__pattoveInitialized = true; }
  });
  if (root.__pattovePartsMounted) return;
  root.__pattovePartsMounted = true;
  function selectTab(tab) {
    const tabs = tab.closest('.ds-tabs');
    tabs.querySelectorAll('[role="tab"]').forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
      tabs.querySelector('#' + CSS.escape(item.getAttribute('aria-controls'))).hidden = !active;
    });
    tabs.dispatchEvent(new CustomEvent('pattove:tabchange', { bubbles: true, detail: { label: tab.textContent.trim(), panel: tab.getAttribute('aria-controls') } }));
  }
  function filter(form) {
    const module = form.closest('.ds-search-module');
    const query = form.elements.query.value.trim().toLocaleLowerCase();
    // The picker look has no status menu, so it always searches every status.
    const status = form.elements.status?.value ?? 'all';
    let count = 0;
    module.querySelectorAll('[data-result]').forEach(item => {
      const match = query.split(/\s+/).every(term => item.dataset.result.toLocaleLowerCase().includes(term)) && (status === 'all' || item.dataset.resultStatus === status);
      item.hidden = !match; if (match) count++;
    });
    module.querySelector('.ds-result-count').textContent = count + '개의 컬렉션';
    module.querySelector('.ds-empty').hidden = count > 0;
    module.querySelector('.ds-demo-note').textContent = '';
  }
  root.addEventListener('submit', event => {
    if (!event.target.matches('[data-part-search]')) return;
    event.preventDefault(); filter(event.target);
  });
  // The picker look filters as the person types; the other looks wait for the search button.
  root.addEventListener('input', event => {
    if (event.target.matches('[data-part-search][data-live] [name="query"]')) filter(event.target.form);
  });
  root.addEventListener('change', event => {
    // The status filter is a select, or a radio chip group in the chips look.
    if (event.target.matches('[data-part-search] [name="status"]')) filter(event.target.form);
  });
  root.addEventListener('click', event => {
    const tab = event.target.closest('.ds-tab');
    if (tab) selectTab(tab);
    const button = event.target.closest('[data-part-action]');
    if (!button || button.disabled) return;
    const action = button.dataset.partAction;
    if (['open-record', 'close-record', 'save-record'].includes(action)) {
      const module = button.closest('.ds-search-module');
      const detail = module.querySelector('.ds-record-detail');
      if (action === 'save-record') {
        button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
        module.__recordOpener.dataset.saved = button.getAttribute('aria-pressed');
        module.__recordOpener.setAttribute('aria-label', module.querySelector('.ds-record-detail h3').textContent + (button.getAttribute('aria-pressed') === 'true' ? ', 보관됨, 상세 열기' : ', 상세 열기'));
        module.querySelector('.ds-demo-note').textContent = button.getAttribute('aria-pressed') === 'true' ? '이 화면에서 컬렉션에 보관했어요.' : '보관을 해제했어요.';
        const record = module.__recordOpener.closest('[data-result]');
        module.dispatchEvent(new CustomEvent('pattove:save', { bubbles: true, detail: {
          id: record.dataset.recordId,
          title: detail.querySelector('h3').textContent,
          description: detail.querySelector('p').textContent,
          tag: record.dataset.resultStatus,
          saved: button.getAttribute('aria-pressed') === 'true'
        } }));
        return;
      }
      const open = action === 'open-record';
      if (open) {
        module.__recordOpener = button;
        const card = button.closest('.ds-card');
        detail.querySelector('h3').textContent = card.querySelector('h3').textContent;
        detail.querySelector('p').textContent = card.querySelector('.ds-card-body > p').textContent;
        detail.querySelector('[data-part-action="save-record"]').setAttribute('aria-pressed', button.dataset.saved || 'false');
      }
      module.querySelectorAll(':scope > form, :scope > .ds-result-count, :scope > .ds-results').forEach(element => { element.hidden = open; });
      detail.hidden = !open;
      module.querySelector('.ds-demo-note').textContent = '';
      if (open) detail.focus(); else module.__recordOpener?.focus();
    } else if (action === 'clear-input') {
      const input = button.closest('.ds-input-group').querySelector('input');
      input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); input.focus();
    } else if (action === 'step') {
      const input = button.closest('.ds-input-group').querySelector('input');
      input.value = String(Math.max(Number(input.min || 0), (Number(input.value) || 0) + Number(button.dataset.step)));
      input.dispatchEvent(new Event('input', { bubbles: true }));
    } else if (action === 'undo') {
      // Undo closes the notice and hands focus back to the action that raised it.
      const example = button.closest('.ds-feedback-example');
      example.querySelector('[data-part-feedback]').hidden = true;
      example.querySelector('[data-part-action="notify"]')?.focus();
      button.dispatchEvent(new CustomEvent('pattove:undo', { bubbles: true }));
    } else if (action === 'notify') {
      button.closest('.ds-feedback-example').querySelector('[data-part-feedback]').hidden = false;
    } else if (action === 'nav') {
      const items = [...button.closest('nav').querySelectorAll(':scope > [data-part-action="nav"]')];
      items.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      button.dispatchEvent(new CustomEvent('pattove:navigate', { bubbles: true, detail: { index: items.indexOf(button), label: button.textContent.trim() } }));
    } else if (action === 'create') {
      button.dispatchEvent(new CustomEvent('pattove:create', { bubbles: true }));
    } else if (action === 'select-card') {
      const card = button.closest('.ds-card');
      const selected = card.dataset.selected !== 'true';
      card.dataset.selected = String(selected);
      button.setAttribute('aria-pressed', String(selected));
      button.lastChild.textContent = selected ? '선택됨' : '선택하기';
      card.dispatchEvent(new CustomEvent('pattove:select', { bubbles: true, detail: { selected, title: card.querySelector('h3').textContent } }));
    } else if (action === 'reset-search') {
      const form = button.closest('.ds-search-module').querySelector('form');
      form.reset(); filter(form); form.elements.query.focus();
    } else if (action === 'press') {
      button.dispatchEvent(new CustomEvent('pattove:action', { bubbles: true, detail: { label: button.getAttribute('aria-label') || button.textContent.trim() } }));
      const region = button.closest('.ds-search-module, .part-demo, .specimen') || root;
      const output = region.querySelector('.ds-demo-note');
      if (output) {
        const card = button.closest('.ds-card');
        output.textContent = card ? card.querySelector('h3').textContent + ' 선택됨' : (button.getAttribute('aria-label') || button.textContent.trim()) + ' 버튼을 눌렀어요.';
      }
    }
  });
  root.addEventListener('keydown', event => {
    const tab = event.target.closest('.ds-tab');
    if (!tab) return;
    const list = tab.closest('[role="tablist"]');
    // A vertical tab list moves with the up and down arrows, a horizontal one with left and right.
    const [back, forward] = list.getAttribute('aria-orientation') === 'vertical' ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight'];
    if (![back, forward, 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const tabs = [...list.querySelectorAll('.ds-tab')];
    const current = tabs.indexOf(tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (current + (event.key === forward ? 1 : -1) + tabs.length) % tabs.length;
    selectTab(tabs[next]); tabs[next].focus();
  });
};
