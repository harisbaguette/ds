# UI 스킬 적용 분석 — 패토브

조사·적용일: 2026-09-23. **현재안은 패토브 / PATTOVE다. 로고와 기본 구조를 유지하고 부제·설명·반복 장식을 걷어낸 [화면 현행화](<../시안/2026-09-23/패토브-재설계/화면-현행화.md>)를 추가 반영했다.** 갈피는 이름 충돌과 탐색·스타일 설계 문제로 미채택했다. [이전 분석](<../시안/2026-09-23/브랜드-업데이트/UI-스킬-이전-분석.md>)과 구분한다.

사용자가 지정한 아홉 링크의 본문을 읽고, 이름만 제공된 `interaction-design`은 wshobson의 공개 자료로 보완했다. 아래 표는 원문에서 확인한 원칙과 이번 프로젝트의 설계 결정을 구분한다. 외부 스킬 설치나 원격 평가 서비스 실행을 뜻하지 않는다.

제품 기준은 [KAWAI UI Design Dictionary](https://ui-design-dictionary.pages.dev/)의 **검색 → 분류 → 미니어처 목록 → 상세** 흐름이다. [사용자 지정 영상](https://x.com/kawai_design/status/2091284281658048996/video/1)의 공개 영상과 실제 웹 화면을 확인했다. [shadcn/ui](https://ui.shadcn.com/)의 정돈된 부품 표현, 영감보관함의 선화·단색면·격자를 함께 반영한다. 소스 수집과 설치 절차는 AI의 구현 작업에 두고, 사용자는 패턴의 모양과 쓰임을 살핀다.

## 10개 자료와 실제 적용

| 자료와 확인한 원문 | 원문에서 가져온 원칙 | 패토브에 반영한 결정 |
|---|---|---|
| **frontend-design** — [제공 페이지](https://www.ui-skills.com/skills/anthropics/frontend-design), [Anthropic 원문](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | 제품 주제에 근거한 정체성, 의도적인 조판, 실제 내용으로 설계하고 비평한다. 지정된 시각 방향을 우선한다. | 이름의 기존 사용을 1차 검색한 뒤 패토브를 작업명으로 채택했다. 분리된 P와 마름모를 SVG로 만들고, 이름과 심벌·활성색을 실제 화면에 함께 적용했다. |
| **apple-design** — [제공 페이지](https://www.ui-skills.com/skills/emilkowalski/apple-design), [Emil 원문](https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md) | 즉시 반응, 직접 조작, 중단 가능한 전환, 공간의 연속성이 중요하다. | 상세는 native dialog로 구현했다. 제목 초점 진입, Escape 닫기, 원래 카드로 초점 복귀, 체험의 즉시 반응을 브라우저에서 확인했다. |
| **beautiful-shadows** — [제공 페이지](https://www.ui-skills.com/skills/mengto/beautiful-shadows), [MengTo 원문](https://github.com/MengTo/Skills/blob/main/agent-skills/web-design/beautiful-shadows/SKILL.md) | 중립색 다중 그림자를 높이에 따라 구분한다. 조밀한 목록에 강한 그림자를 반복하지 않는다. | 목록은 가는 경계, 체험용 잠깐 알림은 낮은 다중 그림자, 상세 대화상자는 더 큰 그림자로 깊이를 구분했다. |
| **accessibility** — [제공 페이지](https://www.ui-skills.com/skills/addyosmani/accessibility), [Addy Osmani 원문](https://github.com/addyosmani/web-quality-skills/blob/main/skills/accessibility/SKILL.md) | 이름·역할·상태, 색 외 표시, 키보드, 대비를 확인한다. 자동 검사만으로 적합성을 선언하지 않는다. | 실제 버튼 이름, 비교 체크박스, 결과 알림, 키보드 초점 순환, 탭 방향키, 입력 오류 연결, 움직임 완화를 구현·확인했다. 전체 접근성 적합성이나 스크린리더 사용성은 검증하지 않았다. |
| **design-review** — [제공 페이지](https://www.ui-skills.com/skills/superfuture/design-review), [Superfuture 원문](https://github.com/Superfuture/design-review/blob/main/design-review/skills/design-review/SKILL.md) | 계층·조판·간격·색·상태·브랜드를 실제 화면으로 보고, 문제마다 구체적인 수정안을 붙인다. | 실제 공개 사이트 7곳을 캡처해 판단했다. 첫 미리보기 위치·노출 카드 수·텍스트 양을 전후 측정하고 검색·비교·저장·키보드를 회귀 검사했다. |
| **emil-design-eng** — [제공 페이지](https://www.ui-skills.com/skills/emilkowalski/emil-design-eng), [Emil 원문](https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md) | 반복해서 접하는 동작의 불필요한 모션은 줄인다. 목적과 빈도에 맞는 속도와 완화를 택한다. | 목록 미리보기는 정적으로 유지하고 상세의 체험 버튼으로 동작을 시작한다. 반복 탐색에 불필요한 등장 효과를 넣지 않고 움직임 완화 설정에서 전환을 제거했다. |
| **shadcn** — [제공 페이지](https://www.ui-skills.com/skills/shadcn-ui/shadcn), [shadcn 공식 스킬](https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md) | 기존 부품과 변형을 먼저 활용하고, 의미 토큰과 올바른 조합·접근 가능한 제목을 쓴다. | KAWAI의 미니어처 목록과 shadcn의 부품 위계를 참고했다. 시안은 의존성 없는 HTML과 native dialog로 구현했으며 shadcn 패키지를 설치·사용한 것으로 표시하지 않는다. 소스 설치는 사용자 탐색 UI에 넣지 않는다. |
| **adapt** — [제공 페이지](https://www.ui-skills.com/skills/pbakaus/adapt), [pbakaus 원문](https://github.com/pbakaus/impeccable/blob/main/skill/reference/adapt.md) | 좁은 화면에서는 정보와 조작을 재배치한다. 화면 크기와 입력 방식을 별도로 고려한다. | 데스크톱은 3열, 모바일은 2열 미니어처 목록이다. 긴 설명을 상세로 옮기고 390×844에서 카드 6개를 온전히 표시한다. 320·390·768px에서 가로 넘침을 확인했다. |
| **better-interface** — [제공 페이지](https://www.ui-skills.com/skills/jakubkrehel/better-interface), [Jakub 원문](https://github.com/jakubkrehel/skills/blob/main/skills/better-interface/SKILL.md) | 취향과 결함을 구분하고, 확인한 범위의 증거로 판단한다. 공통 원인은 한 번에 고친다. | 이름의 1차 검색과 독점 가능성을 구분하고, 브라우저 동작 검사와 실제 사용자 연구를 구분한다. 검증 결과와 시안 범위를 함께 남겼다. |
| **interaction-design** — [보완한 페이지](https://www.ui-skills.com/skills/wshobson/interaction-design), [wshobson 원문](https://github.com/wshobson/agents/blob/main/plugins/ui-design/skills/interaction-design/SKILL.md) | 움직임은 피드백·방향·집중·연속성을 전달한다. 로딩과 상태 전환을 함께 설계한다. | 체험 결과와 실제 패턴 저장을 분리했다. 검색 결과 없음에는 조건 초기화, 저장에는 상태 표시, 단계 입력에는 이전 이동 시 값 보존을 구현했다. |

## 자료를 그대로 적용하지 않은 부분

- `frontend-design`의 일반적인 카드 격자 경계는 이번 사전형 요구에 맞춰 해석했다. 카드마다 다른 실제 패턴을 보여주는 격자는 유지한다.
- `accessibility` 본문의 큰 글자 기준에는 `px` 표기가 있으나, [W3C 원문](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)은 18pt 또는 굵은 14pt다. CSS 기준 약 24px 또는 굵은 18.67px이며, 일반 텍스트에는 4.5:1을 적용한다.
- `adapt`의 44px은 이번 모바일 조작 목표로 채택했다. [WCAG 2.2의 AA 최소 목표 크기](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)는 예외 조건을 둔 24×24 CSS px이다. 둘을 같은 기준으로 표기하지 않는다.
- 서로 다른 스킬의 모션 시간을 합쳐 ‘표준값’이라고 부르지 않는다. 아래 값은 이번 시안의 구현값이며 실제 사용으로 조정한다.
- 외부 리뷰 자료의 통신·설치·라이선스 확인 절차는 실행하지 않았다. 이 작업에서는 공개 본문의 설계·비평 원칙을 참고했다.

## 현재 화면 결정

기존 **패토브 / PATTOVE** 이름과 SVG 로고는 유지한다. 제품 화면에는 슬로건·부제·상시 사용법·연구 출처 설명을 넣지 않는다. 패턴 이름과 선택에 필요한 정보만 보여준다. 검색 예시는 초점 시 노출하고, 비교는 상단 조작으로 선택을 시작한다.

[Cosmos](https://www.cosmos.so/explore), [Layers](https://layers.to/explore), [Recent](https://recent.design/), [Curated](https://curated.design/), [Minimal Gallery](https://minimal.gallery/), [ui.land](https://ui.land/), [KAWAI](https://ui-design-dictionary.pages.dev/)의 공개 화면을 확인했다. 관찰과 적용 여부, 실제 캡처는 [현행화 기록](<../시안/2026-09-23/패토브-재설계/화면-현행화.md>)에서 연결한다. 이 자료들의 소개 문구·광고·과도한 분류까지 복제하지 않는다.

파란색은 기존 로고와 초점 표시에 유지한다. 외곽은 흰 바탕·중립색 글자·절제된 경계로 구성한다. 목록은 실물과 짧은 이름, 상세는 데모·용도·피할 때·관련 항목으로 읽는다. 추가 정보는 설계 메모에 접어 둔다.

스타일은 **선화·컬러블록·풍경**이다. 영감보관함 49장을 다시 분석해 제한색·선·격자·수평 구도를 추출했다. 같은 집중·입력·피드백 기능을 각기 다른 구도와 조작 형태로 구현했으며, 패턴 16개에 적용하고 선택을 저장한다. [스타일 고도화](<../시안/2026-09-23/패토브-재설계/스타일-고도화.md>)와 [이미지별 관찰](<../시안/2026-09-23/패토브-재설계/영감-분석/index.html>)에 근거를 남겼다. 제품에는 ‘참고 이미지’를 펼쳤을 때만 원본을 표시한다.

## 색과 동작

[색상 대비 기록](<../시안/2026-09-23/패토브-재설계/색상-대비.json>)은 현재 CSS 토큰을 계산한 값이다. 전체 접근성 적합성 검사는 아니다.

| 전경 / 배경 | 대비 | 용도 |
|---|---:|---|
| `#242424` / `#FFFFFF` | 15.52:1 | 본문 |
| `#72726E` / `#FFFFFF` | 4.83:1 | 보조 글자 |
| `#FFFFFF` / `#242424` | 15.52:1 | 주요 버튼 |
| `#284CEB` / `#FFFFFF` | 6.32:1 | 로고·초점 |
| `#6D6D65` / `#FFFFFF` | 5.22:1 | 기본 데모 보조 글자 |
| `#63685F` / `#FFFEFA` | 5.66:1 | 선화 데모 보조 글자 |
| `#56617A` / `#F5F5ED` | 5.66:1 | 컬러블록 데모 보조 글자 |
| `#FFFFFF` / `#2452EE` | 5.97:1 | 컬러블록 주요 색면 글자 |
| `#17284B` / `#E4FA75` | 12.65:1 | 컬러블록 강조 버튼 글자 |
| `#596771` / `#F4EEE2` | 5.04:1 | 풍경 데모 보조 글자 |
| `#283E4C` / `#BDCBD2` | 6.71:1 | 풍경 배경 위 글자 |

검색 지연은 120ms, 미리보기 배경 변화는 160ms다. 상세는 native dialog를 사용한다. 열린 대화상자의 초점·Escape·복귀, 탭 방향키, 입력 오류 연결, 움직임 완화 설정을 검사했다. 근거는 [MDN dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)와 [WAI-ARIA APG Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)다.

## 산출물과 범위

[현재 시안](<../시안/2026-09-23/패토브-재설계/README.md>) · [전후 측정](<../시안/2026-09-23/패토브-재설계/전후-비교.json>) · [75개 실행 검사](<../시안/2026-09-23/패토브-재설계/검증-결과.json>)

대표 패턴 16개의 로컬 검색·비교·체험·스타일·저장을 확인한 시안이다. 검색은 별칭 색인이며 생성형 의미 검색이 아니다. 저장은 해당 브라우저에 한정한다. 전체 사전 실행 구현·실기기 터치·스크린리더·사용자 연구는 검증 범위가 아니다. 공개 UI 스킬 원문은 [조사 폴더](<../시안/2026-09-23/브랜드-업데이트/참조/>)에 보관한다.
