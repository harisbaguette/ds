(() => {
  const { parts: p, systemRegistry: r } = window.Pattove;
  const e = p.esc;
  // The part page is for looking only: the live picture with its switches, the variants side by side, and the parts it leans on.
  // Getting a part into a project happens through the registry files and commands, never on this screen.
  const wide = id => ['search-module','template','page'].includes(id);
  const url = (id, extras = {}) => '#/system?' + new URLSearchParams({ detail:id, ...extras });
  function examples(id) {
    if (id === 'button') return [['채움',{variant:'primary'}],['윤곽',{variant:'outline'}],['글자',{variant:'ghost'}],['작게',{size:'sm'}],['크게',{size:'lg'}],['아이콘과 함께',{icon:'search'}],['아이콘만',{icon:'search',iconOnly:'true'}],['로딩',{state:'loading'}],['사용 불가',{state:'disabled'}]];
    const item = r.index.get(id);
    const control = item.controls.find(c=>['state','tone','variant','type'].includes(c.key));
    return control ? control.values.map(([value,label])=>[label,{[control.key]:value}]) : [];
  }
  function page(state) {
    const item = r.index.get(state.detail);
    const options = r.normalizeOptions(item.id, state.options);
    const index = r.items.indexOf(item);
    const adjacent = [[r.items[index-1],'이전','prev'],[r.items[index+1],'다음','next']].filter(([i])=>i).map(([i,label,rel])=>`<a href="${url(i.id)}" rel="${rel}" aria-label="${label}: ${i.name}">${label} · ${e(i.name)} ${p.icon('arrow')}</a>`).join('');
    const variants = examples(item.id);
    const sections = [['preview','미리보기'],...(variants.length?[['examples','예시']]:[]),...(item.deps.length?[['dependencies','함께 쓰는 부품']]:[])];
    return `<article class="component-page" data-component="${item.id}" aria-labelledby="detail-title"><header class="component-heading"><h2 id="detail-title" tabindex="-1">${e(item.name)}</h2><p>${e(item.purpose)}</p></header><div class="component-layout"><div class="system-inspector component-content"><section id="component-preview" aria-label="미리보기"><div class="part-demo" data-wide="${wide(item.id)}"><div class="ds theme-main" data-style="main">${p.renderItem(item.id,'component-live',options)}</div><p class="ds-demo-note" role="status"></p></div>${item.controls.length?`<div class="inspector-options">${item.controls.map(c=>`<label>${e(c.label)}<select data-part-option="${c.key}" data-focus="option-${c.key}">${c.values.map(([value,label])=>`<option value="${value}"${options[c.key]===value?' selected':''}>${e(label)}</option>`).join('')}</select></label>`).join('')}</div>`:''}</section>${variants.length?`<section id="component-examples" class="component-section"><h3>예시</h3><div class="component-examples">${variants.map(([label,provided],i)=>`<section class="component-example"><h4>${e(label)}</h4><div class="ds theme-main" data-style="main">${p.renderItem(item.id,'variant-'+i,r.normalizeOptions(item.id,provided))}</div></section>`).join('')}</div></section>`:''}${item.deps.length?`<section id="component-dependencies" class="component-section"><h3>함께 쓰는 부품</h3><div class="part-dependencies">${item.deps.map(id=>`<a href="${url(id)}">${e(r.index.get(id).name)} ${p.icon('arrow')}</a>`).join('')}</div></section>`:''}<footer class="component-pagination">${adjacent}</footer></div><nav class="component-toc" aria-label="이 페이지에서">${sections.map(([id,label])=>`<a href="${url(item.id,{section:id})}" data-doc-section="${id}">${label}</a>`).join('')}</nav></div></article>`;
  }
  window.Pattove.componentDocs = { page, url };
})();
