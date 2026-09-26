# 70. 장르별 고유 화면

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 70번 분류 GGN이다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

FPS·MOBA·RPG·RTS·카드·퍼즐·리듬·레이싱·격투·시뮬레이션·생존·배틀로얄·로그라이크·비주얼노벨·MMO·방치형·하이퍼캐주얼·스포츠·플랫포머·호러 등 특정 장르에서만 쓰는 화면과 부품을 모은다. 항목 이름 앞에 장르를 붙이며, 모바일과 PC 게임을 함께 다룬다. 여러 장르가 공유하는 공통 화면(GAM), 장르와 무관한 전투 표시(GHD), 돈·재화·확률(GEC), 입력 장치 차이(GIO)는 담지 않는다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| GGN-01 | FPS — 탄창·예비탄 표시 (ammo counter) | 부품 | 지금 탄창에 남은 총알과 가진 총알 수 | 확인 [QGUEFPS] |
| GGN-02 | FPS — 재장전 알림·빈 탄창 경고 (reload prompt) | 부품 | 총알이 떨어지기 전에 다시 채우라고 알림 | 확장 [MK] |
| GGN-03 | FPS — 길게 눌러 보는 점수판 (scoreboard, hold Tab) | 모듈 | 누르고 있는 동안만 양 팀 성적을 펼쳐 봄 | 확장 [MK] |
| GGN-04 | FPS — 나를 잡은 장면 다시 보기 (killcam) | 구성 | 쓰러진 뒤 상대 시점으로 원인을 보여 줌 | 확장 [MK] |
| GGN-05 | FPS — 무기 선택 원판 (weapon wheel) | 부품 | 누르는 동안 둥글게 펼쳐 무기를 고름 | 확장 [MK] |
| GGN-06 | FPS — 조준경 확대 겹화면 (ADS scope overlay) | 구성 | 조준하면 둘레를 가리고 가운데를 확대 | 확장 [MK] |
| GGN-07 | FPS — 총기 부착물 편집 (gunsmith, attachments) | 모듈 | 총의 부위마다 부품을 끼워 성능을 비교 | 확장 [MK] |
| GGN-08 | FPS — 무기 구성 선택 (loadout) | 모듈 | 판 시작 전에 들고 갈 무기 묶음을 고름 | 확장 [MK] |
| GGN-09 | FPS — 사격 연습장 (firing range) | 모듈 | 실전 전에 무기와 반동을 시험하는 곳 | 확장 [MK] |
| GGN-10 | 전술 FPS — 라운드 구매 메뉴 (buy menu) | 모듈 | 라운드 시작 전 번 돈으로 장비를 삼 | 확장 [MK] |
| GGN-11 | FPS — 쓰러진 뒤 관전 화면 (spectator) | 구성 | 살아 있는 팀원 시점을 넘겨 가며 봄 | 확장 [MK] |
| GGN-12 | TPS — 어깨 시점 좌우 전환 (shoulder swap) | 구성 | 벽 반대쪽을 보려고 카메라를 옮김 | 확장 [MK] |
| GGN-13 | MOBA — 금지·선택 순서 진행 (draft, ban/pick) | 흐름 | 두 팀이 번갈아 캐릭터를 금지하고 고름 | 확인 [QGLOLCS] · 대조 [QGLOLDEV] |
| GGN-14 | MOBA — 챔피언 선택 화면 (champion select) | 모듈 | 캐릭터·스킨·보조 설정을 제한 시간 안에 | 확인 [QGLOLCS] |
| GGN-15 | MOBA — 포지션 선택 대기열 (role select) | 구성 | 맡고 싶은 자리를 먼저 적고 매칭 | 확인 [QGLOLCS] |
| GGN-16 | MOBA — 선택 순서 교환 요청 (pick swap) | 구성 | 팀원끼리 고를 차례나 캐릭터를 바꿈 | 확인 [QGLOLCS] |
| GGN-17 | MOBA — 추천 아이템 상점 (item shop, recommended build) | 모듈 | 캐릭터에 맞는 물건을 먼저 보여 주고 삼 | 확인 [QGLOLSHP] |
| GGN-18 | MOBA — 룬·특성 페이지 (runes) | 모듈 | 판 시작 전 고르는 추가 능력 묶음 | 확인 [QGLOLRUN] |
| GGN-19 | MOBA — 골드·처치·도움 요약 (KDA, CS) | 부품 | 지금까지의 처치·죽음·도움과 번 돈 | 확장 [MK] |
| GGN-20 | MOBA — 항복 투표 (surrender vote) | 구성 | 팀 다수가 동의하면 판을 일찍 끝냄 | 확인 [QGLOLSUR] |
| GGN-21 | MOBA — 포탑·억제기 상태 막대 (tower status) | 부품 | 양 팀 건물이 몇 개 남았는지 위쪽에 | 확장 [MK] |
| GGN-22 | MOBA — 스킬 레벨업 더하기 단추 (skill level-up) | 부품 | 레벨이 오를 때 올릴 기술을 고름 | 확장 [MK] |
| GGN-23 | MOBA — 부활 대기 시간 (respawn timer) | 부품 | 죽은 뒤 다시 나오기까지 남은 초 | 확장 [MK] |
| GGN-24 | 모바일 MOBA — 기술 끌어 조준과 취소 영역 (drag to aim, cancel zone) | 구성 | 기술 단추를 끌어 방향을 정하고 놓아 씀 | 확장 [MK] |
| GGN-25 | RPG — 파티 편성 (party formation) | 모듈 | 함께 싸울 동료와 줄 위치를 고름 | 확장 [MK] |
| GGN-26 | RPG — 장비 착용 인형 (paper doll) | 모듈 | 몸 그림의 부위마다 장비를 끼움 | 확장 [MK] |
| GGN-27 | RPG — 능력치 비교 설명창 (item comparison tooltip) | 부품 | 지금 장비와 새 장비의 차이를 초록·빨강으로 | 확장 [MK] |
| GGN-28 | RPG — 세트 효과 표시 (set bonus) | 부품 | 같은 세트를 몇 개 모으면 무엇이 붙는지 | 확장 [MK] |
| GGN-29 | RPG — 장비 강화 화면 (upgrade, enhancement) | 모듈 | 재료를 넣어 장비를 키움, 실패 확률은 공개 | 확장 [MK] |
| GGN-30 | RPG — 능력치 점수 나누기 (attribute allocation) | 구성 | 레벨업 점수를 힘·민첩 등에 배분 | 확장 [MK] |
| GGN-31 | RPG — 캐릭터 생성·직업 선택 (character creation) | 흐름 | 종족·직업·외모를 정하고 시작 | 확장 [MK] |
| GGN-32 | RPG — 탐험 지도와 가려진 곳 (map fog) | 모듈 | 가 본 곳만 밝혀지는 넓은 지도 | 확장 [MK] |
| GGN-33 | RPG — 빠른 이동 지점 (fast travel) | 구성 | 가 본 장소로 순간 이동 | 확장 [MK] |
| GGN-34 | RPG — 대화 원판·성향 선택지 (dialogue wheel) | 부품 | 말할 태도를 둥글게 배치해 고름 | 확장 [MK] |
| GGN-35 | RPG — 동료 호감도 표시 (approval, affinity) | 부품 | 내 선택에 동료가 좋아하는지 싫어하는지 | 확장 [MK] |
| GGN-36 | JRPG — 전투 명령 메뉴 (battle command menu) | 부품 | 공격·기술·아이템·도망을 차례로 고름 | 확장 [MK] |
| GGN-37 | JRPG — 행동 순서 줄 (turn order timeline) | 부품 | 누가 먼저 움직일지 순서를 한 줄로 | 확장 [MK] |
| GGN-38 | JRPG — 행동 시간 게이지 (ATB gauge) | 부품 | 게이지가 차면 그 캐릭터가 행동 | 확장 [MK] |
| GGN-39 | MMO — 공격대 체력 격자 (raid frames) | 모듈 | 많은 파티원 체력을 칸 격자로 한눈에 | 확장 [MK] |
| GGN-40 | MMO — 어그로·위협 수준 표시 (threat meter) | 부품 | 적이 누구를 노리는지 순위로 | 확인 [QGWOWTHR] |
| GGN-41 | MMO — 파티 구하기 게시판 (LFG, group finder) | 모듈 | 같이 갈 사람을 목록에서 찾거나 모집 | 확장 [MK] |
| GGN-42 | MMO — 역할별 던전 자동 매칭 (dungeon finder) | 흐름 | 탱커·치유·공격 역할로 줄 서면 자동 편성 | 확인 [QGWOWDF] |
| GGN-43 | MMO — 매크로 편집기 (macro) | 모듈 | 여러 명령을 단추 하나에 묶음 | 확인 [QGWOWMAC] |
| GGN-44 | MMO — 여러 줄 기술 단축 막대 (action bars) | 모듈 | 많은 기술을 줄마다 끌어 배치 | 확장 [MK] |
| GGN-45 | MMO — 전리품 주사위 굴림 (need/greed roll) | 구성 | 떨어진 물건을 누가 가질지 굴려 정함 | 확장 [MK] |
| GGN-46 | MMO — 대상과 대상의 대상 표시 (target of target) | 부품 | 내가 친 적이 누구를 공격 중인지 | 확장 [MK] |
| GGN-47 | MMO — 피해·치유량 측정 표 (damage meter) | 부품 | 누가 얼마나 때리고 치료했는지 순위 | 확장 [MK] |
| GGN-48 | RTS — 끌어서 유닛 고르기 상자 (selection box) | 구성 | 마우스로 사각형을 그려 여럿을 고름 | 확장 [MK] |
| GGN-49 | RTS — 명령 카드 (command card) | 부품 | 고른 유닛이 할 수 있는 명령 단추판 | 확장 [MK] |
| GGN-50 | RTS — 생산 대기열 (production queue) | 부품 | 건물이 만들 유닛을 순서대로 쌓음 | 확장 [MK] |
| GGN-51 | RTS — 부대 지정 번호 (control groups) | 구성 | Ctrl+숫자로 묶고 숫자로 다시 부름 | 확장 [MK] |
| GGN-52 | RTS — 쉬는 일꾼 단추 (idle worker) | 부품 | 놀고 있는 일꾼을 바로 찾아 줌 | 확장 [MK] |
| GGN-53 | RTS — 선택 유닛 초상 격자 (unit selection panel) | 부품 | 고른 유닛들의 얼굴·체력을 칸으로 | 확장 [MK] |
| GGN-54 | RTS — 전장 안개 (fog of war) | 기준 | 내 유닛이 못 보는 곳은 어둡게 가림 | 확장 [MK] |
| GGN-55 | RTS — 자원·인구 막대 (resource bar, supply) | 부품 | 모은 자원과 인구 한도를 위쪽에 | 확장 [MK] |
| GGN-56 | RTS — 미니맵에 바로 명령 (minimap command) | 구성 | 작은 지도를 눌러 유닛을 보냄 | 확장 [MK] |
| GGN-57 | 4X — 기술 연구 나무 (tech tree) | 모듈 | 무엇을 먼저 연구할지 이어진 길로 고름 | 확장 [MK] |
| GGN-58 | 4X — 외교 화면 (diplomacy) | 모듈 | 다른 나라와 거래·동맹·전쟁 선포 | 확장 [MK] |
| GGN-59 | 4X — 턴 종료 단추와 다음 할 일 (end turn) | 부품 | 남은 결정을 알려 주고 차례를 넘김 | 확장 [MK] |
| GGN-60 | 4X — 도시 관리 화면 (city screen) | 모듈 | 도시의 생산·인구·건물을 한곳에서 | 확장 [MK] |
| GGN-61 | 턴제 전술 — 이동 범위 칸 표시 (movement grid) | 구성 | 이번 차례에 갈 수 있는 칸을 색칠 | 확장 [MK] |
| GGN-62 | 턴제 전술 — 명중 확률 표시 (hit chance) | 부품 | 쏘기 전에 맞힐 확률을 숫자로 | 확장 [MK] |
| GGN-63 | 카드 — 손패 부채꼴 (hand fan) | 부품 | 가진 카드를 부채처럼 펼쳐 놓음 | 확장 [MK] |
| GGN-64 | 카드 — 마나 수정 (mana crystals) | 부품 | 이번 차례에 쓸 수 있는 힘을 알 모양으로 | 확인 [QGHSMANA] |
| GGN-65 | 카드 — 덱 편집 (deck builder) | 모듈 | 카드 모음에서 골라 정해진 장수로 묶음 | 확장 [MK] |
| GGN-66 | 카드 — 첫 손패 바꾸기 (mulligan) | 흐름 | 시작 카드 중 싫은 것을 한 번 바꿈 | 확인 [QGHSMULL] |
| GGN-67 | 카드 — 카드 크게 보기 (card inspect) | 구성 | 누르거나 올리면 카드 글을 크게 | 확장 [MK] |
| GGN-68 | 카드 — 희귀도 테두리·보석 (rarity gem) | 부품 | 얼마나 귀한 카드인지 색으로 구분 | 확장 [MK] |
| GGN-69 | 카드 — 뽑을 더미·버린 더미 (draw pile, discard pile) | 부품 | 남은 카드와 버린 카드 수를 양옆에 | 확장 [MK] |
| GGN-70 | 카드 — 적 행동 예고 (intent) | 부품 | 적이 다음에 무엇을 할지 머리 위에 | 확인 [QGSTSINT] |
| GGN-71 | 카드 — 대상 지정 화살표 (targeting arrow) | 구성 | 카드를 끌면 화살표로 맞을 대상을 가리킴 | 확장 [MK] |
| GGN-72 | 카드 — 턴 종료 단추와 남은 시간 줄 (end turn, rope) | 부품 | 차례를 넘기고 시간이 타들어 가는 줄 | 확장 [MK] |
| GGN-73 | 매치3 — 남은 이동 횟수 (moves left) | 부품 | 이 판에서 움직일 수 있는 남은 횟수 | 확장 [MK] |
| GGN-74 | 매치3 — 판 목표 표시 (level goals) | 부품 | 모아야 할 사탕·깨야 할 칸 수 | 확장 [MK] |
| GGN-75 | 매치3 — 시작 전 부스터 고르기 (pre-level boosters) | 구성 | 판을 열기 전에 도움 아이템을 켬 | 확장 [MK] |
| GGN-76 | 매치3 — 생명 하트와 충전 시간 (lives) | 부품 | 실패하면 줄고 시간이 지나면 차는 하트 | 확장 [MK] |
| GGN-77 | 매치3 — 별 점수 막대 (star meter) | 부품 | 점수가 오르며 별 1·2·3개 선을 넘음 | 확장 [MK] |
| GGN-78 | 퍼즐 — 힌트와 되돌리기 (hint, undo) | 부품 | 막히면 다음 수를 보여 주거나 되돌림 | 확장 [MK] |
| GGN-79 | 리듬 — 노트가 내려오는 길 (note highway) | 구성 | 음표가 줄을 따라 판정선으로 다가옴 | 확장 [MK] |
| GGN-80 | 리듬 — 판정 글자 (judgement text) | 부품 | 누른 박자가 맞았는지 Perfect 등으로 | 확장 [MK] |
| GGN-81 | 리듬 — 콤보 수 (combo counter) | 부품 | 끊기지 않고 맞힌 개수 | 확장 [MK] |
| GGN-82 | 리듬 — 정확도와 등급 (accuracy, rank) | 부품 | 얼마나 정확했는지 백분율과 S·A 등급 | 확인 [QGOSUACC] |
| GGN-83 | 리듬 — 체력·클리어 게이지 (health bar) | 부품 | 틀리면 줄고 맞히면 차는 막대 | 확인 [QGOSUHP] |
| GGN-84 | 리듬 — 싱크 보정 (audio offset calibration) | 모듈 | 소리와 화면이 어긋난 만큼 맞춤 | 확인 [QGOSUOFS] |
| GGN-85 | 리듬 — 난이도·채보 선택 (difficulty, chart select) | 모듈 | 같은 곡의 쉬운·어려운 악보를 고름 | 확장 [MK] |
| GGN-86 | 리듬 — 곡 선택 목록과 미리 듣기 (song select, preview) | 모듈 | 곡을 넘기면 한 소절을 들려 줌 | 확장 [MK] |
| GGN-87 | 리듬 — 노트 속도 설정 (scroll speed) | 구성 | 음표가 내려오는 빠르기를 바꿈 | 확장 [MK] |
| GGN-88 | 레이싱 — 속도계·회전계 (speedometer, tachometer) | 부품 | 지금 속도와 엔진 회전을 바늘·숫자로 | 확인 [QGR3EHUD] |
| GGN-89 | 레이싱 — 순위 표시 (race position) | 부품 | 지금 몇 등인지 크게 | 확장 [MK] |
| GGN-90 | 레이싱 — 랩 수와 랩 시간 (lap counter, lap time) | 부품 | 몇 바퀴째인지와 바퀴마다 걸린 시간 | 확장 [MK] |
| GGN-91 | 레이싱 — 고스트 차 (ghost) | 구성 | 내 기록이나 남의 기록을 반투명 차로 | 확장 [MK] |
| GGN-92 | 레이싱 — 부스트 게이지 (boost, nitro) | 부품 | 순간 가속을 얼마나 쓸 수 있는지 | 확장 [MK] |
| GGN-93 | 레이싱 — 벌칙 알림 (penalty) | 부품 | 코스를 벗어나거나 부딪혔을 때 벌점 | 확장 [MK] |
| GGN-94 | 레이싱 — 주행선 보조 (driving line) | 구성 | 길 위에 달릴 선과 브레이크 지점을 색으로 | 확장 [MK] |
| GGN-95 | 레이싱 — 되감기 (rewind) | 구성 | 실수한 몇 초 전으로 되돌림 | 확장 [MK] |
| GGN-96 | 레이싱 — 차량 세팅 화면 (tuning) | 모듈 | 타이어·서스펜션 값을 막대로 조정 | 확장 [MK] |
| GGN-97 | 격투 — 마주 보는 체력 막대 (mirrored health bars) | 구성 | 두 선수 체력을 좌우 대칭으로 위에 | 확장 [MK] |
| GGN-98 | 격투 — 라운드 승리 표시 (round counter) | 부품 | 몇 판을 이겼는지 점이나 별로 | 확장 [MK] |
| GGN-99 | 격투 — 필살기·드라이브 게이지 (super meter, drive gauge) | 부품 | 모이면 큰 기술을 쓰는 막대 | 확장 [MK] |
| GGN-100 | 격투 — 기술표 (command list, move list) | 모듈 | 기술마다 누를 방향과 단추 순서 | 확장 [MK] |
| GGN-101 | 격투 — 입력 기록 (input history) | 부품 | 방금 누른 방향과 단추가 줄줄이 | 확장 [MK] |
| GGN-102 | 격투 — 프레임 표 (frame meter) | 부품 | 기술의 빠르기와 틈을 칸 단위로 | 확장 [MK] |
| GGN-103 | 격투 — 트레이닝 상대 설정 (training dummy settings) | 모듈 | 연습 상대의 막기·반격을 정함 | 확장 [MK] |
| GGN-104 | 격투 — 캐릭터 선택 격자 (character select) | 모듈 | 초상을 칸에 모아 두 선수가 동시에 고름 | 확장 [MK] |
| GGN-105 | 격투 — 재대결 묻기 (rematch) | 구성 | 끝난 뒤 같은 상대와 바로 다시 | 확장 [MK] |
| GGN-106 | 시뮬 — 건설 모드 (build mode) | 모듈 | 놀기 화면에서 짓기 화면으로 전환 | 확장 [MK] |
| GGN-107 | 시뮬 — 건물·가구 목록 (build catalog) | 모듈 | 종류별 탭에서 골라 끌어 놓음 | 확장 [MK] |
| GGN-108 | 시뮬 — 예산·재정 창 (budget) | 모듈 | 세금과 지출 막대로 나라 살림 조정 | 확장 [MK] |
| GGN-109 | 시뮬 — 시간 배속 (time speed) | 부품 | 멈춤·1배·2배·3배로 시간 흐름 조절 | 확장 [MK] |
| GGN-110 | 시뮬 — 정보 겹침 지도 (info view overlay) | 구성 | 교통·오염 등을 지도 위 색으로 | 확인 [QGCSLINF] |
| GGN-111 | 시뮬 — 수요 막대 (RCI demand) | 부품 | 주거·상업·공업 중 무엇이 모자란지 | 확인 [QGCSLRCI] |
| GGN-112 | 시뮬 — 욕구 막대 (needs, motives) | 부품 | 배고픔·위생·재미가 얼마나 찼는지 | 확장 [MK] |
| GGN-113 | 농장 시뮬 — 계절 달력 (season calendar) | 부품 | 오늘 날짜와 축제·생일 일정 | 확장 [MK] |
| GGN-114 | 생존 — 허기 표시 (hunger bar) | 부품 | 먹어야 할 때를 알려 주는 막대 | 확인 [QGMCHUNG] |
| GGN-115 | 생존 — 갈증 표시 (thirst) | 부품 | 물을 마셔야 할 때를 알려 주는 막대 | 확장 [MK] |
| GGN-116 | 생존 — 체온 표시 (temperature) | 부품 | 춥거나 더워 위험한지 | 확장 [MK] |
| GGN-117 | 생존 — 제작 격자 (crafting grid) | 모듈 | 재료를 칸에 놓아 새 물건을 만듦 | 확인 [QGMCCRFT] |
| GGN-118 | 생존 — 제작법 목록 (recipe book) | 모듈 | 만들 수 있는 것과 필요한 재료 | 확인 [QGMCCRFT] |
| GGN-119 | 생존 — 기지 건설 배치 (base building placement) | 구성 | 벽·바닥을 격자에 맞춰 미리 보고 놓음 | 확장 [MK] |
| GGN-120 | 생존 — 가방 무게 제한 (encumbrance) | 부품 | 너무 무거우면 느려진다고 알림 | 확장 [MK] |
| GGN-121 | 생존 — 정신력 표시 (sanity) | 부품 | 무섭거나 어두우면 줄어드는 수치 | 확인 [QGDSSAN] |
| GGN-122 | 배틀로얄 — 줄어드는 안전지대와 남은 시간 (ring, zone timer) | 부품 | 안전한 원이 언제 얼마나 줄어드는지 | 확인 [QGAPXRNG] |
| GGN-123 | 배틀로얄 — 낙하 지점 고르기 (drop map) | 흐름 | 비행 경로를 보고 내릴 곳을 찍음 | 확장 [MK] |
| GGN-124 | 배틀로얄 — 분대원 상태 (squad status) | 부품 | 팀원 체력·쓰러짐을 옆에 작게 | 확장 [MK] |
| GGN-125 | 배틀로얄 — 부활 신호기 (respawn beacon) | 구성 | 쓰러진 동료의 표식을 가져가 되살림 | 확인 [QGAPXBCN] |
| GGN-126 | 배틀로얄 — 장비 등급 색 (loot rarity color) | 기준 | 흰·파랑·보라·금으로 좋은 물건 구분 | 확장 [MK] |
| GGN-127 | 배틀로얄 — 남은 인원 수 (players alive) | 부품 | 아직 살아남은 사람과 팀 수 | 확장 [MK] |
| GGN-128 | 로그라이크 — 판 요약 (run summary) | 모듈 | 이번 도전의 층·처치·얻은 것을 정리 | 확장 [MK] |
| GGN-129 | 로그라이크 — 영구 성장 나무 (meta progression) | 모듈 | 죽어도 남는 재화로 다음 판을 강화 | 확장 [MK] |
| GGN-130 | 로그라이크 — 조합 효과 표시 (synergy) | 부품 | 같이 가진 것끼리 생기는 추가 효과 | 확장 [MK] |
| GGN-131 | 로그라이크 — 갈림길 지도 (branching map) | 구성 | 다음 방을 여러 길 중에서 고름 | 확인 [QGSTSMAP] |
| GGN-132 | 로그라이크 — 시드 입력 (seed) | 부품 | 같은 숫자로 같은 판을 다시 만듦 | 확인 [QGSTSMAP] |
| GGN-133 | 로그라이크 — 셋 중 하나 보상 (pick one of three) | 구성 | 보상 후보 세 개 중 하나를 고름 | 확장 [MK] |
| GGN-134 | 비주얼노벨 — 대사창 (say screen) | 부품 | 대사를 화면 아래 창에 한 줄씩 보여 줌 | 확인 [QGRPYSCR] |
| GGN-135 | 비주얼노벨 — 이름표 (namebox) | 부품 | 말하는 사람 이름을 대사창 위에 따로 | 확장 [MK] |
| GGN-136 | 비주얼노벨 — 옆 얼굴 그림 (side image) | 부품 | 대사창 옆에 말하는 사람 얼굴 | 확장 [MK] |
| GGN-137 | 비주얼노벨 — 지나간 대사 다시 보기 (backlog, history) | 모듈 | 놓친 대사를 위로 넘겨 다시 읽음 | 확인 [QGRPYHIS] |
| GGN-138 | 비주얼노벨 — 빠른 메뉴 막대 (quick menu) | 부품 | 되감기·자동·건너뛰기·저장 단추를 한 줄로 | 확장 [MK] |
| GGN-139 | 비주얼노벨 — 읽은 글만 건너뛰기 (skip read text) | 구성 | 이미 본 대사만 빨리 넘김 | 확인 [QGRPYPRF] |
| GGN-140 | 비주얼노벨 — 건너뛰는 중 표시 (skip indicator) | 부품 | 빨리 넘기는 동안 구석에 작게 알림 | 확인 [QGRPYSCR] |
| GGN-141 | 비주얼노벨 — 글자 나오는 속도 (text speed) | 구성 | 대사가 한 글자씩 나오는 빠르기 조절 | 확장 [MK] |
| GGN-142 | 비주얼노벨 — 자동 넘김 (auto-forward) | 구성 | 손대지 않아도 읽는 속도에 맞춰 넘김 | 확인 [QGRPYPRF] |
| GGN-143 | 비주얼노벨 — 장면 그림 모음 (CG gallery) | 모듈 | 본 삽화만 열리는 그림첩 | 확인 [QGRPYGAL] |
| GGN-144 | 비주얼노벨 — 음악 감상실 (music room) | 모듈 | 들은 곡을 골라 다시 들음 | 확인 [QGRPYGAL] |
| GGN-145 | 비주얼노벨 — 갈래 지도 (flowchart, route map) | 모듈 | 어느 선택에서 이야기가 갈렸는지 나무로 | 확장 [MK] |
| GGN-146 | 방치형 — 자리 비운 동안의 보상 (offline earnings) | 구성 | 돌아오면 그동안 모인 양을 알려 줌 | 확장 [MK] |
| GGN-147 | 방치형 — 자동 수집 (auto collect) | 부품 | 누르지 않아도 저절로 쌓임 | 확장 [MK] |
| GGN-148 | 방치형 — 처음부터 다시 하며 강해지기 (prestige, ascension) | 흐름 | 진행을 초기화하고 영구 배율을 얻음 | 확인 [QGCCASC] |
| GGN-149 | 방치형 — 한 번에 사는 개수 (buy x1, x10, max) | 부품 | 1개·10개·최대로 묶어 삼 | 확장 [MK] |
| GGN-150 | 방치형 — 아주 큰 수 표기 (big number notation) | 기준 | K·M·B나 1.2e15처럼 짧게 적음 | 확장 [MK] |
| GGN-151 | 하이퍼캐주얼 — 한 손가락 조작 (one-thumb control) | 기준 | 누르기·끌기 하나로 모든 조작 | 확장 [MK] |
| GGN-152 | 하이퍼캐주얼 — 누르면 시작 (tap to play) | 구성 | 메뉴 없이 첫 화면에서 바로 시작 | 확장 [MK] |
| GGN-153 | 하이퍼캐주얼 — 즉시 재시작 (instant restart) | 구성 | 실패하면 기다림 없이 다시 | 확장 [MK] |
| GGN-154 | 하이퍼캐주얼 — 판 진행 막대 (level progress bar) | 부품 | 이 판의 끝까지 얼마나 왔는지 위쪽에 | 확장 [MK] |
| GGN-155 | 스포츠 — 점수·시간 띠 (score bug) | 부품 | 중계처럼 구석에 점수와 경기 시간 | 확장 [MK] |
| GGN-156 | 스포츠 — 선수 교체 (substitution) | 모듈 | 지친 선수를 벤치 선수와 바꿈 | 확장 [MK] |
| GGN-157 | 스포츠 — 전술판 (tactics board) | 모듈 | 진형과 선수 위치를 판 위에 끌어 정함 | 확장 [MK] |
| GGN-158 | 스포츠 — 중계 카메라 고르기 (broadcast camera) | 구성 | TV 중계·가까이 등 시점을 고름 | 확장 [MK] |
| GGN-159 | 스포츠 — 조종 선수 표시와 체력 (player indicator, stamina) | 부품 | 내가 움직이는 선수 발밑 표시와 지친 정도 | 확장 [MK] |
| GGN-160 | 스포츠 관리 — 선수 능력치 카드 (player attributes) | 부품 | 빠르기·슛 같은 능력을 숫자와 육각형으로 | 확장 [MK] |
| GGN-161 | 골프 — 스윙 게이지 (swing meter) | 부품 | 막대가 지나갈 때 눌러 힘과 정확도를 정함 | 확장 [MK] |
| GGN-162 | 플랫포머 — 남은 목숨 수 (lives) | 부품 | 몇 번 더 실패해도 되는지 | 확장 [MK] |
| GGN-163 | 플랫포머 — 중간 저장 지점 (checkpoint) | 구성 | 죽으면 여기서 다시 시작 | 확장 [MK] |
| GGN-164 | 플랫포머 — 수집품 개수 (collectible counter) | 부품 | 동전·별을 몇 개 모았는지 | 확장 [MK] |
| GGN-165 | 플랫포머 — 기록 재기 타이머 (speedrun timer) | 부품 | 구간마다 걸린 시간을 비교 | 확장 [MK] |
| GGN-166 | 호러 — 최소 표시 화면 (minimal HUD) | 기준 | 무서움을 해치지 않게 표시를 거의 없앰 | 확장 [MK] |
| GGN-167 | 호러 — 손전등 배터리 (flashlight battery) | 부품 | 빛이 얼마나 더 버틸지 | 확장 [MK] |
| GGN-168 | 호러 — 저장 횟수 제한 (limited save) | 구성 | 정해진 곳·횟수로만 저장해 긴장 유지 | 확장 [MK] |
| GGN-169 | 스텔스 — 발각 게이지 (detection meter) | 부품 | 적이 나를 얼마나 알아챘는지 차오름 | 확장 [MK] |
| GGN-170 | 스텔스 — 소음 표시 (noise indicator) | 부품 | 내 발소리가 얼마나 퍼지는지 | 확장 [MK] |
| GGN-171 | 타워디펜스 — 웨이브 수와 다음 웨이브 부르기 (wave counter, call early) | 부품 | 몇 번째 적 무리인지와 일찍 부르기 | 확장 [MK] |
| GGN-172 | 타워디펜스 — 타워 설치 칸과 사거리 원 (placement grid, range) | 구성 | 놓을 수 있는 칸과 닿는 거리를 미리 | 확장 [MK] |
| GGN-173 | 타워디펜스 — 적 이동 경로 표시 (enemy path) | 구성 | 적이 지나갈 길을 선으로 미리 | 확장 [MK] |
| GGN-174 | 타워디펜스 — 강화 갈래 (upgrade paths) | 모듈 | 한 타워의 강화 길을 여러 갈래로 | 확장 [MK] |
| GGN-175 | 타워디펜스 — 공격 우선순위 (targeting priority) | 부품 | 앞선 적·센 적 중 누구를 먼저 칠지 | 확장 [MK] |
| GGN-176 | 샌드박스 — 단축 칸 한 줄 (hotbar) | 부품 | 손에 들 블록·도구 아홉 칸을 아래에 | 확인 [QGMCINV] |
| GGN-177 | 샌드박스 — 창작 모드 전체 목록 (creative inventory) | 모듈 | 모든 블록을 탭별로 무한히 꺼냄 | 확장 [MK] |
| GGN-178 | 샌드박스 — 세계 만들기 설정 (world creation) | 흐름 | 모드·시드·규칙을 정해 새 세계를 만듦 | 확장 [MK] |
| GGN-179 | 수집형 RPG — 속성 상성 편성 (team formation) | 모듈 | 적 속성에 맞춰 덱을 추천·저장 | 확장 [MK] |
| GGN-180 | 수집형 RPG — 소탕 (sweep) | 구성 | 다 깬 판을 전투 없이 보상만 받음 | 확장 [MK] |
| GGN-181 | 수집형 RPG — 자동 전투 켜기 (auto battle) | 부품 | 손대지 않아도 캐릭터가 알아서 싸움 | 확장 [MK] |
| GGN-182 | 수집형 RPG — 전투 배속 (battle speed x2) | 부품 | 전투를 두 배·세 배로 빨리 봄 | 확장 [MK] |
| GGN-183 | 수집형 RPG — 반복 전투 (auto repeat) | 구성 | 같은 판을 정한 횟수만큼 저절로 되풀이 | 확장 [MK] |
| GGN-184 | 수집형 RPG — 캐릭터 도감 (collection codex) | 모듈 | 모은 캐릭터와 못 모은 칸을 한눈에 | 확장 [MK] |
| GGN-185 | 스킬 트리 — 칸 상태 (node states) | 부품 | 배운 칸·배울 수 있는 칸·잠긴 칸을 모양으로 구분 | 확장 [MK] · 대조 [QZWOWTAL] |
| GGN-186 | 스킬 트리 — 선행 연결선 (prerequisite link) | 부품 | 앞 칸을 배워야 열리는 길을 선으로 보여 줌 | 확인 [QZWOWTAL] |
| GGN-187 | 스킬 트리 — 줄 단위 잠금 해제 (tiered unlock) | 기준 | 포인트를 쓴 만큼 아래 줄이 열림, 필요한 수를 옆에 적음 | 확인 [QZWOWTAL] |
| GGN-188 | 스킬 트리 — 여러 단계 칸 (multi-rank node) | 부품 | 한 칸을 여러 번 찍으면 지금 단계와 최대 단계를 숫자로 | 확인 [QZWOWTAL] |
| GGN-189 | 스킬 트리 — 남은 포인트 수 | 부품 | 쓸 수 있는 포인트를 판 위쪽에 늘 보여 줌 | 확장 [MK] |
| GGN-190 | 스킬 트리 — 찍기 전 미리보기 (preview before commit) | 구성 | 확정 전에 바뀌는 능력치를 보여 주고 되돌리게 함 | 확장 [MK] |
| GGN-191 | 특성 초기화 — respec | 흐름 | 다시 찍기 전에 드는 비용과 조건을 먼저 알림 | 확인 [QZWOWTAL] · 대조 [QZD4RESP] |
| GGN-192 | 초기화 비용 증가 표시 — escalating respec cost | 기준 | 할 때마다 비싸지면 다음 비용까지 미리 보여 줌 | 확인 [QZPOETREE] · 대조 [QZD4RESP] |
| GGN-193 | 특성 구성 저장 — talent loadouts | 부품 | 자주 쓰는 배치를 이름 붙여 저장하고 한 번에 바꿈 | 확인 [QZWOWTAL] |
| GGN-194 | 큰 특성판 이동·확대 — pan and zoom | 구성 | PC는 휠과 끌기, 모바일은 두 손가락으로 판을 움직임 | 확장 [MK] |
| GGN-195 | 특성판 검색 강조 — tree search highlight | 구성 | 찾는 효과가 붙은 칸만 밝게 표시 | 확장 [MK] |
| GGN-196 | 오토배틀러 — 상점 새로고침 (shop reroll) | 부품 | 골드를 내고 상점 칸을 새 캐릭터로 모두 바꿈 | 확인 [QZTFTSHOP] |
| GGN-197 | 오토배틀러 — 상점 고정 (shop lock) | 부품 | 다음 판에도 지금 상점 목록을 남겨 둠 | 확장 [MK] |
| GGN-198 | 장비 옵션 다시 굴리기 — affix reroll | 흐름 | 바꿀 옵션을 고르고 드는 비용을 먼저 보여 줌 | 확장 [MK] |
