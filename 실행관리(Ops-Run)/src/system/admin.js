/* Pattove HTML adapter. Table pipeline adapted from shadcn-admin e16c87f (MIT).
   Sorting, filtering and pagination use TanStack Table 8.21.3. No React runtime is required. */
(() => {
  const P = window.Pattove ||= {};
  const e = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const statuses = [{ value: 'draft', label: '초안' }, { value: 'published', label: '발행' }, { value: 'archived', label: '보관' }];
  const records = [
    { id: 'guide', title: '처음 시작하는 디자인 가이드', owner: '김하나', status: 'published', description: '처음 만드는 화면의 기본 기준' },
    { id: 'icons', title: '아이콘 사용 원칙', owner: '이도윤', status: 'draft', description: '이름과 그림이 함께 전달하는 의미' },
    { id: 'type', title: '긴 한글 제목과 작은 화면에서도 읽기 편한 타이포그래피', owner: '박서연', status: 'draft', description: '한글 문장과 줄바꿈' },
    { id: 'color', title: '색과 상태', owner: '김하나', status: 'published', description: '색만으로 상태를 구분하지 않기' },
    { id: 'forms', title: '입력과 오류 복구', owner: '이도윤', status: 'archived', description: '저장 실패 후 입력 보존' },
    { id: 'mobile', title: '모바일 탐색', owner: '박서연', status: 'draft', description: '좁은 화면의 탐색 순서' },
  ];
  function validateRecords(list) {
    if (!Array.isArray(list)) throw new Error('자료 목록은 배열이어야 합니다.');
    const ids = new Set();
    for (const record of list) {
      if (!record || typeof record.id !== 'string' || !record.id || ids.has(record.id) || typeof record.title !== 'string' || typeof record.status !== 'string') throw new Error('자료의 고유 ID·제목·상태를 확인해 주세요.');
      ids.add(record.id);
    }
    return list;
  }
  const savedRecord = (result, draft, statuses) => {
    const saved = result === undefined ? draft : result;
    if (!saved || saved.id !== draft.id || typeof saved.title !== 'string' || !saved.title.trim() || !statuses.some(s => s.value === saved.status)) throw new Error('저장 응답을 확인할 수 없습니다. 다시 시도해 주세요.');
    return { ...draft, ...saved };
  };
  const config = options => ({ records, statuses, titleLabel: '제목', ownerLabel: '담당자', searchLabel: '자료 검색', title: '자료 관리', ...options });
  const button = (text, attrs = '', variant = 'outline') => `<button type="button" class="ds-button" data-variant="${variant}" ${attrs}>${e(text)}</button>`;
  const optionsHTML = list => list.map(s => `<option value="${e(s.value)}">${e(s.label)}</option>`).join('');
  function renderEditor(prefix = 'admin-editor') {
    return `<dialog class="ds-record-editor" data-admin-editor aria-labelledby="${e(prefix)}-title"><form novalidate><h2 id="${e(prefix)}-title">상세 · 편집</h2><p class="ds-record-id"></p><fieldset>
      <div class="ds-field"><label for="${e(prefix)}-name" data-editor-title-label>제목</label><input class="ds-input" id="${e(prefix)}-name" name="title" required maxlength="240" aria-describedby="${e(prefix)}-error"><p class="ds-help" id="${e(prefix)}-error" data-title-error></p></div>
      <div class="ds-field"><label for="${e(prefix)}-status">상태</label><select class="ds-input" id="${e(prefix)}-status" name="status">${optionsHTML(statuses)}</select></div>
      <div class="ds-field"><label for="${e(prefix)}-owner" data-editor-owner-label>담당자</label><input class="ds-input" id="${e(prefix)}-owner" name="owner" maxlength="120"></div>
      <div class="ds-field"><label for="${e(prefix)}-description">설명</label><textarea class="ds-input" id="${e(prefix)}-description" name="description" rows="4" maxlength="4000"></textarea></div>
      </fieldset><p role="alert" class="ds-admin-error"></p><p role="status" data-discard-message></p><div class="ds-editor-actions">${button('취소', 'data-editor-cancel', 'ghost')}<button class="ds-button" data-variant="primary" type="submit">저장</button></div></form></dialog>`;
  }
  function renderTable(prefix = 'admin-table', options = {}) {
    const c = config(options); validateRecords(c.records);
    return `<section class="ds-data-table" data-admin-table data-admin-config="${e(JSON.stringify(c))}" aria-label="${e(c.titleLabel)} 목록">
      <div data-table-request hidden><p role="status" data-table-loading hidden>자료를 불러오는 중입니다.</p><p role="alert" class="ds-admin-error" data-table-error></p>${button('다시 불러오기', 'data-table-retry hidden')}</div><div class="ds-table-content" data-table-content>
      <div class="ds-table-toolbar" data-admin-enhanced hidden><div class="ds-field"><label for="${e(prefix)}-query">${e(c.searchLabel)}</label><input class="ds-input" type="search" id="${e(prefix)}-query" data-table-query></div><div class="ds-field"><label for="${e(prefix)}-filter">상태</label><select class="ds-input" id="${e(prefix)}-filter" data-table-filter><option value="">전체 상태</option>${optionsHTML(c.statuses)}</select></div>${button('조건 초기화', 'data-table-reset hidden', 'ghost')}${button('새로고침', 'data-table-reload hidden', 'ghost')}</div>
      <div class="ds-table-scroll" tabindex="0" role="region" aria-label="표 가로 스크롤"><table><caption class="ds-sr-only">${e(c.titleLabel)} 목록</caption><thead><tr><th scope="col" data-admin-enhanced hidden><label class="ds-choice"><input type="checkbox" data-table-all aria-label="현재 쪽 모두 선택"><span></span></label></th>${[['title', c.titleLabel], ['status', '상태'], ['owner', c.ownerLabel]].map(([key, label]) => `<th scope="col" data-sort-column="${key}"><span data-admin-static>${e(label)}</span>${button(label + ' ↕', `data-table-sort="${key}" data-admin-enhanced hidden`, 'ghost')}</th>`).join('')}</tr></thead><tbody>${c.records.map(r => `<tr><td>${e(r.title)}</td><td>${e(c.statuses.find(s => s.value === r.status)?.label ?? r.status)}</td><td>${e(r.owner)}</td></tr>`).join('')}</tbody></table></div>
      <p role="status" class="ds-table-selection" data-table-selection data-admin-enhanced hidden></p><nav class="ds-table-pagination" aria-label="표 페이지" data-admin-enhanced hidden><span role="status" data-table-count></span><label>쪽당 <select class="ds-input" data-table-size>${[5, 10, 20].map(n => `<option value="${n}">${n}개</option>`).join('')}</select></label>${button('이전', 'data-table-previous')}${button('다음', 'data-table-next')}</nav></div></section>`;
  }
  function renderShell(prefix = 'admin', options = {}) {
    const c = config(options);
    return `<section class="ds-admin-shell">${c.navigation?.length ? `<nav aria-label="관리 메뉴">${c.navigation.map(n => `<a href="${e(n.href)}"${n.current ? ' aria-current="page"' : ''}>${e(n.label)}</a>`).join('')}</nav>` : ''}<div class="ds-admin-content"><header><h2>${e(c.title)}</h2>${c.notice ? `<p data-admin-notice>${e(c.notice)}</p>` : ''}</header>${c.body || ''}</div></section>`;
  }
  function renderPage(prefix = 'admin', options = {}) {
    const c = config(options);
    return `<div class="ds-admin-page" data-admin-page>${renderShell(prefix, { ...c, notice: '예제 · 변경사항은 이 화면에서만 유지됩니다.', body: renderTable(prefix, c) + '<p role="status" class="ds-admin-message"></p>' + renderEditor(prefix + '-editor') })}</div>`;
  }
  function mountEditor(host, c, onSaved) {
    if (host.__adminEditor) return host.__adminEditor;
    const dialog = host.matches?.('[data-admin-editor]') ? host : host.querySelector('[data-admin-editor]');
    if (!dialog) throw new Error('편집 대화상자가 없습니다.');
    let adapter = {}, editing = null, trigger = null, pending = false, discard = false;
    const message = host.querySelector('.ds-admin-message');
    function open(record, source) {
      if (editing || pending) return;
      validateRecords([record]);
      editing = { ...record }; trigger = source || document.activeElement; discard = false;
      const form = dialog.querySelector('form'); form.elements.status.innerHTML = optionsHTML(c.statuses);
      for (const name of ['title', 'status', 'owner', 'description']) form.elements[name].value = record[name] ?? '';
      dialog.querySelector('[data-editor-title-label]').textContent = c.titleLabel; dialog.querySelector('[data-editor-owner-label]').textContent = c.ownerLabel;
      dialog.querySelector('.ds-record-id').textContent = record.id; dialog.querySelector('.ds-admin-error').textContent = ''; dialog.querySelector('[data-title-error]').textContent = ''; dialog.querySelector('[data-discard-message]').textContent = ''; dialog.querySelector('[data-editor-cancel]').textContent = '취소'; form.elements.title.removeAttribute('aria-invalid'); form.querySelector('[type="submit"]').textContent = '저장';
      if (message) message.textContent = ''; dialog.showModal();
    }
    function close(force = false, confirmDiscard = false) {
      if (!editing || (pending && !force)) return;
      const form = dialog.querySelector('form');
      const dirty = ['title', 'status', 'owner', 'description'].some(k => form.elements[k].value !== String(editing[k] ?? ''));
      if (!force && dirty && !(discard && confirmDiscard)) { discard = true; dialog.querySelector('[data-discard-message]').textContent = '저장하지 않은 변경사항이 있습니다.'; dialog.querySelector('[data-editor-cancel]').textContent = '변경 버리고 닫기'; return; }
      dialog.close(); const replacement = host.querySelector(`[data-record-edit="${CSS.escape(String(editing.id))}"]`); (trigger?.isConnected ? trigger : replacement || host.querySelector('[data-table-query], [data-editor-open]'))?.focus(); editing = null; adapter.onClose?.();
    }
    if (dialog) {
      const form = dialog.querySelector('form'), submit = form.querySelector('[type="submit"]'), cancel = dialog.querySelector('[data-editor-cancel]');
      dialog.addEventListener('cancel', ev => { ev.preventDefault(); close(); }); cancel.addEventListener('click', () => close(false, true));
      form.addEventListener('input', () => { discard = false; cancel.textContent = '취소'; dialog.querySelector('[data-discard-message]').textContent = ''; dialog.querySelector('.ds-admin-error').textContent = ''; dialog.querySelector('[data-title-error]').textContent = ''; form.elements.title.removeAttribute('aria-invalid'); });
      form.addEventListener('submit', async ev => {
        ev.preventDefault(); if (pending) return;
        const values = Object.fromEntries(new FormData(form));
        if (!values.title.trim()) { dialog.querySelector('[data-title-error]').textContent = `${c.titleLabel}을 입력해 주세요.`; form.elements.title.setAttribute('aria-invalid', 'true'); form.elements.title.focus(); return; }
        if (!c.statuses.some(s => s.value === values.status)) { dialog.querySelector('.ds-admin-error').textContent = '상태를 선택해 주세요.'; return; }
        if (!adapter.onSave && !onSaved) { dialog.querySelector('.ds-admin-error').textContent = '저장 연결이 없습니다. 입력한 내용은 유지됩니다.'; return; }
        const draft = { ...editing, ...values, title: values.title.trim() };
        pending = true; form.querySelector('fieldset').disabled = true; submit.disabled = true; submit.setAttribute('aria-busy', 'true'); submit.textContent = '저장 중'; cancel.disabled = true; dialog.querySelector('.ds-admin-error').textContent = '';
        try {
          const saved = savedRecord(adapter.onSave ? await adapter.onSave(draft) : draft, draft, c.statuses);
          if (!host.isConnected) return;
          onSaved?.(saved);
          if (message) message.textContent = `${saved.title} 저장됨`; close(true);
          host.dispatchEvent(new CustomEvent('pattove:admin-saved', { bubbles: true, detail: saved }));
        } catch (err) { dialog.querySelector('.ds-admin-error').textContent = err instanceof Error ? err.message : '저장하지 못했습니다. 다시 시도해 주세요.'; }
        finally { pending = false; form.querySelector('fieldset').disabled = false; submit.disabled = false; submit.removeAttribute('aria-busy'); submit.textContent = dialog.querySelector('.ds-admin-error').textContent ? '다시 저장' : '저장'; cancel.disabled = false; }
      });
    }
    return host.__adminEditor = { open, isOpen: () => !!editing, isPending: () => pending, connect(next) { adapter = { ...adapter, ...next }; } };
  }
  function mountTable(node) {
    if (node.__adminTable || !window.TableCore) return;
    const c = config(JSON.parse(node.dataset.adminConfig)); validateRecords(c.records);
    const T = window.TableCore;
    let state = {}, data = c.records, adapter = {}, request = null, requestId = 0;
    const host = node.closest('[data-admin-page]') || node, dialog = host.querySelector('[data-admin-editor]');
    const table = T.createTable({ data, columns: ['title', 'status', 'owner'].map(accessorKey => ({ accessorKey, filterFn: 'equalsString' })), getRowId: row => String(row.id),
      state, onStateChange: updater => { state = typeof updater === 'function' ? updater(state) : updater; table.setOptions(o => ({ ...o, state })); refresh(); },
      getCoreRowModel: T.getCoreRowModel(), getFilteredRowModel: T.getFilteredRowModel(), getSortedRowModel: T.getSortedRowModel(), getPaginationRowModel: T.getPaginationRowModel(),
      globalFilterFn: (row, _id, value) => [row.original.id, row.original.title, row.original.owner].some(v => String(v ?? '').toLocaleLowerCase().includes(String(value).trim().toLocaleLowerCase())),
      enableRowSelection: true, autoResetPageIndex: false, renderFallbackValue: '',
    });
    state = { ...table.initialState, pagination: { pageIndex: 0, pageSize: 5 } }; table.setOptions(o => ({ ...o, state }));
    node.querySelectorAll('[data-admin-enhanced]').forEach(n => n.hidden = false);
    node.querySelectorAll('[data-admin-static]').forEach(n => n.hidden = true);
    const query = node.querySelector('[data-table-query]'), filter = node.querySelector('[data-table-filter]');
    const notifySelection = () => adapter.onSelectionChange?.(table.getSelectedRowModel().rows.map(r => r.original));
    const resetPage = () => { table.setPageIndex(0); table.resetRowSelection(); notifySelection(); };
    function refresh() {
      const maxPage = Math.max(0, table.getPageCount() - 1);
      if (state.pagination.pageIndex > maxPage) { state = { ...state, pagination: { ...state.pagination, pageIndex: maxPage } }; table.setOptions(o => ({ ...o, state })); }
      const rows = table.getRowModel().rows;
      node.querySelector('tbody').innerHTML = rows.length ? rows.map(row => {
        const r = row.original;
        return `<tr data-selected="${row.getIsSelected()}"><td><label class="ds-choice"><input type="checkbox" data-table-select="${e(row.id)}" aria-label="${e(r.title)} 선택"${row.getIsSelected() ? ' checked' : ''}><span></span></label></td><td>${dialog || adapter.onEdit ? button(r.title, `data-record-edit="${e(row.id)}"`, 'ghost') : e(r.title)}</td><td>${e(c.statuses.find(s => s.value === r.status)?.label ?? r.status)}</td><td>${e(r.owner)}</td></tr>`;
      }).join('') : `<tr><td colspan="4"><div class="ds-table-empty">조건에 맞는 자료가 없습니다.${button('전체 보기', 'data-table-reset')}</div></td></tr>`;
      const all = node.querySelector('[data-table-all]'); all.checked = table.getIsAllPageRowsSelected(); all.indeterminate = table.getIsSomePageRowsSelected(); all.disabled = !rows.length;
      for (const th of node.querySelectorAll('[data-sort-column]')) { const direction = table.getColumn(th.dataset.sortColumn).getIsSorted(); th.setAttribute('aria-sort', direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none'); const b = th.querySelector('button'); b.textContent = ({ title: c.titleLabel, status: '상태', owner: c.ownerLabel }[th.dataset.sortColumn]) + (direction === 'asc' ? ' ↑' : direction === 'desc' ? ' ↓' : ' ↕'); }
      const count = table.getFilteredRowModel().rows.length;
      node.querySelector('[data-table-count]').textContent = `${count}개 · ${count ? state.pagination.pageIndex + 1 : 0} / ${table.getPageCount()}쪽`;
      node.querySelector('[data-table-selection]').textContent = `${table.getFilteredSelectedRowModel().rows.length}개 선택`;
      node.querySelector('[data-table-previous]').disabled = !table.getCanPreviousPage(); node.querySelector('[data-table-next]').disabled = !table.getCanNextPage();
      node.querySelector('.ds-table-toolbar [data-table-reset]').hidden = !state.globalFilter && !state.columnFilters.length;
    }
    const editor = dialog ? mountEditor(host, c, saved => { data = data.map(r => String(r.id) === String(saved.id) ? { ...r, ...saved } : r); table.setOptions(o => ({ ...o, data })); refresh(); notifySelection(); }) : null;
    const reset = () => { query.value = ''; filter.value = ''; table.setGlobalFilter(''); table.resetColumnFilters(); resetPage(); query.focus(); };
    node.addEventListener('input', ev => { if (ev.target === query) { table.setGlobalFilter(query.value); resetPage(); } });
    node.addEventListener('change', ev => {
      const target = ev.target;
      if (target === filter) { table.getColumn('status').setFilterValue(filter.value); resetPage(); }
      if (target.matches('[data-table-size]')) table.setPageSize(Number(target.value));
      if (target.matches('[data-table-all]')) { table.toggleAllPageRowsSelected(target.checked); notifySelection(); }
      if (target.matches('[data-table-select]')) { const id = target.dataset.tableSelect; table.getRow(id).toggleSelected(target.checked); notifySelection(); node.querySelector(`[data-table-select="${CSS.escape(id)}"]`)?.focus(); }
    });
    node.addEventListener('click', ev => {
      const b = ev.target.closest('button'); if (!b) return;
      if (b.matches('[data-table-retry],[data-table-reload]')) reload(true);
      if (b.matches('[data-table-reset]')) reset();
      if (b.matches('[data-table-previous]')) table.previousPage();
      if (b.matches('[data-table-next]')) table.nextPage();
      if (b.matches('[data-table-sort]')) { table.getColumn(b.dataset.tableSort).toggleSorting(); resetPage(); }
      if (b.matches('[data-record-edit]')) { const r = table.getRow(b.dataset.recordEdit).original; if (adapter.onEdit) adapter.onEdit(r); else editor?.open(r, b); }
    });
    const setRequestState = (loading, error = '') => {
      node.setAttribute('aria-busy', String(loading));
      node.querySelector('[data-table-request]').hidden = !loading && !error;
      node.querySelector('[data-table-loading]').hidden = !loading;
      node.querySelector('[data-table-error]').textContent = error;
      node.querySelector('[data-table-retry]').hidden = !error;
      node.querySelector('[data-table-content]').hidden = loading || !!error;
    };
    const replaceRecords = next => {
      if (editor?.isOpen()) throw new Error('편집을 마친 뒤 자료를 다시 불러와 주세요.');
      validateRecords(next);
      const liveIds = new Set(next.map(r => r.id));
      state = { ...state, rowSelection: Object.fromEntries(Object.entries(state.rowSelection).filter(([id]) => liveIds.has(id))) };
      data = next; table.setOptions(o => ({ ...o, data, state })); refresh(); notifySelection();
    };
    async function reload(focusAfter = false) {
      if (!adapter.loadRecords || editor?.isOpen()) return false;
      request?.abort(); request = new AbortController(); const ownRequest = ++requestId;
      const restoreFocus = focusAfter || node.contains(document.activeElement);
      setRequestState(true);
      try {
        const next = await adapter.loadRecords({ signal: request.signal });
        if (ownRequest !== requestId || !node.isConnected) return false;
        replaceRecords(next); setRequestState(false);
        if (restoreFocus) query.focus();
        return true;
      } catch (error) {
        if (ownRequest !== requestId || !node.isConnected) return false;
        setRequestState(false, error instanceof Error ? error.message : '자료를 불러오지 못했습니다. 다시 시도해 주세요.');
        if (restoreFocus) node.querySelector('[data-table-retry]').focus();
        return false;
      }
    }
    node.__adminTable = {
      table, reload,
      connect(next) {
        const previousLoad = adapter.loadRecords;
        adapter = { ...adapter, ...next }; editor?.connect(next);
        const notice = host.querySelector('[data-admin-notice]'); if (notice) notice.hidden = !!adapter.onSave;
        node.querySelector('[data-table-reload]').hidden = !adapter.loadRecords;
        refresh();
        if (adapter.loadRecords && adapter.loadRecords !== previousLoad) reload();
        else if (!adapter.loadRecords && previousLoad) { request?.abort(); requestId++; setRequestState(false); }
      },
      replaceRecords(next) {
        replaceRecords(next); request?.abort(); requestId++; setRequestState(false);
      },
    };
    refresh();
  }
  function mount(root) {
    [...(root.matches?.('[data-admin-editor-demo]') ? [root] : []), ...root.querySelectorAll('[data-admin-editor-demo]')].forEach(host => {
      if (host.__adminEditor) return;
      let record = { ...records[0] };
      const editor = mountEditor(host, config({}), saved => { record = saved; });
      host.querySelector('[data-editor-open]').addEventListener('click', ev => editor.open(record, ev.currentTarget));
    });
    if (root.matches?.('[data-admin-table]')) mountTable(root);
    root.querySelectorAll('[data-admin-table]').forEach(mountTable);
  }
  function connectEditor(root, options = {}) {
    const editor = mountEditor(root, config(options)); editor.connect(options); return editor;
  }
  function connect(root, adapter) { mount(root); if (root.matches('[data-admin-editor-demo]')) { root.__adminEditor.connect(adapter); return root.__adminEditor; } if (root.matches('[data-admin-editor]') || (!root.querySelector('[data-admin-table]') && root.querySelector('[data-admin-editor]'))) return connectEditor(root, adapter); const table = root.matches('[data-admin-table]') ? root : root.querySelector('[data-admin-table]'); if (!table?.__adminTable) throw new Error('TanStack Table과 관리 화면을 먼저 로드하세요.'); table.__adminTable.connect(adapter); return table.__adminTable; }
  P.admin = { records, statuses, renderTable, renderEditor, renderShell, renderPage, renderEditorDemo: prefix => `<div data-admin-editor-demo>${button('편집 열기', 'data-editor-open')}<p class="ds-admin-message" role="status"></p>${renderEditor(prefix)}</div>`, mount, connect, connectEditor };
  if (typeof document !== 'undefined') { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => mount(document)); else mount(document); }
})();
