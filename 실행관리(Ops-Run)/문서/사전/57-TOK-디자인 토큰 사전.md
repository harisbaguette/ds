# 57. 디자인 토큰 사전

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 57번 분류 TOK다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

화면에 쓰는 모든 값에 붙이는 이름표 목록이다. 이름과 역할만 고정하고 값은 프로젝트·테마마다 갈아 끼우며, 여기 없는 값을 코드에 바로 적는 것은 금지로 본다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| TOK-01 | 색 — primary | 기준 | 제품에서 가장 중요한 행동과 강조에 쓰는 대표 색 | 확장 [MK] |
| TOK-02 | 색 — on-primary | 기준 | primary 면 위에 올라가는 글자와 아이콘 색 | 확장 [MK] |
| TOK-03 | 색 — primary-container | 기준 | 대표 색 계열의 옅은 배경 면 | 확장 [MK] |
| TOK-04 | 색 — on-primary-container | 기준 | 옅은 대표 색 면 위 글자 색 | 확장 [MK] |
| TOK-05 | 색 — secondary | 기준 | 대표 색 다음으로 쓰는 보조 강조 색 | 확장 [MK] |
| TOK-06 | 색 — on-secondary | 기준 | 보조 강조 면 위 글자 색 | 확장 [MK] |
| TOK-07 | 색 — secondary-container | 기준 | 보조 색 계열의 옅은 배경 면 | 확장 [MK] |
| TOK-08 | 색 — on-secondary-container | 기준 | 옅은 보조 색 면 위 글자 색 | 확장 [MK] |
| TOK-09 | 색 — tertiary | 기준 | 태그·차트 보조처럼 세 번째로 쓰는 강조 색 | 확장 [MK] |
| TOK-10 | 색 — tertiary-container | 기준 | 세 번째 강조 색의 옅은 배경 면 | 확장 [MK] |
| TOK-11 | 색 — background | 기준 | 화면 가장 바닥에 깔리는 색 | 확장 [MK] |
| TOK-12 | 색 — on-background | 기준 | 바닥 색 위 기본 글자 색 | 확장 [MK] |
| TOK-13 | 색 — surface | 기준 | 카드·패널처럼 내용이 올라가는 면의 기본 색 | 확장 [MK] |
| TOK-14 | 색 — on-surface | 기준 | 면 위 기본 글자·아이콘 색 | 확장 [MK] |
| TOK-15 | 색 — surface-variant | 기준 | 같은 면 안에서 한 단계 구분되는 면 색 | 확장 [MK] |
| TOK-16 | 색 — on-surface-variant | 기준 | 덜 중요한 보조 글자 색 | 확장 [MK] |
| TOK-17 | 색 — surface-container 단계 | 기준 | 겹쳐 쌓이는 면의 밝기 단계 묶음 | 확장 [MK] |
| TOK-18 | 색 — outline | 기준 | 부품 테두리와 경계선 색 | 확장 [MK] |
| TOK-19 | 색 — outline-variant | 기준 | 약하게만 나누는 구분선 색 | 확장 [MK] |
| TOK-20 | 색 — error | 기준 | 오류와 파괴적 행동에 쓰는 색 | 확장 [MK] |
| TOK-21 | 색 — on-error | 기준 | 오류 면 위 글자 색 | 확장 [MK] |
| TOK-22 | 색 — error-container | 기준 | 오류 안내 상자의 옅은 배경 색 | 확장 [MK] |
| TOK-23 | 색 — warning | 기준 | 주의와 경고에 쓰는 색 | 확장 [MK] |
| TOK-24 | 색 — warning-container | 기준 | 주의 안내 상자의 옅은 배경 색 | 확장 [MK] |
| TOK-25 | 색 — success | 기준 | 성공과 완료에 쓰는 색 | 확장 [MK] |
| TOK-26 | 색 — success-container | 기준 | 성공 안내 상자의 옅은 배경 색 | 확장 [MK] |
| TOK-27 | 색 — info | 기준 | 참고 안내에 쓰는 색 | 확장 [MK] |
| TOK-28 | 색 — info-container | 기준 | 참고 안내 상자의 옅은 배경 색 | 확장 [MK] |
| TOK-29 | 색 — inverse-surface | 기준 | 토스트처럼 주변과 반대로 칠하는 면 색 | 확장 [MK] |
| TOK-30 | 색 — inverse-on-surface | 기준 | 반전 면 위 글자 색 | 확장 [MK] |
| TOK-31 | 색 — inverse-primary | 기준 | 반전 면에서 쓰는 대표 색 | 확장 [MK] |
| TOK-32 | 색 — scrim | 기준 | 모달 뒤를 덮어 어둡게 하는 막 색 | 확장 [MK] |
| TOK-33 | 색 — shadow | 기준 | 그림자를 그릴 때 쓰는 색 | 확장 [MK] |
| TOK-34 | 색 — link | 기준 | 누르면 이동하는 글자 링크 색 | 확장 [MK] |
| TOK-35 | 색 — link-visited | 기준 | 이미 한 번 다녀온 링크 색 | 확장 [MK] |
| TOK-36 | 색 — focus-ring | 기준 | 키보드로 초점이 간 부품을 감싸는 테두리 색 | 확장 [MK] |
| TOK-37 | 색 — selection | 기준 | 글자를 끌어 선택했을 때 깔리는 배경 색 | 확장 [MK] |
| TOK-38 | 색 — disabled | 기준 | 지금 쓸 수 없는 부품의 면과 글자 색 | 확장 [MK] |
| TOK-39 | 색 — placeholder | 기준 | 입력 전 예시 글자 색 | 확장 [MK] |
| TOK-40 | 색 — divider | 기준 | 목록·구역을 나누는 얇은 선 색 | 확장 [MK] |
| TOK-41 | 색 — overlay | 기준 | 위에 덮는 반투명 층의 색 | 확장 [MK] |
| TOK-42 | 색 — brand | 기준 | 로고처럼 테마가 바뀌어도 그대로 두는 고정 색 | 확장 [MK] |
| TOK-43 | 색 — accent | 기준 | 한 화면에 조금만 쓰는 포인트 색 | 확장 [MK] |
| TOK-44 | 색 — chart.categorical | 기준 | 종류가 다른 계열을 구분하는 차트 색 묶음 | 확장 [MK] |
| TOK-45 | 색 — chart.sequential | 기준 | 값이 커질수록 진해지는 차트 색 묶음 | 확장 [MK] |
| TOK-46 | 색 — chart.diverging | 기준 | 기준값 양쪽으로 갈라지는 차트 색 묶음 | 확장 [MK] |
| TOK-47 | 색 — data.positive | 기준 | 늘어남·이익을 뜻하는 수치 색 | 확장 [MK] |
| TOK-48 | 색 — data.negative | 기준 | 줄어듦·손실을 뜻하는 수치 색 | 확장 [MK] |
| TOK-49 | 색 — data.neutral | 기준 | 변화 없음을 뜻하는 수치 색 | 확장 [MK] |
| TOK-50 | 색 — skeleton | 기준 | 불러오는 동안 자리만 잡아 두는 회색 면 색 | 확장 [MK] |
| TOK-51 | 색 — highlight | 기준 | 검색어·바뀐 부분을 형광펜처럼 덧칠하는 색 | 확장 [MK] |
| TOK-52 | 글자 — display.large | 기준 | 가장 큰 표제의 크기·줄간격·굵기·자간 묶음 | 확장 [MK] |
| TOK-53 | 글자 — display.medium | 기준 | 큰 표제 한 단계 아래 글자 묶음 | 확장 [MK] |
| TOK-54 | 글자 — display.small | 기준 | 표제 중 가장 작은 글자 묶음 | 확장 [MK] |
| TOK-55 | 글자 — headline.large | 기준 | 화면 제목에 쓰는 큰 글자 묶음 | 확장 [MK] |
| TOK-56 | 글자 — headline.medium | 기준 | 구역 제목에 쓰는 글자 묶음 | 확장 [MK] |
| TOK-57 | 글자 — headline.small | 기준 | 작은 구역 제목 글자 묶음 | 확장 [MK] |
| TOK-58 | 글자 — title.large | 기준 | 카드·대화상자 제목 글자 묶음 | 확장 [MK] |
| TOK-59 | 글자 — title.medium | 기준 | 목록 항목 제목 글자 묶음 | 확장 [MK] |
| TOK-60 | 글자 — title.small | 기준 | 가장 작은 제목 글자 묶음 | 확장 [MK] |
| TOK-61 | 글자 — body.large | 기준 | 잘 읽히게 키운 본문 글자 묶음 | 확장 [MK] |
| TOK-62 | 글자 — body.medium | 기준 | 기본 본문 글자 묶음 | 확장 [MK] |
| TOK-63 | 글자 — body.small | 기준 | 보조 설명 본문 글자 묶음 | 확장 [MK] |
| TOK-64 | 글자 — label.large | 기준 | 버튼 글자에 쓰는 묶음 | 확장 [MK] |
| TOK-65 | 글자 — label.medium | 기준 | 입력란 이름표에 쓰는 묶음 | 확장 [MK] |
| TOK-66 | 글자 — label.small | 기준 | 배지·꼬리말에 쓰는 가장 작은 묶음 | 확장 [MK] |
| TOK-67 | 글꼴 — font.body | 기준 | 본문에 쓰는 글꼴 가족 | 확장 [MK] |
| TOK-68 | 글꼴 — font.display | 기준 | 제목에만 쓰는 글꼴 가족 | 확장 [MK] |
| TOK-69 | 글꼴 — font.mono | 기준 | 코드와 표에 쓰는 고정폭 글꼴 가족 | 확장 [MK] |
| TOK-70 | 글꼴 — font.numeric | 기준 | 숫자를 또렷하게 보여 주는 글꼴·숫자 변형 설정 | 확장 [MK] |
| TOK-71 | 글자 — font-weight 단계 | 기준 | 굵기 단계에 붙이는 이름 묶음 | 확장 [MK] |
| TOK-72 | 글자 — line-height 단계 | 기준 | 줄 사이 높이 단계 묶음 | 확장 [MK] |
| TOK-73 | 글자 — letter-spacing 단계 | 기준 | 글자 사이 간격 단계 묶음 | 확장 [MK] |
| TOK-74 | 글자 — tabular-nums | 기준 | 자릿수를 세로로 맞추는 숫자 정렬 설정 | 확장 [MK] |
| TOK-75 | 글자 — measure | 기준 | 한 줄이 너무 길지 않게 잡는 단락 최대 폭 | 확장 [MK] |
| TOK-76 | 간격 — space 척도 | 기준 | 모든 여백이 참조하는 기본 간격 단계 묶음 | 확장 [MK] |
| TOK-77 | 간격 — inset | 기준 | 부품 안쪽 여백 | 확장 [MK] |
| TOK-78 | 간격 — gap | 기준 | 나란히 놓인 요소 사이 간격 | 확장 [MK] |
| TOK-79 | 간격 — stack | 기준 | 세로로 쌓은 요소 사이 간격 | 확장 [MK] |
| TOK-80 | 간격 — section | 기준 | 구역과 구역 사이 세로 간격 | 확장 [MK] |
| TOK-81 | 간격 — page-margin | 기준 | 화면 좌우 가장자리 여백 | 확장 [MK] |
| TOK-82 | 크기 — control.height.sm | 기준 | 작은 버튼·입력란 높이 | 확장 [MK] |
| TOK-83 | 크기 — control.height.md | 기준 | 기본 버튼·입력란 높이 | 확장 [MK] |
| TOK-84 | 크기 — control.height.lg | 기준 | 큰 버튼·입력란 높이 | 확장 [MK] |
| TOK-85 | 크기 — icon.size 단계 | 기준 | 아이콘 크기 단계 묶음 | 확장 [MK] |
| TOK-86 | 크기 — avatar.size 단계 | 기준 | 사람 사진 동그라미 크기 단계 묶음 | 확장 [MK] |
| TOK-87 | 크기 — container.max | 기준 | 본문이 넓어질 수 있는 최대 폭 | 확장 [MK] |
| TOK-88 | 크기 — touch-target.min | 기준 | 손가락으로 누를 수 있는 최소 영역 크기 | 확장 [MK] |
| TOK-89 | 반경 — radius.none | 기준 | 모서리를 깎지 않는 값 | 확장 [MK] |
| TOK-90 | 반경 — radius.sm | 기준 | 살짝 둥근 모서리 | 확장 [MK] |
| TOK-91 | 반경 — radius.md | 기준 | 기본 둥근 모서리 | 확장 [MK] |
| TOK-92 | 반경 — radius.lg | 기준 | 크게 둥근 모서리 | 확장 [MK] |
| TOK-93 | 반경 — radius.full | 기준 | 완전히 둥근 알약·원형 모서리 | 확장 [MK] |
| TOK-94 | 테두리 — border.width 단계 | 기준 | 선 굵기 단계 묶음 | 확장 [MK] |
| TOK-95 | 그림자 — elevation 단계 | 기준 | 떠 있는 정도를 나타내는 그림자 단계 묶음 | 확장 [MK] |
| TOK-96 | 그림자 — shadow.inset | 기준 | 안으로 파인 느낌을 주는 그림자 | 확장 [MK] |
| TOK-97 | 불투명도 — opacity 단계 | 기준 | 투명도 단계 묶음 | 확장 [MK] |
| TOK-98 | 불투명도 — opacity.disabled | 기준 | 꺼진 부품을 흐리게 만드는 투명도 | 확장 [MK] |
| TOK-99 | 불투명도 — state-layer | 기준 | 호버·눌림에 덮는 얇은 색층의 진하기 | 확장 [MK] |
| TOK-100 | 층 — z.base | 기준 | 일반 내용이 놓이는 기본 층 | 확장 [MK] |
| TOK-101 | 층 — z.dropdown | 기준 | 펼침 목록이 올라가는 층 | 확장 [MK] |
| TOK-102 | 층 — z.sticky | 기준 | 스크롤해도 붙어 있는 머리말 층 | 확장 [MK] |
| TOK-103 | 층 — z.overlay | 기준 | 뒤를 덮는 막의 층 | 확장 [MK] |
| TOK-104 | 층 — z.modal | 기준 | 대화상자가 놓이는 층 | 확장 [MK] |
| TOK-105 | 층 — z.popover | 기준 | 말풍선 메뉴가 놓이는 층 | 확장 [MK] |
| TOK-106 | 층 — z.toast | 기준 | 잠깐 뜨는 알림이 놓이는 층 | 확장 [MK] |
| TOK-107 | 층 — z.tooltip | 기준 | 가장 위에 뜨는 설명 풍선 층 | 확장 [MK] |
| TOK-108 | 브레이크포인트 — breakpoint 이름 단계 | 기준 | 화면 너비 구간에 붙이는 이름 묶음 | 확장 [MK] |
| TOK-109 | 브레이크포인트 — container-query 기준 | 기준 | 화면이 아니라 담긴 상자 너비로 바뀌는 기준 | 확장 [MK] |
| TOK-110 | 격자 — grid.columns | 기준 | 구간별 격자 열 개수 | 확장 [MK] |
| TOK-111 | 격자 — grid.gutter | 기준 | 격자 열 사이 간격 | 확장 [MK] |
| TOK-112 | 격자 — grid.margin | 기준 | 격자 바깥 좌우 여백 | 확장 [MK] |
| TOK-113 | 움직임 — duration 단계 | 기준 | 애니메이션 길이 단계 묶음 | 확장 [MK] |
| TOK-114 | 움직임 — easing.standard | 기준 | 대부분의 움직임에 쓰는 가속 곡선 | 확장 [MK] |
| TOK-115 | 움직임 — easing.decelerate | 기준 | 들어올 때 천천히 멈추는 곡선 | 확장 [MK] |
| TOK-116 | 움직임 — easing.accelerate | 기준 | 나갈 때 빨라지는 곡선 | 확장 [MK] |
| TOK-117 | 움직임 — easing.emphasized | 기준 | 눈에 띄게 강조할 때 쓰는 곡선 | 확장 [MK] |
| TOK-118 | 움직임 — easing.spring | 기준 | 탄성으로 살짝 튕기는 곡선 | 확장 [MK] |
| TOK-119 | 움직임 — motion.distance | 기준 | 나타날 때 움직이는 거리 | 확장 [MK] |
| TOK-120 | 움직임 — stagger | 기준 | 여러 개가 차례로 나타날 때의 지연 간격 | 확장 [MK] |
| TOK-121 | 포커스 — focus.ring.width | 기준 | 초점 테두리 굵기 | 확장 [MK] |
| TOK-122 | 포커스 — focus.ring.offset | 기준 | 초점 테두리와 부품 사이 띄움 | 확장 [MK] |
| TOK-123 | 커서 — cursor 토큰 | 기준 | 부품 역할마다 정해 두는 마우스 모양 값 | 확장 [MK] |
| TOK-124 | 블러 — blur.backdrop 단계 | 기준 | 뒤 배경을 흐리게 하는 정도 단계 | 확장 [MK] |
| TOK-125 | 비율 — aspect 단계 | 기준 | 사진·영상 틀의 가로세로 비율 묶음 | 확장 [MK] |
| TOK-126 | 표면 — layer.translucent | 기준 | 반투명 유리 면의 배경색과 흐림을 묶은 값 | 확장 [MK] |
| TOK-127 | 토큰 규칙 — 3층 구조 (원시→의미→부품) | 기준 | 값을 뜻으로 감싸고 부품이 뜻만 쓰게 하는 층 나누기 | 확장 [MK] |
| TOK-128 | 토큰 규칙 — 이름 짓기 순서 | 기준 | 묶음·역할·변형·상태 순서로 이름을 붙이는 규칙 | 확장 [MK] |
| TOK-129 | 토큰 규칙 — 테마별 재정의 범위 | 기준 | 밝음·어둠·고대비에서 바꿔도 되는 토큰의 한계 | 확장 [MK] |
| TOK-130 | 토큰 규칙 — 밀도 모드 | 기준 | 넉넉함·빽빽함에 따라 간격과 높이만 바꾸는 방식 | 확장 [MK] |
| TOK-131 | 토큰 규칙 — 브랜드 교체 범위 | 기준 | 브랜드가 바뀔 때 값만 갈아 끼우고 이름은 두는 원칙 | 확장 [MK] |
| TOK-132 | 토큰 규칙 — 플랫폼별 내보내기 | 기준 | 같은 토큰을 웹·앱 형식으로 내보내는 기준 | 확장 [MK] |
| TOK-133 | 토큰 규칙 — 폐기 토큰 표시 | 기준 | 더 안 쓰는 토큰에 대체 이름과 없앨 시점을 적는 방법 | 확장 [MK] |
| TOK-134 | 토큰 규칙 — 값 직접 쓰기 금지 | 기준 | 부품 코드에 색·숫자를 그대로 적지 못하게 막는 원칙 | 확장 [MK] |
| TOK-135 | 토큰 규칙 — 변경 이력과 버전 | 기준 | 토큰이 바뀐 이유와 시점을 남기는 기록 방식 | 확장 [MK] |
| TOK-136 | 컨센트릭(동심) 모서리 반경 규칙 — Concentric Corner Radius | 기준 | 안쪽 요소 모서리 둥글기를 바깥 컨테이너에 맞춰 자동 계산 | 확인 [LGR] |
| TOK-137 | 그라디언트 토큰 — Gradient Token | 기준 | 두 색 이상을 잇는 배경을 이름으로 저장해 재사용 | 확장 [MK] |
| TOK-138 | 전환 토큰 — Transition Token | 기준 | 시간과 이징을 한 묶음으로 저장해 재사용 | 확장 [MK] |
| TOK-139 | 벤더 확장 데이터 — `$extensions` | 기준 | 규격에 없는 우리 쪽 추가 정보를 토큰에 붙이는 정해진 자리 | 확인 [DTCGF] |
| TOK-140 | 토큰 폐기 표시 — `$deprecated` | 기준 | 쓰지 말라고 표시하되 값은 남겨 두는 단계 | 확인 [DTCGF] |
| TOK-141 | 중괄호 별칭 — `{group.token}` | 기준 | 다른 토큰을 가리켜 값을 한곳에서만 고치게 한다 | 확인 [DTCGF] |
| TOK-142 | 넓은 색역 색 표기 | 기준 | Display P3·Oklch처럼 기존 표기보다 넓은 색을 담는 방식 | 확인 [DTCG] |
| TOK-143 | 해석기 모듈 — 조건별 값 선택 | 기준 | 테마·기기에 따라 어떤 값을 고를지 규격 안에서 정하는 부분 | 확인 [DTCG] |
| TOK-144 | 토큰 3단 구조 | 기준 | 원시 값 → 뜻이 붙은 값 → 부품 전용 값 세 단으로 나눈다 | 확인 [LINEDS] |
| TOK-145 | 토큰 이름 3부 구조 | 기준 | 맥락 + 공통 단위 + 구분어 순서로 이름을 만든다 | 확인 [SPCTOK] |
| TOK-146 | 부품 정의 4요소 | 기준 | 부품마다 글자·아이콘·테두리·전경 네 가지 색을 반드시 정의한다 | 확인 [LINEDS] |
