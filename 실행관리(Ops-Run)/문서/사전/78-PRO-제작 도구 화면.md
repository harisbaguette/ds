# 78. 제작 도구 화면

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 78번 분류 PRO다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

이 분류는 영상 편집기, 음악 작업 프로그램, 그림·벡터 편집기, 3D 도구, 코드 편집기, 노드 편집기, 애니메이션 도구, 게임 편집기, 웹 빌더, 글꼴 도구, 발표 자료 편집기, 자동화·데이터 흐름 빌더처럼 무언가를 만드는 사람이 쓰는 도구 화면을 데스크톱·모바일·웹에 걸쳐 모은다. 캔버스 조작 일반(이동·확대·선택·정렬·스냅·눈금자·미니맵)은 19번 CAN, 글 편집과 일반 자동완성은 18번 RTE, 공동 편집과 버전 복원은 20번 COL, 게임 UI 구현 기술은 73번 GTK, 일반 명령 팔레트는 NAV-12, 일반 자동 저장은 DAT-13, 자동화 규칙·재시도 일반은 37번 OPS에 있다. 여기서는 제작 도구에만 있는 화면과 판단 기준만 다룬다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
| --- | --- | --- | --- | --- |
| PRO-01 | 작업 공간 전환 탭 — Workspaces | 구성 | 작업 단계마다 미리 짠 창 배치로 바꿈 | 확인 [QPBLWS] |
| PRO-02 | 편집 영역 나누기·합치기 — Area Split/Join | 구성 | 구석을 끌어 편집 창을 쪼개거나 합침 | 확인 [QPBLAREA] |
| PRO-03 | 영역 크게 보기 — Toggle Maximize Area | 구성 | 편집 창 하나를 잠시 창 전체로 키움 | 확인 [QPBLAREA] |
| PRO-04 | 붙였다 떼는 도구 창 — Dockers | 구성 | 도구 창을 블록처럼 붙이고 떼어 배치 | 확인 [QPKRNAV] · 대조 [QPGDEDIT] |
| PRO-05 | 활동 막대와 좌우 사이드바 — Activity Bar·Sidebars | 구성 | 왼쪽 아이콘으로 옆 창 내용을 갈아 끼움 | 확인 [QPVSUX] |
| PRO-06 | 아래쪽 공용 패널 — Bottom Panel | 구성 | 터미널·문제·출력을 편집 창 아래 모음 | 확인 [QPVSUX] · 대조 [QPGDEDIT] |
| PRO-07 | 상태 표시줄 좌우 나눔 — Status Bar Items | 기준 | 왼쪽은 작업 전체, 오른쪽은 지금 파일 정보 | 확인 [QPVSUX] |
| PRO-08 | 방금 한 조작 조정 창 — Adjust Last Operation | 부품 | 방금 한 명령의 값을 되돌리지 않고 고침 | 확인 [QPBLUNDO] |
| PRO-09 | 마우스 둘레 원형 메뉴 — Pie Menu | 부품 | 커서 둘레에 항목을 펼쳐 빠르게 고름 | 확인 [QPBLPIE] |
| PRO-10 | 손가락 원형 빠른 메뉴 — QuickMenu | 부품 | 태블릿에서 자주 쓰는 명령을 원형으로 모음 | 확인 [QPPCQMENU] |
| PRO-11 | 우클릭 원형 팔레트 — Pop-up Palette | 부품 | 붓·색·최근 색을 커서 자리에서 바로 고름 | 확인 [QPKRPOP] |
| PRO-12 | 단축키 묶음 고르기 — Keymap Presets | 구성 | 익숙한 다른 프로그램 단축키 체계로 바꿈 | 확인 [QPBLKEY] · 대조 [QPVSKEY] |
| PRO-13 | 상황 조건 붙은 단축키 편집기 — Keybindings Editor | 모듈 | 명령마다 키와 적용 상황을 바꾸고 되돌림 | 확인 [QPVSKEY] |
| PRO-14 | 설정 화면 두 얼굴 — Settings UI·JSON | 구성 | 같은 설정을 목록 화면과 원문 파일로 고침 | 확인 [QPVSSET] |
| PRO-15 | 사용자·작업 폴더 설정 층 — User vs Workspace Settings | 기준 | 개인 기본값과 프로젝트 값을 따로 둠 | 확인 [QPVSSET] |
| PRO-16 | 멈춘 뒤 되살리기 — Crash Recovery Autosave | 흐름 | 비정상 종료 뒤 임시 사본에서 작업을 되찾음 | 확인 [QPBLSAVE] |
| PRO-17 | 번호 붙은 백업 사본 — Incremental Backups | 구성 | 저장할 때마다 이전 판을 번호 붙여 남김 | 확인 [QPBLSAVE] |
| PRO-18 | 추가 기능 관리자 — Add-ons Manager | 모듈 | 확장을 켜고 끄고 설치·갱신함 | 확인 [QPBLADD] · 대조 [QPVSEXT] |
| PRO-19 | 확장 상세 카드 — Extension Details | 부품 | 설명·만든 곳·내려받은 수로 믿을지 판단 | 확인 [QPVSEXT] |
| PRO-20 | 플러그인 골라 실행 — Plugin Runner | 흐름 | 최근·추천·검색으로 골라 한 번 실행 | 확인 [QPFIGPLUG] |
| PRO-21 | 플러그인 자료 접근 알림 — Plugin Data Access | 기준 | 파일 내용을 어디까지 읽는지 미리 알림 | 확인 [QPFIGPLUG] |
| PRO-22 | 상태줄 긴 작업 진행 — Running Task Progress | 부품 | 렌더·굽기 진행과 남은 시간을 아래에 보임 | 확인 [QPBLSTAT] |
| PRO-23 | 계산 부하 표시 — CPU Load Meter | 부품 | 처리 한계에 가까우면 소리 끊김 전에 알림 | 확인 [QPABCPU] |
| PRO-24 | 그래픽 메모리 부족 경고 — GPU Memory Warning | 부품 | 그래픽 메모리가 모자라 렌더가 실패할 때 알림 | 확장 [MK] |
| PRO-25 | 집중 모드 — Zen Mode | 구성 | 패널을 모두 숨기고 편집 창만 남김 | 확인 [QPVSUI] |
| PRO-26 | 편집기 나란히 나누기 — Editor Groups | 구성 | 파일 여러 개를 나란히 열어 비교·편집 | 확인 [QPVSUI] · 대조 [QPVSUX] |
| PRO-27 | 잠깐 열린 탭 — Preview Tab | 부품 | 한 번 누른 파일은 기울임 탭으로 잠깐 엶 | 확인 [QPVSUI] |
| PRO-28 | 코드 미니맵 — Code Minimap | 부품 | 파일 전체 모양을 옆에 작게 보여 이동 | 확인 [QPVSUI] |
| PRO-29 | 고정 스크롤 머리 — Sticky Scroll | 부품 | 지금 줄이 속한 함수 이름을 위에 고정 | 확인 [QPVSUI] |
| PRO-30 | 빠른 열기 첫 글자 모드 — Quick Open Prefixes | 구성 | 첫 글자로 명령·기호·줄 이동을 바꿈 | 확인 [QPVSUI] |
| PRO-31 | 스크롤 막대 오류 점 — Overview Ruler | 부품 | 오류·변경 위치를 스크롤 막대에 색 점으로 | 확인 [QPVSEDIT] |
| PRO-32 | 문제 모음 패널 — Problems Panel | 모듈 | 파일별 오류·경고를 모아 눌러서 이동 | 확인 [QPVSEDIT] |
| PRO-33 | 전구 빠른 수정 — Code Action Lightbulb | 부품 | 줄 옆 전구를 눌러 고칠 방법을 고름 | 확인 [QPVSEDIT] |
| PRO-34 | 코드 사이 오류 펼침 — Inline Error Peek | 부품 | 다음 오류를 코드 줄 사이에 펼쳐 봄 | 확인 [QPVSEDIT] |
| PRO-35 | 떠 있는 디버그 도구막대 — Debug Toolbar | 부품 | 계속·건너뛰기·들어가기·멈춤을 한 줄로 | 확인 [QPVSDBG] |
| PRO-36 | 조건·횟수 중단점 — Conditional Breakpoint | 부품 | 식이 참이거나 몇 번째일 때만 멈춤 | 확인 [QPVSDBG] |
| PRO-37 | 멈추지 않는 기록 지점 — Logpoint | 부품 | 지나갈 때 멈추지 않고 메시지만 남김 | 확인 [QPVSDBG] |
| PRO-38 | 변수·호출 순서 창 — Variables·Call Stack | 모듈 | 멈춘 순간의 값과 불려 온 순서를 봄 | 확인 [QPVSDBG] |
| PRO-39 | 디버그 콘솔 — Debug Console | 모듈 | 멈춘 상태에서 식을 넣어 값을 확인 | 확인 [QPVSDBG] |
| PRO-40 | 터미널 나란히 묶기 — Terminal Groups | 구성 | 터미널 여러 개를 한 탭에 나란히 둠 | 확인 [QPVSTERM] |
| PRO-41 | 커밋 가지 그래프 — Source Control Graph | 모듈 | 갈라지고 합쳐진 이력을 선으로 그림 | 확인 [QPVSSCM] |
| PRO-42 | 파일 이력 시간줄 — Timeline View | 모듈 | 한 파일의 커밋·저장 기록을 시간순으로 | 확인 [QPVSSCM] |
| PRO-43 | 줄마다 고친 사람 — Git Blame | 부품 | 줄마다 누가 언제 바꿨는지 흐리게 보임 | 확인 [QPVSSCM] |
| PRO-44 | 여백 변경 막대 — Gutter Change Indicators | 부품 | 추가·수정·삭제 줄을 여백 색 막대로 | 확장 [MK] |
| PRO-45 | 대문자 기준 제안 거르기 — CamelCase Suggest Filter | 부품 | 단어 앞글자만 쳐도 긴 이름 후보를 찾음 | 확인 [QPVSINT] |
| PRO-46 | 트랙 머리 — Track Header | 구성 | 트랙마다 숨김·소리 끔·잠금·높이 조절 | 확인 [QPKDTL] · 대조 [QPLUMATL] |
| PRO-47 | 재생 헤드 — Playhead | 부품 | 지금 보는 시점을 세로 선으로 표시 | 확인 [QPKDTL] |
| PRO-48 | 끼워 넣기·덮어쓰기 모드 — Insert/Overwrite Mode | 기준 | 새 클립이 뒤를 밀지 덮을지 정함 | 확인 [QPKDEDIT] |
| PRO-49 | 잔물결 편집 — Ripple Edit | 부품 | 길이를 바꾸면 뒤 클립이 따라 당겨짐 | 확인 [QPKDEDIT] |
| PRO-50 | 속 내용 밀기 — Slip Tool | 부품 | 자리와 길이는 두고 보이는 구간만 옮김 | 확인 [QPKDEDIT] |
| PRO-51 | 자르기 칼 — Razor Tool | 부품 | 누른 곳에서 클립을 둘로 나눔 | 확인 [QPKDEDIT] |
| PRO-52 | 세 점 편집 — Three-point Editing | 흐름 | 원본 구간과 넣을 자리를 찍어 끼워 넣음 | 확인 [QPKDEDIT] |
| PRO-53 | 원본 창과 결과 창 — Clip vs Project Monitor | 구성 | 고를 소스와 완성본을 따로 재생 | 확인 [QPKDMON] |
| PRO-54 | 시간 위 안내 표시 — Timeline Guides | 부품 | 이름 붙은 표시를 꽂고 눌러 이동 | 확인 [QPKDGUIDE] |
| PRO-55 | 빈 틈 찾기 — Timeline Gap Detection | 부품 | 클립 사이 빈 구멍을 찾아 알려 줌 | 확인 [QPKDGUIDE] |
| PRO-56 | 효과 쌓기 목록 — Effect Stack | 모듈 | 클립 효과를 순서대로 쌓고 켜고 끔 | 확인 [QPKDFX] |
| PRO-57 | 타임라인 위 키프레임 — Timeline Keyframes | 부품 | 효과 값이 바뀌는 점을 클립 위에 보임 | 확인 [QPKDFX] · 대조 [QPCCKEY] |
| PRO-58 | 렌더 작업 대기열 — Render Job Queue | 모듈 | 내보내기를 줄 세우고 편집은 계속함 | 확인 [QPKDREND] |
| PRO-59 | 가벼운 대리 파일 — Proxy Clips | 기준 | 큰 원본 대신 작은 사본으로 부드럽게 편집 | 확장 [MK] |
| PRO-60 | 주 트랙 자석 — Magnetic Main Track | 기준 | 클립이 주 트랙에 붙어 틈 없이 이어짐 | 확인 [QPLUMATL] |
| PRO-61 | 모바일 키프레임 단추 — Keyframe Diamond Button | 부품 | 손가락으로 지금 시점 값을 찍어 둠 | 확인 [QPCCKEY] |
| PRO-62 | 클립 칸 격자 — Session View | 구성 | 클립을 칸에 두고 즉석에서 틀어 조합 | 확인 [QPABSESS] · 대조 [QPGBLOOP] |
| PRO-63 | 장면 줄 한꺼번에 시작 — Scene Launch | 부품 | 가로 한 줄의 클립을 동시에 시작 | 확인 [QPABSESS] |
| PRO-64 | 폰 라이브 루프 격자 — Live Loops | 구성 | 폰에서 칸을 눌러 DJ처럼 소리를 쌓음 | 확인 [QPGBLOOP] |
| PRO-65 | 믹서 채널 줄 — Mixer Channel Strip | 모듈 | 트랙마다 음량·좌우·녹음 대기·솔로를 모음 | 확인 [QPABMIX] |
| PRO-66 | 녹음 대기 단추 — Arm Recording | 부품 | 어느 트랙에 녹음할지 미리 켜 둠 | 확인 [QPABMIX] |
| PRO-67 | 피아노 롤 — MIDI Note Editor | 모듈 | 건반 옆 격자에 음표를 그리고 길이 조절 | 확인 [QPABMIDI] |
| PRO-68 | 세기 편집 막대 — Velocity Editor | 부품 | 음표 아래 막대로 누르는 세기를 조절 | 확인 [QPABMIDI] |
| PRO-69 | 쓰인 음만 남기기 — Fold to Notes | 부품 | 빈 건반 줄을 숨겨 격자를 좁힘 | 확인 [QPABMIDI] |
| PRO-70 | 박자 맞춤 표식 — Warp Markers | 부품 | 녹음 소리의 박을 곡 박자에 맞춰 늘임 | 확인 [QPABWARP] |
| PRO-71 | 반복 구간 괄호 — Loop Brace | 부품 | 위쪽 괄호로 되풀이 재생 구간을 정함 | 확인 [QPABARR] |
| PRO-72 | 메트로놈 단추 — Metronome | 부품 | 녹음할 때 박자 소리를 켜고 끔 | 확인 [QPABREC] |
| PRO-73 | 자동화 곡선 — Automation Envelope | 부품 | 시간에 따라 음량·효과 값이 바뀌게 그림 | 확인 [QPABAUTO] |
| PRO-74 | 박자 격자에 맞추기 — Quantize | 흐름 | 어긋난 음표를 가까운 박으로 옮겨 맞춤 | 확장 [MK] |
| PRO-75 | 트랙 얼리기 — Freeze Track | 흐름 | 무거운 트랙을 소리 파일로 굳혀 부하를 줄임 | 확장 [MK] |
| PRO-76 | 층 섞기 방식 — Blending Modes | 구성 | 아래 층과 색을 어떻게 섞을지 고름 | 확인 [QPKRBLEND] |
| PRO-77 | 지우지 않는 가림막 — Transparency Mask | 구성 | 검게 칠한 곳만 가려 원본을 보존 | 확인 [QPKRTMASK] |
| PRO-78 | 색 곡선 조정 — Curves | 모듈 | 채널마다 곡선을 끌어 밝기·색을 바꿈 | 확인 [QPKRCURVE] |
| PRO-79 | 원본 두는 보정 층 — Filter Mask | 구성 | 원본은 그대로 두고 보정을 층처럼 얹음 | 확인 [QPKRCURVE] |
| PRO-80 | 밝기 분포 그래프 — Histogram | 부품 | 어두운·밝은 픽셀 양을 막대로 보임 | 확인 [QPKRHIST] |
| PRO-81 | 패스 점과 손잡이 — Path Nodes·Handles | 부품 | 점마다 손잡이 두 개로 곡선 모양을 잡음 | 확인 [QPINKPATH] |
| PRO-82 | 손그림 도형 보정 — QuickShape | 흐름 | 손으로 그린 선을 반듯한 도형으로 바꿈 | 확인 [QPPCQSHAPE] |
| PRO-83 | 두 손가락 톡 되돌리기 — Two-finger Undo | 흐름 | 태블릿에서 두 손가락으로 쳐서 되돌림 | 확인 [QPPCGEST] |
| PRO-84 | 앞뒤 장면 겹쳐 보기 — Onion Skin | 구성 | 앞뒤 프레임을 옅은 색으로 겹쳐 봄 | 확인 [QPKRONION] |
| PRO-85 | 이동·회전·크기 손잡이 — Transform Gizmo | 부품 | 화살표·고리를 잡아 물체를 옮기고 돌림 | 확인 [QPBLGIZ] |
| PRO-86 | 시점 방향 공 — Navigation Gizmo | 부품 | 모서리 축 공을 눌러 앞·위·옆 보기로 | 확인 [QPBLGIZ] |
| PRO-87 | 보이는 방식 전환 — Viewport Shading | 구성 | 선·면·재질·최종 렌더 모습으로 바꿔 봄 | 확인 [QPBLSHADE] |
| PRO-88 | 장면 나무 목록 — Outliner | 모듈 | 파일 속 물체를 나무 구조로 보고 숨김 | 확인 [QPBLOUT] · 대조 [QPGDEDIT] |
| PRO-89 | 고른 것만 따로 보기 — Local View | 구성 | 고른 물체만 남기고 나머지를 치움 | 확인 [QPBLLOCAL] |
| PRO-90 | 3D 기준점 커서 — 3D Cursor | 부품 | 새 물체와 회전의 기준 위치를 찍어 둠 | 확인 [QPBL3DC] |
| PRO-91 | 주변까지 부드럽게 편집 — Proportional Editing | 구성 | 한 점을 옮기면 둘레가 따라 휘어짐 | 확인 [QPBLPROP] |
| PRO-92 | 카메라 틀로 보기 — Camera View | 구성 | 렌더될 카메라 틀 안에서 구도를 맞춤 | 확인 [QPBLCAM] |
| PRO-93 | 표면 펼침 편집기 — UV Editor | 모듈 | 3D 표면을 평면에 펼쳐 그림 자리를 맞춤 | 확인 [QPBLUV] |
| PRO-94 | 날아다니며 둘러보기 — Flythrough Mode | 흐름 | 키보드로 장면 안을 날며 둘러봄 | 확인 [QPUNNAV] |
| PRO-95 | 키프레임 한눈 보기 — Dope Sheet | 모듈 | 모든 키프레임을 한 표에서 보고 옮김 | 확인 [QPBLDOPE] |
| PRO-96 | 값 변화 곡선 편집기 — Graph Editor | 모듈 | 시간에 따른 값 곡선을 손잡이로 다듬음 | 확인 [QPBLGRAPH] |
| PRO-97 | 뼈대 자세 모드 — Pose Mode | 구성 | 뼈대를 움직여 캐릭터 자세를 잡음 | 확인 [QPBLPOSE] |
| PRO-98 | 자료 종류별 색 연결구 — Typed Sockets | 기준 | 연결구 색으로 주고받는 자료 종류를 구분 | 확인 [QPBLNODE] |
| PRO-99 | 노드 속 결과 미리보기 — Node Preview | 부품 | 노드 안에 결과 그림을 작게 보임 | 확인 [QPBLNODE] |
| PRO-100 | 그어서 선 끊기 — Cut Links | 흐름 | 끌어 그은 선에 걸린 연결을 한 번에 끊음 | 확인 [QPBLNEDT] |
| PRO-101 | 연결 잠시 막기 — Mute Links | 부품 | 선을 지우지 않고 흐름만 잠깐 막음 | 확인 [QPBLNEDT] |
| PRO-102 | 선 꺾는 경유점 — Reroute Node | 부품 | 긴 선을 꺾어 정리하는 빈 점 | 확인 [QPBLNEDT] |
| PRO-103 | 묶음 입구·출구 노드 — Group Input/Output | 구성 | 묶은 노드의 바깥 연결구를 따로 정함 | 확인 [QPBLNGRP] |
| PRO-104 | 편집기 안 실행 단추 — Play Mode Buttons | 부품 | 편집기 안에서 게임을 바로 돌리고 멈춤 | 확인 [QPUNGAME] |
| PRO-105 | 실행 중 창 색 바꾸기 — Play Mode Tint | 기준 | 실행 중 고친 값이 사라짐을 색으로 경고 | 확장 [MK] |
| PRO-106 | 기기 흉내 보기 — Device Simulator | 구성 | 폰 화면 크기·노치에서 어떻게 보일지 봄 | 확인 [QPUNGAME] |
| PRO-107 | 프리팹 따로 고치기 — Prefab Mode | 구성 | 재사용 묶음을 따로 또는 장면 속에서 고침 | 확인 [QPUNPFB] |
| PRO-108 | 편집기 콘솔 창 — Editor Console | 모듈 | 오류·경고·기록을 모아 원인 줄로 이동 | 확인 [QPUNCON] |
| PRO-109 | 실행 중 장면 나무 — Remote Scene Tree | 모듈 | 돌아가는 게임 속 물체 상태를 실시간 확인 | 확인 [QPGDDBG] |
| PRO-110 | 충돌 모양 보이기 — Visible Collision Shapes | 부품 | 실행 중 부딪힘 영역을 선으로 그림 | 확인 [QPGDDBG] |
| PRO-111 | 편집 내용 실행 반영 — Scene Sync | 흐름 | 편집기에서 바꾼 것을 켜진 게임에 바로 | 확인 [QPGDDBG] |
| PRO-112 | 화면 폭 구간 전환 — Breakpoint Switcher | 구성 | 데스크톱·태블릿·폰 폭을 바꿔 가며 디자인 | 확장 [MK] |
| PRO-113 | 큰 화면 값 흘러내림 — Cascading Breakpoint Styles | 기준 | 큰 화면 스타일이 작은 화면으로 이어짐 | 확장 [MK] |
| PRO-114 | 요소 추가 서랍 — Add Elements Panel | 구성 | 상자·글·그림 블록을 끌어 캔버스에 놓음 | 확장 [MK] |
| PRO-115 | 게시와 주소 고르기 — Publish Dialog | 흐름 | 바뀐 것을 확인하고 실제 주소로 내보냄 | 확장 [MK] |
| PRO-116 | 글자 쌍 간격 창 — Kerning Window | 모듈 | 글자 쌍마다 벌어짐을 표로 보고 고침 | 확인 [QPGLKERN] |
| PRO-117 | 간격 조정 보기 방식 — Kerning Modes | 기준 | 끔·켬·잠금으로 간격 조정 범위를 바꿈 | 확인 [QPGLKERN] |
| PRO-118 | 글자 모양 격자 — Glyph Grid | 구성 | 모든 글자를 칸에 늘어놓고 골라 편집 | 확장 [MK] |
| PRO-119 | 글꼴 높이 기준선 — Font Metrics Lines | 기준 | 기준선·x높이·대문자 높이를 가로선으로 | 확장 [MK] |
| PRO-120 | 슬라이드 작은 그림 줄 — Slide Thumbnail Strip | 구성 | 왼쪽 작은 그림을 끌어 순서를 바꿈 | 확장 [MK] |
| PRO-121 | 모든 장의 틀 — Slide Master | 기준 | 모든 장의 틀·글꼴을 한 곳에서 바꿈 | 확장 [MK] |
| PRO-122 | 발표자 전용 화면 — Presenter View | 구성 | 지금·다음 장·메모·시간을 발표자만 봄 | 확인 [QPPPTPRES] · 대조 [QPLOPRES] |
| PRO-123 | 시험용 고정 결과 — Data Pinning | 흐름 | 바깥 서비스 없이 저장한 결과로 시험 | 확인 [QPN8PIN] |
| PRO-124 | 끌어서 값 연결 — Drag-to-map Fields | 흐름 | 앞 단계 출력 칸을 끌어 입력 식을 만듦 | 확인 [QPN8MAP] |
| PRO-125 | 지난 실행 불러와 고치기 — Debug in Editor | 흐름 | 지난 실행 데이터를 편집기에 다시 올림 | 확인 [QPN8DBG] |
| PRO-126 | 규칙별 갈래 길 — Paths | 구성 | 규칙에 따라 서로 다른 동작 줄기로 나눔 | 확인 [QPZAPPATH] |
| PRO-127 | 조건 걸러 멈춤 — Filter Step | 부품 | 조건이 안 맞으면 흐름을 그 자리에서 멈춤 | 확인 [QPZAPPATH] |
| PRO-128 | 단계별 들어간 값·나온 값 — Step Data In/Out | 모듈 | 실행마다 각 단계의 입력과 출력을 봄 | 확인 [QPZAPHIST] · 대조 [QPN8DBG] |
| PRO-129 | 단계 누르면 표 미리보기 — Step Data Preview | 부품 | 변환 단계를 누르면 그 시점 표를 보임 | 확장 [MK] |
| PRO-130 | 원본 열 바뀜 경고 — Schema Drift Warning | 부품 | 원본 열 구성이 바뀌면 실행 전에 알림 | 확장 [MK] |
| PRO-131 | 작업 순서 그래프 실행 색 — Pipeline DAG Run Status | 모듈 | 단계마다 성공·실패·대기를 색으로 보임 | 확장 [MK] |
