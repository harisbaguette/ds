# 88. 생활 서비스 예약·거래 화면

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 88번 분류 LIF다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

여행·항공·숙박, 공연·영화 예매, 음식 배달과 식당, 택시·킥보드·렌터카 같은 이동, 부동산, 중고거래, 데이팅, 생활 서비스 예약, 집안 가전, 장보기에서 쓰는 업종 고유 화면을 모은다. 배민·카카오T·직방·당근·인터파크 같은 국내 앱과 에어비앤비·우버·티켓마스터·인스타카트 같은 해외 앱의 관례를 함께 다룬다. 업종별 한 줄 요약(DOM-03·04·06·26·27·29·30·46·55·69)은 세부로 풀어 쓰되 되풀이하지 않으며, 상품·장바구니·주문 일반(COM), 달력·예약 슬롯·대기 명단·확인서(SCH), 지도 일반과 실내 평면도(GEO), 스마트홈 연결·기기 제어(IND), 배달 주문 단계(KOR-86), 자동 입력 방지(INP-44)와 휴대폰 지갑 추가(FIN-56)는 해당 분류에 맡긴다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| LIF-01 | 여행 검색 막대 — 어디·언제·누구 — Travel Search Bar | 모듈 | 목적지·날짜·인원을 한 막대에서 차례로 고름 | 확장 [MK] |
| LIF-02 | 출발·도착 맞바꾸기 — Swap Origin and Destination | 부품 | 출발지와 도착지를 한 번에 서로 바꿈 | 확장 [MK] |
| LIF-03 | 왕복·편도·다구간 고르기 — Trip Type Selector | 부품 | 갈 때만인지 올 때도인지 여정 모양을 정함 | 확장 [MK] |
| LIF-04 | 나이별 탑승객 수 — Passenger Age Picker | 부품 | 어른·아이·유아를 나눠 세고 아이 나이를 받음 | 확장 [MK] |
| LIF-05 | 유연한 날짜 검색 — Flexible Dates | 구성 | 날짜가 정해지지 않았을 때 주말·한 달 단위로 찾음 | 확장 [MK] · 대조 [RLGFLT] |
| LIF-06 | 가격 날짜 격자 — Date Grid Fares | 구성 | 가는 날과 오는 날 조합별 값을 칸으로 비교 | 확장 [MK] |
| LIF-07 | 추천·최저가·최단 정렬 탭 — Best Cheapest Fastest Tabs | 구성 | 값과 걸리는 시간 중 무엇을 먼저 볼지 고름 | 확장 [MK] |
| LIF-08 | 항공편 결과 줄 — Flight Result Row | 부품 | 출발·도착 시각·경유 수·걸리는 시간을 한 줄에 | 확장 [MK] |
| LIF-09 | 다음 날 도착 표시 — Plus One Day Marker | 부품 | 날짜를 넘겨 도착하면 +1을 붙여 알림 | 확장 [MK] |
| LIF-10 | 경유 대기·공항 바뀜 경고 — Layover Warning | 부품 | 갈아탈 시간이 짧거나 공항이 바뀌면 경고 | 확장 [MK] |
| LIF-11 | 운임 등급 비교 — Fare Family Comparison | 모듈 | 수하물·변경·환불 조건을 등급별로 나란히 | 확장 [MK] |
| LIF-12 | 수하물 포함 표시·추가 — Baggage Allowance | 구성 | 실을 수 있는 짐과 추가 요금을 미리 보여줌 | 확장 [MK] |
| LIF-13 | 기내 좌석 종류·요금 표시 — Seat Type and Fee Legend | 부품 | 넓은 좌석·비상구·유료 좌석을 표시와 값으로 구분 | 확장 [MK] |
| LIF-14 | 비상구 좌석 조건 확인 — Exit Row Eligibility | 구성 | 비상구 자리는 도울 수 있는 사람인지 먼저 확인 | 확장 [MK] |
| LIF-15 | 여권 영문 이름 입력 — Passport Name Entry | 구성 | 여권과 똑같은 영문 철자로 이름을 받음 | 확장 [MK] |
| LIF-16 | 온라인 체크인 — Online Check-in | 흐름 | 출발 전 앱에서 좌석 확정과 서류 확인을 끝냄 | 확장 [MK] |
| LIF-17 | 모바일 탑승권 — Mobile Boarding Pass | 모듈 | 게이트·탑승 시각·좌석과 바코드를 한 화면에 | 확장 [MK] |
| LIF-18 | 게이트 변경 알림 — Gate Change Update | 구성 | 게이트·출발 시각이 바뀌면 탑승권과 알림을 고침 | 확장 [MK] |
| LIF-19 | 운항 상태 확인 — Flight Status | 모듈 | 지연·결항·탑승 중 같은 비행 상태를 보여줌 | 확장 [MK] |
| LIF-20 | 예약번호로 예약 찾기 — Manage Booking Lookup | 흐름 | 예약번호와 성으로 로그인 없이 예약을 엶 | 확장 [MK] |
| LIF-21 | 지금 가격 수준 표시 — Price Insights | 부품 | 지금 값이 싼 편인지 비싼 편인지 막대로 알림 | 확장 [MK] |
| LIF-22 | 노선 가격 추적 — Route Price Tracking | 구성 | 노선과 날짜를 저장해 항공권 값이 바뀌면 알림 | 확인 [RLGFLT] |
| LIF-23 | 세금 포함 총액 표시 — Total Price Display | 기준 | 수수료와 세금을 합친 값을 목록에서부터 보여줌 | 확인 [RLABTOTAL] |
| LIF-24 | 지도 위 가격 핀 — Price Pin Map | 구성 | 숙소 위치 핀에 1박 값을 적어 지도에서 비교 | 확장 [MK] |
| LIF-25 | 즉시 예약과 요청 예약 — Instant Book vs Request | 구성 | 바로 확정인지 주인 승낙을 기다리는지 알림 | 확인 [RLABINST] |
| LIF-26 | 무료 취소 기한 표시 — Free Cancellation Deadline | 부품 | 언제까지 취소하면 돈을 다 돌려받는지 날짜로 | 확인 [RLBKCXL] |
| LIF-27 | 환불 가능·불가 요금 고르기 — Refundable Rate Choice | 구성 | 싼 환불 불가 값과 비싼 환불 가능 값을 고름 | 확인 [RLBKCXL] |
| LIF-28 | 객실 조건 요약 — Room Conditions | 부품 | 침대 수·조식·면적을 객실마다 짧게 적음 | 확장 [MK] |
| LIF-29 | 대략 위치 원 — Approximate Location Circle | 구성 | 예약 전에는 정확한 주소 대신 동네 범위만 보임 | 확장 [MK] |
| LIF-30 | 호스트 프로필 — Host Profile | 모듈 | 숙소 주인의 응답률·경력·인증을 보여줌 | 확장 [MK] |
| LIF-31 | 항목별 후기 점수 — Category Ratings | 부품 | 청결·정확도·위치 같은 항목마다 점수를 따로 | 확장 [MK] |
| LIF-32 | 셀프 체크인 안내 — Self Check-in Instructions | 모듈 | 출입 비밀번호와 가는 법을 도착 전에 알려 줌 | 확인 [RLABSELF] |
| LIF-33 | 공연 구역 지도 — Venue Section Map | 구성 | 공연장 전체에서 구역을 먼저 고르고 확대 | 확장 [MK] |
| LIF-34 | 등급별 좌석 색 — Price Tier Legend | 부품 | VIP·R·S석 값을 색으로 나눠 좌석에 칠함 | 확장 [MK] |
| LIF-35 | 좌석 붙여 고르기·매수 제한 — Adjacent Seats and Ticket Limit | 기준 | 한 사람이 살 수 있는 장 수와 연석을 안내 | 확장 [MK] |
| LIF-36 | 좌석 잡아 두기 타이머 — Seat Hold Timer | 부품 | 고른 자리를 몇 분만 잡아 두고 남은 시간 표시 | 확장 [MK] |
| LIF-37 | 접속 대기열 — Virtual Waiting Room | 모듈 | 사람이 몰리면 순번과 남은 인원을 보여주며 기다림 | 확장 [MK] |
| LIF-38 | 예매 오픈 알림 — On-sale Alert | 구성 | 티켓이 풀리는 날짜와 시각에 알려 줌 | 확장 [MK] |
| LIF-39 | 캐스팅 일정 — Cast Schedule | 모듈 | 뮤지컬 회차마다 나오는 배우를 달력에 보여줌 | 확장 [MK] |
| LIF-40 | 영화관 특수석 표시 — Special Seat Markers | 부품 | 장애인석·커플석·스크린 방향을 좌석도에 표시 | 확장 [MK] |
| LIF-41 | 할인 권종 고르기 — Ticket Type Discount | 구성 | 청소년·경로·장애인 할인을 장마다 고르고 증빙 안내 | 확장 [MK] |
| LIF-42 | 관람일 기준 취소 수수료 — Cancellation Fee Schedule | 부품 | 관람일이 가까울수록 커지는 취소 수수료를 표로 | 확장 [MK] |
| LIF-43 | 티켓 받는 방법 — Ticket Delivery Method | 구성 | 모바일·현장 수령·배송 중 받을 방법을 고름 | 확장 [MK] |
| LIF-44 | 캡처로 못 쓰는 모바일 티켓 — Screenshot-proof Mobile Ticket | 기준 | 화면 캡처나 인쇄로는 들어갈 수 없게 앱 안 표만 인정 | 확인 [RLTMSAFE] |
| LIF-45 | 티켓 양도·공식 재판매 — Ticket Transfer and Resale | 흐름 | 못 가는 표를 친구에게 넘기거나 정해진 곳에서 되팜 | 확인 [RLTMXFER] |
| LIF-46 | 좌석 시야 미리보기 — View from Seat | 구성 | 그 자리에서 무대가 어떻게 보이는지 사진으로 | 확장 [MK] |
| LIF-47 | 배달 가게 카드 — Delivery Store Card | 부품 | 걸리는 시간·배달팁·최소 주문을 가게 사진과 함께 | 확장 [MK] |
| LIF-48 | 가게 영업 상태 — Store Open Status | 부품 | 준비 중·쉬는 시간·영업 종료를 가게에 표시 | 확장 [MK] |
| LIF-49 | 배달·포장·매장 고르기 — Fulfillment Mode Tabs | 구성 | 같은 가게를 배달·포장·먹고 가기로 바꿔 봄 | 확장 [MK] |
| LIF-50 | 메뉴 필수·선택 옵션 묶음 — Required and Optional Modifier Groups | 구성 | 꼭 하나 고를 것과 여러 개 더할 것을 나눠 받음 | 확장 [MK] |
| LIF-51 | 최소 주문 금액 안내 — Minimum Order Notice | 부품 | 얼마를 더 담아야 주문되는지 남은 금액을 알림 | 확장 [MK] |
| LIF-52 | 배달팁 구간표 — Delivery Fee Tiers | 부품 | 주문 금액과 거리마다 배달팁이 얼마인지 표로 | 확장 [MK] |
| LIF-53 | 한 가게만 담기 — Single Store Cart Rule | 기준 | 다른 가게 메뉴를 담으면 장바구니를 비울지 물음 | 확장 [MK] |
| LIF-54 | 가게·배달원 요청사항 — Order Instructions | 구성 | 맵기·수저 필요 여부와 배달원 전달 말을 나눠 받음 | 확장 [MK] |
| LIF-55 | 배달 방식 고르기 — Delivery Option Choice | 구성 | 빨리 오는 배달과 싼 묶음 배달 중 고름 | 확장 [MK] |
| LIF-56 | 배달 완료 사진 — Proof of Delivery Photo | 부품 | 문 앞에 둔 음식 사진을 주문 화면으로 보냄 | 확장 [MK] |
| LIF-57 | 문 앞에 두기 — Leave at Door | 구성 | 얼굴 보지 않고 받는 방법을 주문 때 고름 | 확장 [MK] |
| LIF-58 | 배달원 팁 — Courier Tip | 부품 | 배달해 준 사람에게 줄 팁을 금액으로 고름 | 확장 [MK] |
| LIF-59 | 함께 주문 — Group Order | 흐름 | 링크를 나눠 여러 사람이 한 장바구니에 담음 | 확장 [MK] |
| LIF-60 | 테이블 QR 주문 — Table QR Ordering | 흐름 | 식탁 코드를 찍어 자리에서 바로 주문·결제 | 확장 [MK] |
| LIF-61 | 식당 원격 줄서기 — Remote Restaurant Waitlist | 흐름 | 식당에 가지 않고 줄을 서고 차례가 오면 알림 | 확장 [MK] |
| LIF-62 | 예약금과 노쇼 수수료 — Reservation Deposit | 부품 | 예약할 때 미리 내는 돈과 안 오면 떼는 돈을 알림 | 확장 [MK] |
| LIF-63 | 태우러 올 곳 핀 맞추기 — Pickup Pin Adjust | 구성 | 지도 핀을 끌어 정확히 탈 자리를 정함 | 확장 [MK] |
| LIF-64 | 차량 종류별 요금 비교 — Ride Option Selector | 구성 | 일반·고급·큰 차의 값과 도착 시간을 나란히 | 확장 [MK] |
| LIF-65 | 미리 확정되는 요금 — Upfront Fare | 기준 | 타기 전에 낼 돈을 정해 보여줌 | 확인 [RLUBFARE] |
| LIF-66 | 기사 찾는 중 화면 — Matching Screen | 부품 | 부른 뒤 근처 기사를 찾는 동안 기다림을 보여줌 | 확장 [MK] |
| LIF-67 | 번호판 확인 — Check Your Ride | 구성 | 타기 전 차 번호와 차종이 맞는지 크게 보여줌 | 확장 [MK] |
| LIF-68 | 탑승 확인 번호 — Ride PIN | 구성 | 기사에게 숫자를 말해 맞는 차인지 확인 | 확인 [RLUBPIN] |
| LIF-69 | 이동 상황 공유 — Share Trip Status | 구성 | 가족에게 지금 위치와 도착 예정을 링크로 보냄 | 확장 [MK] |
| LIF-70 | 안전 도구·긴급 버튼 — Safety Toolkit | 모듈 | 위급할 때 신고와 도움 기능을 한 곳에 모음 | 확장 [MK] |
| LIF-71 | 수요 많을 때 할증 표시 — Surge Pricing Notice | 부품 | 사람이 몰려 값이 오른 것을 배수와 함께 알림 | 확인 [RLUBFARE] |
| LIF-72 | 미리 부르기 — Scheduled Ride | 흐름 | 나중 시각을 정해 택시를 예약 | 확인 [RLUBRSV] |
| LIF-73 | 예약 호출 무료 대기 시간 — Reserved Ride Free Wait | 부품 | 예약한 차가 추가 요금 없이 기다리는 시간을 알림 | 확인 [RLUBRSV] |
| LIF-74 | 킥보드 QR 잠금 풀기 — Scan to Unlock | 흐름 | 기기 코드를 찍어 잠금을 풀고 요금을 시작 | 확장 [MK] |
| LIF-75 | 주차 가능·금지 구역 지도 — Parking Zone Map | 구성 | 킥보드를 세워도 되는 곳과 안 되는 곳을 색으로 | 확장 [MK] |
| LIF-76 | 반납 사진 찍기 — End Ride Photo | 구성 | 세운 모습을 찍어 제대로 반납했는지 남김 | 확장 [MK] |
| LIF-77 | 빌린 차 외관 사진 — Vehicle Condition Photos | 흐름 | 타기 전 흠집을 찍어 남겨 책임을 가림 | 확장 [MK] |
| LIF-78 | 휴대폰으로 차 문 열기 — Digital Car Key | 부품 | 앱 버튼으로 빌린 차 문을 열고 잠금 | 확장 [MK] |
| LIF-79 | 자기부담금 보험 고르기 — Damage Waiver Choice | 구성 | 사고 때 낼 돈 한도별로 보험 값을 비교 | 확장 [MK] |
| LIF-80 | 주차 요금 정산 — Parking Payment | 흐름 | 차 번호로 들어온 시간을 찾아 요금을 냄 | 확장 [MK] |
| LIF-81 | 버스 혼잡도 — Crowding Level | 부품 | 차 안이 붐비는 정도를 여유·보통·혼잡으로 | 확장 [MK] |
| LIF-82 | 내릴 곳 알림 — Alighting Alert | 구성 | 내릴 정류장이 가까워지면 미리 알려 줌 | 확장 [MK] |
| LIF-83 | 전기차 충전 진행 — EV Charging Session | 모듈 | 충전량·남은 시간·요금을 충전 중에 보여줌 | 확장 [MK] |
| LIF-84 | 한국 매물 가격 표기 — Deposit and Rent Price Format | 기준 | 보증금/월세·전세·매매가를 한국식으로 적음 | 확장 [MK] |
| LIF-85 | 거래 유형 필터 — Deal Type Filter | 구성 | 매매·전세·월세·단기를 먼저 골라 매물을 거름 | 확장 [MK] |
| LIF-86 | 면적 단위 바꾸기 — Square Meter and Pyeong Toggle | 부품 | 제곱미터와 평을 눌러서 바꿔 봄 | 확장 [MK] |
| LIF-87 | 매물 카드 — Listing Card | 부품 | 값·면적·층·관리비·사진을 한 카드에 | 확장 [MK] |
| LIF-88 | 지도 위 단지 시세 — Map Price Labels | 구성 | 지도 단지마다 평균 값이나 매물 수를 적음 | 확장 [MK] |
| LIF-89 | 실거래가 추이 — Transaction Price History | 모듈 | 실제 팔린 값을 날짜별 점과 선으로 | 확장 [MK] |
| LIF-90 | 관리비 내역 — Maintenance Fee Breakdown | 부품 | 관리비에 무엇이 들었는지 항목별로 | 확장 [MK] |
| LIF-91 | 매물 광고 필수 표시 — Mandatory Listing Disclosure | 기준 | 소재지·면적·가격 같은 법이 정한 정보를 빠짐없이 | 확장 [MK] |
| LIF-92 | 허위 매물 신고 — Fake Listing Report | 흐름 | 없는 매물이면 신고하고 처리 결과를 받음 | 확장 [MK] |
| LIF-93 | 확인 매물 배지 — Verified Listing Badge | 부품 | 집주인이 실제로 내놓은 매물임을 표시 | 확장 [MK] |
| LIF-94 | 중개사 정보 — Agent Info Panel | 모듈 | 중개사무소 이름·등록번호·연락처를 매물 옆에 | 확장 [MK] |
| LIF-95 | 방문 일정 요청 — Request a Tour | 흐름 | 보고 싶은 날짜와 시간을 골라 중개사에 보냄 | 확장 [MK] |
| LIF-96 | 3D 집 둘러보기 배지 — Virtual Tour Badge | 부품 | 3D·영상 둘러보기가 있는 매물을 표시 | 확장 [MK] |
| LIF-97 | 주변 생활 정보 — Neighborhood Info | 모듈 | 학교·역·가게까지 거리를 매물 아래에 | 확장 [MK] |
| LIF-98 | 동네 인증 — Neighborhood Verification | 흐름 | 휴대폰 위치로 지금 그 동네에 있는지 확인 | 확장 [MK] |
| LIF-99 | 동네 범위 넓히기 — Neighborhood Range Setting | 구성 | 가까운 동네만 볼지 먼 동네까지 볼지 정함 | 확장 [MK] |
| LIF-100 | 중고 물건 올리기 — Sell Item Form | 흐름 | 사진·제목·가격·설명을 차례로 넣어 올림 | 확장 [MK] |
| LIF-101 | 가격 제안 받기 — Accept Offers Toggle | 부품 | 사는 사람이 값을 깎아 달라고 할 수 있게 켬 | 확장 [MK] |
| LIF-102 | 거래 상태 — Listing Status | 부품 | 판매중·예약중·거래완료를 글 옆에 표시 | 확장 [MK] |
| LIF-103 | 끌어올리기 — Bump Listing | 구성 | 올린 글을 목록 맨 위로 다시 올림, 횟수 제한 | 확장 [MK] |
| LIF-104 | 채팅 속 약속 잡기 — Meetup Scheduling | 구성 | 채팅에서 만날 날짜·시간·장소를 정해 알림 | 확장 [MK] |
| LIF-105 | 매너 온도 — Trust Temperature | 부품 | 거래 평가를 온도 숫자로 바꿔 믿을 만한지 보여줌 | 확장 [MK] |
| LIF-106 | 거래 후기 — Transaction Review | 흐름 | 거래가 끝나면 서로 좋았던 점과 아쉬운 점을 남김 | 확장 [MK] |
| LIF-107 | 안전결제 — Escrow Payment | 흐름 | 물건을 받았다고 확인할 때까지 돈을 맡아 둠 | 확장 [MK] |
| LIF-108 | 외부 메신저 유도 경고 — Off-platform Warning | 구성 | 다른 앱으로 옮기자는 말이 보이면 사기 주의를 띄움 | 확장 [MK] |
| LIF-109 | 판매 금지 물품 안내 — Prohibited Items Notice | 기준 | 올릴 수 없는 물건을 글 쓰기 전에 알림 | 확장 [MK] |
| LIF-110 | 무료 나눔 — Free Giveaway | 구성 | 값 대신 나눔으로 올려 가져갈 사람을 찾음 | 확장 [MK] |
| LIF-111 | 되돌리기 — Rewind | 부품 | 실수로 넘긴 프로필을 한 장 되돌림 | 확장 [MK] |
| LIF-112 | 매치 성사 화면 — It's a Match Screen | 부품 | 서로 좋아요를 누르면 두 사진과 대화 버튼을 띄움 | 확장 [MK] |
| LIF-113 | 사진 인증 배지 — Photo Verification Badge | 부품 | 셀카로 본인임을 확인한 사람에게 표시 | 확장 [MK] |
| LIF-114 | 보내기 전 한 번 더 — Are You Sure Prompt | 구성 | 상처 줄 수 있는 말을 보내기 전에 다시 묻기 | 확장 [MK] |
| LIF-115 | 받은 말 불편 확인 — Does This Bother You | 구성 | 무례한 메시지를 받으면 신고할지 물어봄 | 확장 [MK] |
| LIF-116 | 신고·매치 끊기 — Report and Unmatch | 흐름 | 불편한 상대를 끊고 이유를 골라 신고 | 확장 [MK] |
| LIF-117 | 데이트 일정 공유 — Share My Date | 구성 | 만날 사람·장소·시간을 믿는 사람에게 보냄 | 확장 [MK] |
| LIF-118 | 프로필 질문 답 — Profile Prompts | 부품 | 정해진 질문에 짧게 답해 성격을 보여줌 | 확장 [MK] |
| LIF-119 | 대략 거리 표시 — Approximate Distance | 기준 | 정확한 위치 대신 몇 km 거리만 보여줌 | 확장 [MK] |
| LIF-120 | 서비스 요청서 질문지 — Request Questionnaire | 흐름 | 평수·날짜·원하는 일을 차례로 물어 요청서를 만듦 | 확장 [MK] |
| LIF-121 | 받은 견적 비교 — Quote Comparison | 모듈 | 여러 전문가가 보낸 값과 조건을 나란히 비교 | 확장 [MK] |
| LIF-122 | 전문가 프로필 — Pro Profile | 모듈 | 경력·자격·후기·고용 횟수를 한 화면에 | 확장 [MK] |
| LIF-123 | 담당자 고르기 — Staff Selection | 구성 | 미용실 디자이너처럼 사람을 먼저 고르고 시간 선택 | 확장 [MK] |
| LIF-124 | 시술·서비스 메뉴 — Service Menu | 부품 | 시술마다 걸리는 시간과 값을 적은 목록 | 확장 [MK] |
| LIF-125 | 방문 도착 알림 — Pro Arrival Notice | 부품 | 기사가 출발했고 언제 도착하는지 알림 | 확장 [MK] |
| LIF-126 | 이사 짐 목록 입력 — Moving Inventory | 구성 | 큰 짐을 골라 세어 견적을 정확히 받음 | 확장 [MK] |
| LIF-127 | 추가 비용 승인 — Extra Charge Approval | 구성 | 현장에서 일이 늘면 값을 보여주고 허락받음 | 확장 [MK] |
| LIF-128 | 세탁 남은 시간 — Appliance Cycle Remaining | 부품 | 세탁기·건조기가 끝날 때까지 남은 시간 | 확장 [MK] |
| LIF-129 | 소모품 교체 알림 — Filter Replacement Reminder | 구성 | 필터·세제가 떨어질 때 알리고 주문으로 이어줌 | 확장 [MK] |
| LIF-130 | 스마트 고장 진단 — Smart Diagnosis | 흐름 | 가전 상태를 읽어 고장 원인과 해결을 안내 | 확장 [MK] |
| LIF-131 | 세탁 코스 받기 — Download Cycle | 구성 | 기본에 없는 코스를 앱에서 받아 가전에 넣음 | 확장 [MK] |
| LIF-132 | 로봇청소기 집 지도 — Robot Vacuum Map | 모듈 | 청소한 지도에서 방 나누기와 금지 구역을 정함 | 확장 [MK] |
| LIF-133 | 배송 방식과 주문 마감 — Delivery Cutoff Countdown | 구성 | 몇 시까지 주문하면 언제 오는지 남은 시간 표시 | 확장 [MK] |
| LIF-134 | 배송 시간대 고르기 — Delivery Window | 구성 | 받을 시간 구간을 골라 예약 | 확장 [MK] |
| LIF-135 | 대체 상품 승인 — Replacement Approval | 흐름 | 장보는 사람이 바꾼 물건을 받을지 실시간 결정 | 확장 [MK] · 대조 [RLICREPL] |
| LIF-136 | 상품별 요청 메모 — Item Instructions Note | 구성 | 물건마다 고르는 법이나 바꿀 조건을 적어 둠 | 확인 [RLICREPL] |
| LIF-137 | 무게 상품 예상 가격 — Estimated Weight Price | 기준 | 무게로 파는 물건은 예상 값과 실제 정산을 나눔 | 확인 [RLICWGT] |
| LIF-138 | 보관 방법 구분 — Storage Type Label | 부품 | 냉장·냉동·상온을 상품과 장바구니에서 나눠 표시 | 확장 [MK] |
| LIF-139 | 공동현관 출입 방법 — Building Entry Instructions | 구성 | 새벽에 들어갈 수 있게 현관 비밀번호를 받음 | 확장 [MK] |
| LIF-140 | 소비기한 표시 — Use-by Date Display | 부품 | 받을 물건의 먹어도 되는 날짜를 미리 알림 | 확장 [MK] |
