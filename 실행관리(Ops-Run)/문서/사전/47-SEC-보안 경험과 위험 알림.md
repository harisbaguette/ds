# 47. 보안 경험과 위험 알림

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 47번 분류 SEC다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

보안을 사용자가 이해하고 따르게 하는 화면이다. 겁주지 않으면서 무엇을 해야 하는지 한 번에 보인다.

| ID | 항목 | 통용 용어 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|---|
| SEC-01 | 비밀번호 강도·규칙 실시간 표시 | 비밀번호 강도 표시기 (Password Strength Meter) | 구성 | 조건 충족을 체크로 보이기 | 확장 [MK] · 대조 [NIST863B] |
| SEC-02 | 유출된 비밀번호 경고 | 유출 비밀번호 경고 (Breached Password Warning) | 구성 | 알려진 유출과 겹치면 알림 | 확장 [MK] · 대조 [NIST863B] |
| SEC-03 | 새 기기 로그인 알림·차단 | 새 기기 로그인 알림 (New Device Login Alert) | 흐름 | 낯선 접속을 알리고 막기 | 확장 [MK] |
| SEC-04 | 보안 점검 — 계정 안전 점수 | 보안 점검 (Security Checkup) | 모듈 | 할 일 목록으로 보안 상태 | 확장 [MK] |
| SEC-05 | 2단계 인증 설정 유도 | 2단계 인증 (Two-Factor Authentication) | 흐름 | 켜야 하는 이유와 절차 | 확장 [MK] |
| SEC-06 | 복구 방법 등록 — 이메일·전화·코드 | 계정 복구 수단 (Account Recovery Options) | 흐름 | 잃어버렸을 때 대비 | 확장 [MK] |
| SEC-07 | 피싱 의심 링크 경고 | 외부 링크 경고 (External Link Warning) | 구성 | 낯선 주소 열기 전 확인 | 확장 [MK] |
| SEC-08 | 민감 작업 재인증 — Step-up Auth | 스텝업 인증 (Step-up Authentication) | 구성 | 중요한 일 전에 다시 확인 | 확장 [MK] |
| SEC-09 | 세션 잠금·자동 로그아웃 예고 | 세션 타임아웃 경고 (Session Timeout Warning) | 구성 | 곧 나감을 알리고 연장 | 확장 [MK] · 대조 [OWASPSESS] |
| SEC-10 | 권한 요청 설명 — 왜 필요한지 | 권한 사전 안내 (Permission Priming) | 구성 | 권한마다 이유 한 줄 | 확장 [MK] |
| SEC-11 | 공유 링크 위험 안내 | 공유 링크 권한 표시 (Link Sharing Visibility) | 구성 | 누구나 볼 수 있음을 표시 | 확장 [MK] |
| SEC-12 | 계정 탈취 의심 시 조치 안내 | 계정 탈취 대응 (Account Takeover Recovery) | 흐름 | 비밀번호 바꾸고 세션 끊기 | 확장 [MK] |
| SEC-13 | 관리자 위험 행동 이중 승인 | 4-아이즈 승인 (Four-Eyes Principle) | 흐름 | 두 사람 승인으로 실행 | 확장 [MK] |
| SEC-14 | 개인정보 마스킹 표시 — 카드 뒷자리 | 데이터 마스킹 (Data Masking) | 부품 | 일부만 보이는 값 | 확장 [MK] |
| SEC-15 | CAPTCHA 대안·접근 가능한 봇 검사 | 보이지 않는 캡차 (Invisible CAPTCHA) | 구성 | 보이지 않는 검사 우선 | 확장 [MK] |
| SEC-16 | 보안 사고 안내·조치 요청 | 보안 사고 공지 (Security Incident Notice) | 모듈 | 무슨 일이 있었고 무엇을 할지 | 확장 [MK] |
| SEC-17 | 보안 키패드 — Secure Keypad | 보안 키패드 (Secure Keypad) | 부품 | 해킹 방지를 위해 화면에 그려 넣는 자체 숫자 입력 키패드 | 확인 [TOSSMINI] |
| SEC-18 | 대체 인증수단 전환 링크 — Fallback Auth Method Switch | 다른 인증 방법 사용 (Try Another Way) | 부품 | 주 인증수단이 안 될 때 다른 인증수단으로 바꾸는 링크 | 확장 [KRWEB] |
| SEC-19 | 인지 부담 없는 인증 — Accessible Authentication | 접근 가능한 인증 (Accessible Authentication) | 기준 | 기억력 시험(퍼즐 등) 없이 패스키·비밀번호 관리자로 로그인하게 하는 기준 | 확인 [WCAG22] |
| SEC-20 | 패스키 실패 시 자연스러운 전환 — Graceful Fallback | 인증 폴백 (Authentication Fallback) | 흐름 | 패스키 인증이 실패해도 다른 방법으로 매끄럽게 넘어가는 흐름 | 확인 [PASSKEY] |
| SEC-21 | 계정 복구 직후 패스키 생성 제안 — Create Passkey After Recovery | 패스키 업그레이드 제안 (Passkey Upsell) | 흐름 | 비밀번호 재설정 등 계정 복구 직후 패스키 등록을 권하는 흐름 | 확인 [PASSKEY] |
| SEC-22 | 교차기기 로그인 — Cross-Device Sign-in(QR) | 교차 기기 인증 (Cross-Device Authentication) | 흐름 | QR코드로 다른 기기의 패스키를 빌려와 로그인하는 흐름 | 확인 [PASSKEY] |
| SEC-23 | 긴급 이탈(패닉) 버튼 — Exit This Page | 빠른 나가기 버튼 (Quick Exit) | 부품 | 위험 상황에서 화면을 즉시 지우고 다른 사이트로 이동 | 확인 [G] |
| SEC-24 | PASS 통신사 선택 화면 — Carrier PASS Selector | PASS 본인인증 (Mobile Identity Verification) | 구성 | 본인 명의 통신사를 골라 PASS 인증으로 넘어가는 화면 | 확장 [KRWEB] |
| SEC-25 | 간편인증 사업자 선택 — Simple Auth Provider Selector | 간편인증 선택 (Simple Authentication) | 구성 | 카카오·네이버·토스 같은 인증 수단 중 하나를 고르는 화면 | 확장 [KRWEB] |
| SEC-26 | 공동인증서 선택창 — Certificate Selector | 공동인증서 선택 (Certificate Picker) | 구성 | 저장 위치별 인증서 목록에서 하나를 골라 로그인함 | 확장 [KRWEB] |
| SEC-27 | 인증매체 전환 탭 — Auth Method Tab | 인증 수단 탭 (Auth Method Tabs) | 부품 | 간편·공동·금융 인증 방식을 탭으로 오가며 고름 | 확장 [KRWEB] |
| SEC-28 | 로그인 시도 제한과 잠금 안내 | 계정 잠금 (Account Lockout) | 기준 | 여러 번 틀리면 잠그고 알림 | 확인 [NIST863B] · 대조 [OWASPAUTH] |
| SEC-29 | 계정 있는지 안 알려 주기 | 계정 열거 방지 (Account Enumeration Prevention) | 기준 | 아이디 존재를 문구로 흘리지 않음 | 확인 [OWASPAUTH] |
| SEC-30 | 문자 인증 위험 경고 문구 | SMS 인증 위험 고지 (SMS OTP Warning) | 부품 | 문자는 가로챌 수 있다고 알림 | 확인 [NIST863B] |
| SEC-31 | 비밀번호 붙여넣기 허용 | 비밀번호 붙여넣기 허용 (Allow Password Paste) | 부품 | 비밀번호 관리기를 막지 않음 | 확인 [NIST863B] |
| SEC-32 | 권한 거부 후 재요청 제한 안내 | 권한 재요청 안내 (Permission Re-request) | 흐름 | 거절하면 다시 못 물으니 미리 설명 | 확인 [WEBDEVPERM] |
