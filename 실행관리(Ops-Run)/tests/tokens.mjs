import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTokens } from '../scripts/tokens.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { kindsIn } = loadTokens(root);
let checks = 0;
for (const declaration of [
  'padding:17px', 'color:#fff', 'color:#000000', 'color:rgb(0 0 0)',
  'background:rgba(0,0,0,0)', 'font-family:"Pretendard",sans-serif',
  'color:var(--color-white)', 'color:var( --color-white )', 'border-radius:var(--p-unknown)', 'border-radius:var( --p-unknown )',
  'background:var(--p-bg,#fff)'
]) {
  assert.throws(() => kindsIn(`.fixture{${declaration}}`, 'fixture'), declaration);
  checks++;
}
assert.throws(() => kindsIn('@media(max-width:777px){.fixture{padding:0}}', 'fixture'));
checks++;
for (const css of [
  '.fixture{color:#fff;&:hover{color:var(--p-ink)}}',
  '.fixture{padding:17px;@media(max-width:760px){padding:0}}',
  '.fixture{content:"a;b}";font-family:"Arial"; &:hover{color:var(--p-ink)}}',
  '.fixture{color:var(--p-ink); broken declaration}'
]) {
  assert.throws(() => kindsIn(css, 'fixture'), css);
  checks++;
}
for (const declaration of [
  'padding:var(--p-space-md)', 'font-family:var(--p-mono-font)', 'font-family:var( --p-mono-font )',
  'font-family:inherit', 'color:currentColor', 'background:transparent',
  'width:100%;margin:0;flex:1', 'width:calc(var(--p-space-unit) * 17)',
  'mask:linear-gradient(black,transparent)',
  'mask:url("data:image/svg+xml,%3Csvg fill=\'#000\'%3E%3C/svg%3E")'
]) {
  assert.doesNotThrow(() => kindsIn(`.fixture{${declaration}}`, 'fixture'), declaration);
  checks++;
}
assert.doesNotThrow(() => kindsIn('/* var(--color-missing) */ .fixture{content:"var(--p-missing)";color:var(--p-ink)}', 'fixture'));
checks++;
// The same guard covers generated HTML examples, not just the application CSS.
for (const filename of fs.readdirSync(path.join(root, 'src/registry/r'))) {
  const item = JSON.parse(fs.readFileSync(path.join(root, 'src/registry/r', filename), 'utf8'));
  for (const file of item.files || []) {
    if (!/^design\/examples\/.*\.html$/.test(file.path)) continue;
    for (const [, css] of file.content.matchAll(/<style>([\s\S]*?)<\/style>/g)) {
      assert.doesNotThrow(() => kindsIn(css, file.path));
      checks++;
    }
  }
}
console.log(`${checks} token contract checks passed.`);
