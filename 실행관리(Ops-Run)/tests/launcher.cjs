const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { spawn } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const packageRoot = path.dirname(root);
const executable = path.join(packageRoot, '패토브 실행.exe');
const out = path.join(root, 'test-results/launcher');
const origin = 'http://127.0.0.1:4173';
fs.mkdirSync(out, { recursive: true });
const checks = [];
const check = (name, result) => { assert.ok(result, name); checks.push(name); };
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const samePath = (a, b) => path.resolve(a).toLowerCase() === path.resolve(b).toLowerCase();
async function status() {
  try {
    const response = await fetch(origin + '/__pattove/status', { signal: AbortSignal.timeout(1200) });
    const value = await response.json();
    return value.app === 'pattove-shell' ? value : null;
  } catch { return null; }
}
function launch(file = executable) {
  return new Promise((resolve, reject) => {
    const child = spawn(file, ['--no-browser'], { cwd: os.tmpdir(), windowsHide: true, stdio: 'ignore' });
    const timeout = setTimeout(() => { child.kill(); reject(new Error('Launcher timed out')); }, 25000);
    child.once('error', error => { clearTimeout(timeout); reject(error); });
    child.once('exit', code => { clearTimeout(timeout); resolve(code); });
  });
}
async function stopOwnServer(expectedRoot) {
  const value = await status();
  if (!value) return;
  assert.ok(samePath(value.root, expectedRoot), 'Never stop another project server');
  assert.ok(Number.isInteger(value.pid) && value.pid > 0);
  process.kill(value.pid);
  for (let i = 0; i < 30; i++) {
    if (!await status()) return;
    await pause(100);
  }
  throw new Error('Owned server did not stop');
}
(async () => {
  let fixtureRoot, conflict, mayRestore = false;
  try {
    const cacheLink = path.join(packageRoot, 'graft');
    if (fs.existsSync(cacheLink)) check('자동 생성 캐시는 실행관리로 연결', fs.lstatSync(cacheLink).isSymbolicLink() && samePath(fs.realpathSync(cacheLink), path.join(root, 'graft')));
    const visible = fs.readdirSync(packageRoot).filter(name => !name.startsWith('.') && name !== 'graft').sort();
    check('첫 폴더는 실행 파일·사용방법·실행관리뿐', JSON.stringify(visible) === JSON.stringify(['패토브 실행.exe', '사용방법.md', '실행관리(Ops-Run)'].sort()));
    check('사용자가 실행할 파일은 EXE 하나', visible.filter(name => /\.(exe|bat|cmd|ps1|vbs|lnk|html)$/i.test(name)).length === 1);
    const pe = fs.readFileSync(executable), peOffset = pe.readUInt32LE(60);
    check('콘솔 창 없는 Windows 실행 파일', pe.toString('ascii', 0, 2) === 'MZ' && pe.readUInt16LE(peOffset + 24 + 68) === 2);
    const previous = await status();
    if (previous) assert.ok(samePath(previous.root, root), 'Test port belongs to another project');
    mayRestore = true;
    await stopOwnServer(root);
    check('다른 작업 폴더에서 최초 실행 성공', await launch() === 0);
    const first = await status();
    check('현재 폴더의 앱 준비 확인', first && samePath(first.root, root));
    const home = await fetch(origin).then(response => response.text());
    check('준비 후 실제 화면 제공', home.includes('src/app.js'));
    check('반복 실행 성공', await launch() === 0);
    check('반복 실행해도 서버 PID 유지', (await status()).pid === first.pid);
    const simultaneous = await Promise.all([launch(), launch(), launch()]);
    check('동시 실행해도 서버 하나', simultaneous.every(code => code === 0) && (await status()).pid === first.pid);

    const fixture = fs.mkdtempSync(path.join(out, '이동 확인 (공백)-'));
    fixtureRoot = path.join(fixture, '실행관리(Ops-Run)');
    fs.mkdirSync(path.join(fixtureRoot, 'scripts'), { recursive: true });
    fs.copyFileSync(path.join(root, 'scripts/serve.cjs'), path.join(fixtureRoot, 'scripts/serve.cjs'));
    fs.writeFileSync(path.join(fixtureRoot, 'index.html'), '<!doctype html><title>Relocated launcher</title>');
    const movedExecutable = path.join(fixture, '패토브 실행.exe');
    fs.copyFileSync(executable, movedExecutable);
    check('다른 복사본을 기존 서버로 잘못 연결하지 않음', await launch(movedExecutable) === 1);
    check('다른 복사본 실행 시 현재 서버 보존', (await status()).pid === first.pid);

    await stopOwnServer(root);
    conflict = http.createServer((req, res) => { res.writeHead(200, { 'Content-Type': 'text/plain' }); res.end('another application'); });
    await new Promise((resolve, reject) => { conflict.once('error', reject); conflict.listen(4173, '127.0.0.1', resolve); });
    check('다른 앱이 포트를 사용하면 실패를 알림', await launch() === 1);
    check('충돌한 다른 앱을 종료하지 않음', await fetch(origin).then(response => response.text()) === 'another application');
    await new Promise(resolve => conflict.close(resolve));
    conflict = null;

    check('한글·공백·괄호가 있는 이동 경로에서 시작', await launch(movedExecutable) === 0);
    check('이동한 실행 파일은 자신의 지원 폴더 사용', samePath((await status()).root, fixtureRoot));
    await stopOwnServer(fixtureRoot);
    check('검사 후 실제 앱 복구', await launch() === 0 && samePath((await status()).root, root));
    fs.writeFileSync(path.join(out, 'results.json'), JSON.stringify({ checks, status: await status() }, null, 2));
    console.log(`${checks.length} launcher checks passed.`);
  } finally {
    if (conflict) await new Promise(resolve => conflict.close(resolve));
    const running = await status();
    if (fixtureRoot && running && samePath(running.root, fixtureRoot)) await stopOwnServer(fixtureRoot);
    if (mayRestore && !await status()) await launch();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
