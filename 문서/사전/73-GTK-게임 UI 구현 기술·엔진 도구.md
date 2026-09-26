# 73. 게임 UI 구현 기술·엔진 도구

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 73번 분류 GTK다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

게임 엔진과 게임용 웹 엔진에서 UI를 실제로 만드는 기술·부품·규칙을 담는다. 엔진별 UI 체계, 해상도·DPI 대응, 9분할 이미지, 아틀라스와 그리기 비용, 글꼴과 현지화, 초점 이동, 데이터 연결, 화면 관리 구조를 모바일과 PC 양쪽 기준으로 정리한다. React 같은 웹 프런트엔드 일반 기술과, 플레이어가 보는 설정 화면 자체(GIO)나 연출 감각(GFX)은 담지 않는다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| GTK-01 | 유니티 기본 UI — Unity UI (uGUI) | 기준 | 게임 오브젝트로 쌓는 유니티 UI, 장면 속 UI도 가능 | 확인 [QTCANVAS] |
| GTK-02 | 유니티 UI 툴킷 — UI Toolkit (UXML·USS) | 기준 | 구조 파일과 모양 파일을 나눠 웹처럼 만드는 유니티 UI | 확인 [QTUITK] |
| GTK-03 | UI 빌더 — UI Builder | 부품 | UXML·USS를 끌어 놓으며 만드는 편집 화면 | 확인 [QTUITK] |
| GTK-04 | 유니티 UI 체계 고르기 — uGUI vs UI Toolkit | 기준 | 장면 속 UI와 기존 자산은 uGUI, 새 메뉴 화면은 UI Toolkit 검토 | 확장 [MK] · 대조 [QTUITK] |
| GTK-05 | 언리얼 기본 UI — UMG (Unreal Motion Graphics) | 기준 | 위젯 블루프린트로 그리는 언리얼 UI | 확인 [QTUMGBP] |
| GTK-06 | 언리얼 공용 UI 플러그인 — Common UI | 기준 | 메뉴가 여러 겹이고 패드 조작이 많은 게임에 | 확인 [QIUECUI] |
| GTK-07 | 언리얼 바탕 UI 틀 — Slate | 기준 | 편집기와 UMG 밑에서 도는 C++ UI 틀, 특수 위젯 만들 때 | 확장 [MK] · 대조 [QTSLATE] |
| GTK-08 | 고도 UI 노드 체계 — Godot Control | 기준 | 앵커와 컨테이너로 짜는 고도 엔진 UI | 확인 [QTGDANCH] |
| GTK-09 | 페이저 게임 UI — Phaser | 기준 | 브라우저 2D 게임에서 캔버스 위에 직접 그리는 화면 부품 | 확장 [MK] · 대조 [QTPHNINE] |
| GTK-10 | PixiJS 장면 부품 — PixiJS | 기준 | 웹에서 빠르게 그리는 2D 화면 틀, 버튼 동작은 직접 구현 | 확장 [MK] · 대조 [QTPXNINE] |
| GTK-11 | 코코스 크리에이터 UI — Cocos Creator | 기준 | 아시아 모바일 게임에서 흔한 엔진의 UI 부품 | 확인 [QTCCWID] |
| GTK-12 | 데폴드 GUI — Defold GUI | 기준 | 가벼운 모바일·웹 게임용 노드 방식 UI | 확인 [QTDFGUI] |
| GTK-13 | 베비 UI — Bevy UI | 기준 | 러스트 엔진에서 플렉스·격자 배치로 짜는 UI | 확장 [MK] |
| GTK-14 | HTML·CSS 방식 게임 UI 라이브러리 — RmlUi | 기준 | C++ 게임에 웹 문법 비슷한 UI를 무료로 붙일 때 | 확인 [QTRMLUI] |
| GTK-15 | 웹 기술 게임 UI 미들웨어 — Coherent Gameface | 기준 | HTML·자바스크립트로 콘솔·PC 게임 UI를 만드는 상용 도구 | 확인 [QTGFACE] |
| GTK-16 | 플래시 기반 게임 UI의 역사 — Scaleform | 기준 | 예전 대작 게임의 UI 방식, 지원이 끝나 새로 고르지 않음 | 확장 [MK] |
| GTK-17 | 화면 맨 앞 캔버스 — Screen Space Overlay | 구성 | 장면 위에 UI를 늘 맨 앞에 그림 | 확인 [QTCANVAS] |
| GTK-18 | 카메라 캔버스 — Screen Space Camera | 구성 | 카메라 설정을 따르는 UI, 3D 효과를 UI 사이에 끼울 때 | 확인 [QTCANVAS] |
| GTK-19 | 월드 공간 캔버스 — World Space Canvas | 구성 | 장면 속 물건처럼 놓는 UI, 머리 위 이름표·게시판 | 확인 [QTCANVAS] |
| GTK-20 | UI 그리는 순서 — Hierarchy order·Sort Order | 기준 | 목록 아래쪽 부품이 위에 그려지는 규칙 | 확인 [QTCANVAS] |
| GTK-21 | 기준 해상도 — Reference Resolution | 기준 | 한 크기로 그리고 실제 화면에 맞춰 키움 | 확인 [QTSCALER] |
| GTK-22 | 캔버스 배율기 — Canvas Scaler (Scale With Screen Size) | 부품 | 화면이 크면 UI도 같은 비율로 커짐 | 확인 [QTSCALER] |
| GTK-23 | 너비·높이 맞춤 비율 — Match Width Or Height | 기준 | 너비와 높이 중 무엇을 기준으로 키울지 정함 | 확인 [QTSCALER] |
| GTK-24 | 넓히기·자르기 맞춤 — Expand·Shrink | 기준 | 화면 비율이 다를 때 캔버스를 늘리거나 잘라 맞춤 | 확인 [QTSCALER] |
| GTK-25 | 실제 크기 고정 — Constant Physical Size | 기준 | 기기 DPI로 손가락이 누를 실제 크기를 지킴 | 확인 [QTSCALER] |
| GTK-26 | 스프라이트 픽셀 대응 — Reference Pixels Per Unit | 기준 | 그림 한 점이 UI 한 칸에 맞게 번짐 막기 | 확인 [QTSCALER] |
| GTK-27 | 언리얼 DPI 배율 규칙 — DPI Scale Rule (Shortest Side) | 기준 | 화면의 짧은 변을 기준으로 UI 배율 정하기 | 확인 [QTUEDPI] |
| GTK-28 | DPI 배율 곡선 — DPI Curve | 부품 | 해상도마다 몇 배로 키울지 그래프로 지정 | 확인 [QTUEDPI] |
| GTK-29 | 앱 전체 UI 배율 — Application Scale | 기준 | 해상도 규칙과 별개로 UI 전체 크기 조정 | 확인 [QTUEDPI] |
| GTK-30 | 기준 해상도에서 배율 1로 작업 — Design at DPI Scale 1.0 | 기준 | 한 해상도를 정해 모든 위젯을 그 기준으로 | 확인 [QTUMGBP] |
| GTK-31 | 고도 늘이기 모드 — Stretch Mode (canvas_items·viewport) | 기준 | 기준 크기 화면을 창 크기에 맞추는 방식 | 확인 [QTGDRES] |
| GTK-32 | 고도 비율 유지 방식 — Stretch Aspect (keep·keep_width·expand) | 기준 | 검은 띠를 둘지 화면을 넓혀 채울지 | 확인 [QTGDRES] |
| GTK-33 | 정수 배율 — Integer Scaling | 기준 | 도트 그림을 2배·3배로만 키워 번짐 막기 | 확인 [QTGDRES] |
| GTK-34 | 자동 배율 위 추가 배율 — Stretch Scale | 구성 | 계산된 크기에 플레이어 조정 값을 곱함 | 확인 [QTGDRES] |
| GTK-35 | 두 방향 대응 기준 해상도 — Square base resolution | 기준 | 세로·가로 모두 받으려면 정사각 기준 크기로 | 확인 [QTGDRES] |
| GTK-36 | 사각 영역 변환 — RectTransform | 부품 | UI 부품의 위치·크기·기준점을 담는 틀 | 확인 [QTRECT] |
| GTK-37 | 앵커 — Anchors | 기준 | 부모 가장자리에 붙여 화면 크기 변화를 견딤 | 확인 [QTRECT] · 대조 [QTUMGANC] |
| GTK-38 | 피벗 — Pivot | 기준 | 돌리고 키울 때 중심이 되는 점 | 확인 [QTRECT] |
| GTK-39 | 늘이기 앵커 — Stretch Anchors | 구성 | 앵커를 벌려 부모와 함께 늘어나게 | 확인 [QTRECT] |
| GTK-40 | 언리얼 캔버스 패널 앵커 — Canvas Panel Anchors | 구성 | 위젯 자리를 화면 비율로 정하고 여러 크기로 미리 보기 | 확인 [QTUMGANC] |
| GTK-41 | 고도 앵커와 오프셋 — Anchors·Offsets | 구성 | 네 가장자리 거리를 부모 기준 비율로 | 확인 [QTGDANCH] |
| GTK-42 | 코코스 정렬 부품 — Widget (Align Mode) | 부품 | 부모 가장자리에 붙이기, 매 프레임 정렬은 움직임을 막음 | 확인 [QTCCWID] |
| GTK-43 | 데폴드 맞춤 방식 — Adjust Mode (Fit·Zoom·Stretch) | 기준 | 비율 다른 화면에 맞추거나 채우거나 늘리기 | 확인 [QTDFGUI] |
| GTK-44 | 레이아웃 그룹 — Horizontal·Vertical·Grid Layout Group | 부품 | 자식 부품을 줄이나 격자로 자동 배치 | 확인 [QTAUTOLAY] |
| GTK-45 | 레이아웃 요소 크기 값 — Min·Preferred·Flexible | 기준 | 최소·원하는·남는 공간 크기 규칙 | 확인 [QTAUTOLAY] |
| GTK-46 | 내용 맞춤 크기 — Content Size Fitter | 부품 | 글 길이에 맞춰 상자 크기를 자동 조정 | 확인 [QTAUTOLAY] |
| GTK-47 | 비율 맞춤 — Aspect Ratio Fitter | 부품 | 가로세로 비율을 지키며 부모 안에 맞춤 | 확인 [QTAUTOLAY] |
| GTK-48 | 고도 컨테이너 — HBox·VBox·Grid·Margin Container | 부품 | 자식을 자동으로 줄 세우는 상자 | 확인 [QTGDCONT] |
| GTK-49 | 고도 크기 플래그 — Fill·Expand·Stretch Ratio | 기준 | 컨테이너 안 남는 공간을 나누는 규칙 | 확인 [QTGDCONT] |
| GTK-50 | 흐름 컨테이너 — Flow Container | 부품 | 자리가 모자라면 다음 줄로 넘김 | 확인 [QTGDCONT] |
| GTK-51 | 비율 유지 컨테이너 — Aspect Ratio Container | 부품 | 자식 비율을 자동으로 지킴 | 확인 [QTGDCONT] |
| GTK-52 | 언리얼 슬롯 크기 — Auto·Fill | 기준 | 필요한 만큼 또는 남는 만큼 차지 | 확인 [QTUMGBP] |
| GTK-53 | 배율 상자 — Scale Box | 부품 | 오래 유지할 크기 조절은 이 상자로 | 확인 [QTUMGBP] |
| GTK-54 | 렌더 변환은 잠깐만 — Render Transform | 기준 | 움직이는 연출에만, 고정 크기에는 쓰지 않음 | 확인 [QTUMGBP] |
| GTK-55 | 9분할 이미지 — 9-slice | 기준 | 모서리는 그대로 두고 가운데만 늘려 창·버튼 만들기 | 확인 [QT9SLICE] |
| GTK-56 | 늘이기·반복 분할 — Sliced·Tiled | 구성 | 테두리를 늘릴지 무늬로 반복할지 | 확인 [QT9SLICE] |
| GTK-57 | 고도 나인패치 — NinePatchRect | 부품 | 3×3 격자로 나눠 늘리기·반복·맞춤 반복 | 확인 [QTGD9P] |
| GTK-58 | 페이저 나인슬라이스 — NineSlice (3-slice) | 부품 | 웹 게임 창·가로 막대, 잘린 텍스처는 못 씀 | 확인 [QTPHNINE] |
| GTK-59 | PixiJS 나인슬라이스 스프라이트 — NineSliceSprite | 부품 | 웹 2D 버튼·패널의 장식 테두리 유지 | 확인 [QTPXNINE] |
| GTK-60 | 데폴드 9분할 — slice-9 | 부품 | GUI 상자 노드의 테두리 유지 | 확인 [QTDFGUI] |
| GTK-61 | 언리얼 브러시 여백 — Slate Brush Margin (Box·Border) | 부품 | 위젯 그림의 9분할 경계 값 | 확장 [MK] |
| GTK-62 | 채워지는 이미지 — Image Filled | 부품 | 원이나 막대 모양으로 차오르는 그림, 재사용 대기 표시에 | 확장 [MK] |
| GTK-63 | 스프라이트 아틀라스 — Sprite Atlas | 부품 | 여러 그림을 한 장에 모아 그리기 횟수 줄임 | 확인 [QTATLAS] |
| GTK-64 | 저사양용 아틀라스 변형 — Variant Atlas | 구성 | 메모리 작은 기기에 저해상도 사본 싣기 | 확인 [QTATLAS] |
| GTK-65 | 그리기 묶음 — Batching·Draw Call | 기준 | 같은 그림·재질끼리 한 번에 그려 부담 줄임 | 확인 [QTDFGUI] · 대조 [QTATLAS] |
| GTK-66 | 겹쳐 그리기 줄이기 — Overdraw | 기준 | 투명한 부품을 여러 겹 쌓지 않기 | 확인 [QTUIOPT] |
| GTK-67 | 캔버스 나누기 — Canvas Splitting | 구성 | 자주 바뀌는 부품을 따로 떼어 다시 계산 줄임 | 확인 [QTUIOPT] |
| GTK-68 | 레이아웃 재계산 — Layout Rebuild | 기준 | 크기가 바뀌면 프레임 끝에 다시 배치, 잦으면 느림 | 확인 [QTAUTOLAY] · 대조 [QTUIOPT] |
| GTK-69 | 레이아웃 그룹 줄이기 — Avoid nested Layout Groups | 기준 | 자동 배치가 겹칠수록 계산이 늘어남 | 확인 [QTUIOPT] |
| GTK-70 | 누름 판정 끄기 — Raycast Target | 기준 | 누르지 않는 부품은 판정에서 빼기 | 확인 [QTUIOPT] |
| GTK-71 | 누름 판정기 — Graphic Raycaster | 부품 | 어떤 UI를 눌렀는지 판정, 누를 캔버스에만 둠 | 확인 [QTUIOPT] |
| GTK-72 | 캔버스 숨기기 — Disable Canvas | 구성 | 안 보이는 화면은 그리기 명령을 멈춤 | 확인 [QTUIOPT] |
| GTK-73 | 전체 화면 UI 뒤 장면 끄기 — Hide scene behind fullscreen UI | 구성 | 메뉴가 화면을 가리면 3D 장면 그리기 멈춤 | 확인 [QTUIOPT] |
| GTK-74 | UI 오브젝트 풀링 — Object Pooling | 구성 | 부품을 지우지 않고 꺼 두었다가 다시 씀 | 확인 [QTUIOPT] |
| GTK-75 | 스크롤 목록 칸 재활용 — Recycling Scroll View | 구성 | 보이는 칸만 만들고 돌려 써 긴 목록을 가볍게 | 확장 [MK] · 대조 [QTUIOPT] |
| GTK-76 | 가림 틀 — Mask·RectMask2D | 부품 | 스크롤 칸 밖 내용을 잘라 숨김 | 확장 [MK] |
| GTK-77 | 다시 그리기 저장 — Invalidation Box·Retainer Box | 구성 | 바뀌지 않은 위젯은 다시 그리지 않음 | 확장 [MK] |
| GTK-78 | 매 프레임 확인 대신 이벤트 — Event-driven UI update | 기준 | 값이 바뀔 때만 화면을 고침 | 확인 [QTUMGBP] |
| GTK-79 | 재질보다 텍스처 — Textures over Materials | 기준 | UI 그림은 가벼운 텍스처로 | 확인 [QTUMGBP] |
| GTK-80 | 그림 파일 여백 줄이기 — Texture Padding | 기준 | 그림 안 빈 여백을 없애고 조각 그림으로 나눔 | 확인 [QTUMGBP] |
| GTK-81 | UI 텍스처 메모리 설정 — 압축·밉맵 끄기 | 기준 | 화면에 붙는 UI 그림은 작은 사본이 필요 없음 | 확장 [MK] · 대조 [QTATLAS] |
| GTK-82 | 애니메이터 대신 코드 트윈 — Animator vs Tween | 기준 | 애니메이터는 값이 그대로여도 매 프레임 다시 계산 | 확인 [QTUIOPT] |
| GTK-83 | 프레임 디버거 — Frame Debugger | 부품 | 한 프레임을 그리기 단계별로 멈춰 보기 | 확인 [QTFRAMEDB] |
| GTK-84 | 위젯 리플렉터 — Widget Reflector | 부품 | 위젯 구조와 성능 문제 살피기 | 확인 [QTUMGBP] |
| GTK-85 | 언리얼 인사이트 UI 추적 — Unreal Insights·Slate Insights | 부품 | 위젯 갱신과 그리기 시간을 기록해 비교 | 확장 [MK] |
| GTK-86 | 거리장 글꼴 — SDF Font | 기준 | 크기를 바꾸거나 멀어져도 가장자리가 매끈한 글자 | 확인 [QTTMPSDF] |
| GTK-87 | 비트맵 글꼴 — Bitmap Font | 부품 | 미리 구운 글자 그림, 숫자가 자주 바뀔 때 빠름 | 확인 [QTPXTEXT] · 대조 [QTTMPSDF] |
| GTK-88 | 웹 게임 글자 방식 고르기 — Text·BitmapText·HTMLText | 기준 | 자주 바뀌면 비트맵, 서식이 복잡하면 HTML | 확인 [QTPXTEXT] |
| GTK-89 | 미리 굽는·쓸 때 굽는 글꼴 — Static·Dynamic Font Asset | 기준 | 쓸 글자를 미리 굽거나 쓸 때마다 추가 | 확인 [QTTMPDYN] |
| GTK-90 | 글꼴 대체 목록 — Font Fallback | 구성 | 없는 글자를 다음 글꼴에서 찾아 채움 | 확인 [QTTMPFB] |
| GTK-91 | 한중일 글꼴 대체와 용량 — CJK Font Fallback | 기준 | 한글·한자는 글자 수가 많아 동적 글꼴로, 빌드 용량 주의 | 확장 [MK] · 대조 [QTTMPDYN] |
| GTK-92 | 빠진 글자 표시 — Missing Glyph (tofu) | 기준 | 끝까지 못 찾으면 네모가 뜸, 출시 전 전체 글자 검사 | 확인 [QTTMPFB] |
| GTK-93 | 글자 외곽선·그림자 — Outline·Underlay | 구성 | 밝은 배경 위 글자도 읽히게 테두리 넣기 | 확장 [MK] · 대조 [QTGDBB] |
| GTK-94 | 서식 태그 — Rich Text Tags (color·size·b) | 구성 | 문장 안 일부만 색·크기 바꾸기 | 확인 [QTTMPRT] · 대조 [QTGDBB] |
| GTK-95 | 문장 속 아이콘 — Inline Sprite (sprite·img) | 구성 | 문장 사이에 버튼·재화 그림 넣기 | 확인 [QTTMPRT] · 대조 [QTGDBB] |
| GTK-96 | 문장 속 링크 — link·url tag | 구성 | 용어를 누르면 설명 창 열기 | 확인 [QTTMPRT] · 대조 [QTGDBB] |
| GTK-97 | 글자 효과 태그 — wave·shake·rainbow | 구성 | 대사 글자를 흔들거나 물결치게 | 확인 [QTGDBB] |
| GTK-98 | 언어별 글자 모양 지정 — lang tag | 구성 | 같은 한자라도 언어에 맞는 모양으로 | 확인 [QTGDBB] |
| GTK-99 | 문자열 테이블 — String Table | 부품 | 화면 글을 키와 언어별 값으로 분리 | 확인 [QTLOC] |
| GTK-100 | 에셋 테이블 — Asset Table | 부품 | 언어별로 그림·소리를 바꿔 끼움 | 확인 [QTLOC] |
| GTK-101 | 엔진 복수형 처리 — Smart Strings·tr_n | 구성 | 수량에 맞는 문구를 엔진이 골라 넣음 | 확인 [QTLOC] · 대조 [QTGDI18N] |
| GTK-102 | 번역 문맥 — Translation Context | 기준 | 같은 영어 낱말도 뜻마다 다른 번역 | 확인 [QTGDI18N] |
| GTK-103 | 자동 번역 적용 — Auto Translate | 기준 | 라벨 글이 키와 같으면 저절로 번역 | 확인 [QTGDI18N] |
| GTK-104 | 언리얼 현지화 대시보드 — Localization Dashboard | 모듈 | 글 모으기·내보내기·가져오기·묶기를 한 곳에서 | 확인 [QTUELOC] |
| GTK-105 | 번역 파일 주고받기 — PO·XLIFF·CSV | 기준 | 번역 업체 도구와 주고받는 파일 형식 | 확인 [QTUELOC] · 대조 [QTLOC] |
| GTK-106 | 의사 현지화 — Pseudo-localization | 구성 | 가짜 긴 번역으로 넘침·번역 누락을 미리 찾기 | 확인 [QTPSEUDO] · 대조 [QTGDI18N] |
| GTK-107 | 오른쪽→왼쪽 자동 반전 — RTL Layout Mirroring | 구성 | 아랍어에서 앵커·여백을 좌우로 뒤집음 | 확인 [QTGDI18N] |
| GTK-108 | 아랍어 글자 이어 쓰기 지원 확인 — Text Shaping | 기준 | 엔진 글자 처리가 이어지는 글자 모양을 지원하는지 | 확장 [MK] |
| GTK-109 | 넘치는 글 자동 축소 — Auto Size | 구성 | 넘치면 글자를 줄이되 최소 크기 지킴 | 확장 [MK] |
| GTK-110 | 넘침 처리 방식 — Overflow·Ellipsis·Truncate | 기준 | 말줄임·자르기·다음 페이지 중 고르기 | 확장 [MK] |
| GTK-111 | 언어별 자간·행간 — Character·Line Spacing | 기준 | 언어마다 글자 사이와 줄 사이를 따로 | 확장 [MK] |
| GTK-112 | 언어 바꾸면 즉시 다시 불러오기 — Locale Changed Event | 구성 | 설정에서 언어를 바꾸면 화면 글을 새로 채움 | 확장 [MK] |
| GTK-113 | 이벤트 시스템 — EventSystem | 부품 | 누르기·끌기를 알맞은 부품에 전달 | 확장 [MK] |
| GTK-114 | 선택 이동 방식 — Navigation (Automatic·Explicit) | 기준 | 방향키로 옮길 곳을 자동 또는 직접 지정 | 확인 [QTNAV] |
| GTK-115 | 이동 경로 보기 — Navigation Visualize | 부품 | 편집기에서 초점 이동 화살표 확인 | 확인 [QTNAV] |
| GTK-116 | 초점 이웃 — Focus Neighbor·Next·Previous | 구성 | 방향키·탭 순서를 부품마다 지정 | 확인 [QTGDNAV] |
| GTK-117 | 첫 초점 잡기 — grab_focus | 구성 | 패드로 메뉴를 열면 첫 버튼에 초점 | 확인 [QTGDNAV] |
| GTK-118 | UI 전용 입력 동작 분리 — ui_up·ui_accept | 기준 | 메뉴 조작 키를 게임 조작에 섞지 않음 | 확인 [QTGDNAV] |
| GTK-119 | 입력 라우팅 — Common UI Input Routing | 구성 | 겹친 메뉴 중 맨 위 화면만 입력을 받게 | 확인 [QIUECUI] |
| GTK-120 | 패드 방향 이동 관리 — Cardinal Navigation | 구성 | 패드 십자키 이동을 엔진이 처리 | 확인 [QIUECUI] |
| GTK-121 | 기기별 버튼 그림 연결 — Controller Data Asset | 부품 | 연결된 패드에 맞는 버튼 그림을 엔진이 골라 줌 | 확인 [QIUECUI] |
| GTK-122 | 중복 입력 막기 — Input Debounce·Block during transition | 기준 | 전환 중 두 번 눌림과 뒤 화면 눌림 막기 | 확장 [MK] |
| GTK-123 | UI 소리 연결 지점 — UI Sound Hooks | 구성 | 누름·초점·열림 이벤트에 소리를 한 곳에서 붙임 | 확장 [MK] |
| GTK-124 | 재사용 위젯·프리팹 — User Widget·Prefab | 부품 | 한 번 만든 버튼·창을 여러 화면에서 씀 | 확인 [QTUMGBP] |
| GTK-125 | 끼워 쓰는 템플릿 노드 — Template Node | 부품 | 다른 GUI 파일을 불러와 끼워 씀 | 확인 [QTDFGUI] |
| GTK-126 | 데이터 바인딩 — Runtime Data Binding | 구성 | 게임 값이 바뀌면 화면 글이 저절로 바뀜 | 확인 [QTUIBIND] |
| GTK-127 | 뷰모델 — UMG Viewmodel (MVVM) | 구성 | 게임 데이터와 화면 그림을 나눠 맡김 | 확인 [QTUEMVVM] |
| GTK-128 | 바인딩 방향 — One Way·Two Way | 기준 | 값이 한쪽으로만 가는지 서로 오가는지 | 확인 [QTUEMVVM] |
| GTK-129 | 값 변환 함수 — Conversion Function·Converter | 구성 | 숫자를 글자나 색으로 바꿔 보여줌 | 확인 [QTUEMVVM] · 대조 [QTUIBIND] |
| GTK-130 | 화면 쌓기 — Activatable Widget Stack | 구성 | 열린 메뉴를 쌓고 뒤로 가기로 하나씩 닫기 | 확장 [MK] · 대조 [QIUECUI] |
| GTK-131 | 팝업 관리자 — Popup Manager (우선순위·대기열) | 구성 | 여러 알림 창을 중요도 순서로 하나씩 | 확장 [MK] |
| GTK-132 | 화면 전환 관리자 — Screen Flow Manager | 구성 | 화면 열고 닫기와 로딩을 한 곳에서 | 확장 [MK] |
| GTK-133 | UI 상태 머신 — UI State Machine | 구성 | 화면 상태를 정해 둔 길로만 바꿈 | 확장 [MK] |
| GTK-134 | 주소로 에셋 불러오기 — Addressables | 구성 | 필요할 때만 UI 그림을 불러오고 내려놓기 | 확인 [QTADDR] |
| GTK-135 | 원격 UI 콘텐츠 받기 — Remote Content | 구성 | 앱 업데이트 없이 배너·이벤트 그림 교체 | 확인 [QTADDR] |
| GTK-136 | 유니티 스타일시트 — USS | 부품 | CSS처럼 UI 모양을 파일로 따로 관리 | 확인 [QTUSS] |
| GTK-137 | 스타일 변수 — USS Custom Properties | 기준 | 색·간격 값을 한 곳에서 바꿈 | 확인 [QTUSS] |
| GTK-138 | 테마 스타일시트 — Theme Style Sheet (TSS) | 구성 | 게임 전체 겉모습을 파일 하나로 교체 | 확인 [QTUSS] |
| GTK-139 | 고도 테마 — Theme (StyleBox·Font·Color) | 부품 | 부모에서 자식으로 퍼지는 모양 묶음 | 확인 [QTGDTHEM] |
| GTK-140 | 테마 변형 — Type Variation | 구성 | 같은 라벨에 제목용 모양을 따로 둠 | 확인 [QTGDTHEM] |
| GTK-141 | 공용 스타일 자산 — Common UI Style Assets | 부품 | 버튼·글자 모양을 여러 화면이 함께 씀 | 확인 [QIUECUI] |
| GTK-142 | UI 스킨 교체 — Skin Swap | 구성 | 시즌·이벤트마다 뼈대는 두고 겉모습만 바꿈 | 확장 [MK] |
| GTK-143 | 명암 전환 없는 게임 테마 구조 — Single-tone game theme structure | 기준 | 한 가지 배경 톤을 기준으로 색 값을 설계 | 확장 [MK] |
| GTK-144 | 안전영역 틀 — Safe Area (Screen.safeArea) | 구성 | 노치·둥근 모서리를 피해 UI를 틀 하나 안에 | 확인 [UNISAFE] |
| GTK-145 | 언리얼 안전 구역 위젯 — Safe Zone | 부품 | TV 가장자리·노치 안쪽으로 자식을 줄임 | 확인 [UNRSAFE] |
| GTK-146 | 기기별 미리 보기 — Screen Size Preview·Debug Safe Zone | 구성 | 편집기에서 기기와 방향을 바꿔 보기 | 확인 [UNRSAFE] · 대조 [QTUMGANC] |
| GTK-147 | 노치 모양 목록 받기 — Display Cutout API | 부품 | 가려진 부분을 사각형 목록으로 받아 피함 | 확장 [MK] |
| GTK-148 | 창 크기 변경 대응 — Window Resize Handling | 구성 | PC 창 크기가 바뀌면 다시 정렬 | 확인 [QTCCWID] |
| GTK-149 | 비율별 배치 파일 — Layouts per orientation | 구성 | 세로·가로마다 다른 배치로 바꿔 끼움 | 확장 [MK] · 대조 [QTDFGUI] |
| GTK-150 | 장면 속 이름표 카메라 향하기 — Billboard World UI | 구성 | 머리 위 표시가 늘 카메라 쪽을 봄 | 확장 [MK] |
| GTK-151 | UI 애니메이션 편집기 — UMG Animation·Timeline | 부품 | 위젯 움직임을 편집기에서 키로 찍음 | 확장 [MK] |
| GTK-152 | UI 자동화 테스트 — UI Automation Test | 흐름 | 버튼 누르기를 자동으로 돌려 깨짐 찾기 | 확장 [MK] · 대조 [QTUITK] |
| GTK-153 | 해상도별 스크린샷 비교 — Resolution Screenshot Sweep | 흐름 | 여러 기기 크기로 찍어 겹침·잘림 비교 | 확장 [MK] |
| GTK-154 | 디자이너→엔지니어 전달 — Figma to Engine Handoff | 흐름 | 시안의 치수·그림을 엔진 부품으로 옮기기 | 확장 [MK] |
