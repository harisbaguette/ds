# 디자인시스템 · 파토브

[목표와 완료 기준](<문서/디자인 시스템 정의.md>) · [구현 구조](DESIGN.md) · [정의서 대조 기록](<문서/아토믹 뼈대 정합성.md>)

상위 폴더의 **`패토브 실행.exe`**를 더블클릭한다. 서버가 준비된 뒤 **http://127.0.0.1:4173** 이 열린다. 중복 실행은 기존 서버를 재사용한다.

이 문서와 아래 개발 명령의 기준 폴더는 **`실행관리(Ops-Run)`**이다. 소스·문서·영감 이미지·검증 자료를 이곳에 모았으며, 파일 사이의 상대 경로와 웹 주소는 유지했다. 개발 서버만 켜려면 이 폴더에서 `npm run dev`를 실행한다.

**사전의 시각 예시 → 스타일·상태 비교 → 필요한 소스 가져오기 → 실제 프로젝트에서 조합**하는 흐름을 만든다. 첫 화면은 작은 부품과 조합을 한눈에 보는 시트다. 주 메뉴는 **스타일·사전** 두 개이며, 원문과 계층 설명은 필요한 곳에서 펼친다.

기존 9개 스타일을 제거하고 **메인 스타일 하나**를 구축한다. [단점과 보완 기준](<문서/메인 스타일 명세.md>)을 화면과 배포 소스에 함께 적용한다. 현재는 **0.3.0 / Trial**이다. 대표 부품과 사용자 흐름의 재사용 경로를 구현했으며, 정의서 전체나 모든 스타일의 최종 품질을 완성했다고 뜻하지 않는다.

## 소스 가져오기

부품 상세에서 HTML 또는 React를 선택하면 설치 명령, 개별 소스, 필요한 의존성이 포함된 ZIP을 받는다. 일반 HTML은 별도 빌드나 React 없이 사용한다. 한 파일로 전달할 때는 단독 HTML 다운로드를 사용한다.

공식 shadcn CLI로 프로젝트 안에 수정 가능한 소스를 설치한다. 로컬 서버가 실행 중이어야 한다.

```sh
# 일반 HTML 버튼
npx shadcn@4.21.0 add http://127.0.0.1:4173/src/registry/r/pattove-main-button-html.json

# React 컬렉션 화면과 하위 부품
npx shadcn@4.21.0 add http://127.0.0.1:4173/src/registry/r/pattove-main-page-react.json
```

파일은 프로젝트의 `design/`에 들어간다. HTML은 `design/examples/main/button.html`, React는 해당 `design/examples/main/page.jsx` 예시에서 시작한다. React 프로젝트는 React 런타임을 제공하며 Next.js의 상호작용 부품에는 client 경계가 포함되어 있다. 서버 저장·인증은 포함하지 않는다. React 검색 모듈은 `id`, `title`, `description`, `tag`를 가진 레코드와 `onSave(record)`를 받아 연결한다. HTML 예시는 `data-record-id`와 `pattove:save` 이벤트로 선택한 레코드를 전달하며, 화면 안의 보관 상태만 바꾼다. 영구 저장 성공·실패는 소비 프로젝트에서 연결한다.

- 버튼·입력창부터 검색 모듈·페이지까지 선택한 단위와 의존성만 가져온다.
- 아이콘은 개별 SVG 또는 React 컴포넌트로 받는다. SVG 하나에 React나 글꼴 전체가 따라오지 않는다.
- 카드의 제목·본문·행동 영역, 필드의 라벨·설명도 공개한다. 필드는 라벨의 `for`와 입력의 `id`, 설명의 `aria-describedby` 연결을 유지한다.
- 공통 CSS·아이콘 원본·스타일 토큰을 HTML과 React가 공유한다. 환경별 동작은 별도 구현이다.
- `design/manifests/`에 시스템·부품 버전, 원본 경로와 파일 해시를 남긴다. 프로젝트에서 고친 파일을 자동 병합하거나 갱신하지 않는다.

`index.html`을 직접 열어도 부품 시트와 문서, 단독 HTML 내보내기는 사용할 수 있다. 레지스트리 조회·ZIP·CLI 설치는 HTTP 서버에서 사용한다. HTML의 정적 표시, JavaScript가 필요한 검색·탭, 오프라인 사용은 구분한다.

## 개발과 검증

```sh
npm install
npm run build
npm run dev
```

`build:system`은 공유 소스와 글꼴, `build:registry`는 shadcn 레지스트리·배포 UI 정보, `build:library`는 사전과 문서를 생성한다. 원본 변경 후 전체 `npm run build`를 실행한다. 다른 주소로 배포할 때는 `REGISTRY_URL`을 해당 `/src/registry/r` 주소로 설정하고 다시 빌드한다. 현재는 로컬 제공이며 외부에 게시하지 않았다.

```sh
npm test
npm run test:system
npm run test:system:audit
npm run test:library
npm run test:styles
npm run test:outer
npm run test:visual
npm run test:design
npm run test:atlas
npm run test:consumers
npm run test:launcher
```

개발 서버가 켜진 상태에서 검사한다. 브라우저가 없으면 `npx playwright-core install chromium firefox webkit`으로 준비한다. 결과와 캡처는 `test-results/`에 기록한다.

`test:launcher`는 실행 파일의 시작·중복 방지·포트 충돌·경로 이동을 확인하며 이 프로젝트의 서버를 잠시 종료했다가 복구한다. `npm run build:launcher`는 기존 로고를 Windows 아이콘으로 변환하고 C# 소스에서 상위 폴더의 실행 파일 하나를 만든다. Windows의 .NET Framework C# 컴파일러를 사용한다. 실행 파일은 PC에 설치된 Node.js로 서버를 구동하므로 Node.js 자체를 포함한 설치 패키지는 아니다.

`test:consumers`는 공식 CLI로 별도 프로젝트에 실제 설치하고 Next.js에서 다른 도서 콘텐츠로 재사용한다. 일반 HTML은 네트워크를 차단한 파일 환경에서도 실행한다. `test:atlas`는 세 브라우저의 탐색·ZIP·모바일 화면을 확인한다. 설치용 임시 프로젝트는 `test-results/source-consumers/` 안에만 만든다.

## 남아 있는 범위

전체 사전 항목의 구현, 스타일마다 독립된 대표 화면·시각 자산의 완성도, AI의 목적 해석부터 조합·검수·수정까지의 전체 흐름은 아직 완료되지 않았다. 현재 검사 결과를 전체 디자인 승인이나 사람의 보정 없는 완성으로 확대하지 않는다. 모바일 네이티브·인쇄·프로젝트 갱신과 마이그레이션도 별도 검증이 필요하다.

원본은 `문서/`, 취향의 근거는 `영감보관함/이미지/`, 사용 자산은 `assets/`에 둔다. 사용자 정의 문서를 현재 구현에 맞춰 축소하지 않는다.
