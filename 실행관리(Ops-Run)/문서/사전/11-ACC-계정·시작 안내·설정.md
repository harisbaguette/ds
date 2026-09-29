# 11. 계정·시작 안내·설정

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 11번 분류 ACC다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

| ID | 항목 | 통용 용어 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|---|
| ACC-01 | 로그인 — Login | 로그인 (Sign In) | 모듈 | 계정으로 서비스에 진입 | 확인 [LI] |
| ACC-02 | 가입 — Signup | 회원가입 (Sign Up) | 모듈 | 필요한 정보로 계정 생성 | 확인 [G] |
| ACC-03 | 이메일·전화번호 확인 | 이메일·휴대폰 인증 (Email / Phone Verification) | 모듈 | 연락 수단의 소유 확인 | 확인 [G] |
| ACC-04 | 비밀번호 재설정 | 비밀번호 재설정 (Password Reset) | 모듈 | 접근할 수 없는 계정 복구 | 확인 [B] |
| ACC-05 | 인증 링크·패스키 진입 | 패스키 로그인 (Passkey / Passwordless Sign-In) | 구성 | 지원하는 인증 방식으로 로그인 | 확인 [B] |
| ACC-06 | 첫 설정 — Onboarding | 온보딩 (Onboarding) | 모듈 | 이용에 필요한 초기 조건 설정 | 확인 [OB] |
| ACC-07 | 맥락별 도움말·제품 둘러보기 | 제품 투어 (Contextual Help / Product Tour) | 구성 | 필요한 순간에 기능 사용 안내 | 확인 [UO] |
| ACC-08 | 시작 과제 목록 — Getting Started Checklist | 시작하기 체크리스트 (Getting Started Checklist) | 모듈 | 초기 작업과 완료 상태 안내 | 확장 [G] |
| ACC-09 | 프로필 설정 | 프로필 설정 (Profile Settings) | 모듈 | 사용자 정보 확인·수정 | 확인 [SP] |
| ACC-10 | 알림 설정 | 알림 설정 (Notification Settings) | 모듈 | 알림 종류·경로·수신 조건 선택 | 확인 [SN] |
| ACC-11 | 멤버·역할 관리 | 멤버 관리 (Members & Roles) | 모듈 | 구성원과 접근 역할 확인·변경 | 확인 [SM] |
| ACC-12 | 초대와 수락 | 초대 (Invite Members) | 모듈 | 다른 사람을 작업 공간에 연결 | 확인 [B] |
| ACC-13 | 외부 서비스 연결·해제 | 연동 관리 (Connected Apps) | 모듈 | 연동 상태를 확인하고 변경 | 확인 [B] |
| ACC-14 | 구독 변경·탈퇴·종료 | 구독 해지·회원 탈퇴 (Cancel Subscription) | 구성 | 결과를 이해하고 이용을 마무리 | 확장 [G] |
| ACC-15 | 다중 인증 등록·복구 코드 | 2단계 인증 (Two-Factor Authentication) | 모듈 | 추가 인증 수단과 복구 경로 준비 | 확인 [UXP] |
| ACC-16 | 로그인 기기·세션 관리 | 세션 관리 (Active Sessions) | 모듈 | 활성 접속 확인·종료 | 확장 · 계정 관리 요구 |
| ACC-17 | 보안 활동 기록 | 보안 로그 (Security Activity Log) | 모듈 | 주요 계정 변경 내역 조회 | 확장 · 계정 관리 요구 |
| ACC-18 | 권한 매트릭스 | 권한 매트릭스 (Permission Matrix) | 모듈 | 대상·행동별 허용 범위를 비교 | 확인 [SHR] · 대조 [OKTARBAC] |
| ACC-19 | 조직 소유권 이전 | 소유권 이전 (Ownership Transfer) | 흐름 | 새 소유자 지정·수락·권한 전환 | 확장 · 협업 요구 |
| ACC-20 | 알림 방해 금지 시간 | 방해 금지 모드 (Do Not Disturb) | 구성 | 수신 시간대를 선택 | 확장 [SN] |
| ACC-21 | 설정 검색과 적용 범위 | 설정 검색 (Settings Search) | 모듈 | 개인·팀·조직 설정을 구분해 찾기 | 확장 · 설정 요구 |
| ACC-22 | 계정 연결·연결 계정 선택 | 계정 연결 (Linked Accounts) | 모듈 | 여러 로그인 수단과 계정 연결 | 확장 · 계정 관리 요구 |
| ACC-23 | 소셜·외부 계정으로 로그인 | 소셜 로그인 (Social Login) | 구성 | 구글·애플 등 버튼과 계정 합치기 | 확장 [MK] |
| ACC-24 | 기기 코드 로그인 — TV·CLI | 기기 코드 로그인 (Device Code Flow) | 흐름 | 짧은 코드를 다른 기기에서 입력해 승인 | 확장 [MK] |
| ACC-25 | 매직 링크 로그인 | 매직 링크 (Magic Link Login) | 흐름 | 비밀번호 없이 이메일 링크로 들어가기 | 확장 [MK] |
| ACC-26 | 로그인 상태 유지·기기 신뢰 | 로그인 상태 유지 (Remember Me) | 구성 | 이 기기 기억하기와 만료 안내 | 확장 [MK] |
| ACC-27 | 의심 로그인 알림·승인 | 새 기기 로그인 알림 (Suspicious Login Alert) | 흐름 | 낯선 기기 접속을 알리고 막기 | 확장 [MK] |
| ACC-28 | 계정 삭제와 유예 기간 | 계정 삭제 (Account Deletion) | 흐름 | 지운 뒤 되살릴 수 있는 기간 안내 | 확장 [MK] |
| ACC-29 | 아이디·이메일 변경 확인 | 이메일 변경 인증 (Email Change Verification) | 흐름 | 새 주소로 확인 뒤 교체 | 확장 [MK] |
| ACC-30 | 비밀번호 변경과 다른 기기 로그아웃 | 비밀번호 변경 (Change Password) | 흐름 | 바꾼 뒤 모든 세션 끊기 선택 | 확장 [MK] |
| ACC-31 | 연령 확인·보호자 동의 | 연령 인증 (Age Verification / Parental Consent) | 흐름 | 나이 확인과 미성년 계정 처리 | 확장 [MK] · 대조 [STEAMG] |
| ACC-32 | 프로필 사진 업로드·자르기 | 프로필 사진 크롭 (Avatar Upload & Crop) | 구성 | 사진을 올려 원형 틀에 맞춤 | 확장 [MK] |
| ACC-33 | 계정 전환 — 여러 계정 | 계정 전환 (Account Switcher) | 구성 | 로그아웃 없이 다른 계정으로 바꾸기 | 확장 [MK] |
| ACC-34 | 팀 생성·첫 멤버 초대 | 팀 생성 (Create Team) | 흐름 | 조직 만들고 사람 부르기 | 확장 [MK] |
| ACC-35 | API 토큰·개인 키 발급 | API 키 발급 (API Tokens) | 구성 | 한 번만 보이는 키와 만료 관리 | 확장 [MK] |
| ACC-36 | 데이터 내보내기·계정 이관 | 데이터 내보내기 (Data Export / Takeout) | 흐름 | 내 자료를 받아 다른 서비스로 | 확장 [MK] |
| ACC-37 | 언어·시간대·표기 형식 설정 | 지역 설정 (Language & Region Settings) | 구성 | 사용자별 지역 설정 | 확장 [MK] |
| ACC-38 | 접근성 설정 — 글자 크기·대비·움직임 | 접근성 설정 (Accessibility Settings) | 구성 | 앱 안 접근성 옵션 모음 | 확장 [MK] |
| ACC-39 | 이메일 수신 빈도·요약 설정 | 이메일 수신 설정 (Email Preferences / Digest) | 구성 | 즉시·하루 요약·끄기 선택 | 확장 [MK] |
| ACC-40 | 가입 완료 후 첫 과제 유도 | 첫 행동 유도 (First-Run Experience) | 흐름 | 가입 직후 바로 가치가 보이는 첫 행동 | 확장 [MK] |
| ACC-41 | 프로필 완성도 표시 | 프로필 완성도 (Profile Completeness) | 부품 | 채운 비율과 다음 채울 항목 | 확장 [MK] |
| ACC-42 | 공개 프로필 미리보기 | 공개 프로필 미리보기 (Public Profile Preview) | 구성 | 남에게 보이는 모습 확인 | 확장 [MK] |
| ACC-43 | 온보딩 코치마크 말풍선 — Coachmark/Teaching Callout | 코치마크 (Coachmark) | 부품 | 새 기능 위치를 화살표로 짚어 짧게 안내하는 말풍선 | 확인 [FL2] |
| ACC-44 | 안내 스포트라이트 배너 — Guide Banner | 가이드 배너 (Spotlight Banner) | 구성 | 새 기능을 소개하며 화면 일부를 밝혀 보여주는 배너 | 확인 [CAR] |
| ACC-45 | 스포트라이트 단계별 온보딩 투어 — Tour | 온보딩 투어 (Product Tour) | 흐름 | 화면 요소를 순서대로 밝혀가며 안내하는 온보딩 투어 | 확인 [ANT] |
| ACC-46 | 직접 조작하며 배우기 — Playthrough | 플레이스루 (Playthrough Onboarding) | 구성 | 설명을 읽는 대신 실제로 눌러 보며 사용법을 익히는 온보딩 | 확인 [UIP] |
| ACC-47 | 패스키 자동완성 로그인 | 패스키 자동완성 (Passkey Autofill) | 부품 | 입력칸을 누르면 지문으로 바로 | 확인 [PASSKEY] |
| ACC-48 | 가입 시 이메일 가리기 | 이메일 가리기 (Hide My Email / Email Masking) | 부품 | 진짜 주소 대신 전달용 주소 | 확인 [APPLEHME] |
| ACC-49 | 조직 로그인 강제 전환 | SSO 강제 (Enforced SSO) | 구성 | 회사 계정으로만 들어오게 | 확인 [ENTRASSO] |
| ACC-50 | 도메인 소유 확인 | 도메인 인증 (Domain Verification) | 흐름 | 회사 주소가 우리 것임을 증명 | 확인 [ENTRADOM] |
| ACC-51 | 초대 만료와 재전송 | 초대 만료·재전송 (Invite Expiry & Resend) | 부품 | 오래된 초대는 끊고 다시 보냄 | 확인 [GHINVITE] |
