# 36. 신뢰·정보 통제·동의

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 36번 분류 PRV다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

| ID | 항목 | 통용 용어 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|---|
| PRV-01 | 사용 목적별 동의 선택 | 동의 관리 (Consent Management) | 모듈 | 목적과 선택 결과를 이해 | 확장 [UXP] |
| PRV-02 | 개인 데이터 열람·내보내기 | 데이터 내보내기 (Data Export) | 흐름 | 데이터 범위 선택 → 준비 → 수령 | 확장 · 계정 서비스 요구 |
| PRV-03 | 개인 데이터 삭제와 결과 | 계정 데이터 삭제 (Data Deletion) | 흐름 | 대상 확인 → 요청 → 처리 결과 | 확장 · 계정 서비스 요구 |
| PRV-04 | 연결 서비스의 접근 권한 확인 | 연결된 앱 관리 (Connected Apps) | 모듈 | 외부 서비스의 접근 범위 관리 | 확장 [SM] |
| PRV-05 | 공개 범위와 미리보기 | 공개 범위 설정 (Visibility Settings) | 모듈 | 다른 사용자에게 보이는 정보 확인 | 확장 · 계정 서비스 요구 |
| PRV-06 | 민감 값 숨김·임시 표시 | 민감 정보 마스킹 (Data Masking) | 구성 | 필요한 순간에만 상세 값 확인 | 확장 · 웹앱 요구 |
| PRV-07 | 자료의 작성자·출처·정정 연결 | 출처·작성자 표시 (Attribution) | 구성 | 정보의 책임과 변경 근거 확인 | 확장 · 전문 콘텐츠 요구 |
| PRV-08 | 선택 동의의 변경·철회 | 동의 철회 (Consent Withdrawal) | 흐름 | 현재 설정 확인 → 변경 → 적용 | 확장 [UXP] |
| PRV-09 | 신고 사유와 처리 결과 | 신고하기 (Report Content) | 흐름 | 문제 대상 지정 → 제출 → 후속 상태 | 확장 [US] |
| PRV-10 | 외부 공유·게시 전 범위 확인 | 공유 전 확인 (Share Preview) | 구성 | 보낼 대상과 실제 공개 내용을 검토 | 확장 · 협업 요구 |
| PRV-11 | 쿠키·추적 동의 배너 | 쿠키 배너 (Cookie Consent Banner) | 구성 | 첫 방문 동의와 세부 설정 | 확장 [MK] |
| PRV-12 | 데이터 사용 요약 — 이렇게 씁니다 | 개인정보 요약 (Privacy Summary) | 구성 | 어떤 자료를 왜 쓰는지 한 장 | 확장 [MK] |
| PRV-13 | 개인정보 보호 대시보드 | 개인정보 대시보드 (Privacy Dashboard) | 모듈 | 내 자료·권한을 한곳에서 | 확장 [MK] |
| PRV-14 | 위치·마이크 사용 중 표시 | 사용 중 표시 (Privacy Indicator) | 부품 | 지금 쓰고 있음을 알리는 점 | 확장 [MK] |
| PRV-15 | 스크린샷·화면 녹화 방지 안내 | 캡처 방지 (Screenshot Protection) | 구성 | 민감 화면 보호 알림 | 확장 [MK] |
| PRV-16 | 자녀 보호·연령 등급 | 자녀 보호 기능 (Parental Controls) | 구성 | 콘텐츠 등급과 잠금 | 확장 [MK] |
| PRV-17 | 익명·가명 모드 | 익명 모드 (Anonymous Mode) | 구성 | 이름 없이 참여하기 | 확장 [MK] |
| PRV-18 | 자동 삭제 메시지·기한 | 사라지는 메시지 (Disappearing Messages) | 구성 | 시간 지나면 사라지는 대화 | 확장 [MK] |
| PRV-19 | 종단간 암호화 표시 | 종단간 암호화 표시 (End-to-End Encryption Indicator) | 부품 | 암호화됨을 알리는 자물쇠 | 확장 [MK] |
| PRV-20 | 데이터 보관 위치·국가 표시 | 데이터 저장 위치 (Data Residency) | 구성 | 자료가 어디 저장되는지 | 확장 [MK] |
| PRV-21 | 투명성 보고·요청 내역 | 투명성 보고서 (Transparency Report) | 모듈 | 정부·외부 요청 공개 | 확장 [MK] |
| PRV-22 | 동의 이력·언제 무엇에 동의 | 동의 이력 (Consent History) | 구성 | 내 동의 기록 보기 | 확장 [MK] |
| PRV-23 | 광고 개인화 끄기 | 맞춤 광고 설정 (Ad Personalization) | 구성 | 맞춤 광고 설정 | 확장 [MK] |
| PRV-24 | 개인정보 처리 방침 변경 알림 | 개인정보처리방침 변경 고지 (Privacy Policy Update) | 구성 | 바뀐 점 요약과 동의 | 확장 [MK] |
| PRV-25 | 사업자정보 확인 링크·팝업 — Business Info Verification Popup | 사업자정보 확인 (Business Info Verification) | 부품 | 사업자등록번호 등 판매자 정보를 팝업으로 확인시켜 주는 링크 | 확장 [KRWEB] |
| PRV-26 | 본인인증 진입 배너 — Verification Rationale Banner | 본인인증 안내 (Verification Rationale) | 부품 | 본인인증을 요구하기 전 왜 필요한지 알리는 배너 | 확장 [KRWEB] |
| PRV-27 | 사용자 간 신뢰도 점수 배지 — Trust Score Badge | 신뢰도 배지 (Trust Score Badge) | 부품 | 다른 사용자와의 거래 신뢰도를 점수·온도로 보여주는 배지 | 확인 [DAANGN] |
| PRV-28 | 동의 배너 거부·수락 버튼 대칭 — Symmetric Accept/Reject | 동등한 거부 버튼 (Symmetric Accept/Reject) | 기준 | 쿠키 등 동의 배너에서 거부 버튼을 수락 버튼과 같은 크기·위치로 두는 기준 | 확장 [CNIL2] |
| PRV-29 | 배너 닫기=거부 인정 — Continue Without Accepting | 닫기=거부 (Continue Without Accepting) | 기준 | 배너를 닫거나 스크롤만 해도 거부한 것으로 인정하는 기준 | 확장 [CNIL2] |
| PRV-30 | 동의 유효기간·재동의 요청 — Consent Renewal | 재동의 (Consent Renewal) | 흐름 | 일정 기간이 지나면 동의를 다시 받는 흐름 | 확장 [CNIL2] |
| PRV-31 | 앱 추적 투명성 요청 팝업 | ATT 팝업 (App Tracking Transparency) | 흐름 | 광고 추적 허락을 한 번 물음 | 확장 [MK] |
| PRV-32 | 데이터 안전 섹션 표 | 데이터 보안 섹션 (Data Safety Section) | 구성 | 무슨 정보를 왜 모으는지 한 표로 | 확인 [GOOGPLAYDS] |
| PRV-33 | 선택한 사진만 접근 허용 | 제한된 사진 접근 (Limited Photo Access) | 부품 | 앨범 전체가 아니라 고른 것만 | 확인 [ANDROIDPARTIAL] |
