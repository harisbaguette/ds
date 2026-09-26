# 81. 연령·생활 맞춤 모드

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 81번 분류 AGE다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

이 분류는 쓰는 사람의 나이와 생활 형편에 맞춰 화면 전체의 동작을 바꾸는 모드와 그 설정을 모은다. 어린이 보호, 청소년 계정, 고령자와 디지털 초보를 위한 단순 화면, 보호자의 가족 관리, 운전·취침 같은 상황 모드, 문화·종교 일정, 기억 보조와 정신 건강 안전, 추모 계정까지 다룬다. 글자 크기·대비 같은 접근성 일반은 29-ACS, 동의 일반은 36-PRV, 게임 안의 접근성은 74-GAC에서 다룬다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| AGE-01 | 어린이 모드 전환 — kids mode | 모듈 | 아이용 단순 화면으로 통째로 바꾸기, 나갈 때는 보호자 확인 | 확장 [MK] · 대조 [QYYTKPC] |
| AGE-02 | 중립 나이 입력 — neutral age screen | 기준 | 생년월을 자유롭게 적게 하고 몇 살부터 되는지 미리 알리지 않기 | 확인 [QYCOPPA] |
| AGE-03 | 보호자에게 먼저 알리기 — direct notice to parents | 흐름 | 아이 정보를 모으기 전에 무엇을 모으는지 보호자에게 직접 알림 | 확인 [QYCOPPA] |
| AGE-04 | 보호자 관문 — parental gate | 부품 | 어른만 풀 수 있는 문제로 링크·구매 앞을 막기 | 확인 [QYAPGATE] · 대조 [APPLEASRG] |
| AGE-05 | 보호자 구역 — parent area | 구성 | 곱셈 문제나 암호를 풀어야 열리는 설정 공간 | 확인 [QYYTKPC] |
| AGE-06 | 아이 화면 밖 링크 막기 — no links out | 기준 | 아이 앱에서 밖으로 못 나가게, 꼭 필요하면 보호자 관문 뒤에 두기 | 확인 [APPLEASRG] · 대조 [QYAPGATE] |
| AGE-07 | 아이 화면 추적 광고·외부 분석 빼기 | 기준 | 어린이 앱에는 행동 추적 광고와 외부 분석 도구를 넣지 않기 | 확인 [APPLEASRG] · 대조 [QYICOSTD] |
| AGE-08 | 글 모르는 아이용 음성 안내 — voice prompts for pre-readers | 부품 | 글을 아직 못 읽는 아이에게 말로 할 일 알려 주기 | 확인 [QYAPGATE] |
| AGE-09 | 그림 중심 메뉴 — icon-first navigation | 구성 | 글자 대신 큰 그림을 눌러 고르게 하기 | 확장 [MK] |
| AGE-10 | 어린이 누름 칸 2cm — child touch target | 기준 | 어린 아이가 누르는 칸은 가로세로 2cm 이상 | 확인 [QYNNGKID] |
| AGE-11 | 나이별 손동작 고르기 — age-appropriate gestures | 기준 | 어린 아이는 누르기·밀기 위주, 꼬집기·오래 끌기는 피하기 | 확인 [QYNNGKID] |
| AGE-12 | 아이별 프로필 — kid profile | 구성 | 아이마다 나이·볼 거리·시간을 따로 두기 | 확장 [MK] · 대조 [QYYTKAGE] |
| AGE-13 | 나이 단계별 볼 거리 — content levels by age | 구성 | 미취학·5~8세·9~12세로 보여 줄 것 나누기 | 확인 [QYYTKAGE] |
| AGE-14 | 보호자가 고른 것만 보기 — approved content only | 구성 | 보호자가 직접 고른 영상·채널만 보이게 하기 | 확인 [QYYTKPC] |
| AGE-15 | 아이 검색 끄기 — search off | 부품 | 아이가 마음대로 찾지 못하게 검색창 없애기 | 확인 [QYYTKPC] |
| AGE-16 | 시청 시간 타이머 — screen time timer | 부품 | 정한 시간이 지나면 앱이 스스로 멈춤 | 확인 [QYYTKPC] |
| AGE-17 | 시간 끝 안내 화면 — time's up screen | 구성 | 시간이 다 되면 쉬자고 알리고 더 보기를 막기 | 확장 [MK] · 대조 [QYYTKPC] |
| AGE-18 | 감독 단계 세 가지 — supervised experience tiers | 구성 | 9세 이상·13세 이상·대부분 보기로 볼 범위 넓히기 | 확인 [QYYTSUP] |
| AGE-19 | 아이 계정 가장 안전한 기본값 — high privacy by default | 기준 | 아이 계정은 공개·공유를 처음부터 꺼 두기 | 확인 [QYICOSTD] |
| AGE-20 | 아이 위치 기본 끄기 — geolocation off by default | 기준 | 위치 공유는 꺼 두고 켜졌을 땐 눈에 띄게 알리기 | 확인 [QYICOSTD] |
| AGE-21 | 아이 맞춤 추천 기본 끄기 — profiling off | 기준 | 아이 행동으로 맞춤 추천 만들기는 처음엔 꺼 두기 | 확인 [QYICOSTD] |
| AGE-22 | 아이 부추기기 금지 — no nudge techniques | 기준 | 개인정보를 더 내거나 보호를 끄도록 유도하지 않기 | 확인 [QYICOSTD] · 대조 [QYICONUD] |
| AGE-23 | 쉬기 쪽으로 이끌기 — pause and save nudge | 부품 | 쉬기·중간 저장 버튼을 더 잘 보이게 두기 | 확인 [QYICONUD] |
| AGE-24 | 지켜보는 중 표시 — monitoring indicator | 부품 | 보호자가 보고 있을 땐 아이 화면에 켜진 아이콘으로 알림 | 확인 [QYICOPC] |
| AGE-25 | 한입 크기 개인정보 설명 — bite-size explanations | 구성 | 정보를 쓰기 시작하는 순간에 짧게 설명하기 | 확인 [QYICOTR] |
| AGE-26 | 어른에게 물어보라는 권유 | 부품 | 설정을 바꾸기 전에 보호자나 믿는 어른과 상의하라고 권하기 | 확인 [QYICOTR] |
| AGE-27 | 나이대별 설계 구간 — age ranges | 기준 | 0~5·6~9·10~12·13~15·16~17세로 나눠 화면을 다르게 | 확인 [QYICOPC] |
| AGE-28 | 나이 확인 방법 고르기 — age assurance | 기준 | 스스로 입력·자동 추정·외부 확인 중 위험 크기에 맞게 고르기 | 확인 [QYICOAGE] |
| AGE-29 | 나이 모르면 모두 아이 기준 | 기준 | 나이를 확인할 수 없으면 모든 사용자를 아이처럼 보호 | 확인 [QYICOAGE] |
| AGE-30 | 아이용 신고·요청 버튼 — online tools for children | 부품 | 아이가 쉽게 신고하고 지워 달라고 요청하는 버튼 | 확인 [QYICOSTD] |
| AGE-31 | 연결 장난감 안내 — connected toys | 기준 | 듣고 모으는 장난감은 사기 전과 쓸 때 분명히 알리기 | 확인 [QYICOSTD] |
| AGE-32 | 보호자가 만드는 아이 계정 — child account | 흐름 | 보호자가 자기 기기에서 아이 계정을 만들고 관리 | 확인 [QYAPFAM] |
| AGE-33 | 민감한 사진 흐리게 — communication safety | 구성 | 아이가 받은 알몸 사진을 흐리게 하고 믿는 어른 연락 길 주기 | 확인 [QYAPCS] |
| AGE-34 | 청소년 계정 기본 비공개 — teen private account | 기준 | 청소년 계정은 처음부터 비공개로 | 확인 [QYMETATA] |
| AGE-35 | 청소년 메시지 받는 범위 제한 — messaging restrictions | 기준 | 팔로우하거나 연결된 사람만 메시지 보내게 하기 | 확인 [QYMETATA] |
| AGE-36 | 청소년 태그·언급 제한 — limited interactions | 기준 | 팔로우한 사람만 청소년을 태그·언급하게 하기 | 확인 [QYMETATA] |
| AGE-37 | 민감 콘텐츠 가장 엄격 단계 — sensitive content control | 기준 | 청소년은 민감한 글·영상 제한을 제일 세게 | 확인 [QYMETATA] |
| AGE-38 | 청소년 수면 모드 — sleep mode | 모듈 | 밤 10시~아침 7시 알림을 끄고 메시지에 자동 답장 | 확인 [QYMETATA] |
| AGE-39 | 60분 사용 알림 — time limit reminder | 부품 | 하루 60분이 지나면 앱을 나가라고 알림 | 확인 [QYMETATA] |
| AGE-40 | 설정 풀 때 보호자 허락 — parental permission to change | 흐름 | 16세 미만은 보호자 허락이 있어야 보호 설정을 느슨하게 | 확인 [QYMETATA] |
| AGE-41 | 대화 상대만 보이는 보호자 화면 | 구성 | 보호자는 최근 7일 대화 상대만 보고 내용은 못 봄 | 확인 [QYMETATA] |
| AGE-42 | 관심 주제 보호자 보기 | 부품 | 아이가 고른 관심 주제를 보호자에게 보여 주기 | 확인 [QYMETATA] |
| AGE-43 | 청소년 추정 계정 보호 | 흐름 | 어른 생일을 적었어도 청소년으로 보이면 청소년 설정 적용 | 확인 [QYMETATA] |
| AGE-44 | 숨길 단어 — hidden words | 부품 | 싫은 말이 들어간 댓글·메시지 요청 가리기 | 확인 [QYIGHW] · 대조 [QYMETATA] |
| AGE-45 | 몰래 제한하기 — restrict | 부품 | 괴롭히는 사람에게 내 접속·읽음 표시를 숨기기 | 확인 [QYIGRES] |
| AGE-46 | 올리기 전 다시 생각 알림 — comment warning | 부품 | 상처 줄 말을 올리려 하면 한 번 더 묻기 | 확장 [MK] |
| AGE-47 | 자해 검색 개입 화면 — self-harm search intervention | 구성 | 위험한 말을 찾으면 결과보다 도움 연락처를 먼저 보여 주기 | 확장 [MK] |
| AGE-48 | 위기 상담 연결 카드 — crisis helpline card | 부품 | 상담 전화·문자를 한 번 눌러 바로 연결 | 확장 [MK] |
| AGE-49 | 친구 걱정 알리기 — report a concern | 흐름 | 친구가 위험해 보이면 이름을 숨기고 운영자에게 알리기 | 확장 [MK] |
| AGE-50 | 쉬운 모드 — easy mode | 모듈 | 글자·아이콘을 크게 하고 화면을 단순하게 바꾸기 | 확인 [QYSAMKR] · 대조 [QYSAMEZ] |
| AGE-51 | 즐겨 찾는 사람 홈 버튼 — favourite contacts on home | 부품 | 가족 사진 버튼을 홈 화면에 두고 바로 전화 | 확인 [QYSAMEZ] |
| AGE-52 | 보조 접근 — assistive access | 모듈 | 꼭 필요한 앱만 큰 칸으로 보여 주는 단순 화면 | 확인 [QYAPAA] |
| AGE-53 | 큰 칸·한 줄 배치 고르기 — grid or rows layout | 부품 | 큰 그림 칸과 한 줄 목록 중 보기 편한 쪽 고르기 | 확장 [MK] · 대조 [QYAPAA] |
| AGE-54 | 그림 글자판·영상 메시지 — emoji keyboard and video message | 부품 | 글 대신 이모지나 영상으로 답하게 하기 | 확인 [QYAPAA] |
| AGE-55 | 믿을 만한 도우미 설정 — trusted supporter | 흐름 | 가족이 단순 화면을 대신 꾸며 주기 | 확인 [QYAPAA] |
| AGE-56 | 단순 화면 나가기 잠금 | 부품 | 실수로 복잡한 화면에 가지 않게 암호로 잠그기 | 확인 [QYAPAA] |
| AGE-57 | 늘 같은 자리의 뒤로 버튼 | 부품 | 어느 화면에서든 같은 곳에 큰 뒤로 버튼 두기 | 확인 [QYAPAA] · 대조 [QYCOGA] |
| AGE-58 | 사기 전화 실시간 경고 — scam detection | 부품 | 통화 중 사기와 비슷한 말이 나오면 바로 경고 | 확인 [QYPXSCAM] |
| AGE-59 | 낙상 감지 — fall detection | 흐름 | 넘어지면 30초 기다린 뒤 긴급 전화와 가족 문자 | 확인 [QYAPFALL] |
| AGE-60 | 나이에 맞춘 안전 기능 자동 켜기 | 기준 | 55세 이상이면 낙상 감지를 처음부터 켜 두기 | 확인 [QYAPFALL] |
| AGE-61 | 긴급 구조 요청 — emergency SOS | 흐름 | 버튼을 여러 번 눌러 구조 전화와 위치 보내기 | 확장 [MK] |
| AGE-62 | 의료 정보 카드 — medical ID | 부품 | 잠금 화면에서도 병·약·비상 연락처를 보이게 | 확장 [MK] |
| AGE-63 | 고령자 오류 쉽게 풀기 | 기준 | 무엇이 틀렸고 어떻게 고치는지 쉽게 알려 주기 | 확인 [QYNNGSEN] |
| AGE-64 | 숨은 손동작 대신 보이는 버튼 | 기준 | 길게 누르기·밀기 대신 눈에 보이는 버튼 쓰기 | 확장 [MK] · 대조 [QYNNGSEN] |
| AGE-65 | 사람 도움 버튼 — provide human help | 부품 | 막히면 사람과 이야기할 길을 늘 보이게 두기 | 확인 [QYCOGA] |
| AGE-66 | 음성 자동 안내 피하는 길 — avoid voice menus | 기준 | 전화 자동 안내를 건너뛰고 사람에게 가는 길 주기 | 확인 [QYCOGA] |
| AGE-67 | 지점 방문 안내 | 구성 | 가까운 창구와 챙길 서류를 미리 알려 주기 | 확장 [MK] |
| AGE-68 | 용어 풀이 도움말 — glossary tip | 부품 | 어려운 말 옆에 뜻을 풀어 주기 | 확장 [MK] |
| AGE-69 | 대리인 사용 — proxy access | 흐름 | 허락받은 가족이 대신 일을 처리하기 | 확장 [MK] |
| AGE-70 | 원격 도움 — remote assistance | 흐름 | 가족이 멀리서 화면을 보며 도와주기 | 확장 [MK] |
| AGE-71 | 큰돈 늦게 보내기 — delayed transfer | 기준 | 큰돈은 정한 시간 뒤에 보내 취소할 틈 주기 | 확장 [MK] |
| AGE-72 | 가족에게도 거래 알림 | 부품 | 큰 거래가 생기면 지정한 가족에게도 알림 | 확장 [MK] |
| AGE-73 | 셈을 시키지 않기 — don't rely on user calculations | 기준 | 합계·남은 날짜 같은 셈은 화면이 대신 하기 | 확인 [QYCOGA] |
| AGE-74 | 드는 돈 처음에 알리기 — notify fees at task start | 기준 | 일을 시작할 때 수수료부터 알려 주기 | 확인 [QYCOGA] |
| AGE-75 | 어려운 일의 쉬운 길 — alternative for complex tasks | 구성 | 복잡한 과정 옆에 쉬운 다른 방법 두기 | 확인 [QYCOGA] |
| AGE-76 | 익숙한 화면 지키기 — familiar interface | 기준 | 새 버전이 나와도 익숙한 배치를 고를 수 있게 | 확인 [QYCOGA] |
| AGE-77 | 위험한 요청 한 번 더 경고 — help the user stay safe | 기준 | 돈·개인정보를 요구받으면 멈춰 확인하게 알리기 | 확인 [QYCOGA] |
| AGE-78 | 끼어들기 줄이기 — limit interruptions | 기준 | 하던 일 중 튀어나오는 알림·창을 줄이기 | 확인 [QYCOGA] |
| AGE-79 | 초보·익숙 모드 바꾸기 — beginner and expert mode | 모듈 | 처음엔 기본 기능만, 익숙해지면 전부 보이기 | 확장 [MK] |
| AGE-80 | 간단 설정 화면 — support simplification | 모듈 | 자주 쓰는 설정만 남긴 짧은 설정 화면 | 확인 [QYCOGA] |
| AGE-81 | 되풀이 알림 — reminders | 부품 | 할 일과 약속을 잊지 않게 다시 알려 주기 | 확인 [QYCOGA] |
| AGE-82 | 하던 일 이어 보기 요약 — where you left off | 부품 | 다시 열면 멈춘 곳과 남은 일을 짧게 보여 주기 | 확장 [MK] |
| AGE-83 | 가족 그룹 역할 — family roles | 구성 | 어른 관리자·보호자·아이 역할을 나눠 권한 주기 | 확인 [QYAPFAM] |
| AGE-84 | 가족 인원 한도 — family size limit | 기준 | 관리자와 다섯 명까지만 한 가족으로 묶기 | 확인 [QYAPFAM] |
| AGE-85 | 자녀 위치 보기 — child location | 구성 | 보호자 화면에서 아이 기기 위치 찾기 | 확인 [QYFLLOC] · 대조 [QYAPFAM] |
| AGE-86 | 앱 승인 — app approval | 흐름 | 아이가 받으려는 앱을 보호자가 허락하거나 막기 | 확인 [QYFLAPP] |
| AGE-87 | 웹사이트 허락 요청 — ask to browse | 흐름 | 13세 미만은 새 사이트를 열 때 보호자에게 묻기 | 확인 [QYAPST] |
| AGE-88 | 쉬는 시간·학교 시간 일정 — downtime and school time | 구성 | 시작·끝 시각을 정해 그 시간엔 기기 쓰기 멈춤 | 확인 [QYFLDOWN] · 대조 [QYAPST] |
| AGE-89 | 분류별 하루 시간 — time allowances | 구성 | 게임·SNS 같은 묶음마다 하루 시간을 정하기 | 확인 [QYAPST] |
| AGE-90 | 앱별 하루 제한 — app limits | 부품 | 앱 하나마다 하루 쓸 시간을 정하기 | 확인 [QYFLLIM] |
| AGE-91 | 늘 쓸 수 있는 앱 — always allowed apps | 부품 | 기기가 잠겨도 꼭 필요한 앱은 열리게 두기 | 확인 [QYFLLOCK] |
| AGE-92 | 연락할 수 있는 사람 정하기 — allowed contacts | 구성 | 새 사람과 연락하려면 보호자 허락 받기 | 확인 [QYAPST] |
| AGE-93 | 보호자 기기에서 잠금 암호 정하기 | 기준 | 아이 설정 암호는 아이 기기가 아닌 보호자 기기에서 | 확인 [QYAPST] |
| AGE-94 | 원격 기기 잠금 — lock device | 흐름 | 보호자가 아이 기기를 바로 잠그되 긴급 전화는 남기기 | 확인 [QYFLLOCK] |
| AGE-95 | 감독 끝내기 승인 — stop supervision | 흐름 | 18세 미만은 보호자가 허락해야 감독을 끝냄 | 확인 [QYFLSTOP] |
| AGE-96 | 시간 더 달라고 요청 — request more time | 흐름 | 아이가 시간을 더 청하고 보호자가 폰에서 허락 | 확장 [MK] |
| AGE-97 | 주간 사용 보고 — activity report | 구성 | 한 주 동안 무엇을 얼마나 썼는지 보호자에게 보여 주기 | 확인 [QYMSFAM] |
| AGE-98 | 아이 씀씀이 한도 — spending limits | 구성 | 아이가 쓸 수 있는 돈 한도와 쓴 내역 보기 | 확인 [QYMSFAM] |
| AGE-99 | 용돈 카드 — allowance card | 모듈 | 보호자가 용돈을 넣고 아이가 쓴 곳을 함께 보기 | 확장 [MK] |
| AGE-100 | 여러 자녀 한 화면 — parent dashboard | 모듈 | 아이 여럿의 시간·위치·요청을 한곳에 모으기 | 확장 [MK] |
| AGE-101 | 컴퓨터·게임기 함께 관리 — cross-device family safety | 모듈 | 컴퓨터·게임기·폰 사용 시간을 한곳에서 정하기 | 확인 [QYMSFAM] |
| AGE-102 | 브라우저 어른 사이트 막기 — web filter | 구성 | 아이 브라우저에서 어른용 사이트 걸러 내기 | 확인 [QYMSFAM] · 대조 [QYAPST] |
| AGE-103 | 보호자에게 묻기 — ask a parent | 흐름 | 막힌 앱·사이트를 아이 화면에서 보호자에게 바로 요청 | 확인 [QYMSFAM] |
| AGE-104 | 운전 중 모드 — driving focus | 모듈 | 운전 중엔 알림을 멈추고 자동으로 답장 | 확장 [MK] |
| AGE-105 | 취침 모드 흑백 화면 — bedtime mode | 모듈 | 잘 시간엔 화면을 흑백으로 바꾸고 알림 끄기 | 확인 [QYANDWB] · 대조 [QYPXBED] |
| AGE-106 | 충전하면 취침 모드 켜기 | 부품 | 밤에 충전기를 꽂으면 취침 모드가 켜짐 | 확인 [QYPXBED] |
| AGE-107 | 방해 앱 잠시 멈춤 — focus mode | 모듈 | 고른 앱을 정한 시간 동안 못 열게 하기 | 확인 [QYANDWB] |
| AGE-108 | 임신·수유 모드 | 모듈 | 임신 주차에 맞춰 정보와 조심할 것 보여 주기 | 확장 [MK] |
| AGE-109 | 라마단 모드 | 모듈 | 금식·해 지는 시각에 맞춰 알림·배달 시간 바꾸기 | 확장 [MK] |
| AGE-110 | 안식일 모드 — sabbath mode | 모듈 | 정한 날엔 불빛·자동 동작을 끄는 기기 모드 | 확인 [QYSABBAT] |
| AGE-111 | 명절 배송·영업 안내 | 부품 | 연휴 동안 배송 멈춤과 영업 시간을 미리 알리기 | 확장 [MK] |
| AGE-112 | 기도 시간 알림 — prayer times | 부품 | 기도 시각에 맞춰 알리고 그동안 알림 줄이기 | 확장 [MK] |
| AGE-113 | 음력 날짜 함께 보기 — lunar calendar | 부품 | 양력 옆에 음력 날짜를 같이 적기 | 확장 [MK] |
| AGE-114 | 다국어 가족 설정 | 구성 | 한 가족 계정에서 사람마다 다른 언어로 보기 | 확장 [MK] |
| AGE-115 | 추억 알림 숨기기 — hide memories | 부품 | 떠난 사람이나 아픈 날짜의 추억을 안 보이게 | 확장 [MK] |
| AGE-116 | 기념일 알림 빼기 — sensitive date opt-out | 부품 | 어머니날 같은 알림을 받을지 미리 묻기 | 확장 [MK] |
| AGE-117 | 추모 계정 관리자 — memorialized account manager | 구성 | 떠난 사람 계정을 가족이 정해진 만큼만 관리 | 확인 [QYFBMEM] |
| AGE-118 | 디지털 유산 연락처 — legacy contact | 흐름 | 세상을 떠난 뒤 믿는 사람이 사진·자료를 받게 미리 정하기 | 확인 [QYAPLEG] |
