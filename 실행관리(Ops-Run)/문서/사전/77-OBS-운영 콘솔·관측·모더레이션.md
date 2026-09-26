# 77. 운영 콘솔·관측·모더레이션

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 77번 분류 OBS다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

서비스를 운영하는 사람이 쓰는 관측·장애 대응·배포 안전장치·기능 플래그·비용 감시 화면과, 콘텐츠 모더레이션·사기 거래 검토·개인정보 요청 처리·특권 접근 화면을 담는다. 일반 목록·CRUD·역할 관리·감사 로그 검색 같은 관리자 기본 화면은 43-ADM과 37-OPS에, 일반 차트 조작과 이상 징후 표시는 17-ANA에, 사용자 쪽 신고·장애 공지는 다른 분류에 두었으므로 여기서는 다시 적지 않는다. 휴대폰으로 당번 호출을 받는 화면처럼 모바일 운영 화면도 함께 다룬다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| OBS-01 | 네 가지 황금 신호 — Golden Signals | 기준 | 지연·트래픽·오류·포화 네 값을 먼저 본다 | 확인 [QOSREMON] |
| OBS-02 | 지연 시간 백분위 분포 — Latency Percentiles | 구성 | 평균 대신 p95·p99로 느린 요청을 드러낸다 | 확인 [QOSREMON] |
| OBS-03 | 상대 시간 범위 선택기 — Time Range Picker | 부품 | 최근 30분·12시간처럼 보는 기간을 바꾼다 | 확인 [QOGFDASH] |
| OBS-04 | 데이터 링크로 로그·추적 넘어가기 — Data Links | 구성 | 그래프의 한 점에서 같은 시간대 로그로 간다 | 확인 [QOGFLINK] |
| OBS-05 | 서비스 호출 지도 — Service Map | 모듈 | 추적으로 본 서비스 간 호출과 이상을 그린다 | 확인 [QODDSMAP] |
| OBS-06 | 호스트 육각형 지도 — Host Map | 구성 | 서버 수백 대를 CPU 사용률 색으로 한눈에 본다 | 확인 [QODDHOST] |
| OBS-07 | 지역별 합성 점검 — Synthetic Monitoring | 모듈 | 여러 지역에서 가짜 요청으로 가용성을 잰다 | 확인 [QODDSYN] |
| OBS-08 | 사용자 세션 다시 보기 — Session Replay | 모듈 | 사용자 화면을 영상처럼 되짚는다, 입력값 가림 필수 | 확인 [QODDRUM] |
| OBS-09 | 실사용자 성능 지표 — Real User Monitoring | 모듈 | 실제 사용자 기기에서 잰 로딩·반응 속도를 본다 | 확장 [MK] · 대조 [QODDRUM] |
| OBS-10 | 모바일 앱 무중단 세션 비율 — Crash-free Sessions | 구성 | 앱이 죽지 않은 세션 비율로 출시 품질을 본다 | 확장 [MK] |
| OBS-11 | 오류 묶음 이슈 목록 — Issue Grouping | 모듈 | 같은 지문의 오류를 한 이슈로 묶어 센다 | 확인 [QOSENTRY] |
| OBS-12 | 이슈 합치기·나누기 — Merge·Unmerge | 부품 | 잘못 묶이거나 갈린 오류를 사람이 바로잡는다 | 확인 [QOSENTRY] |
| OBS-13 | 오류 스택 추적 보기 — Stack Trace | 구성 | 오류가 난 코드 줄과 호출 순서를 보인다 | 확장 [MK] · 대조 [QOSENTRY] |
| OBS-14 | 서비스 수준 목표 화면 — SLO | 모듈 | 목표 대비 최근 기간의 성공률을 보인다 | 확장 [MK] · 대조 [QODDBURN] |
| OBS-15 | 남은 오류 예산 — Error Budget | 부품 | 목표를 지키고 남은 실패 허용량을 보인다 | 확인 [QODDBURN] · 대조 [QOSREEBP] |
| OBS-16 | 오류 예산 소진 속도 — Burn Rate | 구성 | 예산이 닳는 속도를 배수로 알린다 | 확인 [QODDBURN] |
| OBS-17 | 긴 창·짧은 창 소진 경보 — Multiwindow Burn Rate Alert | 기준 | 긴 기간과 짧은 기간이 함께 넘을 때만 울린다 | 확인 [QODDBURN] |
| OBS-18 | 오류 예산 소진 시 변경 동결 — Error Budget Policy | 기준 | 예산을 다 쓰면 긴급 수정 외 배포를 멈춘다 | 확인 [QOSREEBP] |
| OBS-19 | 로그 실시간 흘려보기 — Live Tail | 구성 | 들어오는 로그를 거의 실시간으로 흘려 본다 | 확인 [QODDTAIL] · 대조 [QOGFLOGS] |
| OBS-20 | 로그 앞뒤 줄 보기 — Log Context | 부품 | 고른 로그 주변 줄을 펼쳐 원인을 찾는다 | 확인 [QOGFLOGS] |
| OBS-21 | 로그 양 막대그래프 — Log Volume Histogram | 부품 | 시간대별 로그 양으로 급증 구간을 찾는다 | 확인 [QOGFLOGS] |
| OBS-22 | 로그 수준 색 구분 — Log Level Color | 부품 | 오류·경고·정보 줄을 색으로 구분한다 | 확인 [QOGFLOGS] |
| OBS-23 | 비슷한 로그 묶기 — Log Patterns | 구성 | 문장이 같은 로그를 묶고 바뀌는 값만 강조한다 | 확인 [QODDPAT] |
| OBS-24 | 중복 로그 접기 — Deduplication | 부품 | 똑같은 줄을 접어 목록을 짧게 만든다 | 확인 [QOGFLOGS] |
| OBS-25 | 구조화 로그 펼치기 — JSON Log Expand | 부품 | 한 줄 JSON을 필드별로 펼쳐 읽는다 | 확장 [MK] |
| OBS-26 | 민감정보 가림 규칙 — Sensitive Data Redaction | 구성 | 카드번호 등을 가림·일부 가림·해시로 바꾼다 | 확인 [QODDSDS] |
| OBS-27 | 로그 보관 기간 안내 — Retention Notice | 부품 | 기간이 지난 로그는 검색되지 않음을 알린다 | 확장 [MK] |
| OBS-28 | 요청 흐름 폭포 그림 — Trace Waterfall | 구성 | 요청 한 건의 단계를 한 줄씩 시간순으로 본다 | 확인 [QODDTRACE] · 대조 [QOOTTRC] |
| OBS-29 | 불꽃 그림 — Flame Graph | 구성 | 호출 깊이와 걸린 시간을 겹친 막대로 본다 | 확인 [QODDTRACE] |
| OBS-30 | 스팬 상세 옆판 — Span Detail | 구성 | 한 단계의 속성·오류·로그를 모아 본다 | 확장 [MK] · 대조 [QOOTTRC] |
| OBS-31 | 부모·자식 단계 들여쓰기 — Span Hierarchy | 기준 | 하위 작업을 부모 단계 아래에 들여 보인다 | 확인 [QOOTTRC] |
| OBS-32 | 오류 단계 빨간 표시 — Error Span Highlight | 부품 | 실패한 단계만 빨갛게 표시하고 거른다 | 확인 [QODDTRACE] |
| OBS-33 | 가장 오래 걸린 경로 강조 — Critical Path | 구성 | 전체 지연을 만든 단계들만 이어 보인다 | 확장 [MK] |
| OBS-34 | 표본 수집 안내 — Sampling Notice | 부품 | 일부 요청만 저장됨을 알려 오해를 막는다 | 확인 [QOOTSMP] |
| OBS-35 | 추적 검색 조건 — Trace Search | 구성 | 소요 시간·상태·서비스로 요청을 찾는다 | 확장 [MK] · 대조 [QODDTRACE] |
| OBS-36 | 경보 상태 표시 — Alert State | 부품 | 정상·대기·발생·데이터 없음·오류를 구분한다 | 확인 [QOGFSTATE] |
| OBS-37 | 데이터 없음 상태 — No Data | 기준 | 값이 안 들어오는 것도 따로 알린다 | 확인 [QOGFSTATE] |
| OBS-38 | 대기 기간 뒤 발생 — Pending Period | 기준 | 잠깐 튄 값은 기다렸다가 경보한다 | 확인 [QOGFSTATE] |
| OBS-39 | 경보 잠시 끄기 — Silence | 구성 | 정한 시간만 알림을 끄고 평가는 계속한다 | 확인 [QOGFSIL] |
| OBS-40 | 반복 점검 시간 알림 끄기 — Recurring Downtime | 구성 | 정기 점검 시간에는 경보가 울리지 않게 한다 | 확인 [QODDDOWN] · 대조 [QOGFSIL] |
| OBS-41 | 알림 전달 경로 나무 — Notification Policy Tree | 구성 | 라벨에 따라 받을 팀을 나무 구조로 정한다 | 확인 [QOGFNOTIF] |
| OBS-42 | 여러 조건 묶은 경보 — Composite Monitor | 구성 | 둘 이상 조건이 함께 맞을 때만 울린다 | 확인 [QODDCOMP] |
| OBS-43 | 관련 경보 한 사건으로 묶기 — Alert Grouping | 구성 | 비슷한 경보를 한 건으로 묶어 피로를 줄인다 | 확인 [QOPDGRP] |
| OBS-44 | 시끄러운 경보 보고 — Noisy Alert Report | 모듈 | 자주 울리고 조치 없는 경보를 골라낸다 | 확장 [MK] |
| OBS-45 | 경보 저장 전 미리 시험 — Alert Preview | 구성 | 과거 데이터로 몇 번 울렸을지 먼저 본다 | 확장 [MK] |
| OBS-46 | 경보 메시지 틀 — Alert Message Template | 부품 | 원인·대시보드·조치 링크를 알림에 넣는다 | 확장 [MK] |
| OBS-47 | 당번 일정 층 — On-call Schedule Layers | 구성 | 교대 층을 겹쳐 지금 당번 한 명을 정한다 | 확인 [QOPDSCHED] |
| OBS-48 | 당번 임시 교체 — Schedule Override | 부품 | 휴가 등으로 특정 시간만 당번을 바꾼다 | 확장 [MK] · 대조 [QOPDSCHED] |
| OBS-49 | 호출 확인 제한 시간 — Acknowledge Timeout | 기준 | 정한 시간 안에 확인이 없으면 다음 사람을 부른다 | 확인 [QOPDESC] |
| OBS-50 | 휴대폰 호출 확인 화면 — Mobile Acknowledge | 구성 | 잠금 화면 알림에서 바로 확인하거나 넘긴다 | 확장 [MK] |
| OBS-51 | 사건 선언 — Declare Incident | 흐름 | 사건을 열고 등급과 지휘자를 바로 정한다 | 확장 [MK] · 대조 [QOSREINC] |
| OBS-52 | 사건 심각도 등급 — Severity Levels | 기준 | 영향 크기에 따라 SEV 등급을 매긴다 | 확인 [QOPDSEV] |
| OBS-53 | 사건 역할 배정 — Incident Roles | 구성 | 지휘자·기록자·대외 연락을 나눠 맡긴다 | 확인 [QOPDROLE] · 대조 [QOSREINC] |
| OBS-54 | 살아 있는 사건 문서 — Living Incident Document | 모듈 | 진행 상황을 한 문서에 계속 고쳐 쓴다 | 확인 [QOSREINC] |
| OBS-55 | 사건 시간표 — Incident Timeline | 구성 | 상태 변화와 조치를 시각순으로 남긴다 | 확인 [QOPDPM] |
| OBS-56 | 사건 전용 대화방 자동 생성 — Incident Channel | 구성 | 사건 선언과 함께 전용 채팅방을 연다 | 확장 [MK] |
| OBS-57 | 이해관계자 정기 보고 — Stakeholder Update | 구성 | 경영·고객 담당에게 정해진 주기로 알린다 | 확장 [MK] · 대조 [QOPDROLE] |
| OBS-58 | 운영자용 장애 공지 작성 — Status Page Composer | 흐름 | 장애 공지를 쓰고 조사·복구 단계별로 올린다 | 확장 [MK] · 대조 [ATLINC] |
| OBS-59 | 예정 점검 공지 예약 — Scheduled Maintenance | 흐름 | 점검 시각을 미리 알리고 때가 되면 연다 | 확장 [MK] |
| OBS-60 | 비난 없는 사후 검토 — Blameless Postmortem | 기준 | 사람 탓 대신 구조 원인을 찾는다 | 확인 [QOSREPM] · 대조 [QOPDPM] |
| OBS-61 | 재발 방지 조치 항목 — Action Items | 구성 | 사후 검토의 할 일을 담당·기한과 함께 좇는다 | 확인 [QOSREPM] |
| OBS-62 | 사건 대응 시간 지표 — MTTA·MTTR | 구성 | 확인·복구까지 걸린 평균 시간을 본다 | 확장 [MK] |
| OBS-63 | 모바일 사건 요약 카드 — Mobile Incident Summary | 구성 | 휴대폰에서 등급·영향·최근 소식만 보인다 | 확장 [MK] |
| OBS-64 | 여러 값 플래그 — Multivariate Flag | 구성 | 켜기·끄기 대신 여러 버전 중 하나를 준다 | 확장 [MK] |
| OBS-65 | 긴급 차단 스위치 — Kill Switch | 부품 | 문제 기능을 배포 없이 즉시 끈다 | 확인 [QOLDKILL] |
| OBS-66 | 선행 플래그 조건 — Flag Prerequisites | 구성 | 다른 플래그가 켜져야만 작동하게 한다 | 확인 [QOLDPRE] |
| OBS-67 | 플래그 변경 예약 — Scheduled Flag Change | 구성 | 정한 시각에 대상 규칙이 바뀌게 한다 | 확인 [QOLDSCHED] |
| OBS-68 | 플래그 변경 승인 요청 — Flag Change Approval | 흐름 | 운영 환경 변경 전에 동료 승인을 받는다 | 확인 [QOLDAPPR] |
| OBS-69 | 다 쓴 플래그 보관 — Stale Flag Archive | 구성 | 다 쓴 플래그를 지우지 않고 목록에서 뺀다 | 확인 [QOLDARCH] |
| OBS-70 | 플래그 코드 사용 위치 — Code References | 부품 | 플래그를 쓰는 코드 위치를 보여 준다 | 확인 [QOLDARCH] |
| OBS-71 | 환경별 플래그 상태 비교 — Environment Compare | 구성 | 개발·운영의 켜짐 상태 차이를 나란히 본다 | 확장 [MK] |
| OBS-72 | 지표 감시 점진 공개 — Guarded Rollout | 흐름 | 지표가 나빠지면 자동으로 되돌린다 | 확인 [QOLDGUARD] |
| OBS-73 | 표본 비율 불일치 경고 — SRM Warning | 부품 | 그룹 배정 비율이 틀어지면 결과를 믿지 않게 한다 | 확인 [QOSTSRM] |
| OBS-74 | 보호 지표 — Guardrail Metrics | 기준 | 실험이 해치면 안 되는 지표를 함께 본다 | 확장 [MK] · 대조 [QOLDGUARD] |
| OBS-75 | 실험 효과 신뢰 구간 — Confidence Interval | 구성 | 효과 크기를 범위와 유의 여부로 보인다 | 확장 [MK] |
| OBS-76 | 배포 파이프라인 단계 그림 — Pipeline Graph | 구성 | 빌드·시험·배포 단계의 성공 여부를 잇는다 | 확장 [MK] |
| OBS-77 | 배포 전 필수 검토자 — Required Reviewers | 구성 | 지정 검토자 한 명이 승인해야 진행한다 | 확인 [QOGHENV] |
| OBS-78 | 배포 대기 타이머 — Wait Timer | 부품 | 정한 분만큼 기다린 뒤 배포를 시작한다 | 확인 [QOGHENV] |
| OBS-79 | 배포 허용 브랜치 — Deployment Branch Rule | 기준 | 정해진 브랜치만 운영에 올릴 수 있다 | 확인 [QOGHENV] |
| OBS-80 | 카나리 자동 분석 — Canary Analysis | 흐름 | 성공·실패·판단 불가에 따라 진행·중단·멈춤 | 확인 [QOARGO] |
| OBS-81 | 배포 동결 기간 — Deploy Freeze | 기준 | 정한 기간에는 운영 배포를 막는다 | 확인 [QOGLSAFE] |
| OBS-82 | 낡은 배포 작업 차단 — Outdated Deployment Guard | 기준 | 새 배포 뒤 옛 작업이 덮어쓰지 못하게 한다 | 확인 [QOGLSAFE] |
| OBS-83 | 환경별 현재 버전 표 — Environment Versions | 구성 | 환경마다 어떤 버전이 떠 있는지 본다 | 확장 [MK] |
| OBS-84 | 자동 릴리스 노트 — Generated Release Notes | 구성 | 합쳐진 변경과 기여자를 자동으로 정리한다 | 확인 [QOGHREL] |
| OBS-85 | 배포 고리 단계 — Deployment Rings | 흐름 | 내부에서 일부, 전체 순으로 넓혀 배포한다 | 확장 [MK] · 대조 [QOLDPCT] |
| OBS-86 | 비용 이상 탐지와 원인 순위 — Cost Anomaly Detection | 구성 | 튄 비용을 찾고 금액 큰 원인부터 보인다 | 확인 [QOAWSCAD] |
| OBS-87 | 단위 비용 지표 — Unit Economics | 기준 | 주문·사용자 하나당 드는 클라우드 비용을 본다 | 확인 [QOFINUE] |
| OBS-88 | 놀거나 큰 자원 줄이기 추천 — Rightsizing | 구성 | 쉬거나 너무 큰 서버를 줄이자고 제안한다 | 확인 [QOAWSCO] |
| OBS-89 | 위험도순 검토 대기열 — Priority Review Queue | 구성 | 아동 안전·자해 신고를 맨 앞에 올린다 | 확장 [MK] |
| OBS-90 | 신뢰 신고자 우선 처리 — Trusted Flagger | 기준 | 인정받은 기관의 신고를 먼저 처리한다 | 확장 [MK] · 대조 [DSA] |
| OBS-91 | 검토자 화면 보호 — Reviewer Protection | 구성 | 흐림·흑백·소리 변조로 충격을 줄인다 | 확인 [QOTSPA] |
| OBS-92 | 검토자 노출 한도 — Reviewer Wellness Limits | 기준 | 유해물 연속 검토 시간과 휴식을 정한다 | 확장 [MK] · 대조 [QOTSPA] |
| OBS-93 | 정책 위반 분류 태그 — Policy Violation Tags | 부품 | 어떤 규정을 어겼는지 골라 기록한다 | 확장 [MK] |
| OBS-94 | 단계별 제재 사다리 — Enforcement Ladder | 기준 | 경고에서 기간 정지, 영구 정지로 올린다 | 확장 [MK] |
| OBS-95 | 누적 위반 이력 — Strike History | 구성 | 사용자의 지난 경고·정지를 한눈에 본다 | 확장 [MK] |
| OBS-96 | 처분 이유 통지 — Statement of Reasons | 구성 | 근거 조항과 자동 판단 여부를 알린다 | 확장 [MK] · 대조 [DSA] |
| OBS-97 | 이의 제기 재심사 — Appeal Review | 흐름 | 결정 뒤 6개월 동안 무료로 다시 심사받게 한다 | 확인 [DSA] |
| OBS-98 | 자동 분류 확신도 — Classifier Confidence | 부품 | 모델 점수로 자동 조치와 사람 검토를 가른다 | 확장 [MK] |
| OBS-99 | 사람 검토 기준선 — Human Review Threshold | 기준 | 애매한 점수대는 반드시 사람이 본다 | 확장 [MK] · 대조 [DSA] |
| OBS-100 | 같은 대상 신고 묶기 — Duplicate Report Grouping | 구성 | 한 게시물에 온 신고 여러 건을 한 건으로 본다 | 확장 [MK] |
| OBS-101 | 알려진 유해 이미지 대조 — Hash Matching | 구성 | 해시로 이미 확인된 불법 이미지를 찾는다 | 확인 [QOPDNA] |
| OBS-102 | 증거 보존·법적 보류 — Evidence Hold | 기준 | 지운 게시물도 수사용 원본은 정한 기간 남긴다 | 확장 [MK] |
| OBS-103 | 이중 검토 품질 점검 — QA Double Review | 구성 | 일부 판정을 다른 검토자가 다시 본다 | 확장 [MK] |
| OBS-104 | 투명성 보고서 집계 — Transparency Report | 모듈 | 조치 건수와 사유를 해마다 공개한다 | 확장 [MK] · 대조 [DSA] |
| OBS-105 | 거짓 신고 반복자 제한 — Abusive Notifier Suspension | 기준 | 근거 없는 신고를 반복하면 경고 뒤 막는다 | 확장 [MK] · 대조 [DSA] |
| OBS-106 | 결제 위험 점수 — Risk Score | 부품 | 0~99 점수와 위험 수준을 함께 보인다 | 확인 [QORDRISK] |
| OBS-107 | 위험 판단 이유 — Risk Insights | 구성 | 왜 위험하다고 봤는지 요인을 보인다 | 확인 [QORDRISK] |
| OBS-108 | 사기 방지 규칙 편집 — Fraud Rules | 구성 | 조건이 맞으면 막기·검토·추가 인증을 건다 | 확인 [QORDRULE] |
| OBS-109 | 규칙 적용 전 과거 결제 시험 — Rule Backtest | 구성 | 과거 결제에 걸려 볼 결과를 미리 센다 | 확인 [QORDTEST] |
| OBS-110 | 결제 수동 검토 대기열 — Manual Review Queue | 모듈 | 의심 결제를 우선순위 순으로 살핀다 | 확인 [QORDREV] |
| OBS-111 | 차단·허용 목록 — Block and Allow Lists | 부품 | 사기에 쓰인 이메일·카드를 목록으로 막는다 | 확인 [QORDLIST] |
| OBS-112 | 연결된 거래 보기 — Related Payments | 구성 | 같은 카드·기기의 다른 결제를 모아 본다 | 확장 [MK] · 대조 [QORDREV] |
| OBS-113 | 분쟁 증거 제출 — Dispute Evidence | 흐름 | 지불 거절에 반박 자료를 모아 낸다 | 확인 [QOSTRDIS] |
| OBS-114 | 개인정보 요청 처리함 — DSAR Queue | 모듈 | 열람·삭제 요청을 마감일 순으로 처리한다 | 확인 [QOICOERA] |
| OBS-115 | 삭제 요청 기한 표시 — Erasure Deadline | 부품 | 한 달 기한과 연장 여부를 보인다 | 확인 [QOICOERA] |
| OBS-116 | 요청자 본인 확인 — Requester Identity Check | 구성 | 신원 확인에 꼭 필요한 정보만 받는다 | 확인 [QOICOERA] |
| OBS-117 | 삭제 예외 판단 — Erasure Exemptions | 기준 | 법적 의무·소송 대비 자료는 삭제에서 뺀다 | 확인 [QOICOERA] |
| OBS-118 | 삭제 완료 기록 — Deletion Record | 구성 | 어느 시스템에서 언제 지웠는지 남긴다 | 확장 [MK] |
| OBS-119 | 감사 로그 외부 전송 — Audit Log Streaming | 구성 | 감사 기록을 보안 관제 시스템으로 보낸다 | 확인 [QOGHSTRM] · 대조 [QOCTRAIL] |
| OBS-120 | 필요할 때만 권한 올리기 — Just-in-Time Access | 흐름 | 사유·승인을 받아 정한 시간만 관리자가 된다 | 확인 [QOPIM] |
| OBS-121 | 임시 권한 만료 표시 — Access Expiry Badge | 부품 | 임시 권한이 끝나는 시각을 보인다 | 확인 [QOPIM] |
| OBS-122 | 비상 계정 사용 — Break-glass Access | 흐름 | 평소 경로가 막혔을 때만 쓰고 바로 알린다 | 확인 [QOBREAK] |
| OBS-123 | 운영 환경 색 띠 — Production Banner | 부품 | 운영 서버를 만지는 중임을 붉은 띠로 알린다 | 확장 [MK] |
| OBS-124 | 대신 보기 종료 띠 — Impersonation Banner | 부품 | 다른 사람으로 보는 중임과 끝내기 버튼을 둔다 | 확인 [QOGLIMP] |
| OBS-125 | 대신 보기 중 행동 제한 — Impersonation Restrictions | 기준 | 비밀번호·결제 변경 같은 행동은 막는다 | 확장 [MK] |
