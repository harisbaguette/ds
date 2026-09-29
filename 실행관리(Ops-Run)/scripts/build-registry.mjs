import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { loadTokens, tokenFiles, kinds } from './tokens.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), content); };
const ctx = vm.createContext({ window: {} });
for (const file of ['src/data/catalog.js','src/ui/icons.js','src/system/registry.js','src/system/parts.js','src/system/behaviors.js','src/data/system-source.js','src/data/system-fonts.js']) vm.runInContext(read(file), ctx);
const { catalog, systemRegistry: registry, parts, systemSource: css, systemFonts: fonts, iconMarkup } = ctx.window.Pattove;
const { styleCSS, kindsIn } = loadTokens(root);
// Distributed base.css = default raw values (main style) of only the role kinds the shared rules read,
// then the shared rules. Same content for every item and style, so installs never fight over it.
const sharedKinds = kindsIn(css.shared, 'shared');
const baseCSS = styleCSS('main', sharedKinds, '.ds') + css.shared;
const base = (process.env.REGISTRY_URL || 'http://127.0.0.1:4173/src/registry/r').replace(/\/$/, '');
const cliVersion = JSON.parse(read('node_modules/shadcn/package.json')).version;
const sourceHash = crypto.createHash('sha256').update(['src/system/parts.css','src/system/parts.js','src/system/behaviors.js','src/styles/themes.css',...tokenFiles(),...fs.readdirSync(path.join(root,'src/system/react')).map(file=>'src/system/react/'+file)].map(read).join('\0')).digest('hex');
const file = (name, content) => ({ path: `design/${name}`, type: 'registry:file', target: `~/design/${name}`, content });
const items = [];
function emit(name, title, files, meta = {}, dependencies = []) {
  const item = { $schema: 'https://ui.shadcn.com/schema/registry-item.json', name, type: 'registry:item', title, description: meta.purpose ? `${title}. ${meta.purpose}. ${meta.keywords || ''}` : title, files, ...(dependencies.length ? { registryDependencies: dependencies } : {}), meta: { version: registry.version, lifecycle: 'Trial', ...meta }, docs: '설치한 design 폴더의 예시와 소스를 직접 수정해 사용하세요.' };
  items.push(item); write(`src/registry/r/${name}.json`, JSON.stringify(item, null, 2) + '\n'); return item;
}
let fontCSS = '';
for (const [name, font] of Object.entries(fonts)) fontCSS += `/* ${font.license.replace(/\*\//g,'* /')} */\n@font-face{font-family:${name};font-style:normal;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,${font.data}) format('woff2')}\n`;
emit('pattove-fonts', 'Pretendard · Outfit 및 라이선스', [file('fonts.css', fontCSS)]);
// The names each item's React file exports for its example. Items whose example also uses another part's file list it in exampleUses.
const componentNames = {
  button:'Button', 'icon-button':'IconButton', 'action-row':'ActionRow', 'confirm-row':'ConfirmRow', 'action-bar':'ActionBar', 'segmented-button':'SegmentedButton',
  input:'Input', 'clear-input':'ClearInput', 'unit-input':'UnitInput', stepper:'Stepper', 'password-input':'PasswordInput', field:'Field', 'date-range':'DateRange', 'inline-form':'InlineForm', 'search-bar':'SearchBar', 'search-form':'SearchForm',
  checkbox:'Checkbox', radio:'Radio', switch:'Switch', 'check-card':'CheckCard', 'radio-card':'RadioCard', 'filter-chip':'FilterChip', 'filter-chip-row':'FilterChipRow', 'check-list':'CheckList', 'radio-list':'RadioList', 'switch-list':'SwitchList', 'select-all-list':'SelectAllList',
  badge:'Badge', 'count-badge':'CountBadge', divider:'Divider', 'text-divider':'TextDivider', 'status-dot':'StatusDot', avatar:'Avatar', 'icon-label':'IconLabel',
  notice:'Notice', toast:'Toast', 'progress-bar':'ProgressBar', 'progress-ring':'ProgressRing', 'step-bar':'StepBar',
  card:'Card, CardBody, CardTitle, CardDescription, CardActions', 'list-card':'ListCard, CardBody, CardTitle, CardDescription, CardActions', 'media-card':'MediaCard, CardBody, CardTitle, CardDescription, CardActions',
  'result-grid':'ResultGrid', 'result-list':'ResultList', 'featured-results':'FeaturedResults', 'people-picker':'PeoplePicker', 'empty-state':'EmptyState', 'stat-row':'StatRow',
  tabs:'Tabs', 'bottom-nav':'BottomNav', template:'Template', page:'CollectionPage'
};
const exampleUses = { card:['button'], 'list-card':['button'], 'media-card':['button'] };
const records = '[{id:"spring",title:"봄의 색",description:"연한 초록과 따뜻한 노랑",tag:"진행 중"},{id:"weekend",title:"주말의 기록",description:"산책하며 모은 장면들",tag:"완료"}]';
const svg = d => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" className="ui-icon" width="20" height="20" aria-hidden="true"><path d="${d}" /></svg>`;
const bell = svg('M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20h4');
const cardInside = '<CardBody><CardTitle>브랜드 리뉴얼</CardTitle><CardDescription>색과 서체, 첫인상을 모아 둔 컬렉션</CardDescription></CardBody><CardActions><Button onClick={() => alert("선택했어요.")} variant="outline">선택하기</Button></CardActions>';
const jsxExamples = {
  button:'<Button onClick={() => alert("실행했어요.")}>계속하기</Button>', 'icon-button':`<IconButton label="검색" onClick={() => alert("검색해요.")}>${svg('m20 20-4-4M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14z')}</IconButton>`,
  'action-row':`<ActionRow label="보내기" count={3} onClick={() => alert("보냈어요.")} actions={[{label:"보관",icon:${svg('M7 4h10v16l-5-4-5 4z')}}]} />`,
  'confirm-row':'<ConfirmRow onConfirm={() => alert("삭제했어요.")} onCancel={() => alert("취소했어요.")} />', 'action-bar':'<ActionBar label="3개 담기" onClick={() => alert("담았어요.")} />',
  'segmented-button':'<SegmentedButton />',
  input:'<label>이름<Input name="name" placeholder="이름을 입력하세요" /></label>', 'clear-input':'<label>검색어<ClearInput defaultValue="봄의 색" /></label>', 'unit-input':'<label>금액<UnitInput defaultValue="12,000" /></label>', stepper:'<label>수량<Stepper /></label>', 'password-input':'<label>비밀번호<PasswordInput placeholder="8자 이상" /></label>',
  field:'<Field label="컬렉션 이름" name="name" help="나중에 바꿀 수 있어요." />', 'date-range':'<DateRange startProps={{defaultValue:"9월 1일"}} endProps={{defaultValue:"9월 30일"}} />', 'inline-form':'<InlineForm fields={[{label:"표시 이름",defaultValue:"하나"},{label:"지역",defaultValue:"서울"}]} />',
  'search-bar':'<SearchBar onSearch={value => alert(value.query)} />', 'search-form':'<SearchForm onSearch={value => alert(value.query)} />',
  checkbox:'<Checkbox name="share" defaultChecked>링크로 공유</Checkbox>', radio:'<fieldset><legend>공개 범위</legend><Radio name="visibility" value="private" defaultChecked>나만 보기</Radio><Radio name="visibility" value="shared">링크로 공유</Radio></fieldset>', switch:'<Switch name="notification" defaultChecked>알림 받기</Switch>',
  'check-card':'<CheckCard name="share" description="링크를 받은 사람만 볼 수 있어요" defaultChecked>링크로 공유</CheckCard>', 'radio-card':'<fieldset className="ds-radio-group"><legend>공개 범위</legend><RadioCard name="visibility" value="private" description="나만 열어 볼 수 있어요" defaultChecked>나만 보기</RadioCard><RadioCard name="visibility" value="shared" description="링크를 받은 사람도 볼 수 있어요">링크로 공유</RadioCard></fieldset>',
  'filter-chip':'<FilterChip name="topic" value="design" defaultChecked>디자인</FilterChip>', 'filter-chip-row':'<FilterChipRow name="example-status" />',
  'check-list':'<CheckList legend="받을 알림" items={[{value:"c",label:"댓글"},{value:"l",label:"좋아요"}]} value={["c"]} onChange={next => alert(next.join())} />', 'radio-list':'<RadioList legend="공개 범위" items={[{value:"me",label:"나만 보기"},{value:"link",label:"링크로 공유"}]} value="me" onValueChange={alert} />', 'switch-list':'<SwitchList legend="알림" items={[{name:"push",label:"알림 받기",checked:true},{name:"sound",label:"소리",checked:false}]} onChange={(name, on) => alert(name + " " + on)} />', 'select-all-list':'<SelectAllList items={[{value:"c",label:"댓글"},{value:"l",label:"좋아요"}]} value={["c"]} onChange={next => alert(next.join())} />',
  badge:'<Badge>진행 중</Badge>', 'count-badge':`<CountBadge count={3}>${bell}</CountBadge>`, divider:'<Divider />', 'text-divider':'<TextDivider>또는</TextDivider>', 'status-dot':'<StatusDot />', avatar:'<Avatar name="김하나" />', 'icon-label':`<IconLabel icon={${bell}}>알림</IconLabel>`,
  notice:'<Notice>변경사항을 저장했어요.</Notice>', toast:'<Toast onUndo={() => alert("되돌렸어요.")}>메일을 보관함으로 옮겼어요.</Toast>', 'progress-bar':'<ProgressBar value={68} />', 'progress-ring':'<ProgressRing value={68} />', 'step-bar':'<StepBar step={3} steps={5} label="가입 단계" />',
  card:`<Card>${cardInside}</Card>`, 'list-card':`<ListCard initial="봄">${cardInside}</ListCard>`, 'media-card':`<MediaCard>${cardInside}</MediaCard>`,
  'result-grid':`<ResultGrid records={${records}} onAction={item => alert(item.title)} />`, 'result-list':`<ResultList records={${records}} onAction={item => alert(item.title)} />`, 'featured-results':`<FeaturedResults records={${records}} onAction={item => alert(item.title)} />`,
  'people-picker':'<PeoplePicker people={[{id:"a",title:"김하나",description:"디자인팀",tag:"접속 중"},{id:"b",title:"이도윤",description:"개발팀",tag:"자리 비움"}]} onPick={person => alert(person.title)} />', 'empty-state':'<EmptyState onAction={() => alert("전체를 보여 줘요.")} />', 'stat-row':'<StatRow items={[["전체","3개"],["진행 중","2개"],["완료","1개"]]} />',
  tabs:'<Tabs />', 'bottom-nav':'<BottomNav current="#home" items={[{href:"#home",label:"홈"},{href:"#search",label:"탐색"},{href:"#saved",label:"저장"}]} />', template:'<Template title="나의 기록" count="1개"><p>본문이나 다른 블록을 이 자리에 넣습니다.</p></Template>', page:'<CollectionPage />'
};
const allReact = new Map();
for (const [id] of Object.entries(componentNames)) allReact.set(id, read(`src/system/react/${id}.jsx`));
function reactClosure(id, result = new Set()) {
  if (result.has(id)) return result; result.add(id);
  for (const match of allReact.get(id).matchAll(/from '\.\/([\w-]+)\.jsx'/g)) reactClosure(match[1], result);
  return result;
}
for (const [name, markup] of Object.entries(iconMarkup)) {
  const svg = read(`assets/icons/${name}.svg`);
  emit(`pattove-icon-${name}-html`, `${name} · SVG`, [file(`icons/${name}.svg`, svg)], { item:'icon', icon:name, environment:'html', source:`assets/icons/${name}.svg` });
  const jsx = svg.replace(/<svg[^>]*>/, '<svg {...props} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">');
  emit(`pattove-icon-${name}-react`, `${name} · React`, [file(`icons/${name}.jsx`, `import React from 'react';\nexport function Icon(props){return (${jsx.trim()});}\n`)], { item:'icon', icon:name, environment:'react', source:`assets/icons/${name}.svg` });
}
// A part's css/<block>.css carries only its rules; they read --p-* roles shipped by styles/<style>/<kind>.css.
const partCSS = block => css[block];
// Token kinds and icons ship as their own items, never inside a part's closure.
const standalone = id => id.startsWith('token-') || id === 'icon';
for (const style of catalog.styles.filter(s => s.id !== 'base')) {
  // One semantic file per token kind; an install gets only the kinds its CSS reads (a token item also gets the kinds its swatches read).
  const theme = kind => file(`styles/${style.id}/${kind}.css`, styleCSS(style.id, [kind]));
  for (const kind of kinds) {
    const id = 'token-' + kind, item = registry.index.get(id);
    emit(`pattove-${style.id}-${id}`, `${style.name} · ${item.name}`, [...kinds.filter(k => k === kind || kindsIn(partCSS(id), id).includes(k)).map(theme), file(`css/${id}.css`, partCSS(id)), file(`html/${id}.html`, parts.renderItem(id, `pattove-${id}`))], { item:id, dictionary:item.entry, purpose:item.purpose, keywords:item.keywords, style:style.id, source:`src/tokens/semantic/${kind}.css` }, kind === 'typography' ? [`${base}/pattove-fonts.json`] : []);
  }
  for (const item of registry.items.filter(i => !standalone(i.id))) for (const environment of ['html','react']) {
    const closure = environment === 'html' ? [...registry.dependencies(item.id).map(i => i.id), item.id].filter(id => !standalone(id)) : [...reactClosure(item.id)];
    if (environment === 'react') for (const id of exampleUses[item.id] || []) for (const dep of reactClosure(id)) if (!closure.includes(dep)) closure.push(dep);
    const blocks = [...new Set(closure.flatMap(id => registry.index.get(id).css))];
    const themeKinds = kinds.filter(kind => [sharedKinds, ...blocks.map(block => kindsIn(css[block], block))].some(list => list.includes(kind)));
    const files = [file('base.css', baseCSS), ...themeKinds.map(theme), ...(style.specification ? [file(`styles/${style.id}.md`, read(style.specification))] : []), ...blocks.map(block => file(`css/${block}.css`, partCSS(block)))];
    const styleImports = ['../../fonts.css','../../base.css',...themeKinds.map(kind => `../../styles/${style.id}/${kind}.css`),...blocks.map(block => `../../css/${block}.css`)];
    let example;
    if (environment === 'html') {
      for (const id of closure) files.push(file(`html/${id}.html`, parts.renderItem(id, `pattove-${id}`)));
      if(closure.includes('card')) {
        files.push(file('html/card/title.html',parts.cardTitle('바꿔 쓸 제목')),file('html/card/description.html',parts.cardDescription('바꿔 쓸 본문')),file('html/card/body.html',parts.cardBody(parts.cardTitle('바꿔 쓸 제목')+parts.cardDescription('바꿔 쓸 본문'))),file('html/card/actions.html',parts.cardActions(parts.button({label:'계속하기',action:''}))));
      }
      if(closure.includes('field')) files.push(file('html/field/label.html',parts.fieldLabel('custom-field','입력 이름')),file('html/field/description.html',parts.fieldDescription('custom-field-help','입력 안내 또는 오류')));
      const interactive = closure.some(id => registry.index.get(id).behavior || ['tabs','card'].includes(id));
      if (interactive) files.push(file('html/behaviors.js', `(${ctx.window.Pattove.mountParts.toString()})(document);\n`));
      const markup = parts.renderItem(item.id, 'pattove-example');
      example = file(`examples/${style.id}/${item.id}.html`, `<!doctype html>\n<html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${item.name} · ${style.name}</title>\n${styleImports.map(p => `<link rel="stylesheet" href="${p}">`).join('\n')}<style>body{margin:0;padding:clamp(16px,4vw,48px)}main{max-width:1080px;margin:auto}</style>\n<body class="ds" data-style="${style.id}"><main>${markup}</main>${interactive ? '<script src="../../html/behaviors.js"></script>' : ''}</body></html>\n`);
    } else {
      for (const id of closure) files.push(file(`react/${id}.jsx`, allReact.get(id)));
      const imports = [item.id, ...(exampleUses[item.id] || [])].map(id => `import { ${componentNames[id]} } from '../../react/${id}.jsx';`).join('\n');
      example = file(`examples/${style.id}/${item.id}.jsx`, `'use client';\nimport React from 'react';\n${imports}\n${styleImports.map(p => `import '${p}';`).join('\n')}\nexport default function Example(){return <main className="ds" data-style="${style.id}" style={{padding:32}}>${jsxExamples[item.id]}</main>;}\n`);
    }
    files.push(example);
    const manifest = { item:item.id, dictionary:item.entry || null, purpose:item.purpose, keywords:item.keywords, style:style.id, styleRules:style.rules, references:style.references, environment, version:registry.version, sourceRevision:sourceHash, sourceFiles: environment === 'react' ? closure.map(id => `src/system/react/${id}.jsx`) : ['src/system/parts.js','src/system/parts.css','src/system/behaviors.js'], files:files.map(f => ({ path:f.target, sha256:crypto.createHash('sha256').update(f.content).digest('hex') })), dependencies:closure.filter(id=>id!==item.id), tokens:themeKinds.map(kind=>`token-${kind}`), compatibility:item.compatibility };
    files.push(file(`manifests/${style.id}-${item.id}-${environment}.json`, JSON.stringify(manifest,null,2)));
    files.push(file(`examples/${style.id}/${item.id}-${environment}.md`, `# ${item.name} · ${style.name}\n\n${item.purpose}\n\n${environment === 'html' ? `같은 폴더의 ${item.id}.html을 브라우저에서 엽니다. html/${item.id}.html 조각을 다른 페이지에 넣을 때 예시의 CSS와 필요한 behaviors.js를 연결하세요. 아이디와 라벨 연결은 인스턴스마다 다르게 유지합니다.` : `React 프로젝트에서 ${item.id}.jsx의 Example을 import합니다. Next.js App Router에서도 클라이언트 경계를 포함한 이 예시를 import할 수 있습니다. 개별 react/ 부품은 children·props·콜백으로 조합합니다. React 런타임은 대상 프로젝트가 제공합니다.`}\n\n${item.compatibility}\n\n상태: Trial. 웹 브라우저용입니다. 인쇄·네이티브 앱은 미검증입니다. 로컬에서 수정한 소스는 갱신 전에 diff로 확인하세요.\n`));
    emit(`pattove-${style.id}-${item.id}-${environment}`, `${style.name} · ${item.name} · ${environment}`, files, { ...manifest, files:undefined }, [`${base}/pattove-fonts.json`]);
  }
}
write('src/registry/registry.json', JSON.stringify({ $schema:'https://ui.shadcn.com/schema/registry.json', name:'pattove', homepage:base.replace(/\/src\/registry\/r$/, ''), items:items.map(({ $schema, ...item }) => ({...item,files:item.files.map(({content,...file})=>file)})) }));
// Prune only generated registry items in this exact directory. Retired styles must not remain installable.
const registryDirectory = path.resolve(root, 'src/registry/r');
const liveItems = new Set(items.map(item => item.name + '.json'));
for (const name of fs.readdirSync(registryDirectory)) {
  if (!/^pattove-[\w-]+\.json$/.test(name) || liveItems.has(name)) continue;
  const retiredFile = path.resolve(registryDirectory, name);
  if (path.dirname(retiredFile) !== registryDirectory) throw new Error('Invalid generated path');
  fs.unlinkSync(retiredFile);
}
console.log(`Built ${items.length} shadcn Universal Items; CLI ${cliVersion}.`);
