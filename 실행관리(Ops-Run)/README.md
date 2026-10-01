# 디자인시스템 · 파토브

[목표와 완료 기준](<문서/디자인 시스템 정의.md>) · [구현 구조](DESIGN.md) · [정의서 대조 기록](<문서/아토믹 뼈대 정합성.md>) · [관리 화면 재사용](<문서/관리 화면 재사용.md>)

상위 폴더의 **`패토브 실행.command`**(Mac) 또는 **`패토브 실행.exe`**(Windows)를 더블클릭한다. 서버가 준비된 뒤 **http://127.0.0.1:4173** 이 열린다. 중복 실행은 기존 서버를 재사용한다.

이 문서와 아래 개발 명령의 기준 폴더는 **`실행관리(Ops-Run)`**이다. 소스·문서·영감 이미지·검증 자료를 이곳에 모았으며, 파일 사이의 상대 경로와 웹 주소는 유지했다. 개발 서버만 켜려면 이 폴더에서 `npm run dev`를 실행한다.

첫 화면은 **스타일 카드 격자**다. 카드를 누르면 그 스타일의 버튼·입력·선택·탐색·카드와 완성 화면이 나오고, ‘이 스타일 적용’으로 사이트 전체의 스타일을 바꾼다. 상단에는 대메뉴 **스타일 → 토큰 → 아이콘 → 부품 → 블록 → 템플릿**과 검색 단추를 둔다. 검색 칸은 이 단추나 `/` 키로 여는 창 하나뿐이다. 왼쪽에는 선택한 대메뉴의 중메뉴가 나오고, 중메뉴를 누르면 그 아래에 소메뉴가 펼쳐진다. 스타일 탭의 왼쪽 메뉴는 전체 보기와 스타일 목록이다. 모바일에서도 대메뉴는 상단에 보이며 중·소메뉴는 ‘분류’ 버튼으로 연다. 긴 목록은 쪽 번호로 나뉜다(아이콘 72개, 그 밖 48개). 상세에서 목록으로 돌아오면 분류·검색어와 읽던 위치가 복원된다.

기존 9개 스타일을 제거하고 **메인 스타일 하나**를 구축한다. [단점과 보완 기준](<문서/메인 스타일 명세.md>)을 화면과 배포 소스에 함께 적용한다. 현재는 **0.6.0 / Trial**이다. 대표 부품과 사용자 흐름의 재사용 경로를 구현했으며, 정의서 전체나 모든 스타일의 최종 품질을 완성했다고 뜻하지 않는다.

사전의 모든 항목을 각 탭의 분류 메뉴에서 찾을 수 있다. 부품과 블록은 사전의 분야별 분류를 사용하며, 아이콘 공통 규칙은 아이콘 탭의 ‘아이콘 기준’에서 찾는다. 아직 견본이 없는 항목도 이름·통용 용어·쓰임을 확인할 수 있고, ‘미구현’으로 표시한다.

각 카드에는 고유 ID가 나온다. 상세 화면과 하위 모양 카드의 **복사 아이콘**을 누르면 ID·모양 설정·미리보기 스타일·소스 위치·HTML 예시를 함께 복사한다. 예를 들어 버튼은 `button`, 윤곽선 모양은 `button/variant/outline`이다. 모양 ID를 검색창에 붙여 넣고 Enter를 누르면 그 모양으로 바로 이동한다. 이름이나 나열 순서를 바꿔도 ID는 그대로 유지한다. 미구현 항목은 사전 정의와 미구현 상태를 전달하며, 완성된 아이콘은 실제 이미지 파일 위치를 전달한다. AI가 이 프로젝트에 접근할 수 없다면 복사 내용에 적힌 소스 파일도 함께 제공한다.

## 소스 가져오기

모든 구현 항목은 아래 공식 CLI 주소로 필요한 의존성과 함께 설치한다. 상세 화면의 복사 아이콘은 ID와 소스 위치를 전달한다. 관리 부품 네 개(`data-table`, `record-editor`, `admin-shell`, `admin-page`)는 상세의 ‘가져다 쓰기’에서 HTML·React 설치 명령과 단독 HTML 다운로드도 제공한다. 일반 HTML은 별도 빌드나 React 없이 사용한다.

공식 shadcn CLI로 프로젝트 안에 수정 가능한 소스를 설치한다. 로컬 서버가 실행 중이어야 한다.

```sh
# 일반 HTML 버튼
npx shadcn@4.21.0 add http://127.0.0.1:4173/src/registry/r/pattove-main-button-html.json

# React 자료 관리 화면과 하위 부품
npx shadcn@4.21.0 add http://127.0.0.1:4173/src/registry/r/pattove-main-admin-page-react.json
```

파일은 프로젝트의 `design/`에 들어간다. HTML은 `design/examples/main/button.html`, React는 해당 `design/examples/main/admin-page.jsx` 예시에서 시작한다. React 프로젝트는 React 런타임을 제공하며 Next.js의 상호작용 부품에는 client 경계가 포함되어 있다. 서버 저장·인증은 포함하지 않는다. React 검색 모듈은 `id`, `title`, `description`, `tag`를 가진 레코드와 `onSave(record)`를 받아 연결한다. HTML 예시는 `data-record-id`와 `pattove:save` 이벤트로 선택한 레코드를 전달하며, 화면 안의 보관 상태만 바꾼다. 영구 저장 성공·실패는 소비 프로젝트에서 연결한다.

