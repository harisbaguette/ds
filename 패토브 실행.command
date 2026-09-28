#!/bin/bash
# macOS counterpart of 실행관리(Ops-Run)/scripts/Launcher.cs: start this folder's server once, then open the browser.
set -u
PORT=4173
URL="http://127.0.0.1:$PORT/"
APP_ROOT="$(cd "$(dirname "$0")" && pwd -P)/실행관리(Ops-Run)"
LOCK_DIR="$APP_ROOT/logs/.launcher.lock"
NO_BROWSER=0
for arg in "$@"; do [ "$arg" = "--no-browser" ] && NO_BROWSER=1; done

fail() {
  if [ -d "$APP_ROOT" ] && mkdir -p "$APP_ROOT/logs" 2>/dev/null; then
    printf '%s %s\n' "$(date +%Y-%m-%dT%H:%M:%S)" "$1" >> "$APP_ROOT/logs/launcher.log" 2>/dev/null
  fi
  echo "$1" >&2
  [ "$NO_BROWSER" -eq 0 ] && osascript -e 'on run argv' \
    -e 'display dialog (item 1 of argv) with title "패토브 실행" buttons {"확인"} default button 1 with icon caution' \
    -e 'end run' "$1" >/dev/null 2>&1
  exit 1
}

find_node() {
  local candidate
  candidate="$(command -v node 2>/dev/null)" && [ -x "$candidate" ] && { echo "$candidate"; return 0; }
  # A double-click may start with a minimal PATH, so try the usual install folders and then the login shell's PATH.
  for candidate in /opt/homebrew/bin/node /usr/local/bin/node /opt/homebrew/opt/node*/bin/node \
    "$HOME"/.volta/bin/node "$HOME"/.nvm/versions/node/*/bin/node; do
    [ -x "$candidate" ] && { echo "$candidate"; return 0; }
  done
  candidate="$("${SHELL:-/bin/zsh}" -lc 'command -v node' 2>/dev/null | tail -n 1)"
  [ -x "$candidate" ] && { echo "$candidate"; return 0; }
  return 1
}

# Ready only when the server answering on the port serves this exact folder.
is_ready() {
  "$NODE" -e '
    const fs = require("fs"), path = require("path");
    const [url, root] = process.argv.slice(1);
    const same = p => { try { p = fs.realpathSync(p); } catch {} return path.resolve(p).normalize("NFC").toLowerCase(); };
    fetch(url + "__pattove/status", { signal: AbortSignal.timeout(500) }).then(r => r.json())
      .then(v => process.exit(v.app === "pattove-shell" && same(v.root) === same(root) ? 0 : 1), () => process.exit(1));
  ' "$URL" "$APP_ROOT" 2>/dev/null
}

port_is_busy() { nc -z -G 1 127.0.0.1 "$PORT" >/dev/null 2>&1; }

ensure_server() {
  is_ready && return 0
  if port_is_busy; then
    # A manually started server may be bound but still preparing its response.
    for _ in 1 2 3 4 5 6 7 8 9 10; do sleep 0.1; is_ready && return 0; done
    fail "4173 포트를 다른 프로그램 또는 다른 폴더의 패토브가 사용하고 있습니다.

해당 프로그램을 종료한 뒤 다시 실행해 주세요. 실행 중인 프로그램을 자동 종료하지는 않습니다."
  fi
  # A new session keeps the server alive after the Terminal window closes.
  local child deadline=$((SECONDS + 15))
  child="$(cd "$APP_ROOT" && PORT="$PORT" "$NODE" -e '
    const fs = require("fs"), log = fs.openSync("logs/server.log", "a");
    const server = require("child_process").spawn(process.execPath, ["scripts/serve.cjs"], { detached: true, stdio: ["ignore", log, log] });
    server.unref(); console.log(server.pid);
  ')" || fail "패토브 서버를 시작하지 못했습니다."
  while [ "$SECONDS" -lt "$deadline" ]; do
    is_ready && return 0
    kill -0 "$child" 2>/dev/null || fail "패토브 서버를 시작하지 못했습니다.

실행관리(Ops-Run)/logs/server.log에서 오류를 확인할 수 있습니다."
    sleep 0.1
  done
  # Only the child created by this launch is stopped on failed startup.
  kill "$child" 2>/dev/null
  fail "서버가 응답하지 않아 시작을 중단했습니다. 다시 실행해 주세요."
}

[ -f "$APP_ROOT/scripts/serve.cjs" ] && [ -f "$APP_ROOT/index.html" ] || fail "실행에 필요한 파일을 찾을 수 없습니다.

패토브 실행.command와 실행관리(Ops-Run) 폴더를 함께 두세요."
NODE="$(find_node)" || fail "Node.js 실행 파일을 찾을 수 없습니다.

Node.js를 설치한 뒤 다시 실행해 주세요."
mkdir -p "$APP_ROOT/logs" || fail "실행관리(Ops-Run)/logs 폴더를 만들 수 없습니다."

# One launch at a time per folder, like the Windows mutex; a lock older than a minute is left over from a crash.
find "$LOCK_DIR" -maxdepth 0 -mmin +1 -exec rmdir {} \; 2>/dev/null
locked=0
for _ in $(seq 1 200); do
  if mkdir "$LOCK_DIR" 2>/dev/null; then locked=1; break; fi
  sleep 0.1
done
[ "$locked" -eq 1 ] || fail "패토브가 아직 시작 중입니다. 잠시 후 다시 실행해 주세요."
trap 'rmdir "$LOCK_DIR" 2>/dev/null' EXIT
ensure_server
rmdir "$LOCK_DIR" 2>/dev/null
trap - EXIT

if [ "$NO_BROWSER" -eq 0 ]; then
  open "$URL"
  echo "패토브가 브라우저에서 열렸습니다. 이 창은 닫아도 됩니다."
fi
exit 0
