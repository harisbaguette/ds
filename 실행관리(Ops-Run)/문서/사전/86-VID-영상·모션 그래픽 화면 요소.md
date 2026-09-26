# 86. 영상·모션 그래픽 화면 요소

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 86번 분류 ID다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

이 분류는 영상을 만드는 쪽에서 판단하는 요소를 담는다. 화면 위에 얹는 그래픽과 자막 표기, 영상의 앞뒤 구조, 유튜브·쇼츠·릴스·틱톡·생방송별 규칙, 모션 그래픽, 라이브·웨비나 화면 구성이 여기에 속하며, 가로 화면(PC·TV)과 세로 화면(휴대폰) 기준을 나눠 적었다. 편집 도구 화면(PRO-46~61·95·96), 시청자가 쓰는 플레이어와 뷰어(MED-02·04·06, CNT-98·103·109·112·116), 게임 자막·수어 창·음성 해설(GAC-34~50·61), 썸네일·워터마크·인트로 파일 규격(AST-23·34·45), 화면 비율 띠(GIO-80), 화면 움직임 기본값과 이징(ANM-09·12·14·20)은 담지 않는다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| VID-01 | 하단 자막 띠 — Lower Third | 부품 | 말하는 사람 이름·직함을 화면 아래에 띄움 | 확인 [RVWPLT] |
| VID-02 | 첫 등장 이름 표시 — Name Super | 기준 | 인물이 처음 나올 때 이름을 한 번만 띄움 | 확장 [MK] · 대조 [RVWPLT] |
| VID-03 | 여러 층 하단 자막 — Two-tier / Three-tier Lower Third | 구성 | 이름 아래 직함·소속을 층으로 나눠 보여 줌 | 확인 [RVWPLT] |
| VID-04 | 글자 안전 영역 — Graphics Safe Area | 기준 | 글자·그래픽을 가장자리 5% 안쪽에 둠 | 확인 [RVEBU] |
| VID-05 | 동작 안전 영역 — Action Safe Area | 기준 | 중요한 움직임을 가장자리 3.5% 안쪽에 둠 | 확인 [RVEBU] |
| VID-06 | 좁은 화면 비율 보호 — 4:3 / 14:9 Protection | 기준 | 옛 화면 비율로 잘려도 핵심이 남게 가운데 둠 | 확인 [RVEBU] |
| VID-07 | 채널 로고 표식 — DOG / Bug | 부품 | 방송사·채널 로고를 모서리에 작게 늘 띄움 | 확인 [RVWPDOG] |
| VID-08 | 브랜딩 워터마크 노출 시점 — Branding Watermark Timing | 기준 | 로고를 끝 15초·지정 시점·전체 중 골라 띄움 | 확인 [RVYTWM] |
| VID-09 | 흐르는 문자 띠 — Ticker / Crawl | 부품 | 속보·시세를 화면 아래에서 옆으로 흘려 보냄 | 확인 [RVWPLT] |
| VID-10 | 글자 없는 원본판 — Clean Feed / Textless Version | 구성 | 자막·그래픽을 뺀 화면을 따로 남겨 재편집함 | 확인 [RVWPLT] |
| VID-11 | 화면에 새긴 자막 — Open / Burned-in Captions | 기준 | 끌 수 없게 영상에 새겨 늘 보이는 자막 | 확인 [RVWCAG] |
| VID-12 | 켜고 끄는 자막 — Closed Captions | 기준 | 보는 사람이 켜고 끌 수 있게 따로 싣는 자막 | 확인 [RVWCAG] |
| VID-13 | 자막 최대 두 줄 — Two-line Maximum | 기준 | 한 번에 자막을 두 줄까지만 띄움 | 확인 [RVNFTT] · 대조 [RVDCMP] |
| VID-14 | 한국어 자막 한 줄 16자 — Korean Line Length | 기준 | 한국어 자막 한 줄을 16자 안으로 끊음 | 확인 [RVNFKO] |
| VID-15 | 초당 글자 수 읽기 속도 — Reading Speed CPS | 기준 | 어른 12자·어린이 9자 속도 안에서 자막을 씀 | 확인 [RVNFKO] |
| VID-16 | 분당 단어 읽기 속도 — Reading Rate WPM | 기준 | 영어 자막을 분당 단어 수 한도 안에 맞춤 | 확인 [RVDCMP] |
| VID-17 | 자막 최소·최대 노출 시간 — Minimum / Maximum Duration | 기준 | 자막을 너무 짧거나 길지 않게 띄워 둠 | 확인 [RVNFTT] · 대조 [RVDCMP] |
| VID-18 | 자막 줄 나눔 — Line Breaking | 기준 | 뜻 덩어리가 안 끊기는 자리에서 줄을 바꿈 | 확인 [RVNFTT] |
| VID-19 | 자막 가운데 정렬 — Centered Alignment | 기준 | 자막을 화면 가로 가운데에 맞춰 둠 | 확인 [RVNFTT] |
| VID-20 | 가림 피해 자막 옮기기 — Caption Repositioning | 기준 | 얼굴·화면 글자를 가리면 자막을 위로 올림 | 확인 [RVFCC] · 대조 [RVDCMP] |
| VID-21 | 자막 자리 비워 두고 찍기 — Caption-safe Composition | 기준 | 화면 아래쪽에 자막 들어갈 자리를 비워 둠 | 확장 [MK] · 대조 [RVFCC] |
| VID-22 | 자막 테두리·배경 상자 — Caption Outline / Box | 부품 | 밝은 화면에서도 자막이 읽히게 뒤를 받침 | 확장 [MK] |
| VID-23 | 장면 전환에 맞춘 자막 끊기 — Shot-change Timing | 기준 | 장면이 바뀔 때 자막도 함께 넘김 | 확장 [MK] |
| VID-24 | 화살표·동그라미 강조 — Callout Annotation | 부품 | 화면 속 봐야 할 곳을 도형으로 짚어 줌 | 확장 [MK] |
| VID-25 | 확대해 들어가기 — Punch-in Zoom | 구성 | 중요한 부분을 확대해 시선을 모음 | 확장 [MK] |
| VID-26 | 흐림·모자이크 가리기 — Blur / Pixelate | 부품 | 얼굴·개인정보를 흐려 알아볼 수 없게 함 | 확장 [MK] |
| VID-27 | 마우스 강조·키 입력 표시 — Cursor Highlight / Keystroke Overlay | 부품 | 화면 녹화에서 누른 곳과 키를 보여 줌 | 확장 [MK] |
| VID-28 | 화면 나눠 보여 주기 — Split Screen | 구성 | 두 장면을 나란히 놓고 비교해 보여 줌 | 확장 [MK] |
| VID-29 | 작은 창 겹치기 — Picture-in-Picture Composite | 구성 | 본 화면 모서리에 다른 영상을 작게 얹음 | 확장 [MK] |
| VID-30 | 자료 출처 표시 — Source Credit | 부품 | 남의 영상·사진을 쓸 때 출처를 적어 둠 | 확장 [MK] |
| VID-31 | 재연·자료 화면 표시 — Reenactment / Archive Label | 부품 | 재연이나 옛 자료 화면임을 글자로 알림 | 확장 [MK] |
| VID-32 | 유료 광고 포함 표시 — Paid Promotion Label | 기준 | 협찬 영상은 시작할 때 광고 표시를 띄움 | 확인 [RVYTPP] |
| VID-33 | 합성·변형 콘텐츠 표시 — Altered or Synthetic Content Label | 기준 | 진짜처럼 만든 AI 장면임을 표시로 알림 | 확인 [RVYTAI] |
| VID-34 | 장소·날짜 자막 — Locator / Date Super | 부품 | 촬영 장소와 날짜를 화면 구석에 적음 | 확인 [RVWPLT] |
| VID-35 | 전체 화면 인용 그래픽 — Full-screen Quote Card | 구성 | 중요한 말을 화면 가득 글자로 보여 줌 | 확장 [MK] |
| VID-36 | 첫 몇 초 끌어들이기 — Hook | 기준 | 시작 몇 초 안에 볼 이유를 먼저 보여 줌 | 확장 [MK] |
| VID-37 | 본편 전 먼저 보여 주기 — Cold Open | 구성 | 제목보다 먼저 핵심 장면을 틀어 둠 | 확장 [MK] |
| VID-38 | 짧은 도입부 — Short Intro | 기준 | 로고·제목 도입을 몇 초 안으로 줄임 | 확장 [MK] |
| VID-39 | 마무리 구간 — Outro | 구성 | 끝에 요약과 다음 영상 안내를 모아 둠 | 확장 [MK] |
| VID-40 | 최종 화면 — End Screen | 모듈 | 끝에 다음 영상·구독 버튼을 얹어 보여 줌 | 확인 [RVYTES] |
| VID-41 | 최종 화면 길이·개수 — End Screen Timing | 기준 | 25초 넘는 영상 끝 5~20초에 요소 4개까지 | 확인 [RVYTES] |
| VID-42 | 최종 화면 겹침 정리 — End Screen Overlap Rule | 기준 | 최종 화면이 뜨면 카드·워터마크는 숨겨짐 | 확인 [RVYTES] |
| VID-43 | 최종 화면 자리 비워 두기 — End Screen Safe Space | 구성 | 끝부분에 버튼 놓을 빈자리를 남겨 찍음 | 확장 [MK] · 대조 [RVYTES] |
| VID-44 | 어린이용 영상 제한 — Made for Kids Limits | 기준 | 어린이용 영상엔 최종 화면·워터마크를 못 씀 | 확인 [RVYTES] · 대조 [RVYTWM] |
| VID-45 | 정보 카드 — Info Cards | 부품 | 영상 중간에 관련 링크를 5개까지 알림 | 확인 [RVYTCD] |
| VID-46 | 챕터 시각 적기 — Chapter Timestamps | 흐름 | 설명란에 00:00부터 3개 이상 구간을 적음 | 확인 [RVYTCH] |
| VID-47 | 구간 제목 카드 — Section Title Card | 부품 | 새 주제가 시작될 때 제목을 잠깐 띄움 | 확장 [MK] |
| VID-48 | 기본 장면 전환 — Cut / Dissolve / Wipe | 기준 | 뜻에 맞춰 바로 넘김·겹침·밀기를 고름 | 확장 [MK] |
| VID-49 | 소리 먼저·나중 전환 — J-cut / L-cut | 구성 | 소리를 화면보다 앞이나 뒤로 이어 붙임 | 확인 [RVWPJL] |
| VID-50 | 끊어 붙이기 — Jump Cut | 구성 | 같은 구도에서 군더더기를 잘라 빠르게 이음 | 확장 [MK] |
| VID-51 | 보조 화면 끼우기 — B-roll Cutaway | 구성 | 말하는 동안 관련 장면을 덮어 보여 줌 | 확장 [MK] |
| VID-52 | 예고편 — Teaser / Preview | 구성 | 뒤에 나올 장면을 짧게 미리 보여 줌 | 확장 [MK] |
| VID-53 | 구독 요청 시점 — Subscribe CTA Timing | 기준 | 가치를 보여 준 뒤에 구독을 부탁함 | 확장 [MK] |
| VID-54 | 협찬 구간 — Sponsor Segment | 구성 | 광고 부분을 본편과 구분해 따로 묶음 | 확장 [MK] · 대조 [RVYTPP] |
| VID-55 | 몽타주 — Montage | 구성 | 짧은 장면을 이어 붙여 시간 흐름을 줄임 | 확장 [MK] |
| VID-56 | 촬영 전 장면 순서 그리기 — Storyboard | 흐름 | 찍기 전에 장면 순서를 그림으로 정함 | 확장 [MK] |
| VID-57 | 썸네일 글자 줄이기 — Thumbnail Text | 기준 | 썸네일 글자를 서너 단어로 크게 줄임 | 확장 [MK] |
| VID-58 | 썸네일 얼굴 클로즈업 — Face Close-up | 구성 | 감정이 보이는 얼굴을 크게 넣어 눈길을 끎 | 확장 [MK] |
| VID-59 | 재생 시간 표시 가림 피하기 — Duration Badge Avoidance | 기준 | 오른쪽 아래 시간 표시 자리에 글자를 안 둠 | 확장 [MK] |
| VID-60 | 비율별 썸네일 구도 — Thumbnail Composition by Ratio | 기준 | 16:9·9:16·1:1마다 핵심을 가운데 모음 | 확인 [RVYTTN] |
| VID-61 | 썸네일 규정 지키기 — Thumbnail Policy | 기준 | 커뮤니티 가이드를 어긴 썸네일을 쓰지 않음 | 확인 [RVYTTN] |
| VID-62 | 제목·썸네일 비교 시험 — Test & Compare | 흐름 | 제목·썸네일 3개를 시청 시간으로 겨룸 | 확인 [RVYTAB] |
| VID-63 | 제목과 썸네일 짝 맞추기 — Title-Thumbnail Pairing | 기준 | 제목 말을 썸네일에 그대로 되풀이하지 않음 | 확장 [MK] |
| VID-64 | 시리즈 썸네일 틀 — Series Thumbnail Template | 구성 | 같은 시리즈는 색·배치를 같게 맞춤 | 확장 [MK] |
| VID-65 | 작은 크기로 미리 보기 — Small-size Check | 흐름 | 휴대폰 목록 크기로 줄여 읽히는지 봄 | 확장 [MK] |
| VID-66 | 대표 장면 고르기 — Cover Frame Selection | 흐름 | 목록에 보일 한 장면을 직접 골라 둠 | 확장 [MK] |
| VID-67 | 쇼츠 세로 3분 — Shorts Format | 기준 | 세로 화면에 3분 안으로 짧게 만듦 | 확인 [RVYTSH] |
| VID-68 | 세로 영상 가림 구역 — Short-form UI Safe Zone | 기준 | 위 계정·아래 설명·오른쪽 버튼 자리를 비움 | 확인 [RVTTAD] |
| VID-69 | 오른쪽 버튼 줄 피하기 — Right Rail Avoidance | 기준 | 세로 영상 오른쪽에 글자·얼굴을 두지 않음 | 확장 [MK] · 대조 [RVTTAD] |
| VID-70 | 릴스 커버 격자 잘림 — Reels Grid Crop | 기준 | 격자에서 잘려도 커버 핵심이 남게 둠 | 확장 [MK] |
| VID-71 | 틱톡 광고 글자 한도 — TikTok Ad Text Limits | 기준 | 광고 계정 이름을 한중일 10자 안으로 맞춤 | 확인 [RVTTAD] |
| VID-72 | 틱톡 광고 화면 비율 — TikTok Ad Aspect Ratio | 기준 | 세로 9:16은 540×960 이상으로 올림 | 확인 [RVTTAD] |
| VID-73 | 가로를 세로로 다시 짜기 — Reframe | 흐름 | 가로 영상을 세로로 옮길 때 주인공을 따라감 | 확장 [MK] |
| VID-74 | 건너뛰기 광고 첫 5초 — Skippable Ad Opening | 기준 | 건너뛰기 전 5초에 브랜드와 요점을 넣음 | 확장 [MK] |
| VID-75 | 촬영 프레임 수 유지 — Native Frame Rate | 기준 | 찍은 프레임 수 그대로 올려 끊김을 막음 | 확인 [RVYTEN] |
| VID-76 | 표준 색 공간 — BT.709 Color Space | 기준 | 일반 화질 영상은 BT.709 색으로 내보냄 | 확인 [RVYTEN] |
| VID-77 | 방송 화면 덧그림 — Stream Overlay | 모듈 | 생방송 화면에 캠·채팅·알림을 겹쳐 짬 | 확인 [RVSLW] |
| VID-78 | 웹캠 틀 — Webcam Frame | 부품 | 방송자 얼굴 캠을 테두리로 감싸 구분함 | 확장 [MK] |
| VID-79 | 방송 채팅 창 — Chat Box Widget | 부품 | 시청자 채팅을 방송 화면 안에 띄움 | 확인 [RVSLW] |
| VID-80 | 후원·구독 알림 — Alert Box | 부품 | 후원·구독이 들어오면 화면에 잠깐 알림 | 확인 [RVSLW] |
| VID-81 | 목표 막대 — Goal Bar | 부품 | 후원·구독 목표까지 얼마 남았는지 보여 줌 | 확인 [RVSLW] |
| VID-82 | 최근 활동 목록 — Event List | 부품 | 최근 후원·팔로우를 차례로 적어 보여 줌 | 확인 [RVSLW] |
| VID-83 | 방송 문구 라벨 — Stream Labels | 부품 | 최근 후원자 이름 같은 글자를 늘 띄움 | 확인 [RVSLW] |
| VID-84 | 후원 내역 흐름 띠 — Tip Ticker | 부품 | 최근 후원 내역을 띠로 흘려 보여 줌 | 확인 [RVSLW] |
| VID-85 | 채팅 한 줄 크게 — Chat Highlight | 부품 | 고른 채팅 한 줄을 방송 화면에 크게 띄움 | 확인 [RVSLW] |
| VID-86 | 이모트 벽 — Emote Wall | 부품 | 채팅 이모트가 화면 가득 떠올랐다 사라짐 | 확인 [RVSLW] |
| VID-87 | 시청자 수 표시 — Viewer Count | 부품 | 지금 보는 사람 수를 방송 화면에 띄움 | 확인 [RVSLW] |
| VID-88 | 영상 재생 신청 — Media Share | 모듈 | 시청자가 신청한 영상을 방송 중 틀어 줌 | 확인 [RVSLW] |
| VID-89 | 후원사 배너 돌리기 — Sponsor Banner | 부품 | 후원사 로고를 번갈아 화면 구석에 띄움 | 확인 [RVSLW] |
| VID-90 | 방송 끝 크레딧 — End Credits | 구성 | 방송 끝에 후원자 이름을 올려 보여 줌 | 확인 [RVSLW] |
| VID-91 | 방송 투표 결과 — Poll Result Graphic | 부품 | 투표 결과를 막대로 방송 화면에 띄움 | 확인 [RVSLW] |
| VID-92 | 방송 전·자리 비움·끝 화면 — Starting Soon / BRB / Ending Scene | 구성 | 방송 시작 전·쉴 때·끝낼 때 화면을 따로 둠 | 확장 [MK] |
| VID-93 | 장면 전환 영상 — Stinger Transition | 부품 | 장면 바꿀 때 짧은 영상을 덮어 틂 | 확인 [RVOBSST] |
| VID-94 | 전환 가림 마스크 — Track Matte Transition | 부품 | 흑백 마스크로 두 장면을 부드럽게 바꿈 | 확인 [RVOBSST] |
| VID-95 | 전환 바꿈 지점 — Transition Point | 기준 | 전환 영상이 화면을 다 덮은 순간에 바꿈 | 확인 [RVOBSST] |
| VID-96 | 장면과 소스 — Scenes and Sources | 구성 | 화면 배치를 장면별로 저장해 바꿔 씀 | 확인 [RVOBSQS] |
| VID-97 | 개인정보 가림 장면 — Privacy Scene | 구성 | 개인 창이 보일 때 덮는 장면으로 바꿈 | 확장 [MK] |
| VID-98 | 방송 화면 틀 크기 — Stream Canvas Resolution | 기준 | 방송 화면 틀을 1920×1080에 맞춰 짬 | 확장 [MK] |
| VID-99 | 로고 짧은 움직임 — Logo Sting | 부품 | 영상 앞뒤에 로고를 짧게 움직여 보여 줌 | 확장 [MK] |
| VID-100 | 움직이는 글자 — Kinetic Typography | 구성 | 말 흐름에 맞춰 글자를 움직여 보여 줌 | 확인 [RVWPKT] |
| VID-101 | 설명 애니메이션 — Explainer Video | 구성 | 도형·아이콘 움직임으로 개념을 풀어 줌 | 확장 [MK] |
| VID-102 | 화이트보드 그리기 — Whiteboard Animation | 구성 | 손으로 그려 가며 설명하는 모양을 씀 | 확장 [MK] |
| VID-103 | 사진 천천히 밀고 당기기 — Ken Burns Effect | 구성 | 멈춘 사진을 천천히 확대·이동해 살림 | 확인 [RVWPKB] |
| VID-104 | 셔터 180도 규칙 — 180-degree Shutter | 기준 | 셔터를 프레임 시간 절반으로 맞춰 찍음 | 확장 [MK] |
| VID-105 | 움직임 번짐 — Motion Blur | 기준 | 빠른 움직임에 번짐을 넣어 덜 끊겨 보임 | 확장 [MK] |
| VID-106 | 끊김 없는 반복 — Seamless Loop | 기준 | 끝이 처음과 이어져 반복돼도 이음새가 없음 | 확장 [MK] |
| VID-107 | 모션 그래픽 템플릿 — Motion Graphics Template (MOGRT) | 모듈 | 편집자가 글자·색만 바꿔 쓰는 움직임 틀 | 확장 [MK] |
| VID-108 | 바꿀 수 있는 칸 열기 — Editable Template Properties | 기준 | 템플릿에서 바꿀 칸만 골라 열어 둠 | 확장 [MK] |
| VID-109 | 길이 따라 늘어나는 구간 — Responsive Design Time | 기준 | 길이를 바꿔도 등장·퇴장 움직임은 그대로 | 확장 [MK] |
| VID-110 | 움직임 따라 붙이기 — Motion Tracking | 구성 | 움직이는 물체에 그래픽을 붙여 따라가게 함 | 확장 [MK] |
| VID-111 | 투명 배경 영상 내보내기 — Alpha Channel Export | 기준 | 겹칠 그래픽을 배경 없이 내보내 얹음 | 확장 [MK] |
| VID-112 | 모션 브랜드 원칙 — Motion Brand Principles | 기준 | 브랜드다운 속도와 움직임 성격을 정해 둠 | 확장 [MK] |
| VID-113 | 하단 자막 들어오고 나가기 — Lower Third In / Out | 기준 | 하단 자막을 짧게 들어오고 빠르게 뺌 | 확장 [MK] · 대조 [RVWPLT] |
| VID-114 | 막대 순위 경주 — Bar Chart Race | 구성 | 시간에 따라 순위 막대가 자리를 바꿈 | 확장 [MK] |
| VID-115 | 화면 녹화 설명 영상 — Screencast Tutorial | 구성 | 화면 녹화에 목소리와 강조를 더해 설명함 | 확장 [MK] |
| VID-116 | 자막 품질 네 기준 — FCC Caption Quality Standards | 기준 | 정확·시간 맞춤·빠짐없음·가림 없음을 지킴 | 확인 [RVFCC] |
| VID-117 | 효과음 괄호 표기 — Sound Effect Brackets | 기준 | 효과음을 대괄호 안에 짧게 적어 알림 | 확인 [RVDCMP] · 대조 [RVNFKO] |
| VID-118 | 화면 밖 화자 표시 — Off-screen Speaker ID | 기준 | 안 보이는 사람 말은 이름을 괄호로 붙임 | 확인 [RVDCMP] · 대조 [RVNFKO] |
| VID-119 | 두 사람 대사 줄표 — Dual Speaker Hyphen | 기준 | 한 자막에 두 사람이면 줄표로 나눔 | 확인 [RVNFKO] |
| VID-120 | 노래 음표 표기 — Lyrics Music Note | 기준 | 노랫말 앞뒤에 음표를 붙여 노래임을 알림 | 확인 [RVDCMP] · 대조 [RVNFKO] |
| VID-121 | 기울임 쓰임 구분 — Italics Rule | 기준 | 영어는 속말에 기울임, 한국어는 안 씀 | 확인 [RVDCMP] · 대조 [RVNFKO] |
| VID-122 | 외침 대문자 — All Caps for Shouting | 기준 | 영어 자막에서 외치는 말만 대문자로 씀 | 확인 [RVDCMP] |
| VID-123 | 화면 글자 번역 자막 — Forced Narrative | 기준 | 줄거리에 필요한 화면 글자만 번역해 띄움 | 확인 [RVNFKO] |
| VID-124 | 청각장애인용 자막 — SDH | 기준 | 소리 정보를 더하고 조금 빠른 속도를 허용 | 확인 [RVNFKO] |
| VID-125 | 자막 파일 형식 — SRT / WebVTT / TTML | 기준 | 올릴 곳에 맞는 자막 파일 형식을 고름 | 확장 [MK] |
| VID-126 | 자동 자막 검수 — Auto-caption Review | 흐름 | 자동 자막을 사람이 고친 뒤 공개함 | 확장 [MK] |
| VID-127 | 실시간 문자 통역 — Live Captioning / CART | 구성 | 생방송 말을 속기사가 바로 글자로 띄움 | 확장 [MK] |
| VID-128 | 발표 화면과 발표자 작은 창 — Slides with Presenter PiP | 구성 | 발표 자료 옆에 발표자 얼굴을 작게 둠 | 확장 [MK] |
| VID-129 | 나란히 인터뷰 — Side-by-side Interview | 구성 | 두 사람을 같은 크기로 나란히 놓음 | 확장 [MK] |
| VID-130 | 질문 화면에 띄우기 — On-screen Q&A | 부품 | 시청자 질문을 골라 화면 아래에 띄움 | 확장 [MK] |
| VID-131 | 후원사 안내 화면 — Sponsor Slate | 부품 | 시작·쉬는 시간에 후원사를 한 장 보여 줌 | 확장 [MK] |
| VID-132 | 발표자 바뀜 배치 — Speaker Change Layout | 흐름 | 말하는 사람이 바뀌면 화면 배치도 바꿈 | 확장 [MK] |
| VID-133 | 무대 뒤 대기실 — Backstage / Green Room | 구성 | 방송 전 출연자가 따로 모여 점검함 | 확장 [MK] |
| VID-134 | 발표자 고정 — Spotlight Speaker | 기준 | 주 발표자를 모두에게 크게 고정해 보여 줌 | 확장 [MK] |
| VID-135 | 기술 문제 안내 화면 — Technical Difficulties Slate | 부품 | 방송 사고 때 잠시 기다려 달라고 띄움 | 확장 [MK] |
| VID-136 | 여러 카메라 전환 — Multicam Switching | 흐름 | 여러 카메라 중 지금 볼 화면을 골라 넘김 | 확장 [MK] |
| VID-137 | 다시 보기 다듬기 — Replay Trim | 흐름 | 녹화본에서 대기 시간·사고 구간을 잘라 냄 | 확장 [MK] |
