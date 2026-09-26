# 79. 데스크톱·브라우저·OS 껍데기

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 79번 분류 DSK다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

이 분류는 앱이 운영체제와 브라우저의 껍데기에 맞닿는 자리를 다룬다. 데스크톱 창 틀과 메뉴 막대·트레이·독, 브라우저 확장과 설치형 웹앱, 운영체제 위젯, 시스템 대화상자와 파일 탐색기 연동, 태블릿·접이식 기기의 창 방식, 설치부터 제거까지의 수명 주기가 여기에 속한다. 휴대폰 공유·잠금 화면·앱 아이콘 배지 같은 모바일 시스템 기능은 28-MOB, 손목·TV·키오스크 기기는 52-DVC, 앱 안의 일반 문맥 메뉴·색상·글꼴 선택과 공유 시트는 ACT·INP·SOC를 따르며, 이 분류에는 운영체제나 브라우저가 정한 규칙 때문에 판단이 달라지는 항목만 둔다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| DSK-01 | 제목 표시줄 — Title Bar | 부품 | 창 이름과 끌기·창 조작을 담는 맨 위 띠 | 확인 [QDWINTBD] · 대조 [QDGNHBAR] |
| DSK-02 | 넓은 제목 표시줄 — Tall Title Bar | 기준 | 검색창·계정 사진을 넣으면 높이를 48px로 | 확인 [QDWINTBD] · 대조 [QDWINTBAR] |
| DSK-03 | 사용자 지정 제목 표시줄 — Custom Title Bar | 구성 | 앱 내용을 제목 줄까지 넓혀 도구를 올릴 때 | 확인 [QDWINTBAR] · 대조 [QDELWIN] |
| DSK-04 | 창 끌기 영역 — Drag Region | 기준 | 창을 잡아 옮길 빈 곳을 제목 줄에 남기기 | 확인 [QDWINTBD] · 대조 [QDGNHBAR] |
| DSK-05 | 제목 줄 속 누름 영역 — Non-client Input Passthrough | 기준 | 제목 줄 속 버튼이 눌리게 따로 지정, 빠지면 창만 끌림 | 확인 [QDWINTBAR] |
| DSK-06 | 창 조작 버튼 — Caption Buttons | 부품 | 최소화·최대화·닫기를 시스템 아이콘으로 오른쪽에 | 확인 [QDWINTBD] |
| DSK-07 | 신호등 버튼 — Traffic Lights | 부품 | Mac 창 왼쪽 위 닫기·최소화·확대 세 원 | 확인 [QDHIGWIN] |
| DSK-08 | 키 창·비활성 창 표시 — Key and Inactive Window | 기준 | 지금 입력받는 창만 색을 살리고 나머지는 흐리게 | 확인 [QDHIGWIN] · 대조 [QDWINTBD] |
| DSK-09 | 창 시스템 메뉴 — Window System Menu | 부품 | 제목 줄 우클릭·아이콘 클릭으로 여는 창 메뉴 | 확인 [QDWINTBD] |
| DSK-10 | 두 번 클릭 최대화 — Double-click to Maximize | 흐름 | 제목 줄을 두 번 눌러 창을 키우고 되돌리기 | 확인 [QDWINTBD] |
| DSK-11 | 창 바탕 재질 — Mica | 기준 | 오래 여는 창 바탕에 바탕화면 색을 옅게 비치기 | 확인 [QDWINMICA] |
| DSK-12 | 탭 창 바탕 재질 — Mica Alt | 기준 | 제목 줄에 탭을 둔 창에서 탭과 바탕을 구분 | 확인 [QDWINMICA] |
| DSK-13 | 재질 단색 대체 — Backdrop Fallback | 기준 | 투명 끔·절전·비활성 창이면 단색으로 바꾸기 | 확인 [QDWINMICA] |
| DSK-14 | 제목 줄 탭 — Tabs in Title Bar | 구성 | 탭을 제목 줄에 올리고 창 버튼은 오른쪽에 | 확인 [QDWINTBD] · 대조 [QDWINMICA] |
| DSK-15 | 헤더 바 — Header Bar | 구성 | 앞쪽 행동·가운데 제목·끝쪽 메뉴로 나눈 창 머리 | 확인 [QDGNHBAR] |
| DSK-16 | 주 메뉴 — Primary Menu | 부품 | 설정·단축키·도움말·정보를 모은 메뉴, 닫기 항목 금지 | 확인 [QDGNMENU] |
| DSK-17 | 통합 도구 막대 — Unified Toolbar | 구성 | 제목과 도구 막대를 한 줄로 합친 Mac 창 머리 | 확장 [MK] · 대조 [QDHIGWIN] |
| DSK-18 | 창 버튼 자리 비우기 — Window Controls Clearance | 기준 | 창 버튼이 도구 막대 항목과 겹치지 않게 앞쪽 비우기 | 확인 [QDHIGWIN] |
| DSK-19 | 틀 없는 창 — Frameless Window | 모듈 | 운영체제 창 틀을 끄고 제목 줄을 직접 그리기 | 확인 [QDELWIN] · 대조 [QDTAWIN] |
| DSK-20 | 요소별 끌기 속성 — Tauri Drag Region | 기준 | 끌기 속성은 붙인 요소에만 먹으니 자식마다 확인 | 확인 [QDTAWIN] |
| DSK-21 | 창 상태 복원 — Window State Restore | 흐름 | 닫을 때 크기·위치를 저장해 다음 실행에 되살리기 | 확인 [QDTASTATE] · 대조 [QDHIGWIN] |
| DSK-22 | 다중 창 — Multiple Windows | 구성 | 문서마다 창을 따로 열어 나란히 비교하게 | 확인 [QDHIGWIN] |
| DSK-23 | 새 창으로 열기 — Open in New Window | 흐름 | 항목을 오므리거나 메뉴로 떼어 새 창에 열기 | 확인 [QDHIGWIN] |
| DSK-24 | 창 아래 막대 사용 제한 — Bottom Bar Restraint | 기준 | 창 맨 아래 막대에 중요한 행동을 두지 않기 | 확인 [QDHIGWIN] |
| DSK-25 | 전체 화면 모드 — Full Screen Mode | 흐름 | 시스템 전체 화면에 들고 나기는 사람이 고르게 | 확인 [QDHIGFULL] |
| DSK-26 | 전체 화면 중 독 꺼내기 — Reveal Dock in Full Screen | 기준 | 전체 화면에서도 독을 불러낼 수 있게 두기 | 확인 [QDHIGFULL] |
| DSK-27 | 스냅 레이아웃 — Snap Layouts | 구성 | 최대화 버튼에 올려 창 배치 칸을 고르기 | 확장 [MK] |
| DSK-28 | 최소 창 크기 — Minimum Window Size | 기준 | 줄여도 내용이 깨지지 않는 가장 작은 창 크기 | 확장 [MK] |
| DSK-29 | 모니터별 배율 대응 — Per-monitor DPI | 기준 | 배율이 다른 화면으로 옮겨도 글자가 선명하게 | 확장 [MK] |
| DSK-30 | 시스템 강조색 따르기 — System Accent Color | 기준 | 운영체제에서 고른 강조색을 선택 표시에 쓰기 | 확장 [MK] |
| DSK-31 | 리눅스 데스크톱 항목 — Desktop Entry | 모듈 | 앱 목록에 이름·아이콘·여는 파일 형식 등록 | 확장 [MK] |
| DSK-32 | 메뉴 막대 표준 순서 — Menu Bar Order | 기준 | 앱·파일·편집·형식·보기·앱 메뉴·윈도우·도움말 순 | 확인 [QDHIGMENU] |
| DSK-33 | 말줄임표 메뉴 항목 — Ellipsis Convention | 기준 | 더 입력받는 명령 이름 뒤에만 말줄임표 붙이기 | 확인 [QDHIGMENU] |
| DSK-34 | 수식키 표기 순서 — Modifier Key Order | 기준 | Control·Option·Shift·Command 순으로 적기 | 확인 [QDHIGKEY] |
| DSK-35 | 시스템 표준 단축키 지키기 — Standard Shortcuts | 기준 | 복사·저장 같은 시스템 단축키를 다른 뜻으로 쓰지 않기 | 확인 [QDHIGKEY] · 대조 [QDHIGMENU] |
| DSK-36 | 메뉴 막대 추가 기능 — Menu Bar Extra | 부품 | 메뉴 막대 오른쪽 작은 기호, 누르면 팝오버 아닌 메뉴 | 확인 [QDHIGMENU] · 대조 [QDELTRAY] |
| DSK-37 | iPad 메뉴 막대 — iPadOS Menu Bar | 구성 | 위에서 끌어내리는 메뉴, 같은 기능을 화면에도 두기 | 확인 [QDHIGMENU] |
| DSK-38 | 독 메뉴 — Dock Menu | 부품 | 독 아이콘 우클릭에 열린 창과 핵심 행동 몇 개 | 확인 [QDHIGDOCK] |
| DSK-39 | 시스템 트레이 아이콘 — System Tray Icon | 부품 | 알림 영역 아이콘과 우클릭 메뉴로 상주 앱 조작 | 확인 [QDELTRAY] |
| DSK-40 | 창 닫아도 상주 — Run in Background on Close | 흐름 | 창을 모두 닫아도 트레이에 남아 계속 동작 | 확인 [QDELTRAY] |
| DSK-41 | 점프 목록 작업 — Jump List Tasks | 부품 | 작업 표시줄 우클릭에 자주 쓰는 작업 넣기 | 확인 [QDELAPP] · 대조 [QDELRECT] |
| DSK-42 | 최근 문서 목록 — Recent Documents | 부품 | 점프 목록·독 메뉴·파일 메뉴에 최근 파일 보이기 | 확인 [QDELRECT] · 대조 [QDHIGFILE] |
| DSK-43 | 작업 표시줄·독 진행률 — Taskbar Progress | 부품 | 창을 안 봐도 아이콘에서 진행률 확인, 리눅스 미지원 | 확인 [QDELPROG] |
| DSK-44 | 데스크톱 앱 아이콘 숫자 — Dock Badge Count | 부품 | 독·작업 표시줄 아이콘에 안 읽은 수 표시 | 확인 [QDELAPP] · 대조 [QDPWABDG] |
| DSK-45 | 전역 단축키 — Global Hotkey | 모듈 | 앱이 뒤에 있어도 부르는 키, 다른 앱과 충돌 확인 | 확장 [MK] |
| DSK-46 | 로그인 시 자동 실행 — Launch at Login | 모듈 | 컴퓨터를 켤 때 앱을 띄울지 설정에서 고르기 | 확인 [QDELAPP] |
| DSK-47 | 단일 인스턴스 — Single Instance | 모듈 | 두 번 실행하면 새 창 대신 기존 창을 앞으로 | 확인 [QDELAPP] |
| DSK-48 | 사용자 지정 링크 열기 — Custom Protocol Handler | 모듈 | 웹 링크를 누르면 설치된 앱이 그 화면을 열기 | 확인 [QDELAPP] |
| DSK-49 | 데스크톱 알림 버튼·빠른 답장 — Actionable Toast | 부품 | 알림 안에서 답장·처리, 앱은 띄우지 않기 | 확인 [QDWINNTF] |
| DSK-50 | 알림 센터 정리 — Notification Center Cleanup | 흐름 | 처리한 알림은 알림 센터에서도 지우기 | 확인 [QDWINNTF] |
| DSK-51 | 집중 모드 존중 — Focus Session Respect | 기준 | 집중 중엔 알림을 조용히 알림 센터로만 보내기 | 확인 [QDWINNTF] |
| DSK-52 | 알림에서 맥락 열기 — Contextual Launch | 흐름 | 알림을 누르면 그 내용이 있는 화면으로 바로 | 확인 [QDWINNTF] |
| DSK-53 | 파일 열기 패널 — Open Panel | 부품 | 시스템 파일 고르기 창, 버튼 이름은 할 일에 맞게 | 확인 [QDHIGFILE] |
| DSK-54 | 저장 창 부가 보기 — Save Panel Accessory | 부품 | 시스템 저장 창에 형식·옵션 칸을 덧붙이기 | 확인 [QDHIGFILE] |
| DSK-55 | 미저장 표시 점 — Unsaved Changes Dot | 부품 | 자동 저장이 꺼졌을 때 닫기 버튼 속 점으로 알림 | 확인 [QDHIGFILE] |
| DSK-56 | 자동 저장과 확장자 숨김 — Autosave and Hidden Extensions | 기준 | 따로 저장 안 해도 보존, 확장자는 기본으로 숨김 | 확인 [QDHIGFILE] |
| DSK-57 | 문서 런처 — Document Launcher | 구성 | 제목 카드와 파일 목록으로 여는 문서 앱 첫 화면 | 확인 [QDHIGFILE] |
| DSK-58 | 새로 만들기·열기 명령 — New and Open Commands | 기준 | 파일 메뉴와 단축키 목록에 새로 만들기·열기 두기 | 확인 [QDHIGFILE] |
| DSK-59 | 시스템 빠른 보기 생성기 — Quick Look Generator | 모듈 | Finder·Spotlight에서 앱 파일을 미리 보게 제공 | 확인 [QDHIGFILE] |
| DSK-60 | Finder 동기화 확장 — Finder Sync Extension | 모듈 | 파일 아이콘에 동기화 배지와 전용 메뉴 붙이기 | 확인 [QDHIGFILE] |
| DSK-61 | 파일 제공자 확장 — File Provider Extension | 모듈 | 클라우드 파일을 시스템 파일 앱 안에 보여 주기 | 확인 [QDHIGFILE] |
| DSK-62 | 탐색기 우클릭 메뉴 등록 — Shell Context Menu | 모듈 | 파일 우클릭에 앱 작업 추가, 항목은 적게 | 확장 [MK] · 대조 [QDHIGFILE] |
| DSK-63 | 썸네일 제공자 — Thumbnail Provider | 모듈 | 탐색기 아이콘 자리에 파일 속 모습을 그리기 | 확장 [MK] · 대조 [QDHIGFILE] |
| DSK-64 | 문서 아이콘 — Document Icon | 부품 | 앱 파일 형식마다 알아보는 아이콘 제공 | 확장 [MK] · 대조 [QDPWAFH] |
| DSK-65 | 파일 연결·기본 앱 — File Association | 흐름 | 파일을 두 번 눌렀을 때 열 앱 등록과 기본 앱 안내 | 확장 [MK] · 대조 [QDPWAFH] |
| DSK-66 | 아이콘에 끌어 열기 — Drop on App Icon | 흐름 | 독·작업 표시줄 아이콘에 파일을 끌어 바로 열기 | 확장 [MK] |
| DSK-67 | 앱 밖으로 끌어내기 — Drag Out to Desktop | 흐름 | 앱 속 항목을 바탕화면·폴더로 끌어 파일로 만들기 | 확장 [MK] |
| DSK-68 | 인쇄 페이지 설정 — Page Setup | 부품 | 용지·방향을 정하는 시스템 대화상자 | 확인 [QDHIGPRT] |
| DSK-69 | 인쇄 창 앱 전용 항목 — Print Panel Custom Pane | 부품 | 시스템 인쇄 창에 앱만의 옵션 범주 더하기 | 확인 [QDHIGPRT] |
| DSK-70 | 인쇄 메뉴 흐리기 — Dimmed Print Command | 기준 | 인쇄할 것이 없으면 파일 메뉴 인쇄를 흐리게 | 확인 [QDHIGPRT] |
| DSK-71 | 시스템 글꼴·색 패널 — Fonts and Colors Panels | 부품 | 떠 있는 시스템 패널을 글꼴 보기 메뉴로 부르기 | 확인 [QDHIGPNL] |
| DSK-72 | 인스펙터 패널 — Inspector Panel | 부품 | 선택한 것의 속성을 떠 있는 창에서 고치기 | 확인 [QDHIGPNL] |
| DSK-73 | 패널 자동 숨김 — Panel Auto Hide | 기준 | 앱이 뒤로 가면 떠 있는 패널도 함께 숨기기 | 확인 [QDHIGPNL] |
| DSK-74 | HUD 패널 — HUD Panel | 부품 | 어두운 반투명 떠 있는 창, 미디어 앱에서만 | 확인 [QDHIGPNL] |
| DSK-75 | 끌기 복사·링크 포인터 — Drag Copy and Link Pointer | 기준 | 끌 때 복사인지 바로가기인지 포인터로 미리 알림 | 확인 [QDHIGPTR] |
| DSK-76 | 백그라운드 자동 업데이트 — Background Auto Update | 흐름 | 뒤에서 받아 두고 다시 시작할지 물어 적용 | 확인 [QDELUPD] · 대조 [QDTAUPD] |
| DSK-77 | 업데이트 서명 검증 — Signed Updates | 기준 | 서명이 맞는 업데이트만 설치, 끌 수 없게 | 확인 [QDTAUPD] · 대조 [QDELUPD] |
| DSK-78 | 업데이트 설치 표시 방식 — Installer UI Mode | 기준 | 설치 창을 진행만·기본·조용히 중 고르기 | 확인 [QDTAUPD] |
| DSK-79 | 업데이트 채널 — Update Channel | 모듈 | 안정판·베타 중 받을 판을 설정에서 고르기 | 확장 [MK] |
| DSK-80 | 설치 마법사 — Installer Wizard | 흐름 | 약관·위치·옵션을 단계로 묻고 설치 | 확장 [MK] |
| DSK-81 | 끌어 넣는 설치 — Drag to Applications | 흐름 | 디스크 이미지 창에서 앱을 응용 프로그램 폴더로 끌기 | 확장 [MK] |
| DSK-82 | 설치 범위 선택 — Per-user or All Users | 기준 | 나만 쓸지 모든 사용자용인지 설치 때 고르기 | 확장 [MK] |
| DSK-83 | 제거와 남은 자료 — Uninstall Flow | 흐름 | 제거 때 설정·자료를 지울지 묻고 사유 받기 | 확장 [MK] |
| DSK-84 | 첫 실행 설정 도우미 — Setup Assistant | 흐름 | 처음 켤 때 권한·가져오기·기본 설정을 차례로 | 확장 [MK] |
| DSK-85 | 설정 가져오기 — Import Settings | 흐름 | 다른 앱·예전 판의 설정과 자료를 옮겨 오기 | 확장 [MK] |
| DSK-86 | 라이선스 키 입력 — License Key Entry | 부품 | 붙여 넣기 쉬운 키 입력칸과 바로 형식 검사 | 확장 [MK] |
| DSK-87 | 오프라인 활성화 — Offline Activation | 흐름 | 인터넷 없는 PC는 요청 파일을 다른 기기로 인증 | 확장 [MK] |
| DSK-88 | 기기 활성화 관리 — Activation Seats | 구성 | 라이선스를 쓰는 기기 목록과 해제 버튼 | 확장 [MK] |
| DSK-89 | 체험판 남은 기간 — Trial Countdown | 부품 | 남은 날짜와 구매 버튼, 막기 전에 미리 알림 | 확장 [MK] |
| DSK-90 | 충돌 보고 대화상자 — Crash Reporter Dialog | 흐름 | 다시 켤 때 보낼 내용을 보여 주고 보낼지 묻기 | 확장 [MK] |
| DSK-91 | 진단 로그 내보내기 — Export Diagnostic Logs | 흐름 | 도움말 메뉴에서 로그를 파일 하나로 묶어 저장 | 확장 [MK] |
| DSK-92 | 안전 모드 시작 — Safe Mode Launch | 흐름 | 확장·설정을 끈 채 켜서 문제 원인 가르기 | 확장 [MK] |
| DSK-93 | 서명 안 된 앱 경고 — Gatekeeper and SmartScreen | 기준 | 서명·공증이 없으면 설치를 막는 경고가 뜸 | 확장 [MK] · 대조 [QDELUPD] |
| DSK-94 | 시스템 권한 설정 안내 — Privacy Settings Guide | 흐름 | 화면 기록 권한은 시스템 설정으로 보내고 돌아오면 확인 | 확장 [MK] |
| DSK-95 | 앱 정보 창 — About Window | 부품 | 판 번호·저작권·라이선스를 보여 주는 작은 창 | 확장 [MK] · 대조 [QDGNMENU] |
| DSK-96 | 환경설정 창 — Preferences Window | 구성 | 설정을 주제 탭으로 나눈 별도 창, 메뉴·단축키로 열기 | 확장 [MK] · 대조 [QDGNMENU] |
| DSK-97 | 확장 도구 막대 버튼 — Extension Action | 부품 | 16 DIP 아이콘과 툴팁으로 확장 기능 부르기 | 확인 [QDCRXACT] |
| DSK-98 | 확장 아이콘 배지 — Action Badge | 부품 | 아이콘 위 4자 이하 글자로 상태·개수 알림 | 확인 [QDCRXACT] |
| DSK-99 | 확장 팝업 — Extension Popup | 구성 | 아이콘 아래 뜨는 작은 창, 최대 800x600 | 확인 [QDCRXACT] |
| DSK-100 | 탭별 켜기·끄기 — Per-tab Enable | 기준 | 쓸 수 없는 사이트에선 확장 아이콘을 흐리게 | 확인 [QDCRXACT] |
| DSK-101 | 툴바 고정 여부 확인 — Pinned State Check | 흐름 | 아이콘이 숨겨져 있으면 고정하라고 안내 | 확인 [QDCRXACT] |
| DSK-102 | 확장 사이드 패널 — Extension Side Panel | 구성 | 페이지 옆에 붙어 탭을 옮겨도 남는 작업 창 | 확인 [QDCRXSP] |
| DSK-103 | 사이트별 사이드 패널 — Site-specific Side Panel | 기준 | 특정 사이트에서만 패널을 켜고 다른 곳에선 끄기 | 확인 [QDCRXSP] |
| DSK-104 | 아이콘 눌러 패널 열기 — Open Panel on Action Click | 흐름 | 팝업 대신 도구 막대 클릭으로 사이드 패널 열기 | 확인 [QDCRXSP] |
| DSK-105 | 확장 옵션 페이지 — Options Page | 구성 | 전체 탭 또는 확장 관리 화면 안 내장 설정 | 확인 [QDCRXOPT] |
| DSK-106 | 설치 권한 경고 — Permission Warnings | 기준 | 설치 때 뜨는 경고를 줄이려 권한은 최소로 | 확인 [QDCRXPRM] |
| DSK-107 | 권한 늘 때 비활성 — Disabled on Permission Increase | 기준 | 경고 붙는 권한을 더하면 수락 전까지 확장이 꺼짐 | 확인 [QDCRXPRM] |
| DSK-108 | 선택 권한 요청 — Optional Permissions | 흐름 | 기능을 쓸 때 그 자리에서 권한을 받기 | 확인 [QDCRXPRM] |
| DSK-109 | 누른 탭만 허용 — activeTab | 기준 | 누른 탭에만 잠깐 권한, 설치 경고 없음 | 확인 [QDCRXPRM] |
| DSK-110 | 페이지 삽입 UI 격리 — Content Script Shadow UI | 모듈 | 남의 페이지에 넣는 UI는 섀도 DOM으로 스타일 격리 | 확장 [MK] |
| DSK-111 | 확장 우클릭 메뉴 — Extension Context Menu | 부품 | 페이지·선택 글 우클릭에 확장 명령 추가 | 확장 [MK] |
| DSK-112 | 확장 단축키 — Extension Commands | 모듈 | 브라우저가 관리하는 확장 단축키, 사람이 바꿀 수 있게 | 확장 [MK] |
| DSK-113 | 새 탭 대체 — New Tab Override | 구성 | 새 탭을 확장 화면으로 바꾸기, 되돌리기 쉽게 | 확장 [MK] |
| DSK-114 | 주소창 키워드 — Omnibox Keyword | 흐름 | 주소창 키워드 뒤에 확장 검색 제안 보이기 | 확장 [MK] |
| DSK-115 | 설치 환영·제거 설문 — Welcome and Uninstall Pages | 흐름 | 설치 직후 사용법 탭, 제거 때 사유 묻는 페이지 | 확장 [MK] |
| DSK-116 | 웹앱 표시 모드 — Display Modes | 기준 | 독립 창·최소 UI·전체 화면·브라우저 중 고르기 | 확인 [QDPWADSN] |
| DSK-117 | 테마 색 제목 줄 — theme_color Title Bar | 기준 | 설치 웹앱 창 제목 줄 색을 단색으로 정하기 | 확인 [QDPWADSN] |
| DSK-118 | 설치 유도 자리 — Install Promotion Placement | 구성 | 머리글·메뉴·관심 뒤 배너·짧은 스낵바에 설치 버튼 | 확인 [QDPWAINST] |
| DSK-119 | 설치 제안 시점 — beforeinstallprompt Gate | 흐름 | 설치 가능 신호 뒤에만 보이고 거절은 기억 | 확인 [QDPWAINST] |
| DSK-120 | 창 컨트롤 겹침 — Window Controls Overlay | 구성 | 창 버튼만 남기고 제목 줄 자리까지 앱이 쓰기 | 확인 [QDPWAWCO] |
| DSK-121 | 웹앱 끌기 영역 — app-region | 기준 | 끌 곳은 drag, 버튼은 no-drag로 따로 지정 | 확인 [QDPWAWCO] · 대조 [QDELWIN] |
| DSK-122 | 웹앱 아이콘 배지 — App Badging | 부품 | 설치 웹앱 아이콘에 숫자나 점, 큰 수는 99+ | 확인 [QDPWABDG] |
| DSK-123 | 파일 처리기 — File Handlers | 모듈 | 설치 웹앱을 연결 프로그램에 올리고 첫 열기에 권한 확인 | 확인 [QDPWAFH] |
| DSK-124 | 공유 대상 등록 — Web Share Target | 모듈 | 설치 웹앱을 시스템 공유 목록에 넣기 | 확인 [QDPWASHR] |
| DSK-125 | 앱 바로 가기 메뉴 — App Shortcuts | 부품 | 아이콘 우클릭에 작업 몇 개, 적은 순서가 곧 표시 순서 | 확인 [QDPWASC] |
| DSK-126 | 오프라인 껍데기 — App Shell | 모듈 | 머리·메뉴 틀을 먼저 저장해 끊겨도 바로 뜨게 | 확장 [MK] |
| DSK-127 | 웹앱 링크 처리기 — Protocol Handlers | 모듈 | 설치 웹앱이 특정 링크 형식을 받아 열기 | 확장 [MK] |
| DSK-128 | 앱 창에서 열기 — Launch Handler | 기준 | 링크를 새 창 대신 이미 열린 앱 창에서 열기 | 확장 [MK] |
| DSK-129 | 앱 느낌 다듬기 — App-like Polish | 기준 | 글자 선택·당겨 새로고침을 끄고 안전 영역 지키기 | 확인 [QDPWADSN] |
| DSK-130 | 위젯 크기 계열 — Widget Size Family | 기준 | 소·중·대·특대 중 정보량에 맞는 크기만 제공 | 확인 [QDHIGWDG] · 대조 [QDWINWDG] |
| DSK-131 | 부속 위젯 — Accessory Widgets | 부품 | 잠금 화면용 원형·모서리·한 줄·사각 작은 위젯 | 확인 [QDHIGWDG] |
| DSK-132 | 대화형 위젯 — Interactive Widget | 부품 | 버튼·토글만 두고 앱처럼 꾸미지 않기 | 확인 [QDHIGWDG] |
| DSK-133 | 위젯 설정 편집 — Widget Configuration | 흐름 | 놓은 뒤 보여 줄 항목을 고르는 편집 화면 | 확인 [QDHIGWDG] · 대조 [QDANWDG] |
| DSK-134 | 위젯 렌더 모드 — Widget Rendering Modes | 기준 | 전체 색·강조·비브런트 모드에서 모두 읽히게 | 확인 [QDHIGWDG] |
| DSK-135 | 위젯 갱신 예산 — Widget Update Budget | 기준 | 실시간 갱신은 없으니 시각 표시는 시스템에 맡기기 | 확인 [QDHIGWDG] |
| DSK-136 | 스마트 스택 관련성 — Smart Stack Relevance | 기준 | 지금 쓸모 있을 때 위로 오르게 신호 주기 | 확인 [QDHIGWDG] |
| DSK-137 | 스탠바이 위젯 — StandBy Widgets | 구성 | 두 개를 나란히 크게, 어두우면 붉은 단색 | 확인 [QDHIGWDG] |
| DSK-138 | Mac 데스크톱 위젯 — Desktop Widgets on Mac | 기준 | 초점이 없을 때 흐린 비브런트로 바뀌어도 읽히게 | 확인 [QDHIGWDG] |
| DSK-139 | 다이내믹 아일랜드 세 모양 — Dynamic Island Presentations | 구성 | 작은·최소·펼친 모양마다 따로 배치 | 확인 [HIGLIVE] |
| DSK-140 | 라이브 액티비티 잠금 화면 — Live Activity on Lock Screen | 구성 | 높이 84~160pt 배너, 가장자리 14pt 여백 | 확인 [HIGLIVE] |
| DSK-141 | 라이브 액티비티 수명 — Live Activity Duration | 기준 | 최대 8시간, 끝난 뒤 15~30분 안에 치우기 | 확인 [HIGLIVE] |
| DSK-142 | 윈도우 위젯 보드 — Windows Widgets Board | 구성 | Win+W로 여는 판에 카드형 위젯 소·중·대 | 확인 [QDWINWDG] |
| DSK-143 | 한눈에 보는 위젯 원칙 — Glanceable Widget | 기준 | 한 가지 목적, 차분하고 제때 바뀌는 카드 | 확인 [QDWINWDG] · 대조 [QDHIGWDG] |
| DSK-144 | 안드로이드 위젯 네 유형 — App Widget Types | 기준 | 정보·모음·조작·혼합 중 목적에 맞게 고르기 | 확인 [QDANWDG] |
| DSK-145 | 위젯 제스처 제한 — Widget Gesture Limits | 기준 | 누르기와 세로 넘기기만, 가로 쓸기 금지 | 확인 [QDANWDG] |
| DSK-146 | 위젯 크기 조절 — Resizable Widget | 기준 | 홈 화면에서 늘리고 줄여도 배치가 버티게 | 확인 [QDANWDG] |
| DSK-147 | 빠른 설정 타일 — Quick Settings Tile | 부품 | 켜짐·꺼짐·쓸 수 없음 세 상태, 앱당 2개까지 | 확인 [QDANQST] |
| DSK-148 | 타일 추가 요청 — Request Add Tile | 흐름 | 기능을 쓰는 맥락에서만 타일 추가를 제안 | 확인 [QDANQST] |
| DSK-149 | 제어 센터 컨트롤 — Control Center Controls | 부품 | 제어 센터·잠금 화면에 앱 동작 버튼 하나 | 확장 [MK] |
| DSK-150 | 창 크기 등급 — Window Size Classes | 기준 | 폭 600·840·1200·1600dp 경계, 기기 아닌 창 기준 | 확인 [QDANWSC] |
| DSK-151 | iPad 창 모드 전환 — iPad Windowed Mode | 흐름 | 전체 화면과 크기 조절 창을 오가도 위치 기억 | 확인 [QDHIGWIN] |
| DSK-152 | 스테이지 매니저 — Stage Manager | 구성 | 여러 창을 겹쳐 묶어 두는 iPad·Mac 작업 방식 | 확장 [MK] · 대조 [QDHIGWIN] |
| DSK-153 | 포인터 효과 — Pointer Effects | 기준 | 버튼 위 강조·들어 올림·호버로 누를 곳 알림 | 확인 [QDHIGPTR] |
| DSK-154 | 포인터 자석 — Pointer Magnetism | 기준 | 포인터가 가까운 버튼에 끌려 붙게 | 확인 [QDHIGPTR] |
| DSK-155 | 펜슬 손글씨 입력 — Scribble | 기준 | 입력칸에 손으로 쓰면 글자로, 암호 칸 제외 | 확인 [QDHIGPEN] |
| DSK-156 | 펜슬 두 번 탭·쥐기 — Double Tap and Squeeze | 기준 | 도구 전환처럼 되돌리기 쉬운 동작만 연결 | 확인 [QDHIGPEN] |
| DSK-157 | 펜슬 호버 미리보기 — Pencil Hover | 기준 | 띄운 채로 그려질 모습만 보이고 실행은 금지 | 확인 [QDHIGPEN] |
| DSK-158 | 펜슬 즉시 표시 — Immediate Marking | 기준 | 닿는 순간 획을 그리고 돌리기는 획 모양만 바꾸기 | 확인 [QDHIGPEN] |
| DSK-159 | Command 길게 눌러 단축키 목록 — Shortcut Overlay | 부품 | 하드웨어 키보드 단축키를 시스템 목록으로 한눈에 | 확인 [QDHIGKEY] · 대조 [QDHIGFILE] |
| DSK-160 | 테이블톱 자세 — Tabletop Posture | 구성 | 반쯤 접으면 위는 보기, 아래는 조작으로 나누기 | 확인 [QDANFOLD] |
| DSK-161 | 책 자세 — Book Posture | 구성 | 세로 접힘선 양쪽에 목록과 상세를 나누기 | 확인 [QDANFOLD] |
| DSK-162 | 접힘선 피하기 — Avoid the Hinge | 기준 | 접힘선 위에 버튼·글자를 두지 않기 | 확인 [QDANFOLD] |
| DSK-163 | 안드로이드 데스크톱 창 — Desktop Windowing | 구성 | 태블릿에서 앱을 크기 조절 창으로 띄울 때 대응 | 확장 [MK] · 대조 [QDANWSC] |
| DSK-164 | 앱 사이 끌어 놓기 — Cross-app Drag and Drop | 흐름 | 분할 화면 옆 앱으로 글·사진을 끌어 옮기기 | 확장 [MK] |
