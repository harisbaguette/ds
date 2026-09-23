# UI 스킬 적용 분석 — 갈피 시안

> 이전 갈피 시안의 기록. 현재안은 [패토브 재설계](../패토브-재설계/README.md)이며, 아래 결정을 현재 제품 기준으로 사용하지 않는다.

조사·적용일: 2026-09-23. 사용자가 지정한 아홉 링크의 본문을 읽고, 이름만 제공된 `interaction-design`은 wshobson의 공개 자료로 보완했다. 아래 표는 원문에서 확인한 원칙과 이번 프로젝트의 설계 결정을 구분한다. 외부 스킬 설치나 원격 평가 서비스 실행을 뜻하지 않는다.

제품 기준은 [KAWAI UI Design Dictionary](https://ui-design-dictionary.pages.dev/)의 **검색 → 분류 → 미니어처 목록 → 상세** 흐름이다. [사용자 지정 영상](https://x.com/kawai_design/status/2091284281658048996/video/1)의 공개 영상과 실제 웹 화면을 확인했다. [shadcn/ui](https://ui.shadcn.com/)의 정돈된 부품 표현, 영감보관함의 선화·단색면·격자를 함께 반영한다. 소스 수집과 설치 절차는 AI의 구현 작업에 두고, 사용자는 패턴의 모양과 쓰임을 살핀다.

## 10개 자료와 실제 적용

| 자료와 확인한 원문 | 원문에서 가져온 원칙 | 갈피에 적용한 결정 |
|---|---|---|
| **frontend-design** — [제공 페이지](https://www.ui-skills.com/skills/anthropics/frontend-design), [Anthropic 원문](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | 제품 주제에 근거한 정체성, 의도적인 조판, 실제 내용으로 설계하고 비평한다. 지정된 시각 방향을 우선한다. | ‘갈피’라는 이름과 카드·책갈피 기호를 연결했다. 사용자가 지정한 사전 격자를 유지하고, 개성은 로고와 미니어처 표현에 집중했다. |
| **apple-design** — [제공 페이지](https://www.ui-skills.com/skills/emilkowalski/apple-design), [Emil 원문](https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md) | 즉시 반응, 직접 조작, 중단 가능한 전환, 공간의 연속성이 중요하다. | 목록의 위치를 보존한 상세 모달과 모바일 시트를 설계했다. 누르는 순간의 피드백과 닫은 뒤 초점 복귀는 구현 계약으로 남겼다. Apple 재질을 강제하는 자료로 해석하지 않았다. |
| **beautiful-shadows** — [제공 페이지](https://www.ui-skills.com/skills/mengto/beautiful-shadows), [MengTo 원문](https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/beautiful-shadows/SKILL.md) | 중립색 다중 그림자를 높이에 따라 구분한다. 조밀한 목록에 강한 그림자를 반복하지 않는다. | 목록은 가는 경계와 낮은 깊이, 미니어처 메뉴는 중간 깊이, 상세 모달은 더 큰 깊이로 구분했다. |
| **accessibility** — [제공 페이지](https://www.ui-skills.com/skills/addyosmani/accessibility), [Addy Osmani 원문](https://github.com/addyosmani/web-quality-skills/blob/main/skills/accessibility/SKILL.md) | 이름·역할·상태, 색 외 표시, 키보드, 대비를 확인한다. 자동 검사만으로 적합성을 선언하지 않는다. | 분류 선택에 세로선, 표현 선택에 체크를 더했다. 토큰 대비를 계산하고, 접근 가능한 이름·키 조작·초점은 실제 구현 시 검증하도록 분리했다. |
| **design-review** — [제공 페이지](https://www.ui-skills.com/skills/superfuture/design-review), [Superfuture 원문](https://github.com/Superfuture/design-review/blob/main/design-review/skills/design-review/SKILL.md) | 계층·조판·간격·색·상태·브랜드를 실제 화면으로 보고, 문제마다 구체적인 수정안을 붙인다. | 어두워진 최초 로고 시트를 밝은 평면으로 재생성했다. 빈 상태 썸네일의 내용물을 제거하고, 상세 태그의 청록을 맞췄다. |
| **emil-design-eng** — [제공 페이지](https://www.ui-skills.com/skills/emilkowalski/emil-design-eng), [Emil 원문](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md) | 반복해서 접하는 동작의 불필요한 모션은 줄인다. 목적과 빈도에 맞는 속도와 완화를 택한다. | 전체 갤러리의 상시 동시 재생을 피하고, 지정한 미니어처와 상세에서 동작을 확인하는 방식으로 설계했다. |
| **shadcn** — [제공 페이지](https://www.ui-skills.com/skills/shadcn-ui/shadcn), [shadcn 공식 스킬](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md) | 기존 부품과 변형을 먼저 활용하고, 의미 토큰과 올바른 조합·접근 가능한 제목을 쓴다. | 검색·탭·태그·Dialog·Sheet의 역할을 표준 부품에 대응시켰다. 브랜드는 공통 토큰으로 입힌다. 설치·코드 선택 UI를 제품 전면에 추가하지 않았다. |
| **adapt** — [제공 페이지](https://www.ui-skills.com/skills/pbakaus/adapt), [pbakaus 원문](https://github.com/pbakaus/impeccable/blob/main/skill/reference/adapt.md) | 좁은 화면에서는 정보와 조작을 재배치한다. 화면 크기와 입력 방식을 별도로 고려한다. | 3열 목록을 1열로, 좌측 분류를 분류 선택으로, 중앙 모달을 하단 시트로 바꿨다. 패턴·스타일·영감은 하단 탐색에 유지했다. |
| **better-interface** — [제공 페이지](https://www.ui-skills.com/skills/jakubkrehel/better-interface), [Jakub 원문](https://github.com/jakubkrehel/skills/blob/main/skills/better-interface/SKILL.md) | 취향과 결함을 구분하고, 확인한 범위의 증거로 판단한다. 공통 원인은 한 번에 고친다. | 이미지의 로고·색·선택 표시·본문 위계를 함께 확인했다. DOM·키보드·모션을 보지 않고 구현 품질까지 통과했다고 판단하지 않는다. 하위 도메인 스킬 전체 감사는 수행 범위가 아니다. |
| **interaction-design** — [보완한 페이지](https://www.ui-skills.com/skills/wshobson/interaction-design), [wshobson 원문](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/interaction-design/SKILL.md) | 움직임은 피드백·방향·집중·연속성을 전달한다. 로딩과 상태 전환을 함께 설계한다. | 선택·열기·닫기·결과 갱신의 목적을 명시했다. 빈 상태·검색 결과 없음·완료 상태의 다음 행동을 구분했다. |

## 자료를 그대로 적용하지 않은 부분

- `frontend-design`의 일반적인 카드 격자 경계는 이번 사전형 요구에 맞춰 해석했다. 카드마다 다른 실제 패턴을 보여주는 격자는 유지한다.
- `accessibility` 본문의 큰 글자 기준에는 `px` 표기가 있으나, [W3C 원문](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)은 18pt 또는 굵은 14pt다. CSS 기준 약 24px 또는 굵은 18.67px이며, 일반 텍스트에는 4.5:1을 적용한다.
- `adapt`의 44px은 이번 모바일 조작 목표로 채택했다. [WCAG 2.2의 AA 최소 목표 크기](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)는 예외 조건을 둔 24×24 CSS px이다. 둘을 같은 기준으로 표기하지 않는다.
- 서로 다른 스킬의 모션 시간을 합쳐 ‘표준값’이라고 부르지 않는다. 아래 시간은 갈피의 초기 설계값이며 실제 사용으로 조정한다.
- 외부 리뷰 자료의 통신·설치·라이선스 확인 절차는 실행하지 않았다. 이 작업에서는 공개 본문의 설계·비평 원칙을 참고했다.

## 브랜드와 화면 결정

**갈피 / galpi**는 필요한 패턴을 찾고 다시 찾아올 자리를 남기는 이름이다. 로고는 접힌 사전 카드에 책갈피를 끼운 기호다. 종이색 바탕·먹색 글자·청록 활성색을 공통으로 사용하고, 노랑은 작은 색인과 일러스트에 한정한다.

데스크톱은 분류와 검색을 항상 드러내며 미니어처가 카드의 대부분을 차지한다. 상세는 큰 데모, 표현 선택, 사용 시점, 다른 상태, 관련 패턴 순서로 읽는다. ‘기본·선화·색면’은 같은 기능을 보여주는 표현 변형이다.

영감보관함에서는 Karita 명함의 먹선, MYTURN 화면의 격자와 상태 표시, 우유병 포스터의 제한된 색면, 흑백 고양이 이미지의 간단한 윤곽을 가져왔다. 캐릭터는 빈 상태처럼 의미가 있는 데모에 사용한다.

## 색과 동작의 구현 계약

아래 대비는 지정한 색상 값에 대한 계산이다. 생성 이미지의 모든 픽셀이나 실제 앱의 적합성 검사 결과가 아니다.

| 전경 / 배경 | 대비 | 용도 |
|---|---:|---|
| `#20272B` / `#F7F8F4` | 14.20:1 | 본문 / 페이지 |
| `#FFFFFF` / `#176E7A` | 5.92:1 | 주요 버튼 글자 / 버튼 |
| `#176E7A` / `#E6F4F5` | 5.25:1 | 선택 글자 / 옅은 활성 면 |
| `#536168` / `#FFFFFF` | 6.41:1 | 보조 본문 / 표면 |
| `#20272B` / `#F2D45C` | 10.35:1 | 먹색 / 노랑 면 |

| 동작 | 갈피 초기 설계값 | 구현 확인 사항 |
|---|---|---|
| 카드 가리키기·초점 | 경계 변화 160ms, 해당 데모만 짧게 재생 | hover 없이도 이름·쓰임·상세 접근 가능 |
| 누르기 | 즉시 표면 반응; 큰 카드 전체 확대·축소는 생략 | 이동 중에도 새 입력을 받음 |
| 검색·분류 | 결과 갱신 180ms opacity; 검색할 때 목록 전체 이동 생략 | 검색어·분류·결과가 일치하고 결과 갱신을 알림 |
| 상세 열고 닫기 | 최대 280ms; 데스크톱 중앙, 모바일 아래쪽에서 전환 | [APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)에 따라 초점 진입·닫기·복귀와 배경 비활성 확인 |
| 움직임 완화 | 이동·탄성 제거, 필요한 상태는 글자·아이콘으로 유지 | `prefers-reduced-motion`에서 별도 실행 확인 |

## 산출물과 검토 범위

[브랜드·화면 시안 4장](<./README.md>)과 [브랜드 설계](<./브랜드-설계.md>)에 연결했다. 원본 연구 자료는 시안 폴더의 `참조/`에 보관했다.

4장은 정적 이미지다. 로고 일관성, 한국어 제목, 화면 계층, 목록 밀도, 표현 선택과 모바일 재배치를 직접 보았다. 실제 서체 로딩, 16px 로고의 벡터 선명도, DOM 의미, 키보드, 초점 복귀, 확대, 터치, 모션은 앱 구현 후 확인해야 한다. 이미지 생성의 글자·색·치수는 설계값의 근사 표현이다.