- 버튼·입력창부터 검색·결과 블록·페이지까지 선택한 단위와 의존성만 가져온다.
- 아이콘 탭에서는 필요한 일러스트를 PNG·WebP 파일로 개별 다운로드한다.
- 카드의 제목·본문·행동 영역, 필드의 라벨·설명도 공개한다. 필드는 라벨의 `for`와 입력의 `id`, 설명의 `aria-describedby` 연결을 유지한다.
- 공통 CSS·아이콘 원본·스타일 토큰을 HTML과 React가 공유한다. 환경별 동작은 별도 구현이다.
- `design/manifests/`에 시스템·부품 버전, 원본 경로와 파일 해시를 남긴다. 프로젝트에서 고친 파일을 자동 병합하거나 갱신하지 않는다.

`index.html`을 직접 열어도 부품 시트와 문서를 볼 수 있다. 관리 화면의 단독 HTML 파일도 오프라인에서 작동한다. CLI 설치는 HTTP 서버에서 사용한다. HTML의 정적 표시, JavaScript가 필요한 검색·탭, 오프라인 사용은 구분한다.

## 개발과 검증

```sh
npm install
npm run build
npm run dev
```

`build:system`은 공유 소스와 글꼴, `build:docs`는 사전 수와 현재 버전, `build:registry`는 shadcn 레지스트리·관리 화면 단독 HTML, `build:library`는 사전과 문서를 생성한다. 원본 변경 후 전체 `npm run build`를 실행한다. 다른 주소로 배포할 때는 `REGISTRY_URL`을 해당 `/src/registry/r` 주소로 설정하고 다시 빌드한다. 현재는 로컬 제공이며 외부에 게시하지 않았다.

```sh
npm test
npm run test:system
npm run test:system:audit
npm run test:library
npm run test:references
npm run test:styles
npm run test:shell-style
npm run test:outer
npm run test:visual
npm run test:design
npm run test:atlas
npm run test:consumers
npm run test:admin
npm run test:launcher
```

개발 서버가 켜진 상태에서 검사한다. 브라우저가 없으면 `npx playwright-core install chromium firefox webkit`으로 준비한다. 결과와 캡처는 `test-results/`에 기록한다.

사이트의 메뉴·버튼·입력창·카드 표면은 견본과 같은 `src/system/parts.css`를 사용한다. 색·크기 등 공통 값은 `src/tokens/`, 부품의 모양과 상태는 `parts.css`, 화면 배치는 `src/styles/`에서 수정한다. `test:shell-style`은 실제 사이트와 메인 부품의 상태별 표현을 비교하고, 공통 CSS 수정이 사이트에도 반영되는지 검사한다.

`test:launcher`는 현재 운영체제의 실행 파일로 시작·중복 방지·포트 충돌·경로 이동을 확인하며 이 프로젝트의 서버를 잠시 종료했다가 복구한다. `npm run build:launcher`는 기존 로고를 Windows 아이콘으로 변환하고 C# 소스에서 상위 폴더의 실행 파일 하나를 만든다. Windows의 .NET Framework C# 컴파일러를 사용한다. 실행 파일은 PC에 설치된 Node.js로 서버를 구동하므로 Node.js 자체를 포함한 설치 패키지는 아니다. Mac용 `패토브 실행.command`는 빌드 없이 저장소에 들어 있는 셸 스크립트이며, 같은 규칙으로 서버를 한 번만 띄운다.

`test:consumers`는 공식 CLI로 별도 프로젝트에 실제 설치하고 Next.js에서 다른 도서 콘텐츠로 재사용한다. 일반 HTML은 네트워크를 차단한 파일 환경에서도 실행한다. `test:atlas`는 세 브라우저의 탐색·모바일 화면을 확인한다. `test:admin`은 설치된 관리 화면의 검색·정렬·선택·편집·저장 실패·재시도·초점 복귀와 다른 데이터 재사용을 확인한다. React는 Chromium/Next.js, HTML은 Chromium·Firefox·WebKit에서 실행한다. 설치용 임시 프로젝트는 `test-results/source-consumers/` 안에만 만든다.

관리 화면은 shadcn-admin의 표·툴바·페이지 탐색 구조를 채택했고, TanStack Table 8.21.3을 사용한다. 원본 커밋·수정 범위·MIT 고지는 설치 소스에 포함된다. React는 `onSave(record)`, HTML은 `Pattove.admin.connect(root, { onSave })`로 저장을 연결한다. 두 환경 모두 `loadRecords({ signal })`로 목록 읽기·새로고침·실패 재시도를 연결할 수 있다. 자세한 계약은 [관리 화면 재사용](<문서/관리 화면 재사용.md>)을 따른다.

## 남아 있는 범위

전체 사전 항목의 구현, 스타일마다 독립된 대표 화면·시각 자산의 완성도, AI의 목적 해석부터 조합·검수·수정까지의 전체 흐름은 아직 완료되지 않았다. 현재 검사 결과를 전체 디자인 승인이나 사람의 보정 없는 완성으로 확대하지 않는다. 모바일 네이티브·인쇄·프로젝트 갱신과 마이그레이션도 별도 검증이 필요하다.

원본은 `문서/`, 취향의 근거는 `영감보관함/이미지/`, 사용 자산은 `assets/`에 둔다. 사용자 정의 문서를 현재 구현에 맞춰 축소하지 않는다.
