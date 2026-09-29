# 17. 분석 화면과 데이터 탐색

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 17번 분류 ANA다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

| ID | 항목 | 통용 용어 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|---|
| ANA-01 | 차트 범례로 계열 선택 | 인터랙티브 범례 (Interactive Legend) | 구성 | 비교할 계열만 남김 | 확장 [VEGA] |
| ANA-02 | 영역 선택과 다른 차트 연동 | 브러싱·링킹 (Brushing and Linking) | 구성 | 선택한 데이터의 관계 추적 | 확인 [DASH] |
| ANA-03 | 개요와 확대 구간 | 개요+상세 (Overview + Detail / Range Selector) | 구성 | 전체 맥락 안에서 세부 탐색 | 확인 [VEGA] |
| ANA-04 | 지표에서 상세로 드릴다운 | 드릴다운 (Drill-Down) | 흐름 | 요약 수치 → 세부 집단 → 원자료 | 확인 [CF] |
| ANA-05 | 동일 기간·이전 기간 대조 | 기간 비교 (Period over Period) | 구성 | 변화의 비교 기준 통일 | 확장 [VEGA] |
| ANA-06 | 수치의 정의·분모·단위 설명 | 지표 정의 툴팁 (Metric Definition) | 구성 | 지표의 의미와 계산 범위 전달 | 확인 [DASH] |
| ANA-07 | 기준선·임계치 표시 | 기준선 (Reference Line / Threshold) | 구성 | 판단 기준과 현재 위치 비교 | 확인 [DASH] |
| ANA-08 | 이벤트 주석 | 차트 주석 (Event Annotation) | 구성 | 변화와 사건의 시점 연결 | 확인 [DASH] |
| ANA-09 | 데이터 수집·가공 근거 | 데이터 출처 표기 (Data Source & Methodology) | 구성 | 수치의 생성 과정과 출처 확인 | 확인 [DASH] |
| ANA-10 | 차트와 원자료 표 전환 | 차트·테이블 전환 (Chart / Table Toggle) | 구성 | 시각적 추세와 정확한 값 연결 | 확장 [WAI] |
| ANA-11 | 사용자 정의 대시보드 | 커스텀 대시보드 (Customizable Dashboard) | 모듈 | 위젯 추가·제거·배치·크기 조절 | 확인 [CF] |
| ANA-12 | 전역 조건과 위젯 조건 구분 | 전역·위젯 필터 (Global vs Widget Filter) | 구성 | 필터 적용 범위를 분명하게 표시 | 확장 [DASH] |
| ANA-13 | 고정 화면 모니터링 | 모니터링 대시보드 (Monitoring Wall / TV Mode) | 구성 | 주요 상태를 한 화면에서 관찰 | 확인 [DASH] |
| ANA-14 | 알림 조건 설정 | 알림 조건 설정 (Alert Rules) | 모듈 | 지표의 기준 이탈을 알려 주기 | 확장 · 분석 앱 요구 |
| ANA-15 | 코호트 비교 | 코호트 분석 (Cohort Analysis) | 모듈 | 같은 시작 조건의 집단 변화 비교 | 확장 [VEGA] |
| ANA-16 | 퍼널 이탈 분석 | 퍼널 분석 (Funnel Analysis) | 모듈 | 단계 사이 이동과 이탈 확인 | 확장 · 분석 앱 요구 |
| ANA-17 | 데이터 결측·비교 불가 표시 | 데이터 없음 표시 (No Data / N/A State) | 구성 | 없는 값을 0처럼 해석하지 않게 전달 | 확장 [DASH] |
| ANA-18 | 차트 이미지·보고서 출력 | 리포트 내보내기 (Export Report) | 모듈 | 조건·시점과 함께 결과 보존 | 확장 · HTML 문서 요구 |
| ANA-19 | 저장한 질문·질의 편집 — Query Editor | 쿼리 에디터 (Query Editor) | 구성 | 조건을 문장·SQL로 쓰고 결과 보기 | 확장 [MK] |
| ANA-20 | 탐색형 필터 패널 — Explore Sidebar | 탐색 패널 (Explore Sidebar) | 구성 | 차원·측정값을 끌어 차트 구성 | 확장 [MK] |
| ANA-21 | 세그먼트 정의·저장 | 세그먼트 (Segment Builder) | 구성 | 사용자 집단 조건을 만들어 재사용 | 확장 [MK] |
| ANA-22 | 지표 목표·달성률 표시 | 목표 달성률 (Goal Progress) | 구성 | 목표 대비 진행을 한 줄에 | 확장 [MK] |
| ANA-23 | 이상 징후 자동 표시 — Anomaly | 이상 탐지 (Anomaly Detection) | 구성 | 평소와 다른 값을 자동으로 강조 | 확장 [MK] |
| ANA-24 | 예측 구간·추세선 | 예측 구간·추세선 (Forecast / Trend Line) | 구성 | 앞으로의 예상 범위를 점선으로 | 확장 [MK] |
| ANA-25 | 차트 위 직접 필터 — Click to Filter | 크로스 필터 (Cross-Filtering) | 구성 | 막대 클릭으로 다른 차트가 좁혀짐 | 확장 [MK] |
| ANA-26 | 보고서 예약 발송 | 리포트 예약 발송 (Scheduled Reports) | 구성 | 정해진 때 대시보드를 메일로 | 확장 [MK] |
| ANA-27 | 데이터 계보·출처 추적 — Lineage | 데이터 리니지 (Data Lineage) | 구성 | 이 숫자가 어디서 왔는지 따라가기 | 확장 [MK] |
| ANA-28 | 지표 사전 — Metric Glossary | 지표 사전 (Metric Glossary) | 모듈 | 지표 이름·정의·담당자 목록 | 확장 [MK] |
| ANA-29 | 대시보드 텍스트·설명 위젯 | 텍스트 위젯 (Text Widget) | 부품 | 차트 사이 설명 상자 | 확장 [MK] |
| ANA-30 | 빈 대시보드 시작 안내 | 빈 대시보드 (Empty Dashboard State) | 구성 | 첫 위젯을 만들도록 이끄는 빈 상태 | 확장 [MK] |
| ANA-31 | 데이터 새로고침 주기·수동 갱신 | 데이터 새로고침 (Data Refresh) | 구성 | 언제 갱신됐고 지금 다시 부를지 | 확장 [MK] |
| ANA-32 | 표본 크기·신뢰도 경고 | 표본 크기 경고 (Low Sample Size Warning) | 구성 | 수가 적어 믿기 어려움을 표시 | 확장 [MK] |
| ANA-33 | 실시간 카운터·현재 접속 | 실시간 카운터 (Real-Time Counter) | 부품 | 지금 이 순간의 수치를 크게 | 확장 [MK] |
| ANA-34 | 지표 강조 텍스트 — Metric Text | 지표 텍스트 (Metric Text / Big Number) | 부품 | 숫자 지표를 크게 강조해서 보여주는 글자 부품 | 확인 [ATL] |
| ANA-35 | 퍼널 전환 순서 정의 | 퍼널 순서 정의 (Funnel Step Order) | 기준 | 중간에 딴 짓을 허용할지 | 확인 [AMPFUN] |
| ANA-36 | 결과 없으면 발송 건너뛰기 | 빈 리포트 발송 생략 (Skip Empty Reports) | 기준 | 빈 보고서를 보내지 않음 | 확인 [MBSUB] |
| ANA-37 | 드릴 결과 자동 시각화 | 자동 시각화 (Auto Visualization) | 구성 | 파고든 결과를 알맞은 그림으로 | 확장 [MK] · 대조 [LKDRILL] |
