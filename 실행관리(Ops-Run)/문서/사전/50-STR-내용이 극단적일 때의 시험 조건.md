# 50. 내용이 극단적일 때의 시험 조건

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 50번 분류 STR다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

어떤 부품이든 이 조건에서 깨지지 않아야 수록을 끝낸 것으로 본다. 화면 하나를 만들면 이 목록으로 두드려 본다.

| ID | 항목 | 통용 용어 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|---|
| STR-01 | 아주 긴 제목·단어 — 넘침 시험 | 긴 텍스트 테스트 (Long Text Stress Test) | 기준 | 긴 글이 상자를 뚫지 않는지 | 확장 [MK] |
| STR-02 | 아주 짧은 내용·한 글자 | 짧은 텍스트 테스트 (Short Content Test) | 기준 | 작은 내용에서 모양 유지 | 확장 [MK] |
| STR-03 | 내용 없음·0건·null | 빈 데이터 테스트 (Empty State Test) | 기준 | 빈 값 표기와 빈 화면 | 확장 [MK] |
| STR-04 | 아주 많은 항목 — 1만 건 | 대량 데이터 테스트 (Large Dataset Test) | 기준 | 속도와 스크롤 | 확장 [MK] |
| STR-05 | 아주 큰 숫자·음수·소수 | 숫자 경계값 테스트 (Number Edge Case Test) | 기준 | 자릿수와 부호 표시 | 확장 [MK] |
| STR-06 | 이미지 없음·깨진 이미지·비율 극단 | 이미지 폴백 테스트 (Broken Image Test) | 기준 | 대체 표현 | 확장 [MK] |
| STR-07 | 번역 후 두 배 길이 문구 | 텍스트 확장 테스트 (Text Expansion Test) | 기준 | 버튼·탭이 안 깨지는지 | 확장 [MK] · 대조 [MSPSEUDO] |
| STR-08 | 오른쪽에서 왼쪽 언어 | RTL 테스트 (Right-to-Left Test) | 기준 | 배치 반전 | 확장 [MK] |
| STR-09 | 큰 글자 200%·확대 400% | 텍스트 확대 테스트 (Text Resize and Reflow Test) | 기준 | 재배치 시험 | 확장 [MK] · 대조 [LZA11Y] |
| STR-10 | 아주 좁은 화면 320px·아주 넓은 화면 | 뷰포트 극단 테스트 (Viewport Extremes Test) | 기준 | 양 끝 폭 | 확장 [MK] |
| STR-11 | 느린 네트워크·응답 없음 | 네트워크 스로틀링 테스트 (Network Throttling Test) | 기준 | 기다림 표시와 실패 처리 | 확장 [MK] |
| STR-12 | 동시 알림 폭주 — 10개 토스트 | 알림 폭주 테스트 (Toast Flood Test) | 기준 | 쌓임 규칙 | 확장 [MK] |
| STR-13 | 권한 없음·로그아웃 상태 | 권한 상태 테스트 (Permission State Test) | 기준 | 볼 수 없는 것의 처리 | 확장 [MK] |
| STR-14 | 오래된 데이터·시계 어긋남 | 시간대·시계 오차 테스트 (Clock Skew Test) | 기준 | 시간 표시 오류 | 확장 [MK] |
| STR-15 | 키보드만·스크린 리더만 | 키보드·스크린 리더 테스트 (Keyboard and Screen Reader Test) | 기준 | 마우스 없는 완주 | 확장 [MK] |
| STR-16 | 움직임 줄이기·고대비 모드 켜짐 | 사용자 설정 테스트 (Reduced Motion and High Contrast Test) | 기준 | 시스템 설정 반영 | 확장 [MK] |
| STR-17 | 인쇄·PDF 출력 | 인쇄 테스트 (Print Stylesheet Test) | 기준 | 화면이 종이에서 깨지지 않는지 | 확장 [MK] |
| STR-18 | 복사·붙여넣기 결과 | 복사 붙여넣기 테스트 (Copy-Paste Test) | 기준 | 복사한 글의 형식 | 확장 [MK] |
| STR-19 | 뒤로 가기·새로고침 뒤 상태 | 상태 복원 테스트 (Back/Refresh State Test) | 기준 | 상태 복원 | 확장 [MK] |
| STR-20 | 중간 실패 — 절반만 저장됨 | 부분 실패 테스트 (Partial Failure Test) | 기준 | 부분 성공 표시 | 확장 [MK] |
| STR-21 | 세로쓰기 줄바꿈 규칙 시험 | 세로쓰기 테스트 (Vertical Writing Mode Test) | 기준 | 세로로 쓰는 글이 바르게 끊기나 | 확인 [JLREQ] |
| STR-22 | 가짜 번역으로 누락 찾기 | 의사 번역 테스트 (Pseudo-localization) | 기준 | 번역 안 된 글자를 표시로 잡아냄 | 확인 [MSPSEUDO] |
