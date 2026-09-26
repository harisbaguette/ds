# 69. 게임 라이브 운영·소셜·커뮤니티

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 69번 분류 GLV다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

운영자가 주기적으로 바꾸는 이벤트·시즌·미션·우편·공지와, 이용자끼리 만나는 친구·길드·파티·채팅·신고·제재·랭크 시즌·관전·공유 화면을 모바일과 PC 게임 기준으로 담는다. 플레이 중 화면 위 표시는 GHD, 상점·재화·확률은 GEC, 접근성 옵션(채팅 음성 변환 등)은 GAC, 타이틀·로비·점검 화면 자체와 리더보드·업적·출석 기본형은 GAM에서 다루므로 여기 넣지 않는다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| GLV-01 | 이벤트 배너 회전 — event banner carousel | 부품 | 로비 첫 화면에서 지금 열린 행사를 돌려 보여 줌 | 확장 [MK] |
| GLV-02 | 이벤트 목록 모음 — events hub | 모듈 | 진행 중인 행사를 한곳에 모아 남은 기간과 함께 | 확장 [MK] |
| GLV-03 | 이벤트 달력·운영 일정표 — event calendar | 모듈 | 이번 주와 다음 주 행사를 날짜 위에 펼침 | 확장 [MK] |
| GLV-04 | 행사 미리 알림과 알림 신청 — event pre-announcement | 구성 | 시작 전에 알리고 열리면 알려 달라고 신청 | 확인 [QVROBLIVE] · 대조 [QVAPPIAE] |
| GLV-05 | 스토어에 뜨는 게임 속 행사 카드 — in-app events | 부품 | 앱 장터에서 행사를 미리 알리고 바로 들어오게 | 확인 [QVAPPIAE] · 대조 [QVGPPROMO] |
| GLV-06 | 시즌·이벤트 남은 기간 — season timer | 부품 | 시즌과 행사가 끝나기까지 남은 날과 시간 | 확장 [MK] |
| GLV-07 | 시작·종료 시각의 기준 시간 표기 — server time | 기준 | 서버 시간과 내 나라 시간을 헷갈리지 않게 | 확장 [MK] · 대조 [QVUNIRC] |
| GLV-08 | 일간·주간 초기화 안내 — daily/weekly reset | 기준 | 할 일과 보상이 언제 새로 채워지는지 알림 | 확장 [MK] |
| GLV-09 | 일간·주간 미션 — daily/weekly quests | 모듈 | 매일·매주 바뀌는 짧은 할 일과 보상 | 확장 [MK] |
| GLV-10 | 시즌 도전 과제 — season challenges | 모듈 | 한 시즌 동안 길게 이어지는 목표 묶음 | 확장 [MK] |
| GLV-11 | 미션 바꾸기 — quest reroll | 부품 | 하기 싫은 미션을 정해진 횟수만큼 교체 | 확장 [MK] |
| GLV-12 | 업적 달성 비율 표시 — achievement rarity | 부품 | 이 업적을 몇 퍼센트의 사람이 땄는지 | 확인 [QVSTACH] |
| GLV-13 | 출석 달력 누적 보상 — login calendar milestones | 구성 | 며칠째 왔는지와 큰 보상이 걸린 날을 표시 | 확장 [MK] |
| GLV-14 | 복귀 이용자 환영 이벤트 — returning player event | 흐름 | 오래 쉬다 돌아온 사람에게 따라잡을 보상 | 확장 [MK] |
| GLV-15 | 새 이용자 성장 이벤트 — beginner event | 모듈 | 처음 며칠 동안만 열리는 따라가기 목표 | 확장 [MK] |
| GLV-16 | 핫타임 — hot time boost | 구성 | 정해진 시간대에 경험치·보상을 더 줌 | 확장 [MK] |
| GLV-17 | 기간 한정 모드 — limited-time mode (LTM) | 모듈 | 며칠만 열리는 특별 규칙의 놀이 방식 | 확인 [QVAPPIAE] · 대조 [QVGPPROMO] |
| GLV-18 | 모두 함께 채우는 목표 — community goal | 구성 | 전체 이용자의 합계로 여는 공동 보상 | 확장 [MK] |
| GLV-19 | 시즌 종료 안내·보상 정산 — season end | 흐름 | 시즌이 끝날 때 성적을 보상으로 바꿔 줌 | 확장 [MK] |
| GLV-20 | 우편함 — in-game mailbox | 모듈 | 운영자와 시스템이 보낸 보상을 받는 곳 | 확장 [MK] |
| GLV-21 | 보상 첨부 우편 — mail with attachments | 부품 | 편지에 붙은 아이템을 눌러서 받기 | 확장 [MK] |
| GLV-22 | 모두 받기 — claim all | 구성 | 쌓인 보상을 한 번에 받기, 가방 칸 부족 안내 | 확장 [MK] |
| GLV-23 | 우편 보관 기한 표시 — mail expiry | 부품 | 며칠 뒤 사라지는지 알려 놓치지 않게 | 확장 [MK] |
| GLV-24 | 가방이 찼을 때 우편으로 보내기 — overflow to mail | 구성 | 받을 자리가 없을 때 보상을 잃지 않게 | 확장 [MK] |
| GLV-25 | 운영 보상 우편 — compensation mail | 흐름 | 점검 연장·오류 뒤 사과 보상을 모두에게 | 확장 [MK] |
| GLV-26 | 쿠폰 번호 입력 — coupon redemption | 흐름 | 받은 번호를 넣으면 보상이 우편함으로 옴 | 확장 [MK] |
| GLV-27 | 접속 공지 팝업 — login notice popup | 구성 | 들어올 때 꼭 볼 소식을 겹쳐 띄움 | 확장 [MK] |
| GLV-28 | 오늘 하루 보지 않기 — don't show again today | 부품 | 같은 공지를 하루 동안 다시 띄우지 않음 | 확장 [MK] |
| GLV-29 | 점검 예고와 연장 안내 — maintenance notice | 구성 | 언제 멈추고 언제 다시 여는지 미리 알림 | 확장 [MK] |
| GLV-30 | 업데이트 예고·패치 노트 — patch notes | 모듈 | 무엇이 바뀌고 무엇이 고쳐졌는지 정리 | 확장 [MK] · 대조 [QVSTCOMM] |
| GLV-31 | 게임 속 소식 탭 — in-game news | 모듈 | 공지·이벤트·개발 소식을 게임 밖에 안 나가고 | 확장 [MK] |
| GLV-32 | 게임 속 설문 참여 — player survey | 흐름 | 짧은 질문에 답하면 보상을 주고 의견을 모음 | 확장 [MK] |
| GLV-33 | 공식 방송·개발자 노트 안내 — dev update | 부품 | 다음 업데이트 방송 시각과 다시보기 연결 | 확장 [MK] |
| GLV-34 | 친구 목록과 접속 상태 — friends list presence | 모듈 | 누가 접속했고 무엇을 하는지 한눈에 | 확인 [QVDSFRND] · 대조 [QVSTFRND] |
| GLV-35 | 최근 함께한 사람 — recent players | 구성 | 방금 같이 논 사람을 다시 찾거나 친구 추가 | 확인 [QVSTFRND] |
| GLV-36 | 친구 요청 보내기·받기 — friend request | 흐름 | 요청하고 상대가 받아 줘야 친구가 됨 | 확인 [QVDSFRND] |
| GLV-37 | 친구 추천 — suggested friends | 구성 | 플랫폼 친구나 같이 논 사람을 권함 | 확장 [MK] |
| GLV-38 | 초대 코드와 초대 보상 — referral reward | 흐름 | 친구를 데려오면 둘 다 받는 보상 | 확장 [MK] |
| GLV-39 | 다른 기기 친구 합친 목록 — cross-platform friends | 구성 | 콘솔·PC·모바일 친구를 한 목록에 | 확인 [QVDSFRND] · 대조 [QVXR015] |
| GLV-40 | 플랫폼 계정 연동 — account linking | 흐름 | 플랫폼 계정을 이어 친구와 진행 상황을 함께 씀 | 확인 [QVDSOVR] |
| GLV-41 | 이름과 구분 번호 — display name and tag | 부품 | 같은 이름이 많아도 한 사람을 정확히 찾음 | 확장 [MK] · 대조 [QVXR018] |
| GLV-42 | 지금 하는 일 표시 — rich presence | 부품 | 친구 목록에 어느 판·어느 모드인지 보임 | 확인 [QVSTFRND] · 대조 [QVDSINV] |
| GLV-43 | 게임 초대와 함께하기 — join game invite | 흐름 | 친구가 있는 판에 바로 들어가기 | 확인 [QVDSINV] · 대조 [QVSTFRND] |
| GLV-44 | 플레이어 카드 — player card | 부품 | 이름·등급·대표 캐릭터를 작은 카드로 | 확장 [MK] |
| GLV-45 | 프로필 자랑 칸 — profile showcase | 구성 | 고른 업적·캐릭터를 남에게 보여 주는 칸 | 확장 [MK] |
| GLV-46 | 상태 메시지 — status message | 부품 | 한 줄 소개나 지금 기분을 남에게 보임 | 확장 [MK] |
| GLV-47 | 길드 찾기와 가입 조건 — guild browser | 모듈 | 활동 시간·등급 조건을 보고 맞는 곳 고르기 | 확장 [MK] |
| GLV-48 | 길드 가입 신청과 승인 — guild application | 흐름 | 신청을 보내고 간부가 받아 주면 가입 | 확장 [MK] · 대조 [QVXR015] |
| GLV-49 | 길드 직위와 권한 — guild ranks | 구성 | 길드장·간부·일반이 할 수 있는 일을 나눔 | 확장 [MK] |
| GLV-50 | 길드 기여도 — guild contribution | 부품 | 누가 얼마나 도왔는지 점수로 보임 | 확장 [MK] |
| GLV-51 | 길드 상점 — guild shop | 모듈 | 길드 기여로 모은 점수로 바꾸는 보상 목록 | 확장 [MK] |
| GLV-52 | 길드 공지와 출석 — guild notice | 부품 | 길드 안 알림과 오늘 온 사람 체크 | 확장 [MK] |
| GLV-53 | 길드전 일정과 참가 — guild war schedule | 모듈 | 언제 싸우는지와 누가 나가는지 정함 | 확장 [MK] |
| GLV-54 | 길드 공동 사냥 — guild raid | 구성 | 길드원이 함께 큰 적을 쓰러뜨리는 목표 | 확장 [MK] |
| GLV-55 | 파티·그룹 찾기 — looking for group (LFG) | 모듈 | 같이 할 사람을 조건으로 모집 | 확장 [MK] |
| GLV-56 | 파티 초대와 파티장 — party leader | 구성 | 무리를 만들고 대표가 판을 시작 | 확장 [MK] · 대조 [QVDSINV] |
| GLV-57 | 비공개 방과 입장 코드 — private lobby code | 구성 | 코드를 아는 친구만 들어오는 방 | 확인 [QVUNILOB] |
| GLV-58 | 빠른 참가 — quick join | 구성 | 조건에 맞는 첫 빈방에 바로 들어감 | 확인 [QVUNILOB] |
| GLV-59 | 예상 대기 시간과 대기열 상태 — queue ETA | 부품 | 상대를 찾는 데 얼마나 걸릴지 보임 | 확장 [MK] |
| GLV-60 | 판 시작 준비 확인 — ready check | 구성 | 모두가 준비됐다고 눌러야 판이 열림 | 확인 [QVUNILOB] · 대조 [QVLOLDODG] |
| GLV-61 | 판 나가기·거절 제재 — dodge and leave penalty | 기준 | 준비 뒤 빠지면 대기 벌칙을 줌 | 확인 [QVLOLDODG] |
| GLV-62 | 실력 점수 표시 방식 — MMR visibility | 기준 | 숨은 실력 점수를 얼마나 보여 줄지 정함 | 확장 [MK] · 대조 [QVVALCOMP] |
| GLV-63 | 채팅 채널 — world guild party chat | 구성 | 전체·길드·파티 대화를 탭으로 나눔 | 확장 [MK] |
| GLV-64 | 귓속말 — whisper | 부품 | 한 사람에게만 보내는 대화 | 확장 [MK] |
| GLV-65 | 욕설 거르개 단계 설정 — profanity filter | 부품 | 나쁜 말을 얼마나 가릴지 직접 고름 | 확장 [MK] · 대조 [QVXR018] |
| GLV-66 | 음성 채팅과 개인 음소거 — voice chat mute | 구성 | 같은 판 사람 목소리를 한 명씩 끔 | 확인 [QVXR015] |
| GLV-67 | 다른 기기 이용자와의 대화 허용 범위 — cross-network communication | 기준 | 모두·친구만·막기 중 더 엄격한 쪽을 따름 | 확인 [QVXR015] |
| GLV-68 | 빠른 채팅 문구 — quick chat | 부품 | 정해진 짧은 말을 버튼 하나로 보냄 | 확인 [QVXR018] |
| GLV-69 | 이모트·스티커 — emotes and stickers | 부품 | 말 대신 몸짓과 그림으로 반응 | 확장 [MK] · 대조 [QVXR015] |
| GLV-70 | 커뮤니티 규범 안내 — code of conduct | 기준 | 해도 되는 행동과 안 되는 행동을 알림 | 확인 [QVXCS] · 대조 [QVXR018] |
| GLV-71 | 방해·피해 행동 분류 — disruption and harms framework | 기준 | 신고 사유와 제재 기준을 같은 말로 나눔 | 확인 [QVFPA] |
| GLV-72 | 플레이어 신고 흐름 — report player | 흐름 | 누구를 왜 신고하는지 고르고 증거를 붙임 | 확인 [QVNXREP] · 대조 [QVPSREP] |
| GLV-73 | 경기 뒤 신고 — post-match report | 구성 | 방금 판에 있던 사람 목록에서 바로 신고 | 확인 [QVLOLREP] |
| GLV-74 | 신고 증거 첨부 — clip and chat evidence | 부품 | 녹화 장면과 대화 기록을 함께 보냄 | 확인 [QVPSREP] |
| GLV-75 | 신고 결과 알림 — report feedback | 부품 | 내 신고로 조치가 됐다고 알려 줌 | 확인 [QVLOLREP] · 대조 [QVXR018] |
| GLV-76 | 투표로 내보내기 — vote kick | 구성 | 표를 모아 방해꾼을 내보냄, 괴롭힘 악용 주의 | 확인 [QVFPA] |
| GLV-77 | 게임 차단과 플랫폼 차단 함께 지키기 — block list | 모듈 | 게임 안 차단 목록과 기기 차단 목록을 모두 따름 | 확인 [QVXR015] |
| GLV-78 | 제재 통지 화면 — enforcement notice | 모듈 | 무엇 때문에 얼마 동안 막혔는지 알림 | 확장 [MK] · 대조 [QVNXPEN] |
| GLV-79 | 누적 경고 기록 — strike history | 부품 | 받은 경고가 쌓이면 제재가 길어짐 | 확인 [QVNXPEN] |
| GLV-80 | 채팅 제한 안내 — chat restriction | 부품 | 나쁜 말을 한 뒤 말할 수 있는 양을 줄임 | 확인 [QVLOLREP] · 대조 [QVLOLHON] |
| GLV-81 | 이의 신청 — appeal | 흐름 | 제재가 틀렸다고 생각하면 다시 봐 달라고 | 확인 [QVLOLREP] · 대조 [QVXR018] |
| GLV-82 | 칭찬하기 — honor or endorsement | 구성 | 경기 뒤 좋은 팀원에게 칭찬을 줌 | 확인 [QVLOLHON] |
| GLV-83 | 칭찬 등급 — honor level | 부품 | 꾸준히 좋은 행동을 하면 오르는 표시 | 확인 [QVLOLHON] |
| GLV-84 | 어린이 계정 소통 제한 — child communication limits | 기준 | 보호자가 대화·친구 추가를 막거나 허락 | 확인 [QVPSFAM] · 대조 [QVXR015] |
| GLV-85 | 랭크 등급과 구간 — ranked tiers and divisions | 기준 | 실력에 따라 나눈 등급 사다리 | 확인 [QVLOLTIER] |
| GLV-86 | 배치 경기 — placement matches | 흐름 | 시즌 처음 몇 판으로 시작 등급을 정함 | 확장 [MK] |
| GLV-87 | 승급전 — promotion series | 구성 | 다음 등급으로 오르기 위한 결정 판 | 확장 [MK] · 대조 [QVLOLTIER] |
| GLV-88 | 강등 보호 — demotion protection | 구성 | 등급이 바로 떨어지지 않게 몇 판 막아 줌 | 확장 [MK] |
| GLV-89 | 오래 쉬면 등급 하락 여부 — rank decay | 기준 | 한동안 판을 안 하면 등급이 내려가는지 밝힘 | 확인 [QVVALCOMP] |
| GLV-90 | 랭크 시즌 초기화 — ranked season reset | 흐름 | 시즌이 바뀌면 등급을 낮추고 다시 시작 | 확장 [MK] · 대조 [QVVALCOMP] |
| GLV-91 | 토너먼트 대진표 — tournament bracket | 모듈 | 게임 안 대회의 다음 상대와 입장 시각 | 확장 [MK] |
| GLV-92 | 토너먼트 참가 신청과 입장 확인 — tournament check-in | 흐름 | 신청하고 시작 전에 왔다고 확인 | 확장 [MK] |
| GLV-93 | 관전 목록 — spectate | 모듈 | 친구나 인기 판을 골라 구경 | 확장 [MK] · 대조 [QVSTBCST] |
| GLV-94 | 경기 다시 보기 — replay | 모듈 | 끝난 판을 처음부터 돌려 봄 | 확장 [MK] |
| GLV-95 | 클립·스크린샷 공유 — clip sharing | 흐름 | 멋진 장면을 저장하고 밖으로 보냄 | 확인 [QVSTCOMM] |
| GLV-96 | 결과 공유 카드 — share card | 부품 | 성적을 그림 한 장으로 SNS에 올림 | 확장 [MK] |
| GLV-97 | 크리에이터 후원 코드 — support-a-creator code | 부품 | 좋아하는 방송인 코드를 넣고 사면 그에게 몫이 감 | 확장 [MK] |
| GLV-98 | 방송 시청 보상 — Twitch Drops | 흐름 | 방송을 보면 게임 속 보상을 받음 | 확인 [QVTWDROP] |
| GLV-99 | Discord 연동 — Discord integration | 구성 | 게임 대화와 친구를 Discord와 이어 줌 | 확인 [QVDSLINK] · 대조 [QVDSOVR] |
| GLV-100 | 게임 안 게시판 — in-game community board | 모듈 | 공략·질문 글을 게임 안에서 읽고 씀 | 확장 [MK] · 대조 [QVSTCOMM] |
| GLV-101 | 팬 창작물·이용자 제작물 모음 — UGC gallery | 모듈 | 다른 사람이 만든 그림·맵·장식을 구경하고 받음 | 확인 [QVSTCOMM] · 대조 [QVXR018] |
| GLV-102 | 비공식 제작물 표시 — third-party content disclaimer | 부품 | 개발사가 만들지 않은 내용임을 알림 | 확인 [QVXR018] |
| GLV-103 | 제작물 보기 제한 때 대신 보여 주기 — UGC restriction fallback | 구성 | 볼 수 없는 제작물은 기본 그림으로 바꾸고 이유를 알림 | 확인 [QVXR018] |
