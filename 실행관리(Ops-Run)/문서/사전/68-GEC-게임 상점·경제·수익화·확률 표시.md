# 68. 게임 상점·경제·수익화·확률 표시

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 68번 분류 GEC다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

모바일과 PC 게임에서 돈·재화·확률이 걸린 화면을 담는다. 상점과 재화 표시, 정기 상품과 시즌 보상 길, 광고 보상, 뽑기·강화의 확률 공개, 결제 확인·한도·보호자 승인·환불, 그리고 이 영역에서 쓰지 말아야 할 방식을 다룬다. 일반 결제 수단과 청구서는 BIL, 뽑기를 여는 순간의 연출은 GFX, 운영 이벤트와 보상 우편은 GLV가 맡는다.

| ID | 항목 | 통용 용어 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|---|
| GEC-01 | 확률형 아이템 표시 의무 — 한국 게임산업법 제33조 | 확률형 아이템 확률 공개 의무 (Loot Box Probability Disclosure) | 기준 | 게임·홈페이지·광고마다 종류와 확률을 적음 | 확인 [QELAW33] · 대조 [QEDECREE] |
| GEC-02 | 확률형 아이템 범위 — 캡슐형·강화형·합성형 | 확률형 아이템 유형 (Capsule, Enhancement, Fusion) | 기준 | 뽑기만이 아니라 강화·합성도 공개 대상 | 확인 [QEHWAWOO] · 대조 [QELAWDEF] |
| GEC-03 | 무료 재화 경계 — 유료로도 살 수 있는 재화 | 유료 구매 가능 재화 (Purchasable Currency) | 기준 | 보너스로 준 골드도 돈으로 살 수 있으면 공개 대상 | 확인 [QEHWAWOO] |
| GEC-04 | 확률 표시 위치 — 구매·조회·사용 화면 | 확률 표시 위치 (Odds Display Placement) | 기준 | 사는 첫 화면부터 결제 직전까지 건너뛸 수 없게 | 확인 [QEDECREE] · 대조 [QEHWAWOO] |
| GEC-05 | 확률 백분율 표기와 반올림 자리 | 확률 백분율 표기 (Probability Percentage) | 기준 | 퍼센트로, 너무 작은 값도 뭉개지 않게 | 확인 [QEDECREE] |
| GEC-06 | 확률 안내 누리집 바로가기 — 화면이 좁을 때 | 확률 정보 바로가기 (Odds Page Link) | 구성 | 칸이 모자라면 확률 페이지로 곧장 연결 | 확인 [QEDECREE] · 대조 [QEHWAWOO] |
| GEC-07 | 확률 공개 누리집 — 글자로 검색되는 표 | 확률 공개 페이지 (Probability Disclosure Page) | 모듈 | 게임 밖에서도 이름으로 찾아볼 수 있게 | 확인 [QEDECREE] · 대조 [QEHWAWOO] |
| GEC-08 | 광고물의 확률형 아이템 포함 문구 | 광고 확률형 아이템 고지 (Loot Box Ad Disclosure) | 기준 | 광고에도 뽑기가 들어 있다고 알림 | 확인 [QEHWAWOO] |
| GEC-09 | 천장 조건과 횟수별 확률 표시 — pity 공개 | 천장 공개 (Pity System Disclosure) | 기준 | 몇 번 뽑으면 확정인지와 회차별 확률을 적음 | 확인 [QEHWAWOO] |
| GEC-10 | 모아서 완성하는 뽑기 표시 — 컴플리트 가챠 | 컴플리트 가챠 (Complete Gacha) | 기준 | 조합을 채우면 받는 보상도 확률 공개 | 확인 [QEHWAWOO] |
| GEC-11 | 수량 한정 뽑기 잔여 수량 — box gacha | 박스 가챠 (Box Gacha) | 부품 | 남은 개수와 바뀌는 확률을 늘 보여 줌 | 확인 [QEHWAWOO] |
| GEC-12 | 진행에 따라 변하는 확률 표시 — 누적 보정 | 확률 보정 공개 (Dynamic Odds Disclosure) | 구성 | 실패할수록 오르는 확률을 지금 값으로 | 확인 [QEHWAWOO] |
| GEC-13 | 기간 한정 판매 조건 고지 | 기간 한정 판매 고지 (Limited-Time Sale Notice) | 구성 | 이벤트로만 파는 조건을 팔 때 분명히 | 확인 [QEHWAWOO] |
| GEC-14 | 확률 변경 사전 공지 | 확률 변경 공지 (Odds Change Notice) | 흐름 | 바꾸기 전에 무엇을 언제 바꾸는지 먼저 게시 | 확인 [QEHWAWOO] |
| GEC-15 | 확률 거짓 표시 징벌 배상 — 2025년 8월 시행 | 확률 조작 징벌적 손해배상 (Punitive Damages for False Odds) | 기준 | 일부러 속이면 손해의 3배까지 물어냄 | 확인 [QEKCPUN] · 대조 [QEEDAILY] |
| GEC-16 | 앱 스토어 확률 공개 — App Store 3.1.1 loot box odds | 앱스토어 확률 공개 (App Store Loot Box Odds) | 기준 | 사기 전에 종류별 받을 확률을 보여 줌 | 확인 [APPLEASRG] |
| GEC-17 | 구글 플레이 확률 공개 — randomized virtual items | 구글 플레이 확률 공개 (Randomized Virtual Items) | 기준 | 구매 버튼 가까이, 사기 전에 확률 공개 | 확인 [QEGPPAY] |
| GEC-18 | 유료 재화 만료 금지 | 유료 재화 소멸 금지 (No Currency Expiration) | 기준 | 돈 주고 산 재화는 기한이 끝나지 않음 | 확인 [APPLEASRG] |
| GEC-19 | 재화는 산 게임 안에서만 사용 | 재화 게임 간 이동 금지 (Non-Transferable Currency) | 기준 | 다른 게임으로 옮겨 쓰게 하지 않음 | 확인 [QEGPPAY] |
| GEC-20 | 금지 — 현금 도박용 재화 인앱 판매 | 현금 도박 재화 판매 금지 (Real-Money Gambling Ban) | 기준 | 실제 돈 걸기에 쓸 재화는 앱 결제로 팔지 않음 | 확인 [APPLEASRG] |
| GEC-21 | 인게임 구매 표시 — PEGI In-game purchases | PEGI 인게임 구매 표시 (PEGI In-Game Purchases) | 기준 | 유럽 등급표에 돈 쓰는 요소와 뽑기 여부 표시 | 확인 [QEPEGI] |
| GEC-22 | 인게임 구매 표시 — ESRB In-Game Purchases (Includes Random Items) | ESRB 인게임 구매 표시 (ESRB In-Game Purchases) | 기준 | 북미 등급표에 구매와 무작위 상품 표시 | 확인 [QEESRB] |
| GEC-23 | 국내 등급·내용정보 표시 — GRAC | 게임물 등급 표시 (GRAC Rating) | 기준 | 이용 연령과 내용 정보를 시작·상점에 표시 | 확장 [MK] |
| GEC-24 | 게임 상점 탭 구조 — 추천·재화·패키지·꾸미기 | 상점 탭 구성 (Shop Tabs) | 모듈 | 파는 것을 종류별 칸으로 나눔 | 확장 [MK] |
| GEC-25 | 새 상품·무료 상품 알림 점 | 레드닷 알림 (Red Dot Badge) | 부품 | 상점에 새로 들어온 것을 작은 점으로 | 확장 [MK] |
| GEC-26 | 다중 재화 상단 바 — currency bar | 재화 바 (Currency Bar) | 부품 | 가진 돈 여러 종류를 화면 위에 늘 | 확장 [MK] |
| GEC-27 | 재화 부족 시 충전 안내 창 | 재화 부족 팝업 (Insufficient Currency Popup) | 흐름 | 모자란 양과 채우는 길을 보여 줌, 강요 주의 | 확장 [MK] |
| GEC-28 | 유료·무료 재화 구분 표시 | 유상·무상 재화 구분 (Paid vs Free Currency) | 기준 | 산 재화와 얻은 재화를 따로 셈 | 확장 [MK] · 대조 [QEHWAWOO] |
| GEC-29 | 재화 보유 상한 — currency cap | 재화 보유 한도 (Currency Cap) | 구성 | 더 못 모으는 한도와 넘칠 때 처리 | 확장 [MK] |
| GEC-30 | 재화 획득·사용 내역 | 재화 사용 내역 (Currency History) | 모듈 | 언제 얼마 얻고 썼는지 목록으로 | 확장 [MK] |
| GEC-31 | 재화 사용 전 확인 창 | 재화 사용 확인 팝업 (Purchase Confirmation) | 구성 | 비싼 재화를 쓰기 전에 한 번 더 물음 | 확장 [MK] |
| GEC-32 | 현지 통화 가격 표시 — local currency | 현지 통화 표시 (Local Currency Pricing) | 기준 | 사는 사람 나라 돈으로 값을 보여 줌 | 확인 [QESTMTXI] |
| GEC-33 | 상품 카드 — 가격·구성품·이미지 | 상품 카드 (Product Card) | 부품 | 무엇을 얼마에 사는지 한 칸에 | 확장 [MK] |
| GEC-34 | 할인율·원래 가격 표시 | 할인 표시 (Discount Badge) | 부품 | 얼마나 싸졌는지 원래 값과 함께 | 확장 [MK] |
| GEC-35 | 가치 배지 — N% more value | 가치 배지 (Value Badge) | 부품 | 같은 돈에 더 받는 양을 표시, 과장 주의 | 확장 [MK] |
| GEC-36 | 판매 종료 남은 시간 | 판매 종료 타이머 (Sale Countdown) | 부품 | 언제까지 파는지 실제 시간으로 | 확장 [MK] |
| GEC-37 | 구매 제한 횟수 — 산 횟수/전체 횟수 | 구매 제한 횟수 (Purchase Limit) | 부품 | 몇 번 더 살 수 있는지 버튼 곁에 | 확인 [QEFCO] |
| GEC-38 | 패키지 구성품 목록 | 패키지 구성품 (Bundle Contents) | 구성 | 묶음 안에 든 것을 하나하나 보여 줌 | 확장 [MK] |
| GEC-39 | 첫 결제 보너스·첫 구매 특가 — first purchase offer | 첫 구매 보너스 (First Purchase Bonus) | 구성 | 처음 사는 사람에게 더 얹어 줌 | 확인 [QEGRIAP] |
| GEC-40 | 시작 묶음 — starter pack | 스타터 팩 (Starter Pack) | 구성 | 초반에 필요한 것을 싸게 묶음 | 확장 [MK] |
| GEC-41 | 상황 맞춤 제안 — targeted offer | 맞춤형 오퍼 (Targeted Offer) | 구성 | 막힌 순간·레벨 도달 때 맞춘 상품 | 확인 [QEGRIAP] |
| GEC-42 | 기간 한정 제안 창 — limited-time offer | 기간 한정 오퍼 (Limited-Time Offer) | 구성 | 잠깐만 파는 상품을 띄움, 반복 주의 | 확장 [MK] · 대조 [QEGRIAP] |
| GEC-43 | 계단식 묶음 — step-up offer | 스텝업 패키지 (Step-Up Offer) | 구성 | 살수록 다음 묶음이 열림, 전체 값 공개 | 확장 [MK] |
| GEC-44 | 웹 상점 — web shop | 웹 상점 (Web Shop) | 모듈 | 게임 밖 누리집에서 사고 게임에서 받음 | 확장 [MK] |
| GEC-45 | 월정액 — monthly card | 월정액 (Monthly Card) | 모듈 | 한 번 사고 매일 조금씩 받음 | 확장 [MK] · 대조 [QEGRSUB] |
| GEC-46 | 월정액 남은 일수와 수령 알림 | 월정액 잔여 일수 (Monthly Card Days Remaining) | 부품 | 며칠 남았는지와 오늘 받았는지 | 확장 [MK] |
| GEC-47 | 게임 구독 — 자동 갱신 혜택 | 게임 구독 (Game Subscription) | 모듈 | 매달 돈 내고 혜택을 이어 받음 | 확인 [QEGRSUB] |
| GEC-48 | 시즌 보상 길 — battle pass 무료·유료 트랙 | 배틀 패스 (Battle Pass) | 모듈 | 놀수록 칸이 열리고 유료 줄은 더 받음 | 확인 [QEGRBP] |
| GEC-49 | 패스 단계 건너뛰기 구매 — tier skip | 티어 스킵 (Tier Skip) | 구성 | 돈으로 칸을 바로 올림 | 확장 [MK] |
| GEC-50 | 유료 전환 시 지난 보상 소급 지급 | 패스 보상 소급 지급 (Retroactive Pass Rewards) | 구성 | 늦게 사도 지나온 칸 보상을 한꺼번에 | 확장 [MK] |
| GEC-51 | 패스 시즌 종료 안내와 미수령 보상 | 시즌 종료 미수령 보상 (Unclaimed Season Rewards) | 흐름 | 끝나기 전 알리고 안 받은 보상 처리 | 확장 [MK] |
| GEC-52 | 시즌 패스·DLC 구매 목록 — season pass | 시즌 패스·DLC (Season Pass / DLC) | 모듈 | PC·콘솔 확장판 보유와 구매 | 확장 [MK] · 대조 [QEESRB] |
| GEC-53 | 영상 보고 보상 받기 — rewarded ad | 보상형 광고 (Rewarded Ad) | 구성 | 광고를 스스로 골라 보면 보상 | 확인 [QEADREW] |
| GEC-54 | 광고 보상 사전 고지와 선택 | 보상형 광고 사전 고지 (Rewarded Ad Opt-In) | 기준 | 무엇을 보면 무엇을 주는지 먼저 알림 | 확인 [QEADREW] |
| GEC-55 | 보상 두 배 받기 광고 — double reward | 보상 2배 광고 (Double Reward Ad) | 구성 | 판이 끝날 때 광고로 보상을 늘림 | 확인 [QEUNIRV] |
| GEC-56 | 보상형 전면 광고 도입 화면 — rewarded interstitial | 보상형 전면 광고 (Rewarded Interstitial) | 구성 | 자동 재생 전에 보상과 건너뛰기를 알림 | 확장 [MK] · 대조 [QEADREW] |
| GEC-57 | 전면 광고 시점 — 장면 전환 지점 interstitial | 전면 광고 (Interstitial Ad) | 기준 | 판 사이 쉬는 곳에만, 조작 중엔 금지 | 확인 [QEADINT] |
| GEC-58 | 광고 간격 — ad pacing | 광고 빈도 조절 (Ad Pacing) | 기준 | 광고가 너무 잦지 않게 시간 간격을 둠 | 확인 [QEUNIRV] · 대조 [QEADINT] |
| GEC-59 | 광고 제거 구매 — remove ads | 광고 제거 (Remove Ads) | 구성 | 돈을 내면 광고를 없앰, 보상 광고는 따로 | 확장 [MK] · 대조 [QEESRB] |
| GEC-60 | 뽑기 배너 — 픽업 대상과 기간 | 픽업 배너 (Gacha Banner) | 모듈 | 이번에 잘 나오는 것과 끝나는 날 | 확장 [MK] |
| GEC-61 | 확률표 화면 — 등급 합계와 개별 확률 | 가챠 확률표 (Gacha Rates Table) | 모듈 | 등급별과 하나하나의 확률을 표로 | 확장 [MK] · 대조 [QEHWAWOO] |
| GEC-62 | 천장 카운터 — pity counter | 천장 카운터 (Pity Counter) | 부품 | 확정까지 몇 번 남았는지 셈 | 확장 [MK] · 대조 [QEHWAWOO] |
| GEC-63 | 픽업 확정 규칙 — 50/50·반천장 | 반천장 (50/50 Guarantee) | 기준 | 놓치면 다음은 픽업 확정인지 밝힘 | 확장 [MK] |
| GEC-64 | 1회·10연 뽑기 버튼과 비용 | 단차·10연차 버튼 (Single / 10-Pull) | 부품 | 한 번과 열 번 값과 재화를 버튼에 | 확장 [MK] |
| GEC-65 | 10연 등급 보장 — 10-pull guarantee | 10연차 확정 (10-Pull Guarantee) | 구성 | 열 번 중 하나는 높은 등급 확정 | 확장 [MK] |
| GEC-66 | 뽑기 결과 목록 | 가챠 결과 화면 (Pull Results) | 구성 | 연출 뒤 얻은 것을 한눈에 정리 | 확장 [MK] |
| GEC-67 | 중복 획득 변환 — 조각·재화 | 중복 변환 (Duplicate Conversion) | 구성 | 이미 가진 것이 나오면 무엇으로 바뀌는지 | 확장 [MK] |
| GEC-68 | 확정권·선택권 — selector ticket | 선택권 (Selector Ticket) | 부품 | 원하는 것 하나를 골라 받음 | 확장 [MK] |
| GEC-69 | 뽑기 포인트 교환 — spark 교환 상점 | 교환 포인트 (Spark System) | 구성 | 뽑은 횟수만큼 쌓아 골라 교환 | 확장 [MK] |
| GEC-70 | 뽑기 기록 조회 — gacha history | 가챠 기록 (Gacha History) | 모듈 | 언제 무엇이 나왔는지 기록 확인 | 확장 [MK] |
| GEC-71 | 강화 창 — 성공률·비용·실패 결과 | 강화 창 (Enhancement Screen) | 모듈 | 누르기 전 확률과 잃는 것을 함께 | 확인 [QEHWAWOO] |
| GEC-72 | 강화 실패 결과 구분 — 유지·하락·파괴 | 강화 실패 페널티 (Enhancement Failure Outcome) | 기준 | 실패하면 무슨 일이 생기는지 미리 | 확장 [MK] |
| GEC-73 | 합성·조합 창 — 재료 칸 | 합성 창 (Fusion Screen) | 모듈 | 재료를 넣고 나올 것과 확률 확인 | 확인 [QEHWAWOO] |
| GEC-74 | 제작 창 — 재료 부족 표시와 구하는 곳 | 제작 창 (Crafting Screen) | 모듈 | 모자란 재료와 얻는 곳으로 안내 | 확장 [MK] |
| GEC-75 | 분해 — 돌려받는 재료 미리보기 | 분해 (Dismantle) | 구성 | 부수기 전에 무엇을 돌려받는지 | 확장 [MK] |
| GEC-76 | 행동력 — energy·stamina 충전 시간 | 행동력 (Energy System) | 부품 | 한 판에 드는 힘과 다시 차는 시간 | 확인 [QEENERGY] |
| GEC-77 | 행동력 구매·충전 | 행동력 충전 (Energy Refill) | 흐름 | 힘이 모자랄 때 사서 채움, 횟수 제한 | 확장 [MK] · 대조 [QEENERGY] |
| GEC-78 | 시간 단축 구매 — speed-up·skip timer | 시간 단축 (Speed-Up) | 구성 | 기다리는 시간을 재화로 줄임 | 확인 [QEENERGY] |
| GEC-79 | 오프라인 보상 — idle reward | 방치 보상 (Idle Reward) | 구성 | 꺼 둔 동안 쌓인 보상을 받음 | 확장 [MK] |
| GEC-80 | 소탕권 — sweep | 소탕 (Sweep) | 부품 | 깬 판을 다시 안 하고 보상만 | 확장 [MK] |
| GEC-81 | VIP 등급 — 누적 결제 단계 | VIP 등급 (VIP System) | 모듈 | 쓴 돈에 따라 혜택 단계, 과소비 주의 | 확장 [MK] |
| GEC-82 | 누적 결제 이벤트 | 누적 결제 이벤트 (Top-Up Event) | 구성 | 기간 안 쓴 합계에 따라 보상 | 확장 [MK] |
| GEC-83 | 거래소·경매장 — auction house | 거래소 (Auction House) | 모듈 | 게임 재화로 다른 사람과 사고팜 | 확장 [MK] · 대조 [QESTINV] |
| GEC-84 | 플레이어 간 교환 창 — trade window | 1:1 거래 창 (Trade Window) | 흐름 | 양쪽이 올린 물건을 둘 다 확인하고 교환 | 확장 [MK] · 대조 [QESTINV] |
| GEC-85 | 거래 수수료·시세 표시 | 거래 수수료·시세 (Market Fee and Price History) | 부품 | 떼는 몫과 최근 거래 값을 보여 줌 | 확장 [MK] |
| GEC-86 | 아이템 선물하기 — gifting | 선물하기 (Gifting) | 흐름 | 산 것을 친구에게 주고 환불은 산 사람만 | 확인 [APPLEASRG] |
| GEC-87 | 사용 기한 아이템 남은 기간 | 기간제 아이템 (Time-Limited Item) | 부품 | 기간제 물건이 언제 사라지는지 | 확장 [MK] |
| GEC-88 | 플랫폼 결제 확인 창 — Steam 오버레이 결제 | 스팀 오버레이 결제 (Steam Overlay Purchase) | 부품 | 목록·값·승인 버튼을 플랫폼 창에서 | 확인 [QESTMTXI] · 대조 [QESTMTX] |
| GEC-89 | PC 지갑 결제 — Steam Wallet | 스팀 지갑 (Steam Wallet) | 구성 | PC 게임은 지갑 잔액으로만 결제 | 확인 [QESTMTX] |
| GEC-90 | 보류 중 결제 — pending purchase | 보류 중 결제 (Pending Purchase) | 구성 | 돈이 나중에 처리될 때 지급을 미룸 | 확인 [QEGPBILL] |
| GEC-91 | 구매 확정 처리 — acknowledge | 구매 확인 처리 (Purchase Acknowledgement) | 기준 | 3일 안에 확정 안 하면 자동 환불 | 확인 [QEGPONE] |
| GEC-92 | 소모형 상품 소비 처리 — consumable | 소모성 상품 소비 처리 (Consumable Purchase) | 구성 | 재화를 지급하면 다시 살 수 있게 처리 | 확인 [QEGPONE] |
| GEC-93 | 미완료 구매 복구 | 미지급 결제 복구 (Unfinished Transaction Recovery) | 흐름 | 결제 뒤 끊겨도 다시 켜면 지급 | 확장 [MK] · 대조 [QEGPONE] |
| GEC-94 | 구매 복원 — restore purchases | 구매 복원 (Restore Purchases) | 부품 | 기기를 바꿔도 산 것을 되찾음 | 확인 [APPLEASRG] |
| GEC-95 | 청소년 월 결제 한도 | 청소년 결제 한도 (Minor Spending Limit) | 기준 | 미성년자는 한 달에 쓸 돈을 막아 둠 | 확인 [QEKCLIM] |
| GEC-96 | 스스로 정하는 결제 한도 — 자가 한도 | 자가 결제 한도 (Self Spending Limit) | 모듈 | 한 달 쓸 돈과 알림을 직접 정함 | 확장 [MK] |
| GEC-97 | 보호자 구매 승인 — Ask to Buy | 구매 승인 요청 (Ask to Buy) | 흐름 | 아이가 사려면 부모 기기에서 허락 | 확인 [QEASKBUY] |
| GEC-98 | 결제 재인증 주기 — 매번·30분·안 함 | 결제 인증 주기 (Purchase Authentication) | 구성 | 결제할 때 비밀번호를 얼마나 자주 묻나 | 확인 [QEGPAUTH] |
| GEC-99 | 어린이 게임 매 결제 인증 | 어린이 결제 인증 (Child Purchase Authentication) | 기준 | 12세 이하 게임은 살 때마다 인증 | 확인 [QEGPAUTH] |
| GEC-100 | 청약철회 가능 여부 표시 | 청약철회 고지 (Refund Eligibility Notice) | 기준 | 살 때 전·중·후에 환불 되는지 알림 | 확인 [QEKFTCGM] |
| GEC-101 | 플랫폼별 환불 창구 안내 | 환불 창구 안내 (Refund Request Channel) | 구성 | 어디서 환불을 요청하는지 연결 | 확인 [QEAPREF] · 대조 [QEGPREF] |
| GEC-102 | PC 게임 내 아이템 환불 조건 — 48시간 | 스팀 인게임 아이템 환불 (Steam In-Game Item Refund) | 기준 | 쓰지 않은 아이템만 짧은 기간 안에 | 확인 [QESTREF] |
| GEC-103 | 환불 뒤 재화 회수와 모자란 잔액 | 환불 재화 회수 (Refund Clawback) | 구성 | 이미 쓴 재화를 되돌릴 때의 처리 | 확장 [MK] |
| GEC-104 | 금지 — 환불 요청 계정 잠금 | 환불 계정 잠금 금지 (No Chargeback Lockout) | 기준 | 카드 이의 제기했다고 산 것을 막지 않음 | 확인 [QEFTCEPIC] |
| GEC-105 | 금지 — 헷갈리는 버튼 배치로 결제 | 오결제 유도 금지 (Accidental Purchase Prevention) | 기준 | 깨우기·로딩 중 버튼 한 번에 결제 안 되게 | 확인 [QEFTCEPIC] |
| GEC-106 | 금지 — 보호자 동의 없는 아이 결제 | 보호자 동의 없는 결제 금지 (Unauthorized Child Purchase) | 기준 | 아이가 버튼만 눌러 사지 못하게 | 확인 [QEFTCEPIC] |
| GEC-107 | 금지 — 닫으면 다시 못 산다는 거짓 문구 | 라스트 찬스 거짓 문구 금지 (False Last Chance) | 기준 | 다시 뜰 창을 마지막 기회라 속이지 않음 | 확인 [QEKFTCGM] |
| GEC-108 | 금지 — 가짜 카운트다운 — fake urgency | 가짜 긴급성 (Fake Urgency) | 기준 | 끝나지 않는 세일을 시간으로 겁주지 않음 | 확인 [DECEPTIVE] |
| GEC-109 | 금지 — 가짜 품절 임박 — fake scarcity | 가짜 희소성 (Fake Scarcity) | 기준 | 없는 한정 수량으로 재촉하지 않음 | 확인 [DECEPTIVE] |
| GEC-110 | 금지 — 재화 묶음 단위 뒤섞기 | 재화 묶음 단위 불일치 (Currency Pack Mismatch) | 기준 | 살 양과 파는 양을 어긋나게 해 남기지 않음 | 확장 [MK] · 대조 [FTCDP] |
| GEC-111 | 금지 — 닫기 버튼 숨기기 | 닫기 버튼 숨기기 (Hidden Close Button) | 기준 | 작거나 흐린 닫기로 팝업에 가두지 않음 | 확인 [DECEPTIVE] |
| GEC-112 | 금지 — 거절 문구로 창피 주기 — confirmshaming | 컨펌셰이밍 (Confirmshaming) | 기준 | 안 사기 버튼에 부끄러운 말을 쓰지 않음 | 확인 [DECEPTIVE] |
| GEC-113 | 금지 — 구매 팝업 반복 — nagging | 반복 권유 (Nagging) | 기준 | 거절한 제안을 계속 다시 띄우지 않음 | 확인 [KFTC] · 대조 [DECEPTIVE] |
| GEC-114 | 금지 — 구매 버튼만 크게, 거절은 작게 | 시각적 간섭 (Visual Interference) | 기준 | 고르는 버튼 크기·색을 공평하게 | 확인 [KFTC] |
| GEC-115 | 금지 — 묶음에 추가 상품 미리 선택 | 사전 선택 (Preselection) | 기준 | 원하지 않은 것을 미리 체크해 두지 않음 | 확인 [KFTC] |
| GEC-116 | 금지 — 단계 끝에야 드러나는 총비용 | 숨은 비용 (Hidden Costs) | 기준 | 처음부터 전체 값을 보여 줌 | 확인 [KFTC] · 대조 [DECEPTIVE] |
| GEC-117 | 금지 — 월정액·구독 해지 숨기기 | 해지 방해 (Hard to Cancel) | 기준 | 가입만큼 쉽게 끊을 수 있게 | 확인 [DECEPTIVE] · 대조 [KFTC] |
| GEC-118 | 리세마라 — reroll account | 리세마라 (Reroll) | 흐름 | 원하는 첫 뽑기가 나올 때까지 처음부터 다시 함 | 확인 [QZRISEMA] |
| GEC-119 | 첫 뽑기 다시 하기 — tutorial gacha reroll | 튜토리얼 가챠 리롤 (Tutorial Gacha Reroll) | 구성 | 계정을 지우지 않고 초반 뽑기만 여러 번 고르게 함 | 확장 [MK] · 대조 [QZRISEMA] |
| GEC-120 | 회전 상점 — rotating daily shop | 로테이션 상점 (Rotating Shop) | 모듈 | 정해진 시간마다 파는 물건이 바뀜 | 확인 [QZVALSHOP] · 대조 [QZFNSHOP] |
| GEC-121 | 상점 교체까지 남은 시간 — shop refresh timer | 상점 갱신 타이머 (Shop Refresh Timer) | 부품 | 다음 교체까지 남은 시간을 상점 위에 보여 줌 | 확장 [MK] · 대조 [QZFNSHOP] |
| GEC-122 | 교체 시각을 내 시간대로 — local reset time | 현지 시각 초기화 표시 (Local Reset Time) | 기준 | 세계 기준 시각을 내 나라 시간으로 바꿔 보여 줌 | 확장 [MK] · 대조 [QZFNSHOP] |
| GEC-123 | 품절 표시 — sold out | 품절 표시 (Sold Out) | 부품 | 다 팔린 물건은 흐리게 두고 품절이라 적음 | 확장 [MK] |
| GEC-124 | 복각 예고 — rerun notice | 복각 예고 (Rerun Notice) | 부품 | 지난 한정 물건이 다시 나올 날짜를 미리 알림 | 확장 [MK] |
| GEC-125 | 개인 맞춤 할인 상점 — personalized offer shop | 개인화 할인 상점 (Personalized Offer Shop) | 구성 | 사람마다 다른 물건을 기간 한정으로 할인해 보여 줌 | 확장 [MK] |
| GEC-126 | 확률 표시 의무 예외 대상 | 확률 공개 의무 예외 (Disclosure Exemption) | 기준 | 작은 회사나 등급 예외 게임은 빠짐, 해당 여부를 먼저 확인 | 확인 [QZETODAY] · 대조 [QZEASYLAW] |
