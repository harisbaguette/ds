# 71. 게임 입력·플랫폼 적응

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 71번 분류 GIO다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

모바일 터치, PC 키보드·마우스, 게임패드처럼 기기와 입력 장치가 달라질 때 조작과 화면을 맞추는 규칙을 모았다. 가상 조이스틱 자체·버튼 재배치·안전영역 자동 배치 같은 기본 요소는 41-GAM에, 엔진 구현 기술은 73-GTK에, 조준 보조 같은 접근성 선택지는 게임 접근성 분류에 두고, 여기서는 기기 차이에서 생기는 세부 규칙만 다룬다. 클라우드 저장·업적·플랫폼 겹화면처럼 여러 플랫폼이 함께 쓰는 연동 규칙도 이 분류에 넣는다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| GIO-01 | 엄지 닿는 범위 배치 — Thumb Reach Zone | 기준 | 자주 쓰는 버튼을 엄지 가까이 둠, 이동·시점 원은 비움 | 확인 [QHHIGGC] |
| GIO-02 | 왼쪽 이동·오른쪽 시점 분담 — Left Move·Right Camera | 기준 | 왼손은 이동, 오른손은 시점 조작으로 나눔 | 확인 [QHHIGGC] |
| GIO-03 | 게임 터치 버튼 최소 크기 — 44pt·28pt | 기준 | 주요 버튼 44pt, 메뉴 버튼 28pt 이상으로 잡음 | 확인 [QHHIGGC] · 대조 [QAHIGGAME] |
| GIO-04 | 실제 길이 기준 터치 크기 — 15mm·24mm | 기준 | 폰은 15mm, 태블릿은 24mm 이상으로 잡음 | 확인 [XAGRM] |
| GIO-05 | 버튼 사이 빈 틈 — Inactive Space | 기준 | 버튼 둘레에 눌리지 않는 여백을 둠 | 확인 [XAGRM] |
| GIO-06 | 누름 상태 표시 — Pressed State | 기준 | 눌린 버튼 모양을 바로 바꿔 반응을 보임 | 확인 [QHHIGGC] |
| GIO-07 | 행동을 그린 버튼 그림 — Action Icon | 기준 | 버튼에 그 행동을 뜻하는 그림을 넣음 | 확인 [QHHIGGC] |
| GIO-08 | 고정 조이스틱 — Fixed Joystick | 부품 | 늘 같은 자리에 있어 위치를 외우기 쉬움 | 확장 [MK] · 대조 [QIUNONS] |
| GIO-09 | 떠 있는 조이스틱 — Floating Joystick | 부품 | 손가락이 처음 닿은 자리에 스틱이 생김 | 확장 [MK] |
| GIO-10 | 따라오는 조이스틱 — Dynamic Joystick | 부품 | 손가락이 멀어지면 스틱 중심이 따라옴 | 확장 [MK] |
| GIO-11 | 조이스틱 손잡이 이동 반경 — Movement Range | 기준 | 손잡이가 중심에서 움직일 최대 거리를 정함 | 확인 [QIUNONS] |
| GIO-12 | 안쪽 무반응 구역 — Min Deadzone | 기준 | 살짝 닿은 흔들림은 입력으로 치지 않음 | 확인 [QIUNPROC] · 대조 [QIUEEI] |
| GIO-13 | 바깥 최대치 구역 — Max Deadzone | 기준 | 끝까지 밀기 전에 최대 입력으로 채움 | 확인 [QIUNPROC] |
| GIO-14 | 가로 두 손 배치 — Landscape Two-thumb | 구성 | 두 엄지가 양쪽 아래 모서리를 나눠 씀 | 확장 [MK] · 대조 [QHHIGGC] |
| GIO-15 | 세로 한 손 배치 — Portrait One-hand | 구성 | 한 엄지로 화면 아래쪽만 써서 조작함 | 확장 [MK] |
| GIO-16 | 가로·세로 모두 지원 — Both Orientations | 기준 | 기기 방향을 하나로 묶지 않고 둘 다 받음 | 확인 [XAGRM] |
| GIO-17 | 탭과 길게 누르기 구분 시간 — Hold Time Threshold | 기준 | 누른 시간으로 두 동작을 가름 | 확인 [QIUEEI] |
| GIO-18 | 손 뗄 때 실행 — Activate on Release | 기준 | 손가락을 뗄 때 실행해 취소할 틈을 줌 | 확인 [XAGRM] |
| GIO-19 | 밀어서 취소 — Slide to Cancel | 흐름 | 버튼 밖으로 밀어내면 기술을 취소함 | 확인 [XAGRM] |
| GIO-20 | 스와이프 시점 영역 — Swipe Camera Area | 부품 | 오른쪽 빈 곳을 끌어 시점을 돌림 | 확장 [MK] · 대조 [QHHIGGC] |
| GIO-21 | 조준경별 터치 감도 — Per-scope Sensitivity | 기준 | 기본·조준·배율마다 감도를 따로 둠 | 확인 [XAGRM] |
| GIO-22 | 조준 켜는 방식 고르기 — ADS Tap·Hold·Hybrid | 부품 | 조준을 탭·누름·혼합 가운데서 고름 | 확인 [XAGRM] |
| GIO-23 | 자동 사격 모드 — Auto Fire | 부품 | 조준이 맞으면 저절로 쏘게 함 | 확인 [XAGRM] |
| GIO-24 | 아무 곳 탭 사격 — Tap Anywhere to Fire | 부품 | 화면 어디를 눌러도 쏘게 함 | 확인 [XAGRM] |
| GIO-25 | 자동 줍기 — Auto Pick Up | 기준 | 줍기 버튼 없이 닿기만 해도 주움 | 확인 [XAGRM] |
| GIO-26 | 기울이기 조작과 탭 대안 — Tilt to Steer | 부품 | 기울이기 대신 탭 조작도 함께 둠 | 확인 [XAGRM] |
| GIO-27 | 폰 자이로 조준 — Gyro Aim | 부품 | 기기를 움직여 조준을 미세하게 다듬음 | 확장 [MK] |
| GIO-28 | 터치 배치 편집기 — Touch Layout Editor | 모듈 | 버튼 위치·크기·투명도를 직접 바꿈 | 확인 [XAGRM] |
| GIO-29 | 배치 저장·초기화 — Save·Reset Layout | 부품 | 바꾼 배치를 저장하고 기본으로 되돌림 | 확인 [XAGRM] |
| GIO-30 | 미리 만든 조작 배치 — Preset Layouts | 부품 | 여러 조작 배치 가운데 하나를 고름 | 확인 [XAGRM] |
| GIO-31 | 가상 컨트롤러 겹화면 — Virtual Controller | 모듈 | 실제 패드를 흉내 낸 버튼을 화면에 띄움 | 확인 [QIAPVC] · 대조 [QHHIGGC] |
| GIO-32 | 패드 연결 시 터치 버튼 숨김 | 흐름 | 실제 패드가 붙으면 화면 버튼을 치움 | 확장 [MK] · 대조 [QIANDGC] |
| GIO-33 | 노치 쪽 조작 금지 — Cutout Keep-out | 기준 | 노치 근처엔 누를 것을 두지 않음, 터치가 둔함 | 확인 [QIANDCUT] |
| GIO-34 | 배경만 노치까지 채우기 — Short Edges Mode | 기준 | 그림은 가장자리까지, 글·버튼은 안쪽에 둠 | 확인 [QIANDCUT] |
| GIO-35 | 가장자리 제스처 먼저 받기 — Deferring System Gestures | 기준 | 플레이 중 화면 끝 밀기를 게임이 먼저 받음 | 확인 [QIAPDEFER] |
| GIO-36 | 플레이 중에만 제스처 제외 — Gesture Exclusion | 기준 | 조작 구역만 시스템 밀기에서 빼 둠 | 확인 [QIANDGN] |
| GIO-37 | 몰입 모드 — Immersive Mode | 기준 | 시스템 막대를 숨기되 밀면 다시 꺼냄 | 확인 [QIANDGN] |
| GIO-38 | 홈 막대 흐리게 숨김 — Home Indicator Auto-hide | 기준 | 플레이 중 홈 막대를 눈에 덜 띄게 함 | 확장 [MK] · 대조 [QIAPDEFER] |
| GIO-39 | 전화·알림 방해 시 일시정지 — Interruption Pause | 흐름 | 앱을 벗어나면 게임을 멈추고 기다림 | 확장 [MK] · 대조 [QASTOVL] |
| GIO-40 | 발열 단계 대응 — Thermal Throttling | 흐름 | 기기가 뜨거워지면 품질을 먼저 낮춤 | 확인 [QIADPF] |
| GIO-41 | 성능·배터리 우선 모드 — Game Mode | 부품 | 사용자 설정에 맞춰 성능이나 배터리를 앞세움 | 확인 [QIADPF] |
| GIO-42 | 기기 성능별 첫 품질값 — Device-based Defaults | 기준 | 기기 정보를 보고 처음 품질값을 정함 | 확인 [QAHIGGAME] |
| GIO-43 | 연결 품질 표시 — Network Quality Indicator | 부품 | 핑과 신호 세기를 작은 막대로 보임 | 확장 [MK] |
| GIO-44 | 채팅 받아쓰기 — Chat Dictation | 부품 | 채팅을 말로 입력할 수 있게 함 | 확인 [XAGRM] |
| GIO-45 | 화면 키보드 위로 입력창 올림 | 기준 | 키보드가 뜨면 채팅 입력칸을 가리지 않음 | 확장 [MK] |
| GIO-46 | 접는 폰·태블릿 배치 전환 — Foldable Reflow | 기준 | 화면 비율이 바뀌면 버튼 배치를 다시 짬 | 확장 [MK] |
| GIO-47 | 주사율 선택 — Refresh Rate Option | 부품 | 60·90·120Hz 가운데 고름, 배터리 소모 안내 | 확장 [MK] |
| GIO-48 | PC판 “클릭” 문구 — Click instead of Tap | 기준 | PC에선 안내 문구의 “탭”을 “클릭”으로 | 확인 [QAGPGPC] |
| GIO-49 | 멀티터치를 마우스·키로 대체 | 기준 | 두 손가락 확대 같은 동작을 휠·키로 바꿈 | 확인 [QAGPGPC] |
| GIO-50 | 실제 키보드 있으면 화면 키보드 숨김 | 기준 | PC에선 누르는 화면 키보드를 띄우지 않음 | 확인 [QAGPGPC] |
| GIO-51 | 마우스용 스크롤 막대 — Scrollbars | 기준 | 스크롤 목록에 막대를 보여 끌 수 있게 함 | 확인 [QAGPGPC] |
| GIO-52 | 키·마우스 배정 안내 창 — Input SDK Overlay | 모듈 | 현재 키 배정을 보여 주고 바꾸게 함 | 확인 [QIPGINP] |
| GIO-53 | 키보드 키 그림 — Keyboard Glyph | 부품 | 안내 문구에 실제 키 모양 그림을 넣음 | 확장 [MK] |
| GIO-54 | 키 설정 화면 — Keybinding Screen | 모듈 | 행동별 배정 키를 표로 보이고 바꿈 | 확인 [QIUNBIND] · 대조 [XAGRM] |
| GIO-55 | 키 충돌 경고 — Binding Conflict | 흐름 | 이미 쓰는 키면 알리고 맞바꿀지 물음 | 확장 [MK] · 대조 [QIUNBIND] |
| GIO-56 | 배정에서 빼는 키 — Excluded Controls | 기준 | 시스템 키 같은 것은 배정 대상에서 뺌 | 확인 [QIUNBIND] |
| GIO-57 | 배정 대기 중 취소 키 — Cancel Rebinding | 기준 | 새 키를 기다리는 동안 정한 키로 취소 | 확인 [QIUNBIND] |
| GIO-58 | 키 배정 기본값 복원 — Reset to Defaults | 부품 | 바꾼 키를 한 번에 처음으로 되돌림 | 확인 [QIUNBIND] |
| GIO-59 | 바꾼 배정 저장·불러오기 — Binding Overrides | 기준 | 바꾼 키를 저장해 다음 실행에도 유지 | 확인 [QIUNBIND] |
| GIO-60 | 1순위·2순위 키 — Primary·Secondary Binding | 부품 | 한 행동에 키를 두 개까지 걸 수 있음 | 확장 [MK] |
| GIO-61 | 자판 배열 대응 — Physical Key Position | 기준 | AZERTY 같은 배열에서도 키 자리 기준으로 배정 | 확장 [MK] |
| GIO-62 | 상황별 조작표 — Context Control Schemes | 기준 | 메뉴·본 게임·미니게임 조작을 따로 둠 | 확인 [QIPGINP] · 대조 [QIUEEI] |
| GIO-63 | 일부 키 재배정 잠금 | 기준 | 꼭 고정할 키만 골라 재배정을 막음 | 확인 [QIPGINP] |
| GIO-64 | 글 입력 중 재배정 멈춤 | 기준 | 입력칸에 쓰는 동안 바꾼 키 동작을 끔 | 확인 [QIPGINP] |
| GIO-65 | 조작 묶음 프리셋 — Mappable Config | 부품 | 조작 묶음에 이름을 붙여 골라 씀 | 확인 [QIUEEI] |
| GIO-66 | 감도 조절 폭 — Sensitivity Range | 기준 | 기본값에서 위아래 50% 이상 조절되게 함 | 확인 [XAGRM] |
| GIO-67 | 마우스 감도 — Mouse Sensitivity | 부품 | 시점이 도는 빠르기를 숫자로 맞춤 | 확장 [MK] · 대조 [XAGRM] |
| GIO-68 | 원시 마우스 입력 — Raw Input | 기준 | 운영체제 가속을 거치지 않은 움직임을 씀 | 확인 [QIMSRAW] · 대조 [QIPCWMA] |
| GIO-69 | 마우스 가속·부드럽게 하기 끄기 | 부품 | 가속과 스무딩을 따로 끌 수 있게 함 | 확인 [QIPCWMA] |
| GIO-70 | 시점 상하·좌우 반전 — Invert X·Y | 부품 | 시점 방향을 축마다 뒤집음 | 확인 [XAGRM] · 대조 [QIUNPROC] |
| GIO-71 | 조준 중 감도 따로 — ADS Sensitivity | 부품 | 조준했을 때 감도를 따로 맞춤 | 확장 [MK] · 대조 [XAGRM] |
| GIO-72 | 커서 잠금·숨김 — Cursor Lock | 기준 | 플레이 중엔 커서를 묶어 숨기고 메뉴에선 풂 | 확장 [MK] |
| GIO-73 | 커서 창 안에 가두기 — Cursor Confine | 기준 | 여러 모니터에서 커서가 옆 화면으로 안 빠짐 | 확장 [MK] |
| GIO-74 | 창 모드 선택 — Window Mode | 부품 | 전체 화면·테두리 없는 창·창 가운데 고름 | 확인 [QIPCWWIN] |
| GIO-75 | 테두리 없는 창 — Borderless Windowed | 기준 | 창 전환이 빠름, 입력 지연이 조금 늘 수 있음 | 확인 [QIPCWWIN] |
| GIO-76 | Alt+Enter 전환 | 기준 | 전체 화면과 창 모드를 키 하나로 오감 | 확인 [QIPCWWIN] |
| GIO-77 | 해상도·주사율 목록 — Resolution·Refresh | 부품 | 모니터가 지원하는 값만 목록에 보임 | 확장 [MK] |
| GIO-78 | 초광각 화면 대응 — Hor+ Ultrawide | 기준 | 넓은 화면에선 옆 시야를 더 보여 줌 | 확인 [QIPCWUW] · 대조 [QIPCWFOV] |
| GIO-79 | HUD 16:9 안쪽 고정 — HUD Constrain | 기준 | 21:9에서도 HUD는 가운데 16:9 안에 둠 | 확장 [MK] · 대조 [QIPCWUW] |
| GIO-80 | 컷신 위아래·양옆 띠 — Letterbox·Pillarbox | 기준 | 영상 비율이 다르면 띠로 남는 곳을 채움 | 확인 [QIPCWUW] |
| GIO-81 | 시야각 슬라이더 — FOV Slider | 부품 | PC는 85~110도 안팎을 범위로 둠 | 확인 [QIPCWFOV] |
| GIO-82 | UI 크기 배율 — UI Scale | 부품 | 글자·HUD 크기를 해상도와 따로 맞춤 | 확장 [MK] |
| GIO-83 | 프레임 상한 — Frame Rate Cap | 부품 | 최대 FPS를 정해 열과 전력을 줄임 | 확인 [QIPCWFPS] · 대조 [QIPCWVS] |
| GIO-84 | 수직 동기화 — Vsync | 부품 | 화면 찢김을 막는 동기화를 켜고 끔 | 확인 [QIPCWVS] |
| GIO-85 | 삼중 버퍼링 — Triple Buffering | 부품 | 수직 동기화 때 프레임 급락을 줄임 | 확인 [QIPCWVS] |
| GIO-86 | 가변 주사율 — VRR G-Sync·FreeSync | 기준 | 모니터가 프레임에 맞춰 새로 그리게 함 | 확인 [QIPCWFPS] |
| GIO-87 | 그래픽 프리셋 — Low~Epic | 부품 | 여러 설정을 한 단계로 묶어 고름 | 확인 [QIUESCAL] |
| GIO-88 | 렌더 해상도 배율 — Render Scale | 부품 | 화면보다 작게 그려 성능을 얻음 | 확인 [QIUESCAL] |
| GIO-89 | 그래픽 설정 즉시 미리보기 — Live Preview | 흐름 | 바꾼 품질을 바로 화면에 비춰 보임 | 확장 [MK] |
| GIO-90 | 화면 설정 되돌리기 타이머 — Revert Timer | 흐름 | 몇 초 안에 확인 없으면 이전 값으로 | 확장 [MK] |
| GIO-91 | 재시작 필요 표시 — Restart Required | 기준 | 다시 켜야 적용되는 항목에 표시를 붙임 | 확장 [MK] |
| GIO-92 | HDR 밝기 맞춤 — HDR Calibration | 흐름 | 종이 흰색과 최대 밝기를 차례로 맞춤 | 확인 [QIPCWHDR] |
| GIO-93 | 밝기·감마 맞춤 화면 — Gamma Calibration | 흐름 | 겨우 보이는 그림을 기준으로 밝기 맞춤 | 확장 [MK] |
| GIO-94 | 업스케일 품질 단계 — Quality·Balanced·Performance | 부품 | 단계마다 확대 배율을 함께 적음 | 확인 [QIFSR] |
| GIO-95 | 업스케일 기술 이름 — DLSS·FSR | 기준 | 제조사 기술 이름을 그대로 적음 | 확인 [QINVDLSS] · 대조 [QIFSR] |
| GIO-96 | 프레임 생성 — Frame Generation | 부품 | 지연 줄이는 기능과 함께 켜게 함 | 확인 [QINVDLSS] |
| GIO-97 | 선명도 슬라이더 — Sharpening | 부품 | 업스케일 뒤 흐릿함을 조정함 | 확인 [QIFSR] |
| GIO-98 | FPS·핑 표시 — Performance Counter | 부품 | 구석에 작게 프레임 수와 지연을 보임 | 확인 [QIPCWFPS] |
| GIO-99 | 게임 띄울 모니터 선택 — Display Select | 부품 | 여러 모니터 가운데 게임 화면을 고름 | 확장 [MK] |
| GIO-100 | 창 전환 시 멈춤·소리 끔 — Focus Loss | 흐름 | Alt+Tab으로 나가면 멈추거나 소리를 끔 | 확장 [MK] · 대조 [QIPCWWIN] |
| GIO-101 | 개발자 콘솔 — Dev Console | 모듈 | 명령어 입력 창, 기본값은 꺼 둠 | 확장 [MK] |
| GIO-102 | 모드 관리 화면 — Mod·Workshop Manager | 모듈 | 받은 모드를 켜고 끄고 순서를 정함 | 확장 [MK] |
| GIO-103 | 셰이더 준비 진행률 — Shader Compilation | 부품 | 첫 실행 준비를 진행 막대로 보임 | 확장 [MK] |
| GIO-104 | 기기별 그래픽 설정 저장 | 기준 | 그래픽 값은 기기마다 따로 저장함 | 확인 [QADECKREC] |
| GIO-105 | 입력기 조합 창 — IME Composition Window | 부품 | 조합 중인 글자를 커서 자리에 띄움 | 확인 [QIMSIME] |
| GIO-106 | 입력기 후보 창 — IME Candidate Window | 부품 | 한자·후보 목록을 입력칸 옆에 띄움 | 확인 [QIMSIME] |
| GIO-107 | 패드 종류별 버튼 그림 자동 전환 | 흐름 | 연결된 패드 모양에 맞는 그림으로 바꿈 | 확인 [QIANDGCL] · 대조 [QIUECUI] |
| GIO-108 | A·B 자리 반대 배열 — Reverse Layout | 기준 | 닌텐도식은 A·B 위치가 반대임을 반영 | 확인 [QIANDGCL] |
| GIO-109 | 도형 버튼 배열 — Shapes Layout | 기준 | 플레이스테이션은 도형 그림으로 적음 | 확인 [QIANDGCL] |
| GIO-110 | 마지막 입력 기기 따라가기 — Last Input Device | 흐름 | 방금 만진 기기의 그림으로 안내를 바꿈 | 확인 [QADECKCMP] · 대조 [QIUNBIND] |
| GIO-111 | 쓰지 않는 기기 그림 숨김 | 기준 | 패드를 쓰는 동안 키보드 그림을 안 보임 | 확인 [QADECKCMP] |
| GIO-112 | 실제 배정대로 버튼 그림 — Origin Glyphs | 기준 | 사용자가 바꾼 배정대로 그림을 보임 | 확인 [QISTINPT] · 대조 [QIAPGCF] |
| GIO-113 | 기종별 버튼 그림 모음 — Input Prompt Pack | 부품 | 엑스박스·PS·스위치·덱 버튼 그림 세트 | 확인 [QIKENNEY] |
| GIO-114 | 십자키·스틱 메뉴 이동 — Cardinal Navigation | 기준 | 스틱과 십자키로 메뉴 칸을 옮김 | 확인 [QIUECUI] · 대조 [XAGRM] |
| GIO-115 | 돌아올 때 초점 기억 — Focus Memory | 기준 | 이전 화면으로 오면 마지막 칸에 초점 | 확장 [MK] |
| GIO-116 | 가상 커서 — Virtual Cursor | 부품 | 스틱으로 화살표를 움직여 누름 | 확장 [MK] · 대조 [QIANDGCL] |
| GIO-117 | 원형 메뉴 — Radial Menu | 부품 | 스틱 방향으로 여러 항목 가운데 고름 | 확장 [MK] |
| GIO-118 | 길게 눌러 확정 — Hold to Confirm | 부품 | 되돌릴 수 없는 일은 눌러 채워야 실행 | 확장 [MK] · 대조 [QIUEEI] |
| GIO-119 | 확인·취소 버튼 지역차 | 기준 | 기종·지역마다 확인 버튼이 다름을 반영 | 확장 [MK] |
| GIO-120 | 트리거 누름 단계 — Trigger Threshold | 기준 | 반쯤 누름과 끝까지 누름을 나눠 받음 | 확장 [MK] |
| GIO-121 | 패드 진동 세기 — Vibration Strength | 부품 | 진동을 끄거나 세기를 고름 | 확장 [MK] · 대조 [QIAPGCF] |
| GIO-122 | 패드 자이로 조준 — Controller Gyro | 부품 | 패드 기울임으로 조준을 다듬음 | 확인 [QISTINPT] · 대조 [QIAPGCF] |
| GIO-123 | 스틱 쏠림 보정 — Joystick Flat | 기준 | 가만히 둬도 0이 아닌 값은 무시함 | 확인 [QIANDCI] |
| GIO-124 | 스틱 반응 곡선 — Response Curve | 부품 | 기울인 정도와 빠르기의 관계를 고름 | 확장 [MK] |
| GIO-125 | 동작 묶음 — Action Sets | 기준 | 메뉴와 본 게임 조작을 따로 묶음 | 확인 [QISTINPT] |
| GIO-126 | 동작 묶음 겹 — Action Set Layers | 기준 | 부모 설정은 두고 일부만 덮어씀 | 확인 [QISTINPT] |
| GIO-127 | 스팀 조작 설정 바로 열기 — Binding Panel | 흐름 | 게임 안에서 스팀 조작 설정 창을 엶 | 확인 [QISTINPT] |
| GIO-128 | 마우스식·스틱식 시점 함께 받기 | 기준 | 트랙패드와 스틱 시점을 동시에 받음 | 확인 [QADECKREC] |
| GIO-129 | 스팀 덱 최소 글자 9px | 기준 | 1280×800에서 가장 작은 글자 9px 이상 | 확인 [QADECKCMP] |
| GIO-130 | 스팀 덱 기본 해상도 — 1280×800 | 기준 | 16:10 화면을 먼저 맞춰 지원함 | 확인 [QADECKCMP] |
| GIO-131 | 스팀 덱 호환 등급 — Verified·Playable | 기준 | 검증·플레이 가능·미지원 셋으로 나뉨 | 확인 [QADECKCMP] |
| GIO-132 | 패드만으로 모든 기능 — Default Controller Config | 기준 | 기본 배정만으로 모든 내용에 닿게 함 | 확인 [QADECKCMP] · 대조 [XAGRM] |
| GIO-133 | 패드용 글자 입력 — Controller Text Entry | 흐름 | 입력칸에 가면 화면 키보드를 자동으로 띄움 | 확인 [QADECKREC] · 대조 [QADECKCMP] |
| GIO-134 | 시작 창도 패드로 — Launcher Navigation | 기준 | 실행기와 첫 창도 패드로 조작되게 함 | 확인 [QADECKCMP] |
| GIO-135 | 패드 끊김 일시정지 — Disconnect Pause | 흐름 | 연결이 끊기면 멈추고 다시 연결을 안내 | 확장 [MK] · 대조 [QIANDGC] |
| GIO-136 | 플레이어별 패드 배정 — Player Assignment | 기준 | 기기 번호를 각 플레이어와 묶음 | 확인 [QIANDCI] |
| GIO-137 | 버튼 눌러 참가 — Press to Join | 흐름 | 새 패드 버튼을 누르면 플레이어가 늘어남 | 확인 [QIUNPIM] |
| GIO-138 | 화면 나누기 — Split Screen | 구성 | 한 화면을 플레이어 수만큼 나눔 | 확인 [QIUNPIM] |
| GIO-139 | 패드 배터리 표시 — Controller Battery | 부품 | 패드 배터리가 적으면 미리 알림 | 확인 [QIAPGCF] · 대조 [QIANDGC] |
| GIO-140 | 패드 불빛 — Controller Light | 부품 | 불빛 색으로 플레이어나 상태를 알림 | 확인 [QIAPGCF] · 대조 [QIANDGC] |
| GIO-141 | 패드 조작 안내도 — Controller Diagram | 구성 | 패드 그림 위에 버튼별 행동을 적음 | 확장 [MK] |
| GIO-142 | 키보드·마우스·패드 모두 지원 | 기준 | 한 가지 입력만 강요하지 않음 | 확인 [XAGRM] · 대조 [QIAPGCF] |
| GIO-143 | 키보드만으로 모든 기능 | 기준 | 마우스 없이 키만으로 끝까지 할 수 있음 | 확인 [XAGRM] |
| GIO-144 | 하나로 묶은 입력 방식 — Unified Input Model | 기준 | 키보드·마우스·패드를 한 방식으로 받음 | 확인 [QIMSGI] |
| GIO-145 | 입력 기기별 매칭 — Input-based Matchmaking | 기준 | 패드와 마우스 사용자를 나눠 붙임 | 확장 [MK] |
| GIO-146 | 크로스플레이 켜기·끄기 — Crossplay Toggle | 부품 | 다른 기기 사용자와 함께할지 고름 | 확장 [MK] |
| GIO-147 | 상대 입력 기기 아이콘 | 부품 | 명단에 상대가 쓰는 기기 그림을 붙임 | 확장 [MK] |
| GIO-148 | 저장 충돌 고르기 — Save Conflict | 흐름 | 기기 진행과 클라우드 진행을 나란히 두고 고름 | 확인 [QAPGSSAVE] |
| GIO-149 | 저장 칸 표지 — Save Snapshot Cover | 부품 | 저장 칸에 그림·설명·시간을 붙임 | 확인 [QAPGSSAVE] |
| GIO-150 | 켜고 끌 때 자동 동기화 — Auto Cloud Sync | 기준 | 실행과 종료 때 저장 파일을 맞춤 | 확인 [QISTCLD] · 대조 [QADECKREC] |
| GIO-151 | 동기화 끄기 — Disable Cloud Sync | 부품 | 게임별 또는 전체로 동기화를 끔 | 확인 [QISTCLD] |
| GIO-152 | 다른 기기에서 이어 하기 — Cross Progression | 흐름 | 다른 기기에서 멈춘 곳부터 이어 함 | 확인 [QAHIGGAME] · 대조 [QAPGSSAVE] |
| GIO-153 | 게스트 진행 계정 연결 — Account Link | 흐름 | 손님 진행을 플랫폼 계정에 묶음 | 확장 [MK] |
| GIO-154 | 플랫폼 업적 알림 — Achievement Toast | 부품 | 업적 달성 알림을 플랫폼 창에 맡김 | 확인 [QVSTACH] |
| GIO-155 | 숨긴 업적 — Hidden Achievement | 기준 | 밝혀지기 전엔 이름과 조건을 가림 | 확인 [QIPGACH] · 대조 [QVSTACH] |
| GIO-156 | 단계형 업적 진행 — Incremental Achievement | 부품 | 10개 중 3개처럼 진행도를 보임 | 확인 [QIPGACH] · 대조 [QVSTACH] |
| GIO-157 | 오프라인 업적 나중 반영 | 기준 | 끊겨도 달성하고 연결되면 맞춤 | 확인 [QIPGACH] |
| GIO-158 | 게임센터 입구 — Access Point | 부품 | 메뉴 화면에 프로필 입구를 띄움 | 확인 [QAHIGGC] |
| GIO-159 | 플랫폼 창 열리면 멈춤 — Overlay Pause | 흐름 | 스팀 창이 열리면 혼자 하는 게임을 멈춤 | 확인 [QASTOVL] |
| GIO-160 | 플랫폼 알림 모서리 피하기 — Notification Corner | 기준 | 플랫폼 알림 자리와 HUD가 겹치지 않게 | 확인 [QASTOVL] |
| GIO-161 | 플랫폼 단축키 비워 두기 — Shift+Tab | 기준 | 플랫폼 기본 단축키를 게임 키로 쓰지 않음 | 확인 [QASTOVL] |
| GIO-162 | 플랫폼 캡처 키 비워 두기 — F12 | 기준 | 화면 캡처 키와 게임 키가 겹치지 않게 | 확인 [QISTSHOT] |
| GIO-163 | 기기 언어로 첫 언어 채우기 | 흐름 | 처음 켤 때 기기 언어를 기본값으로 씀 | 확장 [MK] |
| GIO-164 | 오프라인 혼자 하기 — Offline Single-player | 기준 | 인터넷 없이도 혼자 하는 부분은 됨 | 확인 [QADECKREC] |
| GIO-165 | 조준 보조 강도 — aim assist strength | 부품 | 보조 세기를 끄기부터 강하게까지 조절 | 확장 [MK] · 대조 [QCXAG108] |
| GIO-166 | 조준 감속 — aim slowdown | 부품 | 조준점이 적 위를 지날 때 느려짐 | 확장 [MK] |
| GIO-167 | 조준 끌림 — aim magnetism | 부품 | 조준점이 가까운 적 쪽으로 살짝 끌려감 | 확장 [MK] |
| GIO-168 | 조준 보조 종류 고르기 | 구성 | 감속·끌림·자동 고정을 따로 켜고 끔 | 확인 [QCXAG108] |
| GIO-169 | 자이로 켜는 조건 — gyro activation | 부품 | 조준할 때만 또는 항상 중에서 고름 | 확장 [MK] |
| GIO-170 | 입력 장치별 보조 차이 안내 | 기준 | 패드와 마우스의 보조가 다르면 설정에 적음 | 확장 [MK] |
