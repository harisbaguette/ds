# 80. 산업·현장·기기 제어

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 80번 분류 IND다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

공장 제어 화면, 집안 기기 제어, 창고 스캐너, 의료기기, 로봇·드론 원격 조종, 매장 주방 단말처럼 현장의 사람과 기계가 함께 쓰는 화면의 항목이다. 업종 일반 정보(DOM), 차량 대시보드·키오스크·손목 화면·결제 단말 기본(DVC), 공간 화면(XR), 지도 일반(GEO)은 넣지 않고 장갑·소음·위험·연결 끊김 같은 현장 조건 때문에 생기는 판단만 모았다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| IND-01 | 고성능 HMI 회색 배경 — High Performance HMI Gray Background | 기준 | 배경을 연회색으로 두어 이상만 눈에 띄게 함 | 확인 [QXROKHMI] · 대조 [QXMALISA] |
| IND-02 | 이상 상태 전용 색 — Color Reserved for Abnormal | 기준 | 밝고 강한 색은 알람과 이상에만 쓰기 | 확인 [QXROKHMI] · 대조 [QXIBISA] |
| IND-03 | 색에 모양·글자 겹쳐 쓰기 — Redundant State Coding | 기준 | 색만 믿지 않고 채움·모양·글자를 함께 붙이기 | 확인 [QXROKHMI] |
| IND-04 | 화면 4단계 계층 — Display Hierarchy Level 1-4 | 구성 | 전체 개요부터 세부·지원 화면까지 층을 나누기 | 확인 [QXROKHMI] · 대조 [QXRPHMI] |
| IND-05 | 1단계 공장 개요 화면 — Level 1 Overview | 모듈 | 공장 전체가 괜찮은지 한눈에 보기 | 확인 [QXROKHMI] · 대조 [QXMALISA] |
| IND-06 | 2단계 공정 단위 제어 화면 — Level 2 Process Unit Control | 모듈 | 한 공정 단위를 보며 평소 조작을 하는 화면 | 확인 [QXROKHMI] · 대조 [QXRPHMI] |
| IND-07 | 간략 배관 계장도 — Limited P&ID | 구성 | 고장 찾기용으로 핵심 설비만 그린 도면 | 확인 [QXROKHMI] |
| IND-08 | 설비 상세 창 — Faceplate | 부품 | 밸브·펌프 하나를 눌러 상세 조작 창 열기 | 확인 [QXROKHMI] · 대조 [QXSIEHMI] |
| IND-09 | 인터록·허가 조건 목록 — Interlock and Permissive List | 부품 | 기계가 왜 안 켜지는지 조건을 줄지어 보이기 | 확인 [QXROKHMI] · 대조 [QXIBISA] |
| IND-10 | 인터록 우회 스위치 — Interlock Bypass Toggle | 부품 | 권한 있는 사람만 조건을 잠시 건너뛰게 하기 | 확인 [QXROKHMI] |
| IND-11 | 단위 붙은 실시간 값 — Live Tag Value with Unit | 부품 | 움직이는 숫자에 단위를 붙여 보여 주기 | 확장 [MK] · 대조 [QXROKHMI] |
| IND-12 | 필요한 자릿수만 표시 — Display Only Needed Precision | 기준 | 판단에 필요한 소수 자리까지만 보이기 | 확인 [QXROKHMI] · 대조 [QXMALISA] |
| IND-13 | 통신 끊김·값 불량 표시 — Stale or Bad Quality Value | 부품 | 믿을 수 없는 값을 흐리게 바꿔 알리기 | 확장 [MK] |
| IND-14 | 한계 표시 막대 — Analog Bar with Limits | 부품 | 지금 값과 정상 범위를 막대 하나에 보이기 | 확인 [QXROKHMI] |
| IND-15 | 실시간 값 글자 위계 — Live Data Font Hierarchy | 기준 | 값은 이름표·단위보다 크고 굵게 쓰기 | 확인 [QXROKHMI] |
| IND-16 | 경향 그래프 창 — Trend Display | 모듈 | 시간에 따른 변화를 보고 다음을 짐작하기 | 확인 [QXROKHMI] · 대조 [QXSIEHMI] |
| IND-17 | 설정값 입력 — Analog Setpoint Entry | 흐름 | 단위와 가장 작은 값·큰 값을 보며 값 넣기 | 확인 [QXROKHMI] |
| IND-18 | 올림·내림 버튼 — Increment Decrement Buttons | 부품 | 정해진 폭만큼만 값을 올리고 내리기 | 확인 [QXROKHMI] |
| IND-19 | 중요 조작 확인 — Confirmation for Critical Action | 흐름 | 결과가 큰 명령은 한 번 더 확인받기 | 확인 [QXROKHMI] |
| IND-20 | 선택 후 실행 — Select Before Operate | 흐름 | 대상을 먼저 고르고 따로 실행해 잘못 누름 막기 | 확인 [QXSESBO] |
| IND-21 | 자동·수동 모드 표시 — Auto Manual Mode Indicator | 부품 | 기계를 지금 사람이 모는지 자동인지 알리기 | 확장 [MK] |
| IND-22 | 설비 상태 기호 — Equipment State Symbol | 부품 | 돌아감·멈춤을 채움과 테두리로 나타내기 | 확인 [QXROKHMI] |
| IND-23 | 운전 제외 회색 — Disabled Out of Service Gray | 기준 | 멈춰 두거나 점검 중인 설비를 회색으로 두기 | 확인 [QXROKHMI] |
| IND-24 | 알람 배너 — Alarm Banner | 부품 | 어느 화면에서든 최신·최상위 알람 보이기 | 확인 [QXROKHMI] |
| IND-25 | 알람 요약 목록 — Alarm Summary | 모듈 | 모든 알람을 거르고 확인하는 목록 화면 | 확인 [QXROKHMI] · 대조 [QXSIEHMI] |
| IND-26 | 알람 우선순위 등급 — Alarm Priority | 기준 | 급한 정도를 몇 단계로 나눠 비율을 정하기 | 확인 [QXIFA18] · 대조 [QXMERO18] |
| IND-27 | 확인 전후 알람 모습 — Unacknowledged Alarm Blink | 기준 | 확인 전엔 깜박이고 확인 뒤엔 멈추기 | 확인 [QXROKHMI] · 대조 [QXMERO18] |
| IND-28 | 알람 보류 — Alarm Shelving | 흐름 | 계속 울리는 알람을 잠시 치워 두기 | 확인 [QXROKHMI] · 대조 [QXISA182] |
| IND-29 | 알람 폭주 억제 — Alarm Flood Suppression | 기준 | 한꺼번에 쏟아지는 알람을 묶어 줄이기 | 확인 [QXIFA18] · 대조 [QXMERO18] |
| IND-30 | 알람 발생 수 목표 — Alarm Rate Target | 기준 | 한 사람이 감당할 알람 수를 미리 정하기 | 확인 [QXAMDHMI] · 대조 [QXIFA18] |
| IND-31 | 알람 경보음 설정 — Audible Alarm Tones | 기준 | 급한 정도마다 다른 소리로 알리기 | 확인 [QXROKHMI] |
| IND-32 | 답이 필요한 알림 — Non-Alarm Notification Requiring Response | 부품 | 알람은 아니지만 대답이 필요한 요청 보이기 | 확인 [QXROKHMI] |
| IND-33 | 두 번 안에 도착 — Two-Touch Navigation | 기준 | 어느 화면이든 두 번 눌러 닿게 만들기 | 확인 [QXAMDHMI] · 대조 [QXRPHMI] |
| IND-34 | 역할별 권한 — Role-Based Security | 기준 | 운전원·엔지니어마다 할 수 있는 일 나누기 | 확인 [QXROKHMI] · 대조 [QXAMDHMI] |
| IND-35 | 작업 자리 제한 — Workstation Location Security | 기준 | 정해진 단말에서만 특정 조작 허락하기 | 확인 [QXROKHMI] |
| IND-36 | 교대 로그인 — Operator Login Logout | 흐름 | 조가 바뀔 때 조작하는 사람을 바꿔 걸기 | 확인 [QXROKHMI] |
| IND-37 | 운전 조작·알람 처리 기록 — Operator Action and Alarm Journal | 모듈 | 누가 언제 설비와 알람을 만졌는지 남기기 | 확인 [QXIFA18] · 대조 [QXROKHMI] |
| IND-38 | 화면 판 번호 — Display Version Identification | 부품 | 지금 화면이 몇 번째 판인지 알리기 | 확인 [QXROKHMI] |
| IND-39 | 설비 도움말 연결 — Help and Documentation Link | 부품 | 설비 창에서 설명서와 진단을 바로 열기 | 확인 [QXROKHMI] |
| IND-40 | 비상 정지는 실물 버튼 — Hardware Emergency Stop | 기준 | 화면이 아닌 실물 버튼으로 멈추게 두기 | 확장 [MK] |
| IND-41 | 터치 명령 버튼 크기 — Touch Hit Zone Minimum | 기준 | 명령 버튼을 40픽셀 이상으로 크게 두기 | 확인 [QXROKHMI] |
| IND-42 | 배치 단계 진행 — Batch Phase Progress | 모듈 | 제조 순서가 몇 단계까지 왔는지 보기 | 확장 [MK] |
| IND-43 | 설정 코드 찍기 — Setup Code QR Scan | 흐름 | 기기에 붙은 코드를 찍어 등록 시작하기 | 확인 [QXAPLMTR] · 대조 [QXGNMTR] |
| IND-44 | 숫자 설정 키 — Manual Pairing Code | 부품 | 코드를 못 찍을 때 숫자로 넣게 하기 | 확인 [QXGNMTR] |
| IND-45 | 가까이 대서 등록 — Tap to Pair | 흐름 | 휴대폰을 기기에 대서 바로 연결하기 | 확인 [QXAPLMTR] |
| IND-46 | 연결 대기 모드 안내 — Pairing Mode Instruction | 부품 | 기기를 연결 대기로 바꾸는 법 보여 주기 | 확인 [QXGNMTR] |
| IND-47 | 와이파이 정보 넘기기 — Network Credential Handoff | 흐름 | 집 인터넷 정보를 새 기기에 건네주기 | 확장 [MK] |
| IND-48 | 묶음 기기 한꺼번에 등록 — Multipack Setup | 흐름 | 여러 기기를 코드 하나로 함께 추가하기 | 확인 [QXAPLMTR] |
| IND-49 | 등록 끝에 방·이름 정하기 — Name and Room Assignment | 흐름 | 추가 직후 어디 둘지 이름을 붙이기 | 확인 [QXGNMTR] · 대조 [QXHKHIG] |
| IND-50 | 빠진 단계만 안내 — Incremental Onboarding | 흐름 | 이미 끝난 설정은 건너뛰고 남은 것만 묻기 | 확인 [QXGHONB] |
| IND-51 | 집 기기 접근 허락 — Home Access Permission | 흐름 | 다른 앱이 집 기기를 쓰려면 허락받기 | 확인 [QXAPLMTR] · 대조 [QXGHONB] |
| IND-52 | 여러 앱 함께 제어 — Multi-Admin | 기준 | 한 기기를 여러 회사 앱에서 같이 쓰기 | 확인 [QXGHFAB] · 대조 [QXCSAMA] |
| IND-53 | 기기 카드 — Device Tile | 부품 | 기기 상태와 켜고 끄기를 한 칸에 담기 | 확인 [QXSTPRES] |
| IND-54 | 기기 상세 화면 — Device Detail View | 모듈 | 기기 하나의 모든 조절을 모아 보기 | 확인 [QXSTPRES] |
| IND-55 | 연결 상태 점 — Online Unhealthy Offline Status | 부품 | 연결됨·불안정·끊김을 점 하나로 알리기 | 확인 [QXSTHLTH] |
| IND-56 | 허브 끊김 전파 — Hub Offline Cascade | 기준 | 허브가 끊기면 딸린 기기도 끊김으로 표시 | 확인 [QXSTHLTH] |
| IND-57 | 모르는 상태 추측 금지 — Unreachable Accessory State | 기준 | 연락이 안 되면 켜짐·꺼짐을 짐작하지 않기 | 확인 [QXHKHIG] |
| IND-58 | 명령 응답 기다림 — Pending Command State | 부품 | 누른 뒤 기기 대답을 기다리는 중임을 보이기 | 확장 [MK] |
| IND-59 | 자동화 규칙 — Starter Condition Action | 흐름 | 언제·어떤 조건에서·무엇을 할지 정하기 | 확인 [QXGHAUTO] |
| IND-60 | 시간 예약·지연 실행 — Schedule and Delay | 흐름 | 정한 시각이나 잠시 뒤에 동작시키기 | 확인 [QXGHAUTO] |
| IND-61 | 기기 소프트웨어 원격 갱신 — Firmware OTA Update | 흐름 | 기기 속 프로그램을 멀리서 새로 받기 | 확인 [QXGHFW] |
| IND-62 | 기기 빼기·초기화 — Remove and Reset Device | 흐름 | 집에서 기기를 빼고 처음 상태로 돌리기 | 확장 [MK] |
| IND-63 | 센서 전지 부족 알림 — Low Battery Alert | 부품 | 센서 전지를 갈 때를 미리 알려 주기 | 확장 [MK] |
| IND-64 | 집·방 묶음 — Home Room Zone Hierarchy | 구성 | 기기를 집과 방 단위로 묶어 보여 주기 | 확인 [QXHKHIG] |
| IND-65 | 겹치지 않는 기기 이름 — Unique Accessory Names | 기준 | 음성 명령이 헷갈리지 않게 이름 짓기 | 확인 [QXHKHIG] |
| IND-66 | 장면 — Scene | 부품 | 여러 기기를 한 번에 정해 둔 상태로 바꾸기 | 확인 [QXHKHIG] |
| IND-67 | 온도 조절 원판 — Thermostat Dial | 부품 | 목표 온도와 지금 온도를 원 위에서 조절 | 확장 [MK] |
| IND-68 | 도어락 원격 열기 확인 — Remote Unlock Confirmation | 흐름 | 문을 멀리서 열 땐 한 번 더 확인받기 | 확장 [MK] |
| IND-69 | 카메라 실시간·기록 줄 — Camera Live and Event Timeline | 모듈 | 지금 화면과 지난 움직임 기록을 함께 보기 | 확장 [MK] |
| IND-70 | 초인종 사진 알림 — Doorbell Snapshot Notification | 부품 | 누가 왔는지 사진과 함께 알려 주기 | 확장 [MK] |
| IND-71 | 가족·손님 초대 — Home Member Invite | 흐름 | 가족이나 손님에게 쓸 권한을 나눠 주기 | 확장 [MK] |
| IND-72 | 외출·귀가 모드 — Away and Home Presence | 흐름 | 집을 비울 때 기기 상태를 한꺼번에 바꾸기 | 확장 [MK] |
| IND-73 | 경비 설정 초읽기 — Arm Disarm Countdown | 흐름 | 경비를 켜기 전 나갈 시간을 세어 주기 | 확장 [MK] |
| IND-74 | 누수·연기 긴급 알림 — Critical Safety Alert | 부품 | 방해 금지 중에도 위험을 크게 알리기 | 확장 [MK] |
| IND-75 | 전기 흐름 그림 — Energy Flow Diagram | 모듈 | 태양광·배터리·전력망 흐름을 한 그림에 | 확장 [MK] · 대조 [QXENPH] |
| IND-76 | 전력망 사고팔기 — Grid Import Export | 부품 | 사 온 전기와 내보낸 전기를 나눠 보이기 | 확인 [QXENPH] |
| IND-77 | 시간대별 요금 띠 — Time of Use Rate Bands | 부품 | 비싼 시간과 싼 시간을 색 띠로 보이기 | 확장 [MK] |
| IND-78 | 정전 대비 배터리 남김 — Backup Reserve Setting | 부품 | 정전 때 쓸 배터리 양을 남겨 두게 하기 | 확장 [MK] |
| IND-79 | 기기별 전기 사용량 — Per-Device Energy Use | 모듈 | 어떤 기기가 전기를 많이 썼는지 보기 | 확장 [MK] |
| IND-80 | 전기 아끼기 요청 참여 — Demand Response Event | 흐름 | 전력 부족 시간에 사용 줄이기에 참여하기 | 확장 [MK] |
| IND-81 | 센서 구역 격자 — Sensor Zone Grid | 모듈 | 밭·온실 구역별 센서 값을 칸으로 보기 | 확장 [MK] |
| IND-82 | 기준선 넘음 알림 — Threshold Alert | 흐름 | 온도·습도가 정한 선을 넘으면 알리기 | 확장 [MK] |
| IND-83 | 구역 물주기 제어 — Zone Irrigation Control | 흐름 | 구역마다 물 주는 시간을 켜고 끄기 | 확장 [MK] |
| IND-84 | 스캔 먼저 받기 — Scan-First Input Focus | 기준 | 칸이 열리면 바로 스캔을 받을 준비 두기 | 확장 [MK] |
| IND-85 | 스캔 결과 소리·떨림·빛 — Scan Decode Feedback | 부품 | 읽기 성공과 실패를 소리·떨림·빛으로 | 확인 [QXZEBDW] |
| IND-86 | 스캔 성공 초록 덮개 — Green Screen Overlay | 부품 | 읽힌 순간 화면을 초록으로 잠깐 덮기 | 확인 [QXZEBDW] |
| IND-87 | 장갑 터치 큰 영역 — Glove Touch Target | 기준 | 장갑 낀 손가락에 맞게 누를 곳 키우기 | 확인 [QXZEBEC] · 대조 [QXROKHMI] |
| IND-88 | 한 화면 한 단계 — Sequential Task Screens | 구성 | 작은 화면을 한 단계씩 넘기며 일하기 | 확인 [QXZEBEC] |
| IND-89 | 걷는 순서대로 피킹 — Pick Path Order | 흐름 | 창고 걷는 순서대로 물건 목록 줄 세우기 | 확장 [MK] |
| IND-90 | 큰 수량 숫자판 — Large Quantity Keypad | 부품 | 개수를 큰 숫자 버튼으로 빨리 넣기 | 확장 [MK] |
| IND-91 | 끊김 중 작업 쌓기 — Offline Queue and Sync | 흐름 | 연결이 끊겨도 일하고 나중에 한꺼번에 보내기 | 확장 [MK] |
| IND-92 | 입고 수량 대조 — Receiving Check | 흐름 | 받은 물건을 주문서와 하나씩 맞춰 보기 | 확장 [MK] |
| IND-93 | 배송 완료 증빙 — Proof of Delivery | 흐름 | 사진과 서명으로 물건 전달을 남기기 | 확장 [MK] |
| IND-94 | 업무 전용 잠금 홈 — Enterprise Lockdown Launcher | 구성 | 업무 앱만 보이게 단말을 묶어 두기 | 확장 [MK] |
| IND-95 | 합격·불합격·해당 없음 — Pass Fail NA Check Item | 부품 | 점검 항목마다 세 답 중 하나를 고르기 | 확장 [MK] |
| IND-96 | 불합격 시 증거 필수 — Evidence Required on Failure | 흐름 | 문제 항목엔 사진과 메모를 꼭 받기 | 확장 [MK] |
| IND-97 | 시간·위치 자동 기록 — Auto Time and GPS Stamp | 기준 | 언제 어디서 했는지 저절로 남기기 | 확장 [MK] |
| IND-98 | 전원 차단 단계 확인 — Lockout Tagout Steps | 흐름 | 수리 전 전원 끊기를 단계마다 확인하기 | 확장 [MK] |
| IND-99 | 설비 코드로 이력 열기 — Asset QR History | 흐름 | 설비에 붙은 코드를 찍어 수리 기록 보기 | 확장 [MK] |
| IND-100 | 운전자 안전 점수 — Driver Safety Score | 모듈 | 급가속·급제동 기록을 점수로 보여 주기 | 확인 [QXSAMDRV] |
| IND-101 | 위험 운전 순간 목록 — Harsh Event Feed | 부품 | 급회전·급제동 순간을 하나씩 짚어 보기 | 확인 [QXSAMDRV] |
| IND-102 | 차량 상태 구분 — Vehicle Status Legend | 기준 | 운행·정차·시동 꺼짐을 색과 글자로 나누기 | 확장 [MK] |
| IND-103 | 운행 다시 보기 — Trip Replay | 흐름 | 지난 경로를 시간 순서대로 되짚어 보기 | 확장 [MK] |
| IND-104 | 운전 시간 상태 — Hours of Service Duty Status | 부품 | 운전·휴식 가능 시간이 얼마 남았는지 보이기 | 확장 [MK] |
| IND-105 | 사용 명세 — Use Specification | 기준 | 누가 어디서 어떻게 쓰는지 먼저 적어 두기 | 확인 [QXGL62366] · 대조 [QXWK62366] |
| IND-106 | 위험 핵심 작업 — Critical Task | 기준 | 잘못하면 다치는 작업을 따로 뽑아 두기 | 확인 [QXGL62366] |
| IND-107 | 만드는 중·다 만든 뒤 시험 — Formative and Summative Evaluation | 흐름 | 개발 중과 완성 뒤 사용 시험을 따로 하기 | 확인 [QXGL62366] · 대조 [QXWK62366] |
| IND-108 | 의료 알람 3단계 — High Medium Low Alarm Priority | 기준 | 위급도를 높음·중간·낮음으로 나누기 | 확인 [QXSS60601] |
| IND-109 | 급한 정도별 소리 묶음 — Auditory Alarm Pattern | 기준 | 급할수록 다른 소리 묶음으로 울리기 | 확인 [QXSS60601] |
| IND-110 | 알람 피로 줄이기 — Alarm Fatigue Reduction | 기준 | 쓸모없는 울림을 줄여 무시하는 버릇 막기 | 확장 [MK] · 대조 [QXFDBDL] |
| IND-111 | 환자 식별 머리줄 — Patient Identification Banner | 부품 | 이름과 두 가지 식별 정보를 늘 위에 두기 | 확장 [MK] |
| IND-112 | 팔찌·약 바코드 확인 — Barcode Medication Administration | 흐름 | 환자 팔찌와 약을 찍어 맞는지 확인하기 | 확인 [QXBCMA] |
| IND-113 | 경고 넘김 사유 입력 — Override Reason Entry | 흐름 | 경고를 넘길 땐 이유를 꼭 적게 하기 | 확인 [QXBCMA] |
| IND-114 | 고위험 약 두 사람 확인 — Independent Double Check | 흐름 | 위험한 약은 두 사람이 따로 확인하기 | 확장 [MK] |
| IND-115 | 넘을 수 없는 선·경고 선 — Hard and Soft Dose Limits | 기준 | 막는 한도와 경고만 하는 한도를 나누기 | 확인 [QXFDBDL] |
| IND-116 | 헷갈리는 약 이름 대문자 — Tall Man Lettering | 기준 | 비슷한 약 이름의 다른 글자를 크게 쓰기 | 확인 [QXTALLMN] |
| IND-117 | 정수 뒤 0 금지 — Trailing Zero Ban | 기준 | 정수 뒤에 0을 붙이지 않아 10배 실수 막기 | 확장 [MK] |
| IND-118 | 환자 감시 파형 배치 — Patient Monitor Waveform Layout | 구성 | 심전도·산소 파형과 숫자를 짝지어 두기 | 확장 [MK] |
| IND-119 | 원격 조종 방향판 — Teleop D-Pad | 부품 | 방향 버튼과 가운데 멈춤으로 로봇 몰기 | 확인 [QXFOXTEL] |
| IND-120 | 손 떼면 멈춤 — Stop on Release | 기준 | 버튼에서 손을 떼면 바로 멈추게 하기 | 확인 [QXFOXTEL] |
| IND-121 | 여러 카메라 격자 — Multi-Camera Grid | 구성 | 로봇 앞뒤 카메라 화면을 나란히 보기 | 확장 [MK] |
| IND-122 | 지연·신호 세기 표시 — Latency and Link Indicator | 부품 | 명령이 늦게 닿는지 늘 보여 주기 | 확장 [MK] |
| IND-123 | 비행 제한 구역 — GEO Zone Warning | 기준 | 날 수 없는 곳을 알리고 들어가지 못하게 막기 | 확인 [QXDJIGEO] |
| IND-124 | 제한 구역 풀기 신청 — Zone Unlock Request | 흐름 | 허가받은 곳만 제한을 풀어 날게 하기 | 확인 [QXDJIGEO] |
| IND-125 | 길게 눌러 귀환 — Hold to Return to Home | 흐름 | 버튼을 길게 눌러 출발점으로 돌아오게 하기 | 확인 [QXDJIRC] · 대조 [QXDJIRTH] |
| IND-126 | 전지 부족 귀환 제안 — Low Battery RTH Prompt | 흐름 | 돌아올 전기가 모자라기 전에 먼저 묻기 | 확인 [QXDJIRTH] |
| IND-127 | 비행 모드 전환 — Flight Mode Switch | 부품 | 빠르게·보통·부드럽게 나는 모드 바꾸기 | 확인 [QXDJIRC] |
| IND-128 | 자율 주행 넘겨받기 — Autonomy Takeover | 흐름 | 자동으로 가던 중 사람이 바로 잡기 | 확장 [MK] |
| IND-129 | 비행 전 점검 목록 — Pre-Flight Checklist | 흐름 | 뜨기 전 나침반·전지·위성 신호 확인하기 | 확장 [MK] |
| IND-130 | 로봇 센서 지도 — Robot Sensor Visualization | 모듈 | 로봇이 본 거리와 지도를 입체로 보기 | 확장 [MK] |
| IND-131 | 주문 경과 시간 — Ticket Time and Fire Time | 부품 | 주문이 들어온 뒤 흐른 시간 보여 주기 | 확인 [QXTSTKT] |
| IND-132 | 오래된 주문 색 바뀜 — Ticket Aging Color | 기준 | 오래 기다린 주문을 색으로 알리기 | 확인 [QXTSKDSQ] · 대조 [QXTSKDS] |
| IND-133 | 완료 치우기·되살리기 — Bump and Recall | 흐름 | 다 만든 주문을 치우고 실수면 되돌리기 | 확인 [QXTSBUMP] |
| IND-134 | 코스별 주문표 — Course Tickets | 흐름 | 전채·본식을 나눠 차례로 내보내기 | 확인 [QXTSCRS] |
| IND-135 | 코스 속도 맞춤 보류 — Course Pacing Hold | 흐름 | 앞 코스가 나가야 다음 코스를 시작하기 | 확인 [QXTSPACE] |
| IND-136 | 조리 시간 맞춰 시작 — Fire by Prep Time | 기준 | 오래 걸리는 음식부터 먼저 시작시키기 | 확인 [QXTSPREP] |
| IND-137 | 메뉴별 전체 수량 — All Day Count | 부품 | 지금 만들 메뉴별 총수를 한곳에 보기 | 확인 [QXTSKDSQ] |
| IND-138 | 내보내기 담당 화면 — Expediter Screen | 모듈 | 주방 준비를 모아 보고 내보낼지 판단하기 | 확인 [QXTSCRS] · 대조 [QXTSPACE] |
| IND-139 | 좌석 배치도 — Table Map | 모듈 | 매장 자리 배치와 손님 상태를 한눈에 보기 | 확장 [MK] |
| IND-140 | 품절 막기 — Eighty-Six Item | 부품 | 다 떨어진 메뉴를 주문하지 못하게 막기 | 확장 [MK] |
| IND-141 | 계산 나누기 — Split Check | 흐름 | 한 자리 금액을 사람별로 나눠 받기 | 확장 [MK] |
| IND-142 | 하루 마감 정산 — End of Day Close Report | 흐름 | 하루 매출과 현금을 맞춰 보고 마감하기 | 확장 [MK] |
| IND-143 | 직원 번호 빠른 전환 — Employee PIN Switch | 흐름 | 단말 하나를 여러 직원이 번갈아 쓰기 | 확장 [MK] |
| IND-144 | 끊김 중 카드 결제 — Offline Payment Mode | 흐름 | 인터넷이 끊겨도 결제를 받고 나중에 처리 | 확인 [QXSQOFF] |
| IND-145 | 안돈 보드 — Andon Board | 모듈 | 생산 줄의 문제를 모두 보게 불빛으로 알리기 | 확인 [QXANDON] |
| IND-146 | 안돈 호출 끈 — Andon Pull Cord | 흐름 | 작업자가 문제를 보면 생산 줄을 세우기 | 확인 [QXANDON] |
| IND-147 | 설비 종합 효율 — OEE Overall Equipment Effectiveness | 모듈 | 가동·속도·품질 세 수치로 효율 보기 | 확인 [QXOEE] |
| IND-148 | 멈춘 이유 고르기 — Downtime Reason Code | 흐름 | 기계가 멈춘 이유를 골라 기록하게 하기 | 확장 [MK] |
| IND-149 | 시간별 목표 대 실적 — Hourly Target vs Actual | 부품 | 시간마다 계획과 실제 생산 수 비교하기 | 확장 [MK] |
| IND-150 | 교대 인수인계 — Shift Handover | 흐름 | 다음 조에 남은 일과 이상을 넘겨주기 | 확장 [MK] |
| IND-151 | 두 손 조작 — Two-Hand Control | 기준 | 위험한 동작은 두 손을 모두 써야 되게 하기 | 확장 [MK] |
| IND-152 | 밀어서 실행 — Slide to Operate | 부품 | 밀어야 실행돼 몸에 스친 오조작을 막기 | 확장 [MK] |
| IND-153 | 벽걸이 화면 큰 글자 — Wall Display Large Numerals | 기준 | 멀리 걸린 화면은 값 글자를 더 키우기 | 확인 [QXROKHMI] |
| IND-154 | 사원증 대서 로그인 — Badge Tap Login | 흐름 | 카드를 대서 쓰는 사람을 빨리 바꾸기 | 확장 [MK] |
