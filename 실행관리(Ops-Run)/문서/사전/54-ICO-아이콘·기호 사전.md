# 54. 아이콘·기호 사전

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 54번 분류 ICO다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

제품 화면에서 쓰는 아이콘을 그림이 아니라 뜻으로 정리한 목록이다. 아이콘은 뜻의 폭이 넓어 부품 갈래에서 떼어 내 별도 갈래로 두었고, 카테고리는 하위 단계 없이 한 층으로 53개를 두었다. Unicode 이모지 그룹과 Font Awesome·Tabler·Lucide·Material Symbols·Phosphor·Remix·Iconoir·Flaticon·Iconscout의 카테고리를 모두 대조해, 큰 아이콘 사이트가 다루는 주제가 빠짐없이 한 곳에 들어가도록 정했다. 순서는 화면 조작(이동·편집·상태 등), 일과 도구, 사람, 생활, 세상, 문화·사회 묶음 순이다. 한 그림이 두 카테고리에 걸치면 쓰임이 더 구체적인 쪽에 둔다. 예를 들어 배터리·와이파이·블루투스는 상태 표시로 쓰여도 기기·연결에, 악기는 음악·소리에, 탈것은 교통에 둔다. 마지막 "아이콘 규칙"은 카테고리가 아니라 아이콘 전체에 공통으로 적용하는 기준과 그림 양식(선·채움·색 등)을 모은 절이며, 아이콘 탭의 카테고리 목록에는 나오지 않는다.

그림 칸은 그 뜻을 그린 실제 아이콘이다. `세트:이름` 형식으로 적고, 세트는 Lucide(`lucide`), Tabler Icons(`tabler`), Phosphor(`phosphor`), Material Symbols(`material`) 가운데 하나다. 네 세트에 알맞은 그림이 없으면 유니코드 이모지를 `emoji:` 뒤에 적는다. 그림이 여러 개면 쉼표로 나누고 가장 알맞은 것을 앞에 둔다. "—"는 그림이 필요 없는 기준 항목이다. 빌드는 부품 항목에 그림이 없거나, 적힌 그림이 설치된 세트에 없으면 멈춘다.

이 표에 없는 나머지 그림도 모두 아이콘 탭에 나온다. 설치된 네 세트의 그림 하나하나에 한국어 이름과 카테고리를 붙인 목록은 [아이콘 그림 분류](<../아이콘 그림 분류.json>)에 있고, 세트를 새 판으로 올려 그림이 늘거나 줄면 이 목록과 맞을 때까지 빌드가 멈춘다.

## 이동 — Navigation

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-01 | 홈 — home | 부품 | 첫 화면으로 돌아가는 표시, 집 모양이 표준 | 확장 [MK] · 대조 [ICLU] | `lucide:house` |
| ICO-02 | 뒤로 — back | 부품 | 직전 화면으로 돌아감, 왼쪽 화살표나 왼쪽 꺾쇠 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-left` |
| ICO-04 | 상위로 — up level | 부품 | 한 단계 위 폴더·분류로 올라감 | 확장 [MK] · 대조 [ICLU] | `lucide:corner-left-up` |
| ICO-05 | 메뉴 — menu | 부품 | 숨은 주메뉴 열기, 가로줄 세 개 햄버거 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:menu` |
| ICO-06 | 더보기 세로 — more vertical | 부품 | 항목 하나에 딸린 추가 동작 목록, 점 세 개 세로 | 확장 [MK] · 대조 [ICLU] | `lucide:ellipsis-vertical` |
| ICO-07 | 더보기 가로 — more horizontal | 부품 | 자리가 모자라 접어 둔 동작 목록, 점 세 개 가로 | 확장 [MK] · 대조 [ICLU] | `lucide:ellipsis` |
| ICO-10 | 접기 — collapse | 부품 | 열린 내용을 다시 숨김, 위 꺾쇠 | 확장 [MK] · 대조 [ICLU] | `lucide:chevron-up` |
| ICO-11 | 모두 펼치기 — expand all | 부품 | 트리·아코디언 전체를 한 번에 여는 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:chevrons-up-down` |
| ICO-12 | 외부 링크 — external link | 부품 | 새 창이나 다른 사이트로 나감, 사각형에서 나가는 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:external-link` |
| ICO-13 | 앵커 링크 — anchor link | 부품 | 문서 안 특정 위치로 바로 가는 주소, 사슬 고리 | 확장 [MK] · 대조 [ICLU] | `lucide:link` |
| ICO-14 | 하위로 들어가기 — drill in | 부품 | 목록 항목 오른쪽 끝에서 다음 단계로 들어감 | 확장 [MK] · 대조 [ICLU] | `lucide:chevron-right` |
| ICO-15 | 사이드바 접기 — sidebar toggle | 부품 | 왼쪽 목록 영역을 넓히거나 좁힘 | 확장 [MK] · 대조 [ICLU] | `lucide:panel-left-open` |
| ICO-16 | 보조 패널 — side panel | 부품 | 오른쪽 상세·속성 영역을 여닫음 | 확장 [MK] · 대조 [ICLU] | `lucide:panel-left` |
| ICO-17 | 새 탭 — new tab | 부품 | 같은 창 안에 작업 탭을 하나 더 만듦 | 확장 [MK] | `tabler:browser-plus` |
| ICO-18 | 새 창 — new window | 부품 | 별도 창으로 띄움 | 확장 [MK] · 대조 [ICLU] | `lucide:app-window` |
| ICO-19 | 경로 구분 — breadcrumb separator | 부품 | 현재 위치 경로에서 단계 사이를 나눔, 꺾쇠나 슬래시 | 확장 [MK] · 대조 [ICLU] | `lucide:chevron-right` |
| ICO-20 | 첫 쪽으로 — first page | 부품 | 페이지 넘김에서 맨 앞으로 이동 | 확장 [MK] · 대조 [ICLU] | `lucide:chevrons-left` |
| ICO-21 | 끝 쪽으로 — last page | 부품 | 페이지 넘김에서 맨 뒤로 이동 | 확장 [MK] · 대조 [ICLU] | `lucide:chevrons-right` |
| ICO-22 | 맨 위로 — back to top | 부품 | 길게 스크롤한 화면을 꼭대기로 되돌림 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-up-to-line` |
| ICO-23 | 건너뛰기 — skip | 부품 | 지금 단계를 지나치고 다음으로 감 | 확장 [MK] · 대조 [ICLU] | `lucide:skip-forward` |
| ICO-24 | 나가기 — exit | 부품 | 지금 모드·작업 공간에서 빠져나감, 문에서 나가는 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:square-arrow-right-exit` |
| ICO-40 | 새로고침 — refresh | 부품 | 화면 내용을 다시 받아옴, 원을 도는 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:refresh-cw` |
| ICO-67 | 전체화면 — fullscreen | 부품 | 화면 전체를 씀, 바깥으로 벌어지는 모서리 | 확장 [MK] · 대조 [ICLU] | `lucide:fullscreen` |
| ICO-68 | 전체화면 종료 — exit fullscreen | 부품 | 원래 창 크기로 돌아옴 | 확장 [MK] · 대조 [ICLU] | `lucide:minimize` |
| ICO-119 | 북마크 — bookmark | 부품 | 나중에 다시 보려고 표시함, 리본 책갈피 | 확장 [MK] · 대조 [ICLU] | `lucide:bookmark` |
| ICO-141 | 로그인 — sign in | 부품 | 계정으로 들어감, 안으로 향한 화살표와 문 | 확장 [MK] · 대조 [ICLU] | `lucide:log-in` |
| ICO-142 | 로그아웃 — sign out | 부품 | 계정에서 나감, 밖으로 향한 화살표와 문 | 확장 [MK] · 대조 [ICLU] | `lucide:log-out` |
| ICO-279 | 대시보드 — dashboard | 부품 | 여러 지표를 한 화면에 모은 곳 | 확장 [MK] · 대조 [ICLU] | `lucide:layout-dashboard` |
| ICO-527 | 출입구 — door open | 부품 | 다른 공간·모드로 들어가고 나가는 관문을 나타냄, 열린 문 모양 | 확인 [ICLU] | `lucide:door-open` |
| ICO-528 | 전체 앱 — apps | 부품 | 설치된 앱을 모아 한 번에 여는 목록을 나타냄, 격자 모양 아이콘 | 확인 [ICLU] | `lucide:layout-grid` |
| ICO-529 | 탭 전환 — tabs | 부품 | 열어 둔 여러 작업 화면을 오가며 봄을 나타냄, 위쪽 탭 모양 | 확인 [ICSET] | `tabler:tabs` |
| ICO-08 | 닫기 — close | 부품 | 창·알림·시트를 닫음, X 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:x` |
| ICO-03 | 앞으로 — forward | 부품 | 뒤로 간 뒤 다시 앞 화면으로 감 | 확장 [MK] · 대조 [ICLU] | `lucide:forward` |

## 편집·행동 — Actions

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-38 | 되돌리기 — undo | 부품 | 방금 한 일을 취소함, 왼쪽으로 굽은 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:undo` |
| ICO-39 | 다시 실행 — redo | 부품 | 되돌린 일을 다시 함 | 확장 [MK] · 대조 [ICLU] | `lucide:redo` |
| ICO-25 | 추가 — add | 부품 | 항목을 하나 더 만듦, 플러스 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:plus` |
| ICO-26 | 새로 만들기 — create new | 부품 | 빈 문서·프로젝트를 새로 시작함 | 확장 [MK] · 대조 [ICLU] | `lucide:square-plus` |
| ICO-27 | 삭제 — delete | 부품 | 항목을 지움, 휴지통 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:trash` |
| ICO-28 | 영구 삭제 — delete forever | 부품 | 되돌릴 수 없게 완전히 지움 | 확장 [MK] · 대조 [ICLU] | `lucide:trash` |
| ICO-29 | 입력 지우기 — clear input | 부품 | 입력칸 내용만 비움, 작은 원 안의 X | 확장 [MK] · 대조 [ICLU] | `lucide:circle-x` |
| ICO-30 | 편집 — edit | 부품 | 내용을 고칠 수 있게 바꿈, 연필 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:pencil` |
| ICO-31 | 이름 바꾸기 — rename | 부품 | 항목 이름만 고침 | 확장 [MK] · 대조 [ICLU] | `lucide:folder-pen` |
| ICO-32 | 저장 — save | 부품 | 지금 상태를 보관함 | 확장 [MK] · 대조 [ICLU] | `lucide:save` |
| ICO-33 | 다른 이름으로 저장 — save as | 부품 | 사본을 새 이름으로 만듦 | 확장 [MK] · 대조 [ICLU] | `lucide:save-plus` |
| ICO-34 | 복사 — copy | 부품 | 선택한 것을 클립보드에 담음, 겹친 사각형 | 확장 [MK] · 대조 [ICLU] | `lucide:copy` |
| ICO-35 | 붙여넣기 — paste | 부품 | 클립보드 내용을 넣음, 집게가 달린 판 | 확장 [MK] · 대조 [ICLU] | `lucide:clipboard-paste` |
| ICO-36 | 잘라내기 — cut | 부품 | 원본을 지우면서 클립보드에 담음, 가위 | 확장 [MK] · 대조 [ICLU] | `lucide:scissors` |
| ICO-37 | 복제 — duplicate | 부품 | 같은 내용을 바로 옆에 하나 더 만듦 | 확장 [MK] · 대조 [ICLU] | `lucide:copy` |
| ICO-41 | 다시 시도 — retry | 부품 | 실패한 작업을 한 번 더 실행함 | 확장 [MK] · 대조 [ICLU] | `lucide:rotate-ccw` |
| ICO-43 | 링크 복사 — copy link | 부품 | 지금 화면 주소를 클립보드에 담음 | 확장 [MK] · 대조 [ICLU] | `lucide:link` |
| ICO-44 | 내보내기 — export | 부품 | 다른 형식 파일로 뽑아냄 | 확장 [MK] | `tabler:file-export` |
| ICO-45 | 가져오기 — import | 부품 | 바깥 파일 내용을 끌어들임 | 확장 [MK] · 대조 [ICLU] | `lucide:import` |
| ICO-46 | 인쇄 — print | 부품 | 종이로 뽑음, 프린터 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:printer` |
| ICO-47 | 다운로드 — download | 부품 | 내 기기로 받음, 아래로 향한 화살표와 받침선 | 확장 [MK] · 대조 [ICLU] | `lucide:download` |
| ICO-48 | 업로드 — upload | 부품 | 서버로 올림, 위로 향한 화살표와 받침선 | 확장 [MK] · 대조 [ICLU] | `lucide:upload` |
| ICO-51 | 고정 — pin | 부품 | 목록 위쪽에 붙박아 둠, 압정 | 확장 [MK] · 대조 [ICLU] | `lucide:pin` |
| ICO-52 | 고정 해제 — unpin | 부품 | 붙박이 상태를 풂, 사선이 그어진 압정 | 확장 [MK] · 대조 [ICLU] | `lucide:pin-off` |
| ICO-53 | 보관 — archive | 부품 | 지우지 않고 목록 밖으로 치움, 뚜껑 달린 상자 | 확장 [MK] · 대조 [ICLU] | `lucide:archive` |
| ICO-54 | 복원 — restore | 부품 | 보관·삭제한 것을 원래 자리로 되돌림 | 확장 [MK] | `tabler:restore` |
| ICO-57 | 필터 — filter | 부품 | 조건에 맞는 것만 남김, 깔때기 | 확장 [MK] · 대조 [ICLU] | `lucide:funnel` |
| ICO-58 | 필터 지우기 — clear filter | 부품 | 걸어 둔 조건을 모두 없앰 | 확장 [MK] · 대조 [ICLU] | `lucide:list-filter` |
| ICO-59 | 정렬 — sort | 부품 | 순서 기준을 바꿈, 길이가 다른 두 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-down-up` |
| ICO-60 | 오름차순 — sort ascending | 부품 | 작은 값부터 위로 놓음 | 확장 [MK] · 대조 [ICLU] | `lucide:list-sort-ascending` |
| ICO-61 | 내림차순 — sort descending | 부품 | 큰 값부터 위로 놓음 | 확장 [MK] · 대조 [ICLU] | `lucide:list-sort-descending` |
| ICO-62 | 검색 — search | 부품 | 찾을 말을 넣어 결과를 좁힘, 돋보기 | 확장 [MK] · 대조 [ICLU] | `lucide:search` |
| ICO-63 | 확대 — zoom in | 부품 | 화면을 크게 봄, 돋보기 안의 플러스 | 확장 [MK] · 대조 [ICLU] | `lucide:zoom-in` |
| ICO-64 | 축소 — zoom out | 부품 | 화면을 작게 봄, 돋보기 안의 빼기 | 확장 [MK] · 대조 [ICLU] | `lucide:zoom-out` |
| ICO-65 | 화면에 맞춤 — fit to screen | 부품 | 내용 전체가 보이게 배율을 맞춤 | 확장 [MK] · 대조 [ICLU] | `lucide:fullscreen` |
| ICO-66 | 실제 크기 — actual size | 부품 | 배율을 100퍼센트로 되돌림 | 확장 [MK] | `tabler:zoom-reset` |
| ICO-69 | 설정 — settings | 부품 | 값과 규칙을 바꾸는 곳, 톱니바퀴 | 확장 [MK] · 대조 [ICLU] | `lucide:settings` |
| ICO-76 | 크기 조절 — resize | 부품 | 가로·세로 크기를 바꿈 | 확장 [MK] · 대조 [ICLU] | `lucide:scaling` |
| ICO-77 | 합치기 — merge items | 부품 | 둘 이상을 하나로 묶음 | 확장 [MK] · 대조 [ICLU] | `lucide:combine` |
| ICO-78 | 나누기 — split item | 부품 | 하나를 둘로 가름 | 확장 [MK] · 대조 [ICLU] | `lucide:split` |
| ICO-79 | 묶기 — group | 부품 | 여러 개를 한 덩어리로 다룸 | 확장 [MK] · 대조 [ICLU] | `lucide:group` |
| ICO-80 | 묶음 풀기 — ungroup | 부품 | 덩어리를 낱개로 되돌림 | 확장 [MK] · 대조 [ICLU] | `lucide:ungroup` |
| ICO-81 | 전체 선택 — select all | 부품 | 목록·캔버스의 모든 것을 고름 | 확장 [MK] | `tabler:select-all` |
| ICO-82 | 승인 — approve | 부품 | 요청을 받아들임, 체크 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-check` |
| ICO-83 | 반려 — reject | 부품 | 요청을 돌려보냄 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-x` |
| ICO-84 | 제출 — submit | 부품 | 작성한 것을 담당에게 넘김 | 확장 [MK] · 대조 [ICLU] | `lucide:send` |
| ICO-86 | 서명 — sign | 부품 | 동의 표시로 이름을 적음, 만년필 | 확장 [MK] · 대조 [ICLU] | `lucide:signature` |
| ICO-88 | 요약 — summarize | 부품 | 긴 내용을 줄여 보여 줌 | 확장 [MK] | `lucide:summary` |
| ICO-89 | 미리보기 — preview | 부품 | 저장 전 결과 모습을 확인함 | 확장 [MK] · 대조 [ICLU] | `lucide:eye` |
| ICO-120 | 보이기 — visible | 부품 | 지금 드러나 있음, 눈 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:eye` |
| ICO-121 | 숨기기 — hidden | 부품 | 지금 가려져 있음, 사선이 그어진 눈 | 확장 [MK] · 대조 [ICLU] | `lucide:eye-off` |
| ICO-458 | 끌기 손잡이 — drag handle | 부품 | 잡고 옮길 수 있는 자리, 점 여섯 개 | 확장 [MK] · 대조 [ICLU] | `lucide:grip-vertical` |
| ICO-531 | 빼기 — minus | 부품 | 값이나 개수를 하나씩 줄임을 나타냄, 가로줄 하나 | 확인 [ICLU] | `lucide:minus` |
| ICO-532 | 설정 슬라이더 — sliders | 부품 | 여러 항목의 값을 막대를 밀어 세밀하게 조절함을 나타냄 | 확인 [ICLU] | `lucide:sliders-vertical` |
| ICO-535 | 매직 도구 — magic | 부품 | 자동으로 보정·생성해 주는 기능을 나타냄, 마법 지팡이 모양 | 확인 [ICLU] | `lucide:wand` |
| ICO-85 | 취소 — cancel | 부품 | 진행 중인 일을 멈추고 되돌림 | 확장 [MK] · 대조 [ICLU] | `lucide:x` |
| ICO-90 | 스캔 — scan | 부품 | 카메라로 종이·코드를 읽어들임 | 확장 [MK] · 대조 [ICLU] | `lucide:scan` |
| ICO-91 | QR 코드 — qr code | 부품 | 네모 코드로 주소·값을 주고받음 | 확장 [MK] · 대조 [ICLU] | `lucide:qr-code` |
| ICO-114 | 별표 — star | 부품 | 즐겨찾기로 표시함, 속이 빈 별과 채운 별로 켜짐·꺼짐 구분 | 확장 [MK] · 대조 [ICLU] | `lucide:star` |
| ICO-441 | 번개 — bolt | 부품 | 아주 빠름·즉시 실행 | 확장 [MK] · 대조 [ICLU] | `lucide:zap` |

## 상태·알림 — Status & Alerts

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-122 | 체크 — check | 부품 | 맞음·완료를 나타내는 단독 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:check` |
| ICO-70 | 도움말 — help | 부품 | 설명과 문의로 가는 길, 원 안의 물음표 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-question-mark` |
| ICO-94 | 정보 — info | 부품 | 알아 두면 좋은 내용, 원 안의 i | 확장 [MK] · 대조 [ICLU] | `lucide:info` |
| ICO-95 | 성공 — success | 부품 | 일이 제대로 끝남, 원 안의 체크 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-check` |
| ICO-96 | 경고 — warning | 부품 | 그대로 두면 문제가 생길 수 있음, 삼각형 안의 느낌표 | 확장 [MK] · 대조 [ICLU] | `lucide:triangle-alert` |
| ICO-97 | 오류 — error | 부품 | 일이 실패함, 원 안의 느낌표나 X | 확장 [MK] · 대조 [ICLU] | `lucide:circle-alert` |
| ICO-98 | 치명적 문제 — critical | 부품 | 즉시 손대야 하는 심각한 상태, 팔각형 표지판 | 확장 [MK] · 대조 [ICLU] | `lucide:octagon-alert` |
| ICO-99 | 질문 — question | 부품 | 확인이 필요함, 원 안의 물음표 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-question-mark` |
| ICO-100 | 알림 — notification | 부품 | 새 소식이 있음, 종 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:bell` |
| ICO-101 | 알림 끔 — notification off | 부품 | 소식을 받지 않음, 사선이 그어진 종 | 확장 [MK] · 대조 [ICLU] | `lucide:bell-off` |
| ICO-102 | 안 읽은 점 — badge dot | 부품 | 숫자 없이 새것이 있음만 알리는 작은 점 | 확장 [MK] | `lucide:circle-dot` |
| ICO-103 | 불러오는 중 — loading | 부품 | 결과를 기다리는 중, 도는 원 | 확장 [MK] · 대조 [ICLU] | `lucide:loader` |
| ICO-104 | 진행률 — progress | 부품 | 얼마나 끝났는지 비율을 보임 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-dot` |
| ICO-105 | 대기 중 — pending | 부품 | 차례를 기다리는 상태, 모래시계 | 확장 [MK] | `lucide:hourglass` |
| ICO-106 | 동기화 — sync | 부품 | 기기와 서버 내용을 맞춤, 서로 쫓는 두 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:refresh-cw` |
| ICO-107 | 동기화 실패 — sync problem | 부품 | 내용 맞추기가 안 끝남 | 확장 [MK] · 대조 [ICLU] | `lucide:refresh-cw-off` |
| ICO-108 | 오프라인 — offline | 부품 | 인터넷에 닿지 않음, 사선이 그어진 구름 | 확장 [MK] · 대조 [ICLU] | `lucide:cloud-off` |
| ICO-109 | 연결됨 — connected | 부품 | 기기·서비스와 이어져 있음 | 확장 [MK] · 대조 [ICLU] | `lucide:link-2` |
| ICO-110 | 연결 끊김 — disconnected | 부품 | 이어져 있던 것이 끊김, 끊긴 사슬 | 확장 [MK] · 대조 [ICLU] | `lucide:link-2-off` |
| ICO-115 | 반쪽 별 — half star | 부품 | 평점에서 0.5점을 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:star-half` |
| ICO-123 | 선택됨 — checked | 부품 | 네모 칸이 켜진 상태 | 확장 [MK] · 대조 [ICLU] | `lucide:square-check` |
| ICO-124 | 일부 선택 — indeterminate | 부품 | 하위 항목 일부만 켜진 상태, 네모 안의 빼기 | 확장 [MK] · 대조 [ICLU] | `lucide:square-minus` |
| ICO-125 | 하나 고름 — radio selected | 부품 | 동그란 칸 하나만 켜진 상태 | 확장 [MK] · 대조 [ICLU] | `lucide:dot` |
| ICO-126 | 새 항목 — new | 부품 | 최근에 생긴 것임을 알림 | 확장 [MK] · 대조 [ICLU] | `lucide:badge-plus` |
| ICO-127 | 초안 — draft | 부품 | 아직 내보내지 않은 작성 중 상태 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-dashed` |
| ICO-128 | 게시됨 — published | 부품 | 사람들에게 공개된 상태 | 확장 [MK] · 대조 [ICLU] | `lucide:badge-check` |
| ICO-129 | 만료됨 — expired | 부품 | 기한이 지나 쓸 수 없는 상태 | 확장 [MK] · 대조 [ICLU] | `lucide:calendar-x` |
| ICO-130 | 읽음 — read receipt | 부품 | 상대가 확인함, 체크 두 개 | 확장 [MK] · 대조 [ICLU] | `lucide:check-check` |
| ICO-131 | 안 읽음 — unread | 부품 | 아직 확인하지 않음, 채운 동그라미 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-dot` |
| ICO-133 | 실시간 — live | 부품 | 지금 벌어지는 중계임을 알림 | 확장 [MK] · 대조 [ICLU] | `lucide:radio` |
| ICO-134 | 업데이트 있음 — update available | 부품 | 새 버전으로 바꿀 수 있음 | 확장 [MK] · 대조 [ICLU] | `lucide:download` |
| ICO-135 | 인증됨 — verified | 부품 | 신원·사실이 확인된 계정·항목, 체크가 든 배지 | 확장 [MK] · 대조 [ICLU] | `lucide:badge-check` |
| ICO-375 | 차단 — block | 부품 | 상대·내용을 막음, 사선이 그어진 원 | 확장 [MK] · 대조 [ICLU] | `lucide:ban` |
| ICO-383 | 긴급 — emergency | 부품 | 즉시 도움이 필요한 상황 | 확장 [MK] · 대조 [ICLU] | `lucide:siren` |
| ICO-536 | 알림 울림 — bell ring | 부품 | 새 알림이 막 울리고 있음을 나타냄, 흔들리는 종 모양 | 확인 [ICLU] | `lucide:bell-ring` |
| ICO-537 | 스위치 켜짐 — toggle on | 부품 | 설정이 켜진 상태를 나타냄, 오른쪽으로 밀린 스위치 | 확인 [ICLU] | `lucide:toggle-right` |
| ICO-538 | 스위치 꺼짐 — toggle off | 부품 | 설정이 꺼진 상태를 나타냄, 왼쪽으로 밀린 스위치 | 확인 [ICLU] | `lucide:toggle-left` |
| ICO-540 | 클라우드 끊김 — cloud off | 부품 | 온라인 저장소·인터넷과 연결이 끊어진 상태임을 나타냄 | 확인 [ICLU] | `lucide:cloud-off` |
| ICO-541 | 위험 경고 — octagon alert | 부품 | 즉시 멈추고 확인해야 할 심각한 문제를 알림, 팔각형 표시 | 확인 [ICLU] | `lucide:octagon-alert` |
| ICO-544 | 사용 불가 — circle slash | 부품 | 지금은 쓸 수 없는 기능임을 나타냄, 원 안의 빗금 | 확인 [ICLU] | `lucide:slash` |

## 화살표·커서 — Arrows & Cursors

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-09 | 펼치기 — expand | 부품 | 접힌 내용을 열어 보임, 아래 꺾쇠 | 확장 [MK] · 대조 [ICLU] | `lucide:expand` |
| ICO-72 | 회전 — rotate | 부품 | 그림·화면을 돌림 | 확장 [MK] · 대조 [ICLU] | `lucide:rotate-cw` |
| ICO-75 | 이동 — move | 부품 | 위치를 옮김, 네 방향 십자 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:move` |
| ICO-442 | 위 화살표 — arrow up | 부품 | 위로 옮기거나 값이 커짐 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-up` |
| ICO-443 | 아래 화살표 — arrow down | 부품 | 아래로 옮기거나 값이 작아짐 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-down` |
| ICO-444 | 왼쪽 화살표 — arrow left | 부품 | 왼쪽으로 옮김 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-left` |
| ICO-445 | 오른쪽 화살표 — arrow right | 부품 | 오른쪽으로 옮김 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-right` |
| ICO-446 | 대각선 화살표 — diagonal arrow | 부품 | 비스듬한 방향으로 나감 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-up-right` |
| ICO-447 | 양방향 화살표 — bidirectional arrow | 부품 | 양쪽으로 오갈 수 있음 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-left-right` |
| ICO-448 | 순환 화살표 — circular arrow | 부품 | 같은 일을 돌아가며 되풀이함 | 확장 [MK] · 대조 [ICLU] | `lucide:rotate-ccw` |
| ICO-449 | 되돌아가는 화살표 — return arrow | 부품 | 왔던 자리로 돌아감, 꺾인 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:corner-down-left` |
| ICO-450 | 갈라지는 화살표 — branching arrow | 부품 | 한 줄기가 둘로 나뉨 | 확장 [MK] · 대조 [ICLU] | `lucide:split` |
| ICO-451 | 합쳐지는 화살표 — merging arrow | 부품 | 두 줄기가 하나로 모임 | 확장 [MK] · 대조 [ICLU] | `lucide:git-merge` |
| ICO-452 | 위 꺾쇠 — chevron up | 부품 | 접기·이전 값, 화살촉만 있는 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:chevron-up` |
| ICO-453 | 아래 꺾쇠 — chevron down | 부품 | 펼치기·목록 열기 | 확장 [MK] · 대조 [ICLU] | `lucide:chevron-down` |
| ICO-454 | 왼 꺾쇠 — chevron left | 부품 | 왼쪽 항목으로 넘김 | 확장 [MK] · 대조 [ICLU] | `lucide:chevron-left` |
| ICO-455 | 오른 꺾쇠 — chevron right | 부품 | 오른쪽 항목으로 넘기거나 안으로 들어감 | 확장 [MK] · 대조 [ICLU] | `lucide:chevron-right` |
| ICO-456 | 겹 꺾쇠 — double chevron | 부품 | 여러 칸을 한 번에 건너뜀 | 확장 [MK] · 대조 [ICLU] | `lucide:chevrons-down` |
| ICO-457 | 캐럿 — caret | 부품 | 선택 상자가 열린다는 아주 작은 삼각형 | 확장 [MK] | `tabler:caret-down` |
| ICO-459 | 순서 손잡이 — reorder handle | 부품 | 목록 순서를 바꾸는 자리, 가로줄 세 개 | 확장 [MK] · 대조 [ICLU] | `lucide:grip-horizontal` |
| ICO-460 | 크기 손잡이 — resize handle | 부품 | 모서리를 잡아 늘이는 자리 | 확장 [MK] · 대조 [ICLU] | `lucide:move-diagonal` |
| ICO-461 | 바깥으로 펴기 — expand arrows | 부품 | 네 방향으로 벌려 크게 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:maximize` |
| ICO-462 | 안으로 모으기 — collapse arrows | 부품 | 네 방향에서 모아 작게 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:minimize` |
| ICO-463 | 정렬 방향 표시 — sort arrow | 부품 | 표 머리에서 지금 정렬 방향을 알림 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-up-down` |
| ICO-464 | 더 있음 표시 — scroll hint | 부품 | 아래·옆에 내용이 더 있음을 알림 | 확장 [MK] · 대조 [ICLU] | `lucide:chevron-down` |
| ICO-466 | 단계 진행 표시 — step arrow | 부품 | 여러 단계에서 다음으로 가는 방향 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-right` |
| ICO-545 | 왼아래 화살표 — arrow down left | 부품 | 현재 위치에서 왼쪽 아래 방향으로 이동하거나 옮김을 나타냄 | 확인 [ICLU] | `lucide:arrow-down-left` |
| ICO-546 | 우상향 꺾쇠 — corner up right | 부품 | 오른쪽으로 꺾여 위쪽으로 이어지는 방향을 안내함 | 확인 [ICLU] | `lucide:corner-up-right` |
| ICO-547 | 마우스 포인터 — mouse pointer | 부품 | 화면에서 마우스로 가리키는 위치를 나타냄, 화살촉 모양 | 확인 [ICLU] | `lucide:mouse-pointer` |
| ICO-548 | 포인터 클릭 — mouse pointer click | 부품 | 마우스로 가리킨 자리를 눌러서 선택했음을 나타냄 | 확인 [ICLU] | `lucide:mouse-pointer-click` |
| ICO-549 | 글자 커서 — text cursor | 부품 | 글자를 입력할 자리를 표시함, 깜빡이는 세로줄 모양 | 확인 [ICLU] | `lucide:text-cursor` |
| ICO-551 | 맨 위 이동 — arrow up to line | 부품 | 목록·값을 맨 처음 자리로 한 번에 올림, 선 위 화살표 | 확인 [ICLU] | `lucide:arrow-up-to-line` |
| ICO-552 | 맨 아래 이동 — arrow down to line | 부품 | 목록·값을 맨 끝 자리로 한 번에 내림, 선 아래 화살표 | 확인 [ICLU] | `lucide:arrow-down-to-line` |
| ICO-553 | 왼쪽 유턴 — u turn left | 부품 | 왼쪽으로 크게 돌아 반대 방향으로 되돌아감을 나타냄 | 확인 [ICSET] | `tabler:u-turn-left` |
| ICO-554 | 큰 위 화살표 — arrow big up | 부품 | 값을 크게 올리거나 우선순위를 크게 높임을 강조해 나타냄 | 확인 [ICLU] | `lucide:arrow-big-up` |

## 글 서식 — Text Formatting

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-234 | 링크 걸기 — insert link | 부품 | 글자에 주소를 붙임 | 확장 [MK] · 대조 [ICLU] | `lucide:link` |
| ICO-235 | 링크 끊기 — unlink | 부품 | 붙여 둔 주소를 뗌 | 확장 [MK] · 대조 [ICLU] | `lucide:unlink` |
| ICO-87 | 번역 — translate | 부품 | 다른 언어로 바꿔 보여 줌 | 확장 [MK] · 대조 [ICLU] | `lucide:languages` |
| ICO-217 | 굵게 — bold | 부품 | 글자를 두껍게 함 | 확장 [MK] · 대조 [ICLU] | `lucide:bold` |
| ICO-218 | 기울임 — italic | 부품 | 글자를 비스듬히 함 | 확장 [MK] · 대조 [ICLU] | `lucide:italic` |
| ICO-219 | 밑줄 — underline | 부품 | 글자 아래 줄을 그음 | 확장 [MK] · 대조 [ICLU] | `lucide:underline` |
| ICO-220 | 취소선 — strikethrough | 부품 | 글자 가운데 줄을 그어 지워진 것처럼 보임 | 확장 [MK] · 대조 [ICLU] | `lucide:strikethrough` |
| ICO-221 | 왼쪽 맞춤 — align left | 부품 | 글을 왼쪽 끝에 맞춤 | 확장 [MK] · 대조 [ICLU] | `lucide:text-align-start` |
| ICO-222 | 가운데 맞춤 — align center | 부품 | 글을 가운데로 모음 | 확장 [MK] · 대조 [ICLU] | `lucide:text-align-center` |
| ICO-223 | 오른쪽 맞춤 — align right | 부품 | 글을 오른쪽 끝에 맞춤 | 확장 [MK] · 대조 [ICLU] | `lucide:text-align-end` |
| ICO-224 | 양쪽 맞춤 — justify | 부품 | 양쪽 끝을 나란히 맞춤 | 확장 [MK] · 대조 [ICLU] | `lucide:text-align-justify` |
| ICO-225 | 글머리 목록 — bulleted list | 부품 | 순서 없는 항목 나열 | 확장 [MK] · 대조 [ICLU] | `lucide:list` |
| ICO-226 | 번호 목록 — numbered list | 부품 | 순서 있는 항목 나열 | 확장 [MK] · 대조 [ICLU] | `lucide:list-ordered` |
| ICO-227 | 할 일 목록 — checklist | 부품 | 켤 수 있는 네모가 붙은 나열 | 확장 [MK] · 대조 [ICLU] | `lucide:list-checks` |
| ICO-228 | 들여쓰기 — indent | 부품 | 단락을 한 칸 안으로 밀어 넣음 | 확장 [MK] · 대조 [ICLU] | `lucide:list-indent-increase` |
| ICO-229 | 내어쓰기 — outdent | 부품 | 단락을 한 칸 밖으로 뺌 | 확장 [MK] · 대조 [ICLU] | `lucide:list-indent-decrease` |
| ICO-230 | 제목 단계 — heading level | 부품 | 큰 제목·작은 제목을 정함 | 확장 [MK] · 대조 [ICLU] | `lucide:heading` |
| ICO-231 | 인용 — blockquote | 부품 | 남의 말을 따온 단락 | 확장 [MK] · 대조 [ICLU] | `lucide:quote` |
| ICO-232 | 코드 조각 — inline code | 부품 | 문장 안에 넣는 짧은 코드 | 확장 [MK] · 대조 [ICLU] | `lucide:code` |
| ICO-233 | 코드 블록 — code block | 부품 | 줄이 여럿인 코드 상자 | 확장 [MK] | `lucide:code` |
| ICO-236 | 표 넣기 — insert table | 부품 | 칸이 있는 표를 만듦 | 확장 [MK] · 대조 [ICLU] | `lucide:table` |
| ICO-237 | 행 추가 — add row | 부품 | 표에 가로줄을 하나 더함 | 확장 [MK] | `tabler:row-insert-bottom` |
| ICO-238 | 열 추가 — add column | 부품 | 표에 세로줄을 하나 더함 | 확장 [MK] | `tabler:column-insert-right` |
| ICO-239 | 구분선 — horizontal rule | 부품 | 내용 사이를 가르는 가로선 | 확장 [MK] · 대조 [ICLU] | `lucide:separator-horizontal` |
| ICO-240 | 글자 색 — text color | 부품 | 글자 색을 바꿈 | 확장 [MK] | `tabler:text-color` |
| ICO-241 | 형광펜 — highlight | 부품 | 글자 뒤에 색을 칠함 | 확장 [MK] · 대조 [ICLU] | `lucide:highlighter` |
| ICO-242 | 글꼴 — font family | 부품 | 글자 모양 종류를 고름 | 확장 [MK] · 대조 [ICLU] | `lucide:type` |
| ICO-243 | 글자 크기 — font size | 부품 | 글자를 크거나 작게 함 | 확장 [MK] | `lucide:a-large-small` |
| ICO-244 | 줄 간격 — line spacing | 부품 | 줄 사이 간격을 조절함 | 확장 [MK] | `tabler:line-height` |
| ICO-245 | 위 첨자 — superscript | 부품 | 글자를 작게 위로 올림 | 확장 [MK] · 대조 [ICLU] | `lucide:superscript` |
| ICO-246 | 아래 첨자 — subscript | 부품 | 글자를 작게 아래로 내림 | 확장 [MK] · 대조 [ICLU] | `lucide:subscript` |
| ICO-247 | 서식 지우기 — clear formatting | 부품 | 꾸밈을 없애고 맨 글자로 되돌림 | 확장 [MK] · 대조 [ICLU] | `lucide:remove-formatting` |
| ICO-249 | 기호 넣기 — insert symbol | 부품 | 자판에 없는 글자를 고름 | 확장 [MK] | `lucide:omega` |
| ICO-250 | 이모지 넣기 — insert emoji | 부품 | 그림 문자를 고름 | 확장 [MK] · 대조 [ICLU] | `lucide:face-slightly-smiling` |
| ICO-251 | 이미지 넣기 — insert image | 부품 | 글 안에 사진을 넣음 | 확장 [MK] · 대조 [ICLU] | `lucide:image` |
| ICO-252 | 맞춤법 — spell check | 부품 | 틀린 글자를 찾아 표시함 | 확장 [MK] · 대조 [ICLU] | `lucide:spell-check` |
| ICO-253 | 찾아 바꾸기 — find and replace | 부품 | 같은 말을 한꺼번에 바꿈 | 확장 [MK] · 대조 [ICLU] | `lucide:replace` |
| ICO-254 | 서식 복사 — format painter | 부품 | 꾸밈만 다른 곳에 옮김 | 확장 [MK] · 대조 [ICLU] | `lucide:paintbrush` |
| ICO-255 | 대소문자 바꾸기 — change case | 부품 | 영문 큰 글자·작은 글자를 바꿈 | 확장 [MK] · 대조 [ICLU] | `lucide:case-sensitive` |
| ICO-495 | 단락 기호 — pilcrow | 부품 | 편집기에서 단락 끝을 보임 | 확장 [MK] · 대조 [ICLU] | `lucide:pilcrow` |
| ICO-555 | 자동 줄바꿈 — text wrap | 부품 | 글이 칸을 넘으면 다음 줄로 자동으로 넘어가게 함 | 확인 [ICLU] | `lucide:text-wrap` |
| ICO-556 | 글 방향 — text direction | 부품 | 글이 가로·세로 중 어느 쪽으로 흐르는지 정함 | 확인 [ICSET] | `tabler:direction` |
| ICO-557 | 자간 — letter spacing | 부품 | 글자와 글자 사이 간격을 넓히거나 좁힘을 나타냄 | 확인 [ICSET] | `tabler:letter-spacing` |
| ICO-496 | 공백 표시 — space dot | 부품 | 편집기에서 빈칸을 눈에 보이게 함 | 확장 [MK] · 대조 [ICLU] | `lucide:space` |

## 글자·숫자·기호 — Letters, Numbers & Symbols

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-493 | 괄호 — brackets | 부품 | 보충 설명을 감쌈 | 확장 [MK] · 대조 [ICLU] | `lucide:brackets` |
| ICO-692 | 커맨드 키 — command | 부품 | 단축키 조합에 쓰이는 특수 명령 키를 나타냄, 커맨드 키 | 확인 [ICLU] | `lucide:command` |
| ICO-467 | 가운뎃점 — bullet | 부품 | 항목 앞에 찍는 작은 점 | 확장 [MK] | `lucide:circle-small` |
| ICO-468 | 중간 대시 — en dash | 부품 | 숫자 범위를 이음 | 확장 [MK] | `lucide:minus` |
| ICO-469 | 긴 대시 — em dash | 부품 | 문장 중간에 끼워 넣는 말을 가름 | 확장 [MK] | `lucide:minus` |
| ICO-470 | 붙임표 — hyphen | 부품 | 말을 이어 붙임 | 확장 [MK] | `lucide:minus` |
| ICO-471 | 말줄임표 — ellipsis | 부품 | 생략하거나 이어지는 중임을 알림 | 확장 [MK] · 대조 [ICLU] | `lucide:ellipsis` |
| ICO-472 | 큰따옴표 — quotation mark | 부품 | 인용한 말의 앞뒤 | 확장 [MK] · 대조 [ICLU] | `lucide:quote` |
| ICO-473 | 작은따옴표 — apostrophe | 부품 | 줄임과 강조에 쓰는 따옴표 | 확장 [MK] | `tabler:quotes` |
| ICO-474 | 화살표 문자 — arrow character | 부품 | 아이콘 대신 글자로 쓰는 방향 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:arrow-right` |
| ICO-475 | 체크 문자 — check mark character | 부품 | 아이콘 대신 글자로 쓰는 완료 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:check` |
| ICO-486 | 저작권 — copyright sign | 부품 | 권리 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:copyright` |
| ICO-487 | 상표 — trademark sign | 부품 | 등록 상표 표시 | 확장 [MK] | `tabler:trademark` |
| ICO-488 | 각주 표시 — footnote mark | 부품 | 아래 주석으로 연결하는 별표·단검 | 확장 [MK] | `lucide:asterisk` |
| ICO-489 | 번호 기호 — number sign | 부품 | 번호 앞에 붙이는 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:hash` |
| ICO-490 | 앰퍼샌드 — ampersand | 부품 | 둘을 잇는 그리고 | 확장 [MK] · 대조 [ICLU] | `lucide:ampersand` |
| ICO-491 | 빗금 — slash | 부품 | 경로와 둘 중 하나를 가름 | 확장 [MK] · 대조 [ICLU] | `lucide:slash` |
| ICO-492 | 세로 막대 — pipe | 부품 | 값 사이를 가르는 세로선 | 확장 [MK] · 대조 [ICLU] | `lucide:separator-vertical` |
| ICO-494 | 물결표 — tilde | 부품 | 대략과 범위를 나타냄 | 확장 [MK] | `tabler:tilde` |

## 화면 배치 — Layout & Controls

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-210 | 작은 창 재생 — picture in picture | 부품 | 다른 일을 하면서 구석에서 계속 틀음 | 확장 [MK] · 대조 [ICLU] | `lucide:picture-in-picture` |
| ICO-256 | 격자 보기 — grid view | 부품 | 같은 크기 칸에 나열함 | 확장 [MK] · 대조 [ICLU] | `lucide:layout-grid` |
| ICO-257 | 목록 보기 — list view | 부품 | 한 줄에 하나씩 나열함 | 확장 [MK] · 대조 [ICLU] | `lucide:layout-list` |
| ICO-258 | 카드 보기 — card view | 부품 | 이미지와 글을 묶은 덩어리로 나열함 | 확장 [MK] | `lucide:layout-grid` |
| ICO-259 | 칸반 보기 — board view | 부품 | 상태별 세로 줄에 카드를 늘어놓음 | 확장 [MK] · 대조 [ICLU] | `lucide:kanban` |
| ICO-260 | 표 보기 — table view | 부품 | 행과 열로 값을 나란히 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:sheet` |
| ICO-261 | 달력 보기 — calendar view | 부품 | 날짜 칸에 일정을 올림 | 확장 [MK] · 대조 [ICLU] | `lucide:calendar` |
| ICO-263 | 지도 보기 — map view | 부품 | 위치 위에 항목을 올림 | 확장 [MK] · 대조 [ICLU] | `lucide:map` |
| ICO-264 | 갤러리 보기 — gallery view | 부품 | 큰 이미지 위주로 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:gallery-horizontal` |
| ICO-265 | 공정표 보기 — gantt view | 부품 | 기간을 막대로 그린 일정표 | 확장 [MK] · 대조 [ICLU] | `lucide:square-chart-gantt` |
| ICO-266 | 계층 보기 — tree view | 부품 | 상위·하위를 접었다 폈다 하며 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:list-tree` |
| ICO-267 | 화면 나누기 — split view | 부품 | 한 화면에 둘을 나란히 둠 | 확장 [MK] · 대조 [ICLU] | `lucide:square-split-horizontal` |
| ICO-268 | 줄 간격 밀도 — density | 부품 | 한 화면에 담기는 줄 수를 조절함 | 확장 [MK] | `tabler:baseline-density-medium` |
| ICO-269 | 열 고르기 — choose columns | 부품 | 표에서 보일 항목을 정함 | 확장 [MK] · 대조 [ICLU] | `lucide:columns-3-cog` |
| ICO-270 | 묶음 기준 — group by | 부품 | 같은 값끼리 모아 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:group` |
| ICO-558 | 여러 단 — columns | 부품 | 화면을 세로로 나눠 나란히 배치함을 나타냄, 두 기둥 모양 | 확인 [ICLU] | `lucide:columns-2` |
| ICO-559 | 여러 줄 — rows | 부품 | 화면을 가로로 나눠 위아래로 배치함을 나타냄, 두 칸 모양 | 확인 [ICLU] | `lucide:rows-2` |
| ICO-560 | 위 패널 — panel top | 부품 | 화면 위쪽에 보조 작업 영역을 펼쳐서 열어 둠을 나타냄 | 확인 [ICLU] | `lucide:panel-top` |
| ICO-561 | 아래 패널 — panel bottom | 부품 | 화면 아래쪽에 보조 작업 영역을 펼쳐서 열어 둠을 나타냄 | 확인 [ICLU] | `lucide:panel-bottom` |
| ICO-562 | 창 모드 — app window | 부품 | 앱을 전체화면이 아닌 띄운 창으로 봄을 나타냄 | 확인 [ICLU] | `lucide:app-window` |
| ICO-563 | 발표 모드 — presentation | 부품 | 슬라이드를 화면 가득 띄워 발표하는 보기로 바꿈을 나타냄 | 확인 [ICLU] | `lucide:presentation` |
| ICO-564 | 위젯 모음 — widgets | 부품 | 화면에 붙여 쓰는 작은 기능 조각들을 나타냄, 퍼즐 조각 모양 | 확인 [ICLU] | `lucide:component` |
| ICO-565 | 위 정렬 — align top | 부품 | 고른 요소들의 위쪽 끝을 나란히 맞춤을 나타냄 | 확인 [ICLU] | `lucide:align-start-vertical` |
| ICO-566 | 아래 정렬 — align bottom | 부품 | 고른 요소들의 아래쪽 끝을 나란히 맞춤을 나타냄 | 확인 [ICLU] | `lucide:align-end-vertical` |
| ICO-567 | 균등 배치 — space between | 부품 | 나열된 요소 사이 간격을 똑같이 벌려서 배치함을 나타냄 | 확인 [ICLU] | `lucide:align-horizontal-space-between` |

## 차트·도표 — Charts & Diagrams

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-542 | 활동 그래프 — activity | 부품 | 지금 벌어지는 움직임·수치 변화를 실시간으로 보여줌 | 확인 [ICLU] | `lucide:activity` |
| ICO-543 | 계기판 — gauge | 부품 | 속도·성능 등 값이 어느 수준인지 바늘로 보여줌 | 확인 [ICLU] | `lucide:gauge` |
| ICO-277 | 오름세 — trending up | 부품 | 값이 올라가는 중, 오른쪽 위 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:trending-up` |
| ICO-278 | 내림세 — trending down | 부품 | 값이 내려가는 중, 오른쪽 아래 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:trending-down` |
| ICO-271 | 막대 그래프 — bar chart | 부품 | 값을 막대 길이로 견줌 | 확장 [MK] · 대조 [ICLU] | `lucide:chart-column` |
| ICO-272 | 선 그래프 — line chart | 부품 | 시간에 따른 변화를 선으로 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:chart-line` |
| ICO-273 | 원 그래프 — pie chart | 부품 | 전체에서 차지하는 몫을 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:chart-pie` |
| ICO-274 | 도넛 그래프 — donut chart | 부품 | 가운데가 뚫린 몫 그림 | 확장 [MK] | `tabler:chart-donut` |
| ICO-275 | 영역 그래프 — area chart | 부품 | 선 아래를 칠해 양을 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:chart-area` |
| ICO-276 | 점 그래프 — scatter chart | 부품 | 두 값의 관계를 점으로 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:chart-scatter` |
| ICO-568 | 버블 차트 — chart bubble | 부품 | 값 크기에 따라 원의 크기가 달라지는 그래프를 봄 | 확인 [ICSET] | `tabler:chart-bubble` |
| ICO-691 | 관계망 그래프 — chart network | 부품 | 여러 항목이 서로 연결된 관계를 점과 선으로 봄 | 확인 [ICLU] | `lucide:chart-network` |
| ICO-746 | 상승 그래프 — chart line up | 부품 | 값이 꾸준히 오르는 추세를 선 그래프로 보여줌 | 확인 [ICSET] | `lucide:trending-up` |

## 문서·폴더 — Files & Folders

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-50 | 첨부 — attach | 부품 | 파일을 메시지에 붙임, 클립 | 확장 [MK] · 대조 [ICLU] | `lucide:paperclip` |
| ICO-167 | 파일 — file | 부품 | 낱개 문서 하나, 모서리가 접힌 종이 | 확장 [MK] · 대조 [ICLU] | `lucide:file` |
| ICO-168 | 새 파일 — new file | 부품 | 빈 파일을 만듦 | 확장 [MK] · 대조 [ICLU] | `lucide:file-plus` |
| ICO-169 | 폴더 — folder | 부품 | 파일을 담는 묶음 | 확장 [MK] · 대조 [ICLU] | `lucide:folder` |
| ICO-170 | 열린 폴더 — folder open | 부품 | 지금 들어가 있는 묶음 | 확장 [MK] · 대조 [ICLU] | `lucide:folder-open` |
| ICO-171 | 새 폴더 — new folder | 부품 | 묶음을 하나 더 만듦 | 확장 [MK] · 대조 [ICLU] | `lucide:folder-plus` |
| ICO-172 | 공유 폴더 — shared folder | 부품 | 다른 사람과 같이 쓰는 묶음 | 확장 [MK] | `tabler:folder-share` |
| ICO-173 | PDF 파일 — pdf file | 부품 | 모양이 고정된 문서 형식 | 확장 [MK] | `tabler:file-type-pdf` |
| ICO-174 | 문서 파일 — document file | 부품 | 글 중심 문서 형식 | 확장 [MK] | `lucide:file-text` |
| ICO-175 | 표 파일 — spreadsheet file | 부품 | 칸과 수식이 있는 표 형식 | 확장 [MK] · 대조 [ICLU] | `lucide:file-spreadsheet` |
| ICO-176 | 발표 파일 — presentation file | 부품 | 장표로 된 발표 자료 | 확장 [MK] · 대조 [ICLU] | `lucide:presentation` |
| ICO-177 | 이미지 파일 — image file | 부품 | 사진·그림 형식 | 확장 [MK] · 대조 [ICLU] | `lucide:file-image` |
| ICO-178 | 영상 파일 — video file | 부품 | 움직이는 화면 형식 | 확장 [MK] · 대조 [ICLU] | `lucide:file-play` |
| ICO-179 | 오디오 파일 — audio file | 부품 | 소리만 담긴 형식 | 확장 [MK] · 대조 [ICLU] | `lucide:file-headphone` |
| ICO-180 | 압축 파일 — archive file | 부품 | 여러 파일을 눌러 담은 형식 | 확장 [MK] · 대조 [ICLU] | `lucide:file-archive` |
| ICO-182 | 글 파일 — text file | 부품 | 서식 없는 순수 글 | 확장 [MK] · 대조 [ICLU] | `lucide:file-text` |
| ICO-183 | 알 수 없는 파일 — unknown file | 부품 | 미리 볼 수 없는 형식 | 확장 [MK] · 대조 [ICLU] | `lucide:file-question-mark` |
| ICO-184 | 클라우드 파일 — cloud file | 부품 | 서버에만 있는 파일 | 확장 [MK] | `lucide:cloud-upload` |
| ICO-185 | 오프라인 사용 가능 — available offline | 부품 | 인터넷 없이 열 수 있게 내려받아 둔 상태 | 확장 [MK] · 대조 [ICLU] | `lucide:download` |
| ICO-186 | 휴지통 보관함 — trash bin | 부품 | 지운 것이 잠시 머무는 곳 | 확장 [MK] · 대조 [ICLU] | `lucide:trash` |
| ICO-187 | 바로가기 — shortcut | 부품 | 원본을 가리키는 연결, 작은 화살표가 겹친 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:file-symlink` |
| ICO-188 | 버전 기록 — version history | 부품 | 지난 저장본 목록 | 확장 [MK] · 대조 [ICLU] | `lucide:file-clock` |
| ICO-189 | 저장 용량 — storage | 부품 | 쓴 공간과 남은 공간, 원반 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:hard-drive` |
| ICO-190 | 링크 첨부 — linked item | 부품 | 파일 대신 주소로 붙인 자료 | 확장 [MK] · 대조 [ICLU] | `lucide:link` |
| ICO-569 | 파일 제외 — file minus | 부품 | 목록·묶음에서 파일 하나를 뺌을 나타냄, 파일 위 가로줄 | 확인 [ICLU] | `lucide:file-minus` |
| ICO-570 | 파일 확인됨 — file check | 부품 | 검토·서명이 끝난 파일임을 나타냄, 파일 위 체크 | 확인 [ICLU] | `lucide:file-check` |
| ICO-571 | 파일 취소 — file x | 부품 | 잘못되었거나 거부된 파일임을 나타냄, 파일 위 엑스 | 확인 [ICLU] | `lucide:file-x` |
| ICO-572 | 파일 찾기 — file search | 부품 | 파일 안이나 목록에서 원하는 내용을 찾음을 나타냄 | 확인 [ICLU] | `lucide:file-search` |
| ICO-573 | 잠금 폴더 — folder lock | 부품 | 다른 사람이 열어 볼 수 없게 막아 둔 폴더를 나타냄 | 확인 [ICLU] | `lucide:folder-lock` |
| ICO-574 | 파일 묶음 — files | 부품 | 여러 파일이 겹쳐 있는 모습으로 다수 파일을 나타냄 | 확인 [ICLU] | `lucide:files` |
| ICO-575 | 클립보드 — clipboard | 부품 | 복사한 내용이나 확인용 서식을 담아 두는 판을 나타냄 | 확인 [ICLU] | `lucide:clipboard` |
| ICO-576 | 점검 목록 — clipboard list | 부품 | 확인할 항목을 줄줄이 적어 둔 서식판을 나타냄 | 확인 [ICLU] | `lucide:clipboard-list` |
| ICO-577 | 노트 — notebook | 부품 | 메모를 차곡차곡 적어 두는 공책 형태 문서를 나타냄 | 확인 [ICLU] | `lucide:notebook` |
| ICO-578 | 포스트잇 — sticky note | 부품 | 짧게 붙였다가 손쉽게 떼는 메모 쪽지를 나타냄 | 확인 [ICLU] | `lucide:sticky-note` |
| ICO-584 | 폴더 구조 — folder tree | 부품 | 폴더 안에 폴더가 이어지는 계층 구조를 봄을 나타냄 | 확인 [ICLU] | `lucide:folder-tree` |
| ICO-696 | JSON 파일 — file json | 부품 | 구조화된 데이터가 담긴 JSON 형식 파일을 나타냄 | 확인 [ICLU] | `lucide:file-braces` |
| ICO-697 | HTML 파일 — html | 부품 | 웹 문서를 만드는 마크업 언어 파일임을 나타냄 | 확인 [ICSET] | `tabler:file-type-html` |
| ICO-698 | CSS 파일 — css | 부품 | 웹 화면을 꾸미는 스타일 언어 파일임을 나타냄 | 확인 [ICSET] | `tabler:file-type-css` |

## 업무·마케팅 — Business & Marketing

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-579 | 서류 가방 — briefcase | 부품 | 업무·직장과 관련된 항목들을 묶어서 나타냄, 서류 가방 모양 | 확인 [ICLU] | `lucide:briefcase` |
| ICO-581 | 도장 — stamp | 부품 | 승인·발급을 확정하는 표시를 나타냄, 도장 모양 | 확인 [ICLU] | `lucide:stamp` |
| ICO-607 | 확성기 — megaphone | 부품 | 공지·홍보를 크게 알림을 나타냄, 메가폰 모양 | 확인 [ICLU] | `lucide:megaphone` |

## 사진·영상 — Photo & Video

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-200 | 반복 — repeat | 부품 | 목록을 끝나면 다시 처음부터 틀음 | 확장 [MK] · 대조 [ICLU] | `lucide:repeat` |
| ICO-202 | 무작위 — shuffle | 부품 | 순서를 섞어 틀음, 엇갈린 두 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:shuffle` |
| ICO-132 | 녹화 중 — recording | 부품 | 지금 담고 있음, 빨간 점 | 확장 [MK] | `lucide:video` |
| ICO-191 | 재생 — play | 부품 | 소리·영상을 시작함, 오른쪽을 향한 삼각형 | 확장 [MK] · 대조 [ICLU] | `lucide:play` |
| ICO-192 | 일시정지 — pause | 부품 | 잠깐 멈추고 자리를 지킴, 세로 막대 두 개 | 확장 [MK] · 대조 [ICLU] | `lucide:pause` |
| ICO-193 | 정지 — stop | 부품 | 완전히 멈추고 처음으로 돌림, 네모 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-stop` |
| ICO-194 | 다음 — next track | 부품 | 다음 곡·영상으로 넘김 | 확장 [MK] · 대조 [ICLU] | `lucide:skip-forward` |
| ICO-195 | 이전 — previous track | 부품 | 앞 곡·영상으로 돌아감 | 확장 [MK] · 대조 [ICLU] | `lucide:skip-back` |
| ICO-196 | 빨리 감기 — fast forward | 부품 | 앞으로 빠르게 보냄 | 확장 [MK] · 대조 [ICLU] | `lucide:fast-forward` |
| ICO-197 | 되감기 — rewind | 부품 | 뒤로 빠르게 보냄 | 확장 [MK] · 대조 [ICLU] | `lucide:rewind` |
| ICO-198 | 조금 앞으로 — skip forward | 부품 | 정해진 초만큼 건너뜀, 화살표 안의 숫자 | 확장 [MK] · 대조 [ICLU] | `lucide:skip-forward` |
| ICO-199 | 조금 뒤로 — skip back | 부품 | 정해진 초만큼 되돌림 | 확장 [MK] · 대조 [ICLU] | `lucide:skip-back` |
| ICO-201 | 한 곡 반복 — repeat one | 부품 | 지금 것만 계속 틀음 | 확장 [MK] | `lucide:repeat-1` |
| ICO-203 | 음량 — volume | 부품 | 소리 크기 조절, 스피커와 물결 | 확장 [MK] · 대조 [ICLU] | `lucide:volume` |
| ICO-204 | 음소거 — mute | 부품 | 소리를 끔, 사선이 그어진 스피커 | 확장 [MK] · 대조 [ICLU] | `lucide:volume-x` |
| ICO-205 | 음량 올리기 — volume up | 부품 | 소리를 키움 | 확장 [MK] · 대조 [ICLU] | `lucide:volume-2` |
| ICO-206 | 음량 내리기 — volume down | 부품 | 소리를 줄임 | 확장 [MK] · 대조 [ICLU] | `lucide:volume-1` |
| ICO-207 | 자막 — captions | 부품 | 대사를 글로 보임 | 확장 [MK] · 대조 [ICLU] | `lucide:captions` |
| ICO-208 | 화질 — quality | 부품 | 해상도 단계를 고름 | 확장 [MK] | `tabler:badge-hd` |
| ICO-209 | 재생 속도 — playback speed | 부품 | 빠르게·느리게 트는 배속 | 확장 [MK] · 대조 [ICLU] | `lucide:gauge` |
| ICO-211 | 다른 화면으로 — cast | 부품 | TV·스피커로 넘겨 재생함 | 확장 [MK] · 대조 [ICLU] | `lucide:cast` |
| ICO-213 | 재생목록 — playlist | 부품 | 이어서 틀 목록 | 확장 [MK] · 대조 [ICLU] | `lucide:list-music` |
| ICO-214 | 대기열 추가 — add to queue | 부품 | 지금 것 다음에 틀도록 끼워 넣음 | 확장 [MK] · 대조 [ICLU] | `lucide:list-plus` |
| ICO-341 | 카메라 — camera | 부품 | 사진을 찍음 | 확장 [MK] · 대조 [ICLU] | `lucide:camera` |
| ICO-587 | 라디오 — radio | 부품 | 실시간 방송 채널을 나타냄, 라디오 기기 모양 | 확인 [ICLU] | `lucide:radio` |
| ICO-588 | 팟캐스트 — podcast | 부품 | 녹음된 이야기 방송을 나타냄, 전파가 나오는 마이크 | 확인 [ICLU] | `lucide:mic-signal` |
| ICO-589 | 영상 콘텐츠 — video | 부품 | 움직이는 화면 콘텐츠 자체를 나타냄, 캠코더 모양 | 확인 [ICLU] | `lucide:video` |
| ICO-590 | 필름 — film | 부품 | 영화·동영상 콘텐츠 묶음을 나타냄, 필름 조각 모양 | 확인 [ICLU] | `lucide:film` |
| ICO-591 | 슬레이트 — clapperboard | 부품 | 촬영·제작 중인 영상 콘텐츠를 나타냄, 영화 슬레이트 모양 | 확인 [ICLU] | `lucide:clapperboard` |
| ICO-592 | 사진 — image | 부품 | 사진 콘텐츠 한 장을 나타냄, 산과 해가 있는 그림 | 확인 [ICLU] | `lucide:image` |
| ICO-593 | 사진 여러 장 — images | 부품 | 여러 장의 사진이 겹친 모습으로 앨범·묶음을 나타냄 | 확인 [ICLU] | `lucide:images` |
| ICO-594 | 조리개 — aperture | 부품 | 카메라 렌즈 조리개를 나타냄, 카메라 앱 상징으로도 씀 | 확인 [ICLU] | `lucide:aperture` |
| ICO-595 | 초점 — focus | 부품 | 카메라가 사물에 초점을 맞추는 동작을 나타냄, 네 모서리 표시 | 확인 [ICLU] | `lucide:focus` |
| ICO-596 | 플래시 — flash | 부품 | 촬영 시 빛을 터뜨리는 기능을 나타냄, 번개 모양 | 확인 [ICSET] | `lucide:zap` |
| ICO-597 | 음파 — audio waveform | 부품 | 소리의 크기 변화를 굴곡진 파형으로 보여줌을 나타냄 | 확인 [ICLU] | `lucide:audio-waveform` |
| ICO-342 | 카메라 전환 — switch camera | 부품 | 앞뒤 렌즈를 바꿈 | 확장 [MK] · 대조 [ICLU] | `lucide:switch-camera` |
| ICO-662 | 웹캠 — webcam | 부품 | 컴퓨터에 연결해 화상 통화용 영상을 찍는 카메라를 나타냄 | 확인 [ICLU] | `lucide:webcam` |

## 음악·소리 — Music & Audio

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-212 | 가사 — lyrics | 부품 | 노래 글자를 시간에 맞춰 보임 | 확장 [MK] · 대조 [ICLU] | `lucide:captions` |
| ICO-215 | 녹음 — record audio | 부품 | 소리를 담기 시작함 | 확장 [MK] · 대조 [ICLU] | `lucide:mic` |
| ICO-343 | 마이크 — microphone | 부품 | 소리를 받아들임 | 확장 [MK] · 대조 [ICLU] | `lucide:mic` |
| ICO-344 | 마이크 끔 — microphone off | 부품 | 내 소리를 보내지 않음 | 확장 [MK] · 대조 [ICLU] | `lucide:mic-off` |
| ICO-346 | 헤드폰 — headphones | 부품 | 귀에 쓰는 듣기 기기 | 확장 [MK] · 대조 [ICLU] | `lucide:headphones` |
| ICO-585 | 음악 — music | 부품 | 노래·소리로 이뤄진 콘텐츠를 나타냄, 음표 모양 | 확인 [ICLU] | `lucide:music` |
| ICO-586 | 음반 — disc | 부품 | 저장된 음악·데이터가 담긴 원반을 나타냄, CD 모양 | 확인 [ICLU] | `lucide:disc` |
| ICO-598 | 기타 — guitar | 부품 | 악기·음악 장르 중 기타 연주를 나타냄, 통기타 모양 | 확인 [ICLU] | `lucide:guitar` |
| ICO-599 | 피아노 — piano | 부품 | 악기·음악 장르 중 피아노를 나타냄, 건반 모양 | 확인 [ICLU] | `lucide:piano` |
| ICO-600 | 드럼 — drum | 부품 | 악기·음악 장르 중 타악기 연주를 나타냄, 드럼 모양 | 확인 [ICLU] | `lucide:drum` |
| ICO-601 | 레코드판 — vinyl | 부품 | 옛 방식의 음반 재생을 나타냄, 턴테이블 판 모양 | 확인 [ICSET] | `tabler:vinyl` |
| ICO-602 | 이퀄라이저 — equalizer | 부품 | 음역대별 소리 크기를 막대로 조절하는 도구를 나타냄 | 확인 [ICLU] | `lucide:sliders-vertical` |
| ICO-345 | 스피커 — speaker | 부품 | 소리를 내보내는 기기 | 확장 [MK] · 대조 [ICLU] | `lucide:speaker` |
| ICO-674 | 헤드셋 — headset | 부품 | 마이크가 달린 통화나 상담용 이어폰을 나타냄, 헤드셋 모양 | 확인 [ICLU] | `lucide:headset` |
| ICO-1183 | 마이크 — mic vocal | 부품 | 공연·행사 사회를 나타냄, 그물망 씌운 마이크 모양 | 확인 [ICLU] | `lucide:mic-vocal` |

## 소통·메시지 — Communication

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-42 | 공유 — share | 부품 | 다른 사람·앱으로 내보냄, 점 세 개 연결이나 상자에서 나가는 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:share` |
| ICO-49 | 보내기 — send | 부품 | 메시지를 상대에게 전송함, 종이비행기 | 확장 [MK] · 대조 [ICLU] | `lucide:send` |
| ICO-146 | 답글 — reply | 부품 | 특정 글에 대한 답, 왼쪽으로 굽은 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:reply` |
| ICO-147 | 전체 답장 — reply all | 부품 | 받은 사람 모두에게 답함 | 확장 [MK] · 대조 [ICLU] | `lucide:reply-all` |
| ICO-580 | 받은함 — inbox | 부품 | 새로 들어온 메일·요청이 쌓이는 보관함을 나타냄 | 확인 [ICLU] | `lucide:inbox` |
| ICO-583 | 신문 — newspaper | 부품 | 기사·소식 모음 콘텐츠를 나타냄, 신문 지면 모양 | 확인 [ICLU] | `lucide:newspaper` |
| ICO-144 | 채팅 — chat bubble | 부품 | 주고받는 대화, 말풍선 | 확장 [MK] · 대조 [ICLU] | `lucide:message-circle` |
| ICO-145 | 댓글 — comment | 부품 | 내용에 붙는 의견 | 확장 [MK] · 대조 [ICLU] | `lucide:message-square-text` |
| ICO-149 | 메일 — mail | 부품 | 편지함·메일 주소, 닫힌 봉투 | 확장 [MK] · 대조 [ICLU] | `lucide:mail` |
| ICO-150 | 메일 열림 — mail opened | 부품 | 이미 읽은 메일, 열린 봉투 | 확장 [MK] · 대조 [ICLU] | `lucide:mail-open` |
| ICO-151 | 전화 — phone call | 부품 | 통화 걸기, 수화기 | 확장 [MK] · 대조 [ICLU] | `lucide:phone-call` |
| ICO-152 | 통화 종료 — hang up | 부품 | 전화를 끊음, 기울어진 수화기 | 확장 [MK] · 대조 [ICLU] | `lucide:phone-off` |
| ICO-155 | 멘션 — mention | 부품 | 특정 사람을 불러 알림, 골뱅이표 | 확장 [MK] · 대조 [ICLU] | `lucide:at-sign` |
| ICO-156 | 해시태그 — hashtag | 부품 | 주제 묶음 이름 | 확장 [MK] · 대조 [ICLU] | `lucide:hash` |
| ICO-163 | 연락처 — contacts | 부품 | 저장한 사람 목록, 주소록 책 | 확장 [MK] | `tabler:address-book` |
| ICO-164 | 명함 — contact card | 부품 | 한 사람의 정보 카드 | 확장 [MK] · 대조 [ICLU] | `lucide:contact` |
| ICO-216 | 방송 시작 — broadcast | 부품 | 여러 사람에게 실시간으로 내보냄 | 확장 [MK] | `tabler:broadcast` |
| ICO-603 | 메시지함 — messages | 부품 | 여러 대화 목록을 모아 보여줌을 나타냄, 말풍선 여러 개 | 확인 [ICLU] | `lucide:messages-circle` |
| ICO-604 | 통화 앱 — phone | 부품 | 전화 걸고 받는 기능 전체를 나타냄, 수화기 모양 | 확인 [ICLU] | `lucide:phone` |
| ICO-605 | 음성 사서함 — voicemail | 부품 | 받지 못한 전화가 남긴 음성 메시지함을 나타냄 | 확인 [ICLU] | `lucide:voicemail` |
| ICO-606 | RSS 구독 — rss | 부품 | 새 글이 올라오면 자동으로 받아보는 구독 채널을 나타냄 | 확인 [ICLU] | `lucide:rss` |
| ICO-608 | 음성 메시지 — voice | 부품 | 말로 녹음해서 보내는 음성 메시지를 나타냄, 마이크 모양 | 확인 [ICSET] | `tabler:voice` |
| ICO-609 | 문자 메시지 — sms | 부품 | 전화번호로 주고받는 짧은 글자 메시지를 나타냄 | 확인 [ICSET] | `tabler:device-mobile-message` |
| ICO-610 | 팩스 — fax | 부품 | 종이 문서를 전화선으로 주고받는 기기를 나타냄 | 확인 [ICSET] | `lucide:printer` |
| ICO-611 | 대화 중 표시 — chat dots | 부품 | 상대가 지금 답장을 입력하고 있음을 나타냄, 점 세 개 | 확인 [ICSET] | `tabler:message-dots` |
| ICO-612 | 메일 쓰기 — mail plus | 부품 | 새 메일을 작성함을 나타냄, 봉투 위 플러스 기호 | 확인 [ICLU] | `lucide:mail-plus` |
| ICO-613 | 메일 확인됨 — mail check | 부품 | 보낸 메일이 제대로 전달됐음을 나타냄, 봉투 위 체크 | 확인 [ICLU] | `lucide:mail-check` |
| ICO-614 | 새 대화 — message plus | 부품 | 새로운 대화를 시작함을 나타냄, 말풍선 위 플러스 | 확인 [ICSET] | `tabler:message-plus` |
| ICO-615 | 메시지 차단 — message off | 부품 | 특정 상대의 메시지를 받지 않게 막음을 나타냄 | 확인 [ICSET] | `tabler:message-off` |
| ICO-616 | 수신 전화 — phone incoming | 부품 | 걸려오는 전화를 받는 중임을 나타냄, 안으로 향한 화살표 | 확인 [ICLU] | `lucide:phone-incoming` |
| ICO-617 | 발신 전화 — phone outgoing | 부품 | 내가 거는 중인 전화를 나타냄, 밖으로 향한 화살표 | 확인 [ICLU] | `lucide:phone-outgoing` |
| ICO-618 | 부재중 전화 — phone missed | 부품 | 받지 못하고 놓친 전화 기록을 나타냄, 부재중 표시 | 확인 [ICLU] | `lucide:phone-missed` |
| ICO-148 | 전달 — forward message | 부품 | 받은 내용을 다른 사람에게 넘김 | 확장 [MK] · 대조 [ICLU] | `lucide:forward` |
| ICO-153 | 영상 통화 — video call | 부품 | 얼굴 보며 통화, 캠코더 | 확장 [MK] · 대조 [ICLU] | `lucide:video` |
| ICO-154 | 화면 공유 — screen share | 부품 | 내 화면을 상대에게 보임 | 확장 [MK] · 대조 [ICLU] | `lucide:screen-share` |
| ICO-165 | 고객 지원 — support | 부품 | 상담 창구로 연결, 헤드셋 | 확장 [MK] · 대조 [ICLU] | `lucide:headset` |
| ICO-166 | 의견 보내기 — feedback | 부품 | 제품에 대한 생각을 전함 | 확장 [MK] · 대조 [ICLU] | `lucide:message-square` |

## 기기·연결 — Devices & Connectivity

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-358 | 전원 — power | 부품 | 켜고 끔, 원과 세로 막대 | 확장 [MK] · 대조 [ICLU] | `lucide:power` |
| ICO-113 | 신호 세기 — signal strength | 부품 | 통신이 얼마나 잘 잡히는지, 높이가 커지는 막대 | 확장 [MK] · 대조 [ICLU] | `lucide:signal` |
| ICO-349 | 와이파이 끊김 — wifi off | 부품 | 무선 인터넷이 닿지 않음 | 확장 [MK] · 대조 [ICLU] | `lucide:wifi-off` |
| ICO-539 | 배터리 부족 — battery warning | 부품 | 배터리 전력이 얼마 남지 않아 충전이 필요한 상태임을 알림 | 확인 [ICLU] | `lucide:battery-warning` |
| ICO-111 | 배터리 — battery | 부품 | 남은 전력량 | 확장 [MK] · 대조 [ICLU] | `lucide:battery` |
| ICO-112 | 충전 중 — charging | 부품 | 전원에 꽂혀 채워지는 중, 배터리 위 번개 | 확장 [MK] · 대조 [ICLU] | `lucide:battery-charging` |
| ICO-334 | 휴대폰 — smartphone | 부품 | 손에 드는 작은 화면 기기 | 확장 [MK] · 대조 [ICLU] | `lucide:smartphone` |
| ICO-335 | 태블릿 — tablet | 부품 | 중간 크기 판 모양 기기 | 확장 [MK] · 대조 [ICLU] | `lucide:tablet` |
| ICO-336 | 노트북 — laptop | 부품 | 접히는 개인 컴퓨터 | 확장 [MK] · 대조 [ICLU] | `lucide:laptop` |
| ICO-337 | 데스크톱 — desktop | 부품 | 책상 위 큰 화면 컴퓨터 | 확장 [MK] · 대조 [ICLU] | `lucide:monitor` |
| ICO-339 | 텔레비전 — tv | 부품 | 멀리서 보는 큰 화면 | 확장 [MK] · 대조 [ICLU] | `lucide:tv` |
| ICO-340 | 프린터 — printer | 부품 | 종이로 뽑는 기기 | 확장 [MK] · 대조 [ICLU] | `lucide:printer` |
| ICO-347 | 블루투스 — bluetooth | 부품 | 가까운 기기끼리 무선으로 이음 | 확장 [MK] · 대조 [ICLU] | `lucide:bluetooth` |
| ICO-348 | 와이파이 — wifi | 부품 | 무선 인터넷 연결 | 확장 [MK] · 대조 [ICLU] | `lucide:wifi` |
| ICO-350 | 모바일 데이터 — cellular | 부품 | 통신사 회선으로 연결함 | 확장 [MK] · 대조 [ICLU] | `lucide:card-sim` |
| ICO-351 | 비행기 모드 — airplane mode | 부품 | 모든 무선을 끔 | 확장 [MK] · 대조 [ICLU] | `lucide:plane` |
| ICO-352 | USB — usb | 부품 | 선으로 잇는 연결 단자 | 확장 [MK] · 대조 [ICLU] | `lucide:usb` |
| ICO-353 | 화면 회전 — screen rotation | 부품 | 가로·세로 방향을 바꾸거나 잠금 | 확장 [MK] · 대조 [ICLU] | `lucide:rotate-cw` |
| ICO-355 | 어두운 모드 — dark mode | 부품 | 배경이 어두운 화면으로 바꿈, 초승달 | 확장 [MK] · 대조 [ICLU] | `lucide:moon` |
| ICO-356 | 밝은 모드 — light mode | 부품 | 배경이 밝은 화면으로 바꿈, 해 | 확장 [MK] · 대조 [ICLU] | `lucide:sun` |
| ICO-357 | 진동 — vibration | 부품 | 소리 대신 떨림으로 알림 | 확장 [MK] · 대조 [ICLU] | `lucide:vibrate` |
| ICO-359 | 전원 끄기 — power off | 부품 | 기기를 완전히 끔 | 확장 [MK] · 대조 [ICLU] | `lucide:power-off` |
| ICO-360 | 키보드 — keyboard | 부품 | 글자 입력 장치 | 확장 [MK] · 대조 [ICLU] | `lucide:keyboard` |
| ICO-361 | 마우스 — mouse | 부품 | 가리키는 입력 장치 | 확장 [MK] · 대조 [ICLU] | `lucide:mouse` |
| ICO-363 | 근거리 인식 — nfc | 부품 | 대면 결제·태그 인식 | 확장 [MK] · 대조 [ICLU] | `lucide:nfc` |
| ICO-518 | 처리 장치 — CPU | 부품 | 컴퓨터의 계산을 맡는 부품을 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:cpu` |
| ICO-519 | 메모리 — RAM | 부품 | 지금 쓰는 정보를 잠깐 담아 두는 부품을 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:memory-stick` |
| ICO-520 | 저장 공간 — disk | 부품 | 파일을 오래 담아 두는 공간을 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:hard-drive` |
| ICO-663 | 전원 플러그 — plug | 부품 | 전원에 꽂아 연결함을 나타냄, 콘센트 플러그 모양 | 확인 [ICLU] | `lucide:plug` |
| ICO-664 | 케이블 — cable | 부품 | 기기와 기기를 잇는 유선 연결선을 나타냄, 케이블 모양 | 확인 [ICLU] | `lucide:cable` |
| ICO-665 | 공유기 — router | 부품 | 인터넷을 여러 기기에 나눠 주는 장비를 나타냄 | 확인 [ICLU] | `lucide:router` |
| ICO-666 | 송신탑 — radio tower | 부품 | 전파를 멀리까지 내보내는 통신탑을 나타냄, 송신탑 모양 | 확인 [ICLU] | `lucide:radio-tower` |
| ICO-667 | 위성 안테나 — satellite dish | 부품 | 위성에서 오는 신호를 받는 접시 안테나를 나타냄 | 확인 [ICLU] | `lucide:satellite-dish` |
| ICO-668 | 유심 카드 — sim card | 부품 | 이동통신 가입자 정보가 담긴 소형 카드를 나타냄 | 확인 [ICSET] | `lucide:card-sim` |
| ICO-669 | SD 카드 — sd card | 부품 | 사진이나 파일을 담아 두는 외장 저장 카드를 나타냄 | 확인 [ICLU] | `lucide:memory-stick` |
| ICO-670 | 프로젝터 — projector | 부품 | 화면을 벽이나 스크린에 크게 쏘아 보여주는 기기를 나타냄 | 확인 [ICLU] | `lucide:projector` |
| ICO-671 | 무선 화면 공유 — airplay | 부품 | 가까운 기기로 화면·소리를 무선 전송함을 나타냄 | 확인 [ICLU] | `lucide:airplay` |
| ICO-672 | 리모컨 — remote control | 부품 | 멀리서 기기를 조작하는 조작 장치를 나타냄, 리모컨 모양 | 확인 [ICSET] | `tabler:remote-control` |
| ICO-673 | 전구 — lightbulb | 부품 | 새로운 아이디어나 조명 기능을 나타냄, 전구 모양 | 확인 [ICLU] | `lucide:lightbulb` |
| ICO-676 | 유선 랜 — ethernet | 부품 | 선을 꽂아 연결하는 유선 인터넷 단자를 나타냄 | 확인 [ICSET] | `lucide:ethernet-port` |
| ICO-677 | QR 스캔 — qr scanner | 부품 | 카메라로 QR 코드를 인식함을 나타냄, 모서리 프레임 | 확인 [ICLU] | `lucide:scan-qr-code` |
| ICO-678 | 플러그 뽑힘 — power plug off | 부품 | 전원 코드가 빠져 연결이 끊겼음을 나타냄, 플러그와 사선 | 확인 [ICLU] | `lucide:power-off` |
| ICO-338 | 스마트워치 — smartwatch | 부품 | 손목에 차는 아주 작은 화면 | 확장 [MK] · 대조 [ICLU] | `lucide:watch` |
| ICO-354 | 밝기 — brightness | 부품 | 화면을 밝거나 어둡게 함 | 확장 [MK] · 대조 [ICLU] | `lucide:sun-dim` |
| ICO-1070 | VR 헤드셋 — vr headset | 부품 | 가상현실 기기·모드를 나타냄, 얼굴에 쓰는 고글 형태 | 확인 [ICSET] | `lucide:rectangle-goggles` |

## 개발·데이터·AI — Development, Data & AI

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-181 | 코드 파일 — code file | 부품 | 프로그램 소스 형식 | 확장 [MK] · 대조 [ICLU] | `lucide:file-code` |
| ICO-384 | 데이터베이스 — database | 부품 | 값을 쌓아 두는 저장소, 원통 세 겹 | 확장 [MK] · 대조 [ICLU] | `lucide:database` |
| ICO-386 | 서버 — server | 부품 | 요청을 처리하는 컴퓨터, 가로로 쌓인 상자 | 확장 [MK] · 대조 [ICLU] | `lucide:server` |
| ICO-387 | API — api | 부품 | 프로그램끼리 주고받는 창구 | 확장 [MK] | `tabler:api` |
| ICO-388 | 코드 — code | 부품 | 프로그램 글자, 좌우 꺾쇠 | 확장 [MK] · 대조 [ICLU] | `lucide:code` |
| ICO-389 | 터미널 — terminal | 부품 | 글자로 명령을 넣는 창 | 확장 [MK] · 대조 [ICLU] | `lucide:terminal` |
| ICO-391 | 브랜치 — branch | 부품 | 갈라진 작업 줄기 | 확장 [MK] · 대조 [ICLU] | `lucide:git-branch` |
| ICO-392 | 커밋 — commit | 부품 | 변경을 기록으로 남긴 한 점 | 확장 [MK] · 대조 [ICLU] | `lucide:git-commit-horizontal` |
| ICO-393 | 병합 요청 — pull request | 부품 | 내 작업을 본줄기에 합쳐 달라는 요청 | 확장 [MK] · 대조 [ICLU] | `lucide:git-pull-request` |
| ICO-394 | 버전 태그 — version tag | 부품 | 특정 시점에 붙인 이름표 | 확장 [MK] · 대조 [ICLU] | `lucide:tag` |
| ICO-396 | 플러그인 — plugin | 부품 | 끼워 넣어 기능을 더함, 퍼즐 조각 | 확장 [MK] · 대조 [ICLU] | `lucide:puzzle` |
| ICO-397 | 컨테이너 — container | 부품 | 실행 환경째 담은 묶음 | 확장 [MK] · 대조 [ICLU] | `lucide:container` |
| ICO-398 | 네트워크 — network | 부품 | 서로 이어진 점과 선 | 확장 [MK] · 대조 [ICLU] | `lucide:network` |
| ICO-399 | 로그 — logs | 부품 | 무슨 일이 있었는지 적힌 줄글 기록 | 확장 [MK] · 대조 [ICLU] | `lucide:logs` |
| ICO-400 | 지표 — metrics | 부품 | 상태를 숫자로 재어 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:chart-line` |
| ICO-401 | 빌드 — build | 부품 | 소스를 실행 가능한 형태로 만듦, 망치 | 확장 [MK] · 대조 [ICLU] | `lucide:hammer` |
| ICO-402 | 배포 — deploy | 부품 | 만든 것을 실제 서비스에 올림, 로켓 | 확장 [MK] · 대조 [ICLU] | `lucide:rocket` |
| ICO-403 | 테스트 — test | 부품 | 제대로 도는지 자동으로 확인함, 플라스크 | 확장 [MK] · 대조 [ICLU] | `lucide:flask-conical` |
| ICO-404 | 실험 — experiment | 부품 | 두 안을 나눠 비교함 | 확장 [MK] · 대조 [ICLU] | `lucide:test-tube` |
| ICO-405 | 웹훅 — webhook | 부품 | 일이 생기면 자동으로 알리는 연결 | 확장 [MK] · 대조 [ICLU] | `lucide:webhook` |
| ICO-406 | 자동화 — automation | 부품 | 조건이 맞으면 스스로 실행됨 | 확장 [MK] · 대조 [ICLU] | `lucide:workflow` |
| ICO-407 | 질의 — query | 부품 | 저장된 값을 조건으로 찾아옴 | 확장 [MK] · 대조 [ICLU] | `lucide:database-search` |
| ICO-408 | 스키마 — schema | 부품 | 값의 구조와 규칙 | 확장 [MK] · 대조 [ICLU] | `lucide:table-properties` |
| ICO-409 | 캐시 — cache | 부품 | 자주 쓰는 값을 가까이 두고 빨리 꺼냄 | 확장 [MK] · 대조 [ICLU] | `lucide:database-zap` |
| ICO-410 | 인공지능 — ai assistant | 부품 | 모델이 돕는 기능임을 알림, 반짝이는 별 | 확장 [MK] · 대조 [ICLU] | `lucide:sparkles` |
| ICO-411 | 봇 — bot | 부품 | 사람이 아닌 자동 응답 주체 | 확장 [MK] · 대조 [ICLU] | `lucide:bot` |
| ICO-412 | 개발 문서 — developer docs | 부품 | 쓰는 법이 적힌 안내서 | 확장 [MK] · 대조 [ICLU] | `lucide:book-open-text` |
| ICO-413 | 라이선스 — license | 부품 | 쓸 수 있는 조건 | 확장 [MK] · 대조 [ICLU] | `lucide:creative-commons` |
| ICO-414 | 저장소 — repository | 부품 | 코드가 모여 있는 곳 | 확장 [MK] · 대조 [ICLU] | `lucide:git-branch` |
| ICO-515 | 분기 — fork | 부품 | 원본 코드를 복제해 내 것으로 따로 관리함 | 확장 [MK] · 대조 [ICLU] | `lucide:git-fork` |
| ICO-516 | 복제 — clone | 부품 | 원격 저장소를 내 컴퓨터로 그대로 내려받음 | 확장 [MK] · 대조 [ICLU] | `lucide:hard-drive-download` |
| ICO-517 | 병합 충돌 — merge conflict | 부품 | 같은 부분을 서로 다르게 고쳐 자동으로 합칠 수 없는 상태 | 확장 [MK] · 대조 [ICLU] | `lucide:file-diff` |
| ICO-679 | 브랜치 병합 — git merge | 부품 | 서로 다른 작업 줄기를 하나로 합침을 나타냄, 나뭇가지 모이는 모양 | 확인 [ICLU] | `lucide:git-merge` |
| ICO-680 | 코드 비교 — git compare | 부품 | 두 버전이나 브랜치의 차이를 나란히 놓고 봄을 나타냄 | 확인 [ICLU] | `lucide:git-compare` |
| ICO-681 | 클라우드 업로드 — cloud upload | 부품 | 파일을 온라인 저장소로 올림을 나타냄, 구름 위 화살표 | 확인 [ICLU] | `lucide:cloud-upload` |
| ICO-682 | 클라우드 다운로드 — cloud download | 부품 | 온라인 저장소에서 파일을 받음을 나타냄, 구름 아래 화살표 | 확인 [ICLU] | `lucide:cloud-download` |
| ICO-683 | 중괄호 — braces | 부품 | 코드나 데이터 구조의 범위를 나타냄, 중괄호 기호 모양 | 확인 [ICLU] | `lucide:braces` |
| ICO-684 | 함수 — function | 부품 | 입력값을 계산해 결과를 내는 함수를 나타냄, f(x) 기호 | 확인 [ICLU] | `lucide:square-function` |
| ICO-685 | 변수 — variable | 부품 | 값이 바뀔 수 있는 데이터 항목을 나타냄, x 기호 | 확인 [ICLU] | `lucide:variable` |
| ICO-686 | 정규식 — regex | 부품 | 문자열에서 특정 패턴을 찾는 정규 표현식을 나타냄 | 확인 [ICLU] | `lucide:regex` |
| ICO-687 | 이진수 — binary | 부품 | 0과 1로만 이뤄진 이진 데이터를 나타냄, 이진수 표시 | 확인 [ICLU] | `lucide:binary` |
| ICO-688 | 워크플로 — workflow | 부품 | 여러 단계가 이어지는 자동화 절차를 나타냄, 흐름도 모양 | 확인 [ICLU] | `lucide:workflow` |
| ICO-689 | 사이트맵 — sitemap | 부품 | 웹사이트 전체 페이지 구조를 나무 모양으로 봄 | 확인 [ICSET] | `tabler:sitemap` |
| ICO-690 | 회로 기판 — circuit board | 부품 | 하드웨어나 시스템 내부 구조를 나타냄, 회로 기판 모양 | 확인 [ICLU] | `lucide:circuit-board` |
| ICO-693 | 디버그 실행 — bug play | 부품 | 코드 오류를 한 단계씩 살펴보며 실행함을 나타냄 | 확인 [ICLU] | `lucide:bug-play` |
| ICO-694 | DB 백업 — database backup | 부품 | 데이터베이스 내용을 별도로 복제해 둠을 나타냄 | 확인 [ICLU] | `lucide:database-backup` |
| ICO-695 | 클라우드 설정 — cloud cog | 부품 | 온라인 저장소·서비스의 설정값을 관리함을 나타냄 | 확인 [ICLU] | `lucide:cloud-cog` |
| ICO-395 | 패키지 — package | 부품 | 묶어서 배포하는 덩어리, 상자 | 확장 [MK] · 대조 [ICLU] | `lucide:package` |
| ICO-390 | 버그 — bug | 부품 | 프로그램의 잘못, 벌레 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:bug` |
| ICO-385 | 클라우드 — cloud | 부품 | 인터넷 너머 서버 자원 | 확장 [MK] · 대조 [ICLU] | `lucide:cloud` |

## 디자인·도형 — Design & Shapes

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-533 | 지우개 — eraser | 부품 | 그리거나 쓴 내용을 문질러 지움을 나타냄, 지우개 모양 | 확인 [ICLU] | `lucide:eraser` |
| ICO-71 | 자르기 — crop | 부품 | 이미지 가장자리를 잘라냄 | 확장 [MK] · 대조 [ICLU] | `lucide:crop` |
| ICO-73 | 좌우 뒤집기 — flip horizontal | 부품 | 그림을 좌우로 뒤집음 | 확장 [MK] · 대조 [ICLU] | `lucide:square-centerline-dashed-horizontal` |
| ICO-74 | 상하 뒤집기 — flip vertical | 부품 | 그림을 위아래로 뒤집음 | 확장 [MK] · 대조 [ICLU] | `lucide:square-centerline-dashed-vertical` |
| ICO-280 | 레이어 — layers | 부품 | 겹쳐 쌓인 층을 다룸 | 확장 [MK] · 대조 [ICLU] | `lucide:layers` |
| ICO-282 | 안내선 — guides | 부품 | 맞춤을 돕는 보조선 | 확장 [MK] · 대조 [ICLU] | `lucide:ruler` |
| ICO-283 | 개체 맞춤 — align objects | 부품 | 고른 것들의 변을 나란히 맞춤 | 확장 [MK] · 대조 [ICLU] | `lucide:align-center-horizontal` |
| ICO-284 | 간격 고르게 — distribute | 부품 | 사이 간격을 같게 벌림 | 확장 [MK] · 대조 [ICLU] | `lucide:align-horizontal-distribute-center` |
| ICO-699 | 색상 팔레트 — palette | 부품 | 여러 색상을 한데 모아 놓고 고르는 색상판을 나타냄 | 확인 [ICLU] | `lucide:palette` |
| ICO-700 | 붓 — paintbrush | 부품 | 그림을 그리거나 색을 칠하는 도구를 나타냄, 붓 모양 | 확인 [ICLU] | `lucide:paintbrush` |
| ICO-701 | 펜 도구 — pen tool | 부품 | 점을 찍어 곡선·도형 윤곽을 그리는 도구를 나타냄 | 확인 [ICLU] | `lucide:pen-tool` |
| ICO-702 | 제도 도구 — pencil ruler | 부품 | 자와 연필로 정밀하게 그리는 제도 작업을 나타냄 | 확인 [ICLU] | `lucide:pencil-ruler` |
| ICO-703 | 스포이드 — eyedropper | 부품 | 화면에 있는 색을 그대로 추출하는 도구를 나타냄 | 확인 [ICLU] | `lucide:pipette` |
| ICO-704 | 도형 모음 — shapes | 부품 | 여러 가지 기본 도형을 모아 놓은 도구를 나타냄 | 확인 [ICLU] | `lucide:shapes` |
| ICO-705 | 정사각형 — square | 부품 | 네 변의 길이가 모두 같은 사각 도형을 나타냄 | 확인 [ICLU] | `lucide:square` |
| ICO-706 | 원 — circle | 부품 | 둥글게 이어진 원형 도형을 나타냄, 동그라미 모양 | 확인 [ICLU] | `lucide:circle` |
| ICO-707 | 삼각형 — triangle | 부품 | 세 개의 변으로 이뤄진 삼각 도형을 나타냄, 세모 모양 | 확인 [ICLU] | `lucide:triangle` |
| ICO-708 | 육각형 — hexagon | 부품 | 여섯 개의 변으로 이뤄진 도형을 나타냄, 도형 도구에서 씀 | 확인 [ICLU] | `lucide:hexagon` |
| ICO-709 | 오각형 — pentagon | 부품 | 다섯 개의 변으로 이뤄진 도형을 나타냄, 도형 도구에서 씀 | 확인 [ICLU] | `lucide:pentagon` |
| ICO-710 | 팔각형 — octagon | 부품 | 여덟 개의 변으로 이뤄진 도형을 나타냄, 도형 도구에서 씀 | 확인 [ICLU] | `lucide:octagon` |
| ICO-711 | 마름모 — diamond | 부품 | 네 변 길이는 같으나 각이 다른 도형을 나타냄 | 확인 [ICLU] | `lucide:diamond` |
| ICO-712 | 곡선 도구 — spline | 부품 | 부드럽게 휘어지는 곡선을 그리는 도구를 나타냄 | 확인 [ICLU] | `lucide:spline` |
| ICO-713 | 벡터 도형 — vector | 부품 | 점과 선으로 이뤄져 확대해도 깨지지 않는 도형을 나타냄 | 확인 [ICLU] | `lucide:vector-square` |
| ICO-714 | 프레임 — frame | 부품 | 요소를 담아 두는 틀이나 경계선을 나타냄, 사각 프레임 | 확인 [ICLU] | `lucide:frame` |
| ICO-715 | 격자선 — grid | 부품 | 요소를 줄 맞춰 배치하도록 돕는 안내선을 나타냄 | 확인 [ICLU] | `lucide:grid-3x3` |
| ICO-716 | 3D 회전 — rotate 3d | 부품 | 입체 오브젝트를 세 개의 축으로 돌림을 나타냄 | 확인 [ICLU] | `lucide:rotate-3d` |
| ICO-717 | 블렌드 모드 — blend | 부품 | 두 가지 색이나 이미지를 겹쳐서 섞는 방식을 나타냄 | 확인 [ICLU] | `lucide:blend` |
| ICO-718 | 명암 대비 — contrast | 부품 | 화면의 밝고 어두운 정도 차이를 조절함을 나타냄 | 확인 [ICLU] | `lucide:contrast` |
| ICO-719 | 불투명도 — opacity | 부품 | 요소가 얼마나 비쳐 보이는지 정도를 조절함을 나타냄 | 확인 [ICSET] | `lucide:blend` |
| ICO-720 | 페인트 통 — paint bucket | 부품 | 닫힌 영역 전체를 한 가지 색으로 채움을 나타냄 | 확인 [ICLU] | `lucide:paint-bucket` |
| ICO-721 | 스프레이 — spray can | 부품 | 입자를 뿌리듯이 자연스럽게 색을 칠함을 나타냄 | 확인 [ICLU] | `lucide:spray-can` |
| ICO-722 | 큐브 — cube | 부품 | 여섯 면을 가진 입체 정육면체 도형을 나타냄, 삼차원 표현 | 확인 [ICSET] | `tabler:cube` |
| ICO-723 | 선 스타일 — dashed line | 부품 | 실선·점선 등 테두리 선 모양을 고름을 나타냄 | 확인 [ICLU] | `lucide:line-style` |
| ICO-724 | 선택 영역 — selection | 부품 | 드래그해 고른 영역 범위를 나타냄, 점선 사각형 | 확인 [ICSET] | `lucide:square-dashed` |
| ICO-725 | 색상 견본 — color swatch | 부품 | 낱개 색상값을 저장해 둔 견본 카드를 나타냄, 색상 코드 포함 | 확인 [ICSET] | `tabler:color-swatch` |
| ICO-726 | 타이포그래피 — typography | 부품 | 글자 관련 디자인 설정을 모아 둔 영역을 나타냄 | 확인 [ICSET] | `tabler:typography` |
| ICO-1088 | 제도 컴퍼스 — drafting compass | 부품 | 도형 그리기·기하학 수업을 나타냄, 다리 벌린 도구 | 확인 [ICLU] | `lucide:drafting-compass` |

## 도구·공사·산업 — Tools, Construction & Industry

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-1208 | 가위 — scissors | 부품 | 재단·자르기 도구를 나타냄, 날 두 개 교차한 가위 | 확인 [ICLU] | `lucide:scissors` |
| ICO-281 | 눈금자 — ruler | 부품 | 길이·위치를 재는 자 | 확장 [MK] · 대조 [ICLU] | `lucide:ruler` |
| ICO-1212 | 망치 — hammer | 부품 | 못 박기 등 타격 작업을 나타냄, 자루 달린 망치 머리 | 확인 [ICLU] | `lucide:hammer` |
| ICO-1213 | 렌치 — wrench | 부품 | 볼트·너트 조임 작업을 나타냄, 입 벌어진 렌치 모양 | 확인 [ICLU] | `lucide:wrench` |
| ICO-1214 | 드라이버 — screwdriver | 부품 | 나사 조임 작업을 나타냄, 일자 날 달린 드라이버 | 확인 [ICSET] | `phosphor:screwdriver` |
| ICO-1215 | 전동 드릴 — drill | 부품 | 구멍 뚫기 작업을 나타냄, 방아쇠 달린 전동 드릴 | 확인 [ICLU] | `lucide:drill` |
| ICO-1216 | 도끼 — axe | 부품 | 벌목·절단 작업을 나타냄, 날 넓은 도끼 머리 모양 | 확인 [ICLU] | `lucide:axe` |
| ICO-1217 | 삽 — shovel | 부품 | 땅 파기 작업을 나타냄, 넓적한 삽날과 자루 모양 | 확인 [ICLU] | `lucide:shovel` |
| ICO-1218 | 곡괭이 — pickaxe | 부품 | 채굴·굴착 작업을 나타냄, 양 끝 뾰족한 곡괭이 머리 | 확인 [ICLU] | `lucide:pickaxe` |
| ICO-1219 | 줄자 — tape measure | 부품 | 길이 측정 도구를 나타냄, 감기는 줄자 케이스 모양 | 확인 [ICSET] | `tabler:ruler-measure` |
| ICO-1220 | 공구함 — toolbox | 부품 | 공구 보관·수리 기능을 나타냄, 손잡이 달린 공구함 | 확인 [ICLU] | `lucide:toolbox` |
| ICO-1221 | 공구 세트 — tools | 부품 | 공구·수리 카테고리 전체를 나타냄, 렌치와 드라이버 교차 | 확인 [ICSET] | `tabler:tools` |
| ICO-1222 | 페인트 롤러 — paint roller | 부품 | 도색 작업을 나타냄, 자루 달린 페인트 롤러 모양 | 확인 [ICLU] | `lucide:paint-roller` |
| ICO-1223 | 양동이 — bucket | 부품 | 물이나 자재 담기를 나타냄, 손잡이 달린 양동이 모양 | 확인 [ICSET] | `tabler:bucket` |
| ICO-1224 | 사다리 — ladder | 부품 | 높은 곳 작업 도구를 나타냄, 발판이 이어진 사다리 | 확인 [ICSET] | `tabler:ladder` |
| ICO-1225 | 안전모 — hard hat | 부품 | 공사 현장 안전 장비를 나타냄, 둥근 안전모 모양 | 확인 [ICLU] | `lucide:hard-hat` |
| ICO-1226 | 기중기 — crane | 부품 | 대형 건설 장비를 나타냄, 팔 뻗은 기중기 모양 | 확인 [ICSET] | `tabler:crane` |
| ICO-1227 | 벽돌담 — brick wall | 부품 | 건축·시공 작업을 나타냄, 벽돌 쌓아 올린 담 모양 | 확인 [ICLU] | `lucide:brick-wall` |
| ICO-1228 | 너트 — nut | 부품 | 볼트와 짝을 이루는 조임 부품을 나타냄, 육각 너트 | 확인 [ICLU] | `lucide:nut` |
| ICO-1229 | 손전등 — flashlight | 부품 | 어두운 곳 조명 도구를 나타냄, 빛 뿜는 손전등 모양 | 확인 [ICLU] | `lucide:flashlight` |
| ICO-1230 | 깔때기 — funnel | 부품 | 액체·가루 옮겨 담기 도구를 나타냄, 깔때기 모양 | 확인 [ICLU] | `lucide:funnel` |
| ICO-1231 | 주머니칼 — knife | 부품 | 휴대·야외용 접이식 칼 도구를 나타냄, 접는 주머니칼 | 확인 [ICLU] | `lucide:pocket-knife` |
| ICO-1233 | 수평계 — level | 부품 | 수평·수직 측정 도구를 나타냄, 기포 들어간 수평계 | 확인 [ICSET] | `tabler:gradienter` |
| ICO-1234 | 모루 — anvil | 부품 | 금속 가공 작업대를 나타냄, 위가 평평한 모루 모양 | 확인 [ICLU] | `lucide:anvil` |
| ICO-1235 | 흙손 — trowel | 부품 | 미장·모종삽 작업을 나타냄, 삼각날 달린 흙손 모양 | 확인 [ICSET] | `tabler:trowel` |
| ICO-1236 | 압축기(뚫어뻥) — plunger | 부품 | 배관 막힘 뚫기 도구를 나타냄, 고무 흡착판 뚫어뻥 | 확인 [ICSET] | `tabler:plunger` |
| ICO-1237 | 스프링클러 — sprinkler | 부품 | 자동 살수·소화 장치를 나타냄, 물 뿌리는 스프링클러 | 확인 [ICSET] | `material:sprinkler` |

## 사람·계정 — People & Accounts

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-582 | 신분증 — id card | 부품 | 신원을 확인할 수 있는 개인 정보 카드를 나타냄 | 확인 [ICLU] | `lucide:id-card` |
| ICO-136 | 사람 — person | 부품 | 한 명의 사용자, 머리와 어깨 실루엣 | 확장 [MK] · 대조 [ICLU] | `lucide:user` |
| ICO-137 | 사람 추가 — person add | 부품 | 구성원을 불러들임 | 확장 [MK] · 대조 [ICLU] | `lucide:user-plus` |
| ICO-138 | 사람 빼기 — person remove | 부품 | 구성원을 내보냄 | 확장 [MK] · 대조 [ICLU] | `lucide:user-minus` |
| ICO-139 | 여러 사람 — people | 부품 | 팀·그룹을 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:users` |
| ICO-140 | 프로필 사진 — avatar | 부품 | 사용자 얼굴 자리, 사진이 없으면 이니셜 | 확장 [MK] · 대조 [ICLU] | `lucide:circle-user-round` |
| ICO-143 | 계정 전환 — switch account | 부품 | 다른 계정으로 바꿔 씀 | 확장 [MK] | `tabler:switch` |
| ICO-161 | 초대 — invite | 부품 | 참여 링크를 보냄 | 확장 [MK] · 대조 [ICLU] | `lucide:user-plus` |
| ICO-162 | 팔로우 — follow | 부품 | 상대 소식을 계속 받음 | 확장 [MK] · 대조 [ICLU] | `lucide:user-round-plus` |
| ICO-513 | 성별 — gender(남·여·중립) | 부품 | 남·여·중립 중 하나를 고르는 성별 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:venus` |
| ICO-620 | 인증된 사용자 — user check | 부품 | 신원이 확인된 사용자임을 나타냄, 사람 옆 체크 | 확인 [ICLU] | `lucide:user-check` |
| ICO-621 | 차단된 사용자 — user x | 부품 | 접근이 막힌 사용자임을 나타냄, 사람 옆 엑스 | 확인 [ICLU] | `lucide:user-x` |
| ICO-622 | 사용자 설정 — user cog | 부품 | 특정 사용자의 권한·설정을 관리함을 나타냄, 사람 옆 톱니 | 확인 [ICLU] | `lucide:user-cog` |
| ICO-624 | 아기 — baby | 부품 | 영유아와 관련된 정보나 서비스 대상을 나타냄, 아기 모양 | 확인 [ICLU] | `lucide:baby` |
| ICO-625 | 어린이 — child | 부품 | 어린이 사용자나 보호자 설정 대상을 나타냄, 어린이 모양 | 확인 [ICSET] | `lucide:baby` |
| ICO-626 | 서 있는 사람 — person standing | 부품 | 이동 수단 없이 서 있는 보행자 상태를 나타냄 | 확인 [ICLU] | `lucide:person-standing` |
| ICO-628 | 고령자 — elderly | 부품 | 노년층 사용자·우대 대상을 나타냄, 지팡이 짚은 사람 | 확인 [ICSET] | `tabler:old` |
| ICO-629 | 임산부 — pregnant | 부품 | 임신 중인 사용자나 배려석 대상을 나타냄, 임산부 배지 | 확인 [ICSET] | `material:pregnant_woman` |
| ICO-630 | 가족 — family | 부품 | 보호자와 자녀가 함께하는 가족 구성원 단위를 나타냄 | 확인 [ICSET] | `lucide:users-round` |
| ICO-636 | 걷는 사람 — person walking | 부품 | 도보로 이동하는 수단이나 경로를 나타냄, 걷는 사람 모양 | 확인 [ICSET] | `tabler:walk` |
| ICO-637 | 뛰는 사람 — person running | 부품 | 달리기로 빠르게 이동함을 나타냄, 뛰는 사람 모양 | 확인 [ICSET] | `tabler:run` |
| ICO-639 | 사용자 찾기 — user search | 부품 | 특정 사용자를 검색해 찾음을 나타냄, 사람 옆 돋보기 | 확인 [ICLU] | `lucide:user-search` |
| ICO-642 | 귀 — ear | 부품 | 청각이나 듣기와 관련된 기능을 나타냄, 귀 모양 | 확인 [ICLU] | `lucide:ear` |
| ICO-643 | 입 — lips | 부품 | 말하기나 발음과 관련된 기능을 나타냄, 입술 모양 | 확인 [ICLU] | `lucide:mouth` |
| ICO-1181 | 유모차 — baby carriage | 부품 | 출산·육아 관련 행사를 나타냄, 바퀴 달린 유모차 | 확인 [ICSET] | `tabler:baby-carriage` |

## 손·몸짓 — Hands & Gestures

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-465 | 가리키는 손 — pointing hand | 부품 | 누를 수 있는 자리를 짚어 줌 | 확장 [MK] · 대조 [ICLU] | `lucide:pointer` |
| ICO-534 | 잡기 — grab | 부품 | 화면·캔버스를 붙잡아 끌어서 움직임을 나타냄, 쥔 손 모양 | 확인 [ICLU] | `lucide:hand-grab` |
| ICO-116 | 좋아요 — like | 부품 | 마음에 듦, 엄지 올림 | 확장 [MK] · 대조 [ICLU] | `lucide:thumbs-up` |
| ICO-117 | 싫어요 — dislike | 부품 | 마음에 들지 않음, 엄지 내림 | 확장 [MK] · 대조 [ICLU] | `lucide:thumbs-down` |
| ICO-550 | 터치 손짓 — hand | 부품 | 손으로 건드려 조작하는 동작임을 나타냄, 편 손바닥 모양 | 확인 [ICLU] | `lucide:hand` |
| ICO-158 | 손들기 — raise hand | 부품 | 발언·참여 의사를 알림 | 확장 [MK] · 대조 [ICLU] | `lucide:hand` |
| ICO-631 | 악수 — handshake | 부품 | 협력이나 계약이 성사됐음을 나타냄, 맞잡은 두 손 모양 | 확인 [ICLU] | `lucide:handshake` |
| ICO-632 | 돌봄 손짓 — hand heart | 부품 | 배려·후원하는 마음을 나타냄, 하트를 받친 손 | 확인 [ICLU] | `lucide:hand-heart` |
| ICO-633 | 인사 손짓 — hand waving | 부품 | 환영하거나 작별하는 인사를 나타냄, 흔드는 손 모양 | 확인 [ICSET] | `lucide:hand` |
| ICO-634 | 주먹 — fist | 부품 | 결의나 응원의 뜻을 나타냄, 굳게 쥔 주먹 모양 | 확인 [ICLU] | `lucide:hand-fist` |
| ICO-635 | 브이 손짓 — peace | 부품 | 평화·긍정의 뜻을 나타냄, 검지와 중지를 편 손 | 확인 [ICSET] | `tabler:peace` |
| ICO-651 | 접근 정지 — hand stop | 부품 | 더 진행하지 못하게 막음을 나타냄, 편 손바닥 정지 표시 | 확인 [ICSET] | `tabler:hand-stop` |
| ICO-1122 | 손 흔들기 — hand wave | 부품 | 인사·환영 반응을 나타냄, 손바닥 펴고 흔드는 손 | 확인 [ICSET] | `lucide:hand` |

## 접근성 — Accessibility

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-509 | 스크린리더 전용 — screen reader only | 부품 | 화면엔 안 보이고 보조기술에만 읽히는 숨김 표시 | 확장 [MK] | `lucide:accessibility` |
| ICO-510 | 수어 통역 — sign language | 부품 | 영상에 수어 통역이 함께 나온다는 표시 | 확장 [MK] | `material:sign_language` |
| ICO-511 | 색맹 모드 — color blind mode | 부품 | 색을 구분하기 쉬운 배색으로 바꾸는 설정 | 확장 [MK] | `tabler:blind` |
| ICO-512 | 점자 — braille | 부품 | 점자로도 안내를 제공한다는 표시 | 확장 [MK] | `tabler:braille` |
| ICO-627 | 휠체어 — wheelchair | 부품 | 휠체어를 이용하는 사용자를 위한 접근성 표시, 휠체어 모양 | 확인 [ICSET] | `tabler:wheelchair` |

## 감정·이모지 — Emoji & Emotions

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-157 | 반응 — reaction | 부품 | 글에 감정 표시를 붙임, 웃는 얼굴과 플러스 | 확장 [MK] · 대조 [ICLU] | `lucide:face-slightly-smiling-plus` |
| ICO-159 | 스티커 — sticker | 부품 | 그림 한 장으로 하는 대화 표현 | 확장 [MK] · 대조 [ICLU] | `lucide:sticker` |
| ICO-118 | 하트 — heart | 부품 | 애정·찜 표시, 속이 빈 것과 채운 것으로 상태 구분 | 확장 [MK] · 대조 [ICLU] | `lucide:heart` |
| ICO-427 | 반짝임 — sparkle | 부품 | 새것·특별함·자동 생성을 꾸며 알림 | 확장 [MK] · 대조 [ICLU] | `lucide:sparkles` |
| ICO-433 | 웃는 얼굴 — happy face | 부품 | 만족을 고르는 표정 | 확장 [MK] · 대조 [ICLU] | `lucide:face-slightly-smiling` |
| ICO-434 | 찡그린 얼굴 — sad face | 부품 | 불만을 고르는 표정 | 확장 [MK] · 대조 [ICLU] | `lucide:face-slightly-frowning` |
| ICO-435 | 무표정 얼굴 — neutral face | 부품 | 보통을 고르는 표정 | 확장 [MK] · 대조 [ICLU] | `lucide:face-neutral` |
| ICO-436 | 화난 얼굴 — angry face | 부품 | 강한 불만을 고르는 표정 | 확장 [MK] · 대조 [ICLU] | `lucide:face-angry` |
| ICO-525 | 반응 이모지 — reaction(케어·웃김·놀람) | 부품 | 좋아요 대신 여러 감정 중 하나를 골라 표시함 | 확장 [MK] · 대조 [ICLU] | `lucide:face-slightly-smiling-plus` |
| ICO-526 | 스킨톤 변형 — skin tone | 부품 | 이모지의 피부색을 여러 톤 중에서 고름 | 확장 [MK] | `emoji:🏽` |
| ICO-1110 | 폭소 — laugh | 부품 | 크게 웃는 감정을 나타냄, 눈 감고 입 벌린 얼굴 | 확인 [ICLU] | `lucide:face-grinning` |
| ICO-1111 | 무표정 — annoyed | 부품 | 지루하거나 시큰둥한 감정을 나타냄, 무표정한 얼굴 | 확인 [ICLU] | `lucide:face-expressionless` |
| ICO-1112 | 윙크 — wink | 부품 | 장난스럽거나 친근한 감정을 나타냄, 한쪽 눈 감은 얼굴 | 확인 [ICLU] | `lucide:face-slightly-smiling-plus` |
| ICO-1113 | 놀람 — surprised | 부품 | 놀라거나 당황한 감정을 나타냄, 눈과 입이 커진 얼굴 | 확인 [ICSET] | `tabler:mood-surprised` |
| ICO-1114 | 울음 — cry | 부품 | 슬프거나 우는 감정을 나타냄, 눈물 흘리는 얼굴 | 확인 [ICSET] | `tabler:mood-cry` |
| ICO-1115 | 아픔 — sick | 부품 | 아프거나 메스꺼운 상태를 나타냄, 창백한 얼굴 표정 | 확인 [ICSET] | `tabler:mood-sick` |
| ICO-1116 | 식은땀 — nervous | 부품 | 불안하거나 긴장한 감정을 나타냄, 식은땀 흘리는 얼굴 | 확인 [ICSET] | `tabler:mood-nervous` |
| ICO-1117 | 뽀뽀 — kiss | 부품 | 애정 표현을 나타냄, 입술 내밀고 하트 날리는 얼굴 | 확인 [ICSET] | `emoji:😘` |
| ICO-1118 | 하트눈 — heart eyes | 부품 | 반하거나 좋아하는 감정을 나타냄, 눈이 하트 모양인 얼굴 | 확인 [ICSET] | `lucide:heart` |
| ICO-1120 | 응가 — poop | 부품 | 장난스러운 감탄사 반응을 나타냄, 소용돌이 모양 응가 | 확인 [ICSET] | `tabler:poo` |
| ICO-1121 | 상심 — heart crack | 부품 | 실망하거나 마음 아픈 감정을 나타냄, 금 간 하트 | 확인 [ICLU] | `lucide:heart-crack` |
| ICO-1123 | 졸림 — sleepy | 부품 | 피곤하거나 졸린 상태를 나타냄, 콧물 방울 맺힌 얼굴 | 확인 [ICSET] | `emoji:😪` |
| ICO-1124 | 메롱 — tongue | 부품 | 장난스럽게 놀리는 감정을 나타냄, 혀 내민 얼굴 | 확인 [ICSET] | `tabler:mood-tongue` |
| ICO-1125 | 외계인 — alien | 부품 | 낯설거나 이질적인 반응을 나타냄, 초록빛 외계인 얼굴 | 확인 [ICSET] | `tabler:alien` |
| ICO-1126 | 녹아내림 — melting | 부품 | 무기력하거나 지친 감정을 나타냄, 형체가 녹아내리는 얼굴 | 확인 [ICSET] | `phosphor:smiley-melting` |
| ICO-1127 | 감탄 — wow | 부품 | 감탄하거나 감동한 반응을 나타냄, 입을 크게 벌린 얼굴 | 확인 [ICSET] | `emoji:😲` |

## 쇼핑 — Shopping

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-92 | 바코드 — barcode | 부품 | 막대 코드로 상품·자산을 읽음 | 확장 [MK] · 대조 [ICLU] | `lucide:barcode` |
| ICO-285 | 장바구니 — cart | 부품 | 살 것을 담아 둔 곳 | 확장 [MK] · 대조 [ICLU] | `lucide:shopping-cart` |
| ICO-286 | 장바구니 담기 — add to cart | 부품 | 상품을 장바구니에 넣음 | 확장 [MK] · 대조 [ICLU] | `lucide:shopping-cart-plus` |
| ICO-287 | 결제하기 — checkout | 부품 | 값을 치르는 단계로 넘어감 | 확장 [MK] · 대조 [ICLU] | `lucide:credit-card` |
| ICO-290 | 영수증 — receipt | 부품 | 결제 내역 증빙 | 확장 [MK] · 대조 [ICLU] | `lucide:receipt` |
| ICO-294 | 반품 — return item | 부품 | 받은 물건을 되돌려 보냄 | 확장 [MK] | `tabler:truck-return` |
| ICO-295 | 쿠폰 — coupon | 부품 | 값을 깎아 주는 표 | 확장 [MK] · 대조 [ICLU] | `lucide:ticket-percent` |
| ICO-296 | 할인 — discount | 부품 | 값이 내려간 상태, 퍼센트가 붙은 꼬리표 | 확장 [MK] · 대조 [ICLU] | `lucide:badge-percent` |
| ICO-297 | 가격표 — price tag | 부품 | 값을 적어 붙인 꼬리표 | 확장 [MK] · 대조 [ICLU] | `lucide:tag` |
| ICO-298 | 적립 — reward points | 부품 | 쌓이는 혜택 점수 | 확장 [MK] · 대조 [ICLU] | `lucide:trophy` |
| ICO-303 | 찜 목록 — wishlist | 부품 | 나중에 사려고 모아 둔 목록 | 확장 [MK] · 대조 [ICLU] | `lucide:heart` |
| ICO-304 | 비교 — compare | 부품 | 둘 이상을 나란히 놓고 따짐 | 확장 [MK] · 대조 [ICLU] | `lucide:scale` |
| ICO-305 | 판매자 — seller | 부품 | 물건을 파는 사람·업체 | 확장 [MK] · 대조 [ICLU] | `lucide:store` |
| ICO-306 | 매장 — storefront | 부품 | 오프라인 가게 | 확장 [MK] · 대조 [ICLU] | `lucide:store` |
| ICO-727 | 쇼핑백 — shopping bag | 부품 | 구매한 상품을 담아서 옮기는 봉투를 나타냄, 쇼핑백 모양 | 확인 [ICLU] | `lucide:shopping-bag` |
| ICO-728 | 태그 모음 — tags | 부품 | 여러 개의 분류표를 겹쳐서 보여줌을 나타냄, 태그 모양 | 확인 [ICLU] | `lucide:tags` |
| ICO-729 | 바코드 스캔 — scan barcode | 부품 | 카메라로 상품 바코드를 읽어서 인식함을 나타냄 | 확인 [ICLU] | `lucide:scan-barcode` |
| ICO-730 | 계산대 — cash register | 부품 | 상품 값을 계산하고 결제를 받는 계산대를 나타냄 | 확인 [ICSET] | `tabler:cash-register` |
| ICO-731 | 장바구니 빼기 — cart minus | 부품 | 장바구니에 담긴 상품 하나를 빼냄을 나타냄, 마이너스 표시 | 확인 [ICLU] | `lucide:shopping-cart-minus` |
| ICO-732 | 주문 완료 — cart check | 부품 | 장바구니에 담긴 상품 주문이 확정됐음을 나타냄 | 확인 [ICSET] | `tabler:shopping-cart-check` |
| ICO-734 | 보석 — gem | 부품 | 프리미엄·특별 등급 항목을 나타냄, 보석 모양 | 확인 [ICLU] | `lucide:gem` |
| ICO-735 | 별점 — star rating | 부품 | 상품·서비스 평가 점수를 별 개수로 보여줌을 나타냄 | 확인 [ICLU] | `lucide:star-half` |
| ICO-736 | 계량 저울 — scale | 부품 | 상품의 무게를 재는 저울을 나타냄, 계량 저울 모양 | 확인 [ICLU] | `lucide:scale` |

## 돈·금융 — Money & Finance

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-288 | 신용카드 — credit card | 부품 | 카드 결제 수단 | 확장 [MK] · 대조 [ICLU] | `lucide:credit-card` |
| ICO-289 | 지갑 — wallet | 부품 | 결제 수단과 잔액을 모은 곳 | 확장 [MK] · 대조 [ICLU] | `lucide:wallet` |
| ICO-291 | 청구서 — invoice | 부품 | 낼 금액을 적은 문서 | 확장 [MK] · 대조 [ICLU] | `lucide:receipt-text` |
| ICO-301 | 환불 — refund | 부품 | 받은 돈을 되돌려 줌 | 확장 [MK] · 대조 [ICLU] | `lucide:banknote-arrow-down` |
| ICO-302 | 구독 — subscription | 부품 | 정해진 주기로 계속 내고 씀 | 확장 [MK] | `lucide:rss` |
| ICO-307 | 세금 — tax | 부품 | 값에 붙는 세액 | 확장 [MK] | `tabler:tax` |
| ICO-308 | 통화 바꾸기 — currency exchange | 부품 | 다른 나라 돈으로 환산함 | 확장 [MK] | `tabler:exchange` |
| ICO-309 | 현금 — cash | 부품 | 지폐로 내는 수단 | 확장 [MK] | `tabler:cash` |
| ICO-310 | 은행 — bank | 부품 | 계좌가 있는 기관 | 확장 [MK] | `tabler:building-bank` |
| ICO-311 | 송금 — money transfer | 부품 | 돈을 다른 계좌로 보냄 | 확장 [MK] | `tabler:transfer` |
| ICO-514 | 가상자산 지갑 — crypto wallet | 부품 | 블록체인 지갑을 연결한다는 표시, ICO-289의 결제 지갑과 다름 | 확장 [MK] · 대조 [ICLU] | `lucide:wallet` |
| ICO-737 | 달러 기호 — dollar | 부품 | 가격이나 결제 화면에서 미국 달러화 통화 단위를 나타냄, $ 기호 | 확인 [ICLU] | `lucide:dollar-sign` |
| ICO-738 | 유로 기호 — euro | 부품 | 가격이나 결제 화면에서 유럽연합 통화 단위를 나타냄, € 기호 | 확인 [ICLU] | `lucide:euro` |
| ICO-739 | 파운드 기호 — pound | 부품 | 가격이나 결제 화면에서 영국 파운드 통화 단위를 나타냄, £ 기호 | 확인 [ICSET] | `tabler:currency-pound` |
| ICO-740 | 엔 기호 — yen | 부품 | 가격이나 결제 화면에서 일본 엔화 통화 단위를 나타냄, ¥ 기호 | 확인 [ICSET] | `tabler:currency-yen` |
| ICO-741 | 원 기호 — won | 부품 | 가격이나 결제 화면에서 한국 원화 통화 단위를 나타냄, ₩ 기호 | 확인 [ICSET] | `tabler:currency-won` |
| ICO-742 | 비트코인 — bitcoin | 부품 | 대표적인 가상자산 단위를 나타냄, 비트코인 기호 | 확인 [ICLU] | `lucide:bitcoin` |
| ICO-743 | 루피 기호 — rupee | 부품 | 가격이나 결제 화면에서 인도 루피 통화 단위를 나타냄, ₹ 기호 | 확인 [ICLU] | `lucide:indian-rupee` |
| ICO-744 | 동전 — coins | 부품 | 현금성 자산이나 잔액을 나타냄, 겹친 동전 모양 | 확인 [ICLU] | `lucide:coins` |
| ICO-745 | 저금통 — piggy bank | 부품 | 돈을 모아 저축함을 나타냄, 돼지 저금통 모양 | 확인 [ICLU] | `lucide:piggy-bank` |
| ICO-747 | 현금 지원 — hand coins | 부품 | 돈을 손에 얹어서 건네주거나 지원함을 나타냄, 후원금 지급 | 확인 [ICLU] | `lucide:hand-coins` |
| ICO-748 | 금고 — vault | 부품 | 귀중품·자금을 안전하게 보관하는 공간을 나타냄 | 확인 [ICLU] | `lucide:vault` |
| ICO-749 | 수표 — money check | 부품 | 은행에서 발행해 주는 종이 지급 증서를 나타냄 | 확인 [ICSET] | `lucide:banknote-check` |
| ICO-750 | 이더리움 — ethereum | 부품 | 대표적인 가상자산 단위를 나타냄, 이더리움 로고 | 확인 [ICSET] | `tabler:currency-ethereum` |
| ICO-751 | 캔들 차트 — candlestick chart | 부품 | 시가·종가·고저가를 막대로 보여주는 주가 그래프 | 확인 [ICLU] | `lucide:chart-candlestick` |
| ICO-752 | 카드 결제 불가 — credit card off | 부품 | 신용카드로는 결제할 수 없는 상태를 나타냄, 카드 결제 차단 | 확인 [ICSET] | `tabler:credit-card-off` |
| ICO-483 | 통화 기호 — currency symbol | 부품 | 나라별 돈 단위 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:dollar-sign` |

## 물류·배송 — Logistics & Delivery

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-292 | 배송 — shipping | 부품 | 물건이 오고 가는 일, 트럭 | 확장 [MK] · 대조 [ICLU] | `lucide:truck` |
| ICO-293 | 배송 추적 — track package | 부품 | 지금 어디쯤인지 확인함 | 확장 [MK] · 대조 [ICLU] | `lucide:package-search` |
| ICO-299 | 재고 — stock | 부품 | 남은 수량 | 확장 [MK] · 대조 [ICLU] | `lucide:boxes` |
| ICO-733 | 개봉된 상품 — package open | 부품 | 배송된 상자를 열어서 확인하는 상태를 나타냄, 개봉 표시 | 확인 [ICLU] | `lucide:package-open` |
| ICO-822 | 지게차 — forklift | 부품 | 창고·물류 하역 작업을 나타냄, 앞쪽 포크 달린 지게차 모양 | 확인 [ICLU] | `lucide:forklift` |
| ICO-300 | 창고 — warehouse | 부품 | 물건을 보관하는 곳 | 확장 [MK] · 대조 [ICLU] | `lucide:warehouse` |

## 시간·일정 — Time & Calendar

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-262 | 시간선 보기 — timeline view | 부품 | 시간 순서로 길게 늘어놓음 | 확장 [MK] · 대조 [ICLU] | `lucide:timeline` |
| ICO-312 | 시계 — clock | 부품 | 지금 시각, 둥근 시계판 | 확장 [MK] · 대조 [ICLU] | `lucide:clock` |
| ICO-313 | 달력 — calendar | 부품 | 날짜를 고르거나 보는 곳 | 확장 [MK] · 대조 [ICLU] | `lucide:calendar` |
| ICO-314 | 일정 추가 — add event | 부품 | 달력에 새 약속을 넣음 | 확장 [MK] · 대조 [ICLU] | `lucide:calendar-plus` |
| ICO-315 | 타이머 — timer | 부품 | 정해진 시간이 지나면 알려 줌 | 확장 [MK] · 대조 [ICLU] | `lucide:timer` |
| ICO-316 | 스톱워치 — stopwatch | 부품 | 흐른 시간을 잼 | 확장 [MK] | `tabler:stopwatch` |
| ICO-317 | 알람 — alarm | 부품 | 정한 시각에 깨워 줌, 종이 달린 시계 | 확장 [MK] · 대조 [ICLU] | `lucide:alarm-clock` |
| ICO-318 | 모래시계 — hourglass | 부품 | 오래 걸리는 처리를 기다림 | 확장 [MK] · 대조 [ICLU] | `lucide:hourglass` |
| ICO-319 | 기록 — history | 부품 | 지난 행동 목록, 시계와 되돌림 화살표 | 확장 [MK] · 대조 [ICLU] | `lucide:rotate-ccw-clock` |
| ICO-320 | 최근 항목 — recent | 부품 | 방금 본 것들을 모아 봄 | 확장 [MK] · 대조 [ICLU] | `lucide:list-clock` |
| ICO-321 | 반복 일정 — recurring | 부품 | 주기마다 되풀이되는 약속 | 확장 [MK] · 대조 [ICLU] | `lucide:calendar-sync` |
| ICO-322 | 시간대 — time zone | 부품 | 나라마다 다른 시각 기준 | 확장 [MK] | `tabler:timezone` |
| ICO-323 | 마감 — deadline | 부품 | 끝내야 하는 시점 | 확장 [MK] · 대조 [ICLU] | `lucide:clipboard-clock` |
| ICO-753 | 월간 달력 — calendar days | 부품 | 한 달 전체의 날짜가 한눈에 보이는 달력을 나타냄 | 확인 [ICLU] | `lucide:calendar-days` |
| ICO-754 | 일정 확정 — calendar check | 부품 | 약속·일정이 확정됐음을 나타냄, 달력 위 체크 | 확인 [ICLU] | `lucide:calendar-check` |
| ICO-755 | 일정 취소 — calendar x | 부품 | 잡혀 있던 약속이 취소됐음을 나타냄, 달력 위 엑스 | 확인 [ICLU] | `lucide:calendar-x` |
| ICO-756 | 시간 있는 일정 — calendar clock | 부품 | 날짜와 시각이 함께 표시된 일정을 나타냄, 시각 포함 일정 | 확인 [ICLU] | `lucide:calendar-clock` |
| ICO-757 | 기념일 — calendar heart | 부품 | 특별히 아끼는 날짜를 표시함을 나타냄, 달력 위 하트 | 확인 [ICLU] | `lucide:calendar-heart` |
| ICO-758 | 주간 달력 — calendar week | 부품 | 한 주 단위로 일정이 보이는 달력을 나타냄, 주간 보기 | 확인 [ICSET] | `tabler:calendar-week` |
| ICO-759 | 일간 달력 — calendar day | 부품 | 하루 단위로 자세히 보이는 일간 달력을 나타냄 | 확인 [ICSET] | `lucide:calendar-clock` |
| ICO-760 | 일정 항목 — calendar event | 부품 | 달력에 낱개로 등록된 약속 하나를 나타냄, 일정 항목 표시 | 확인 [ICSET] | `tabler:calendar-event` |
| ICO-761 | 일정 없음 — calendar off | 부품 | 해당 날짜에 잡혀 있는 일정이 없음을 나타냄, 빈 일정 표시 | 확인 [ICLU] | `lucide:calendar-off` |
| ICO-762 | 일정 찾기 — calendar search | 부품 | 지난 날짜나 약속을 찾아서 검색함을 나타냄, 돋보기 표시 | 확인 [ICLU] | `lucide:calendar-search` |
| ICO-763 | 중요 일정 — calendar star | 부품 | 우선순위가 높은 약속을 표시함을 나타냄, 달력 위 별 | 확인 [ICSET] | `tabler:calendar-star` |
| ICO-764 | 시간 변경 — clock arrow | 부품 | 예정된 시각을 앞뒤로 옮겨서 조정함을 나타냄, 시계 화살표 | 확인 [ICLU] | `lucide:clock-arrow-up` |
| ICO-765 | 알람 미루기 — snooze | 부품 | 울린 알람을 잠시 뒤로 미룸을 나타냄, 다시 울림 예약 | 확인 [ICSET] | `tabler:alarm-snooze` |
| ICO-766 | 알람 끔 — alarm off | 부품 | 설정해 둔 알람이 꺼져 있는 상태를 나타냄, 알람 해제 | 확인 [ICLU] | `lucide:alarm-clock-off` |
| ICO-767 | 시간 추가 — clock plus | 부품 | 일정이나 타이머에 시간을 더해서 늘림을 나타냄 | 확인 [ICLU] | `lucide:clock-plus` |
| ICO-768 | 타이머 초기화 — timer reset | 부품 | 흐르고 있던 시간을 처음 값으로 되돌림을 나타냄 | 확인 [ICLU] | `lucide:timer-reset` |
| ICO-769 | 타이머 끔 — timer off | 부품 | 설정해 둔 타이머가 꺼져 있는 상태를 나타냄, 타이머 해제 | 확인 [ICLU] | `lucide:timer-off` |
| ICO-770 | 시간 임박 — clock alert | 부품 | 정해진 시각이 얼마 남지 않았음을 알려줌을 나타냄 | 확인 [ICLU] | `lucide:clock-alert` |
| ICO-771 | 시간 확인됨 — clock check | 부품 | 예정된 시각이 지켜졌음을 확인함, 시계 위 체크 | 확인 [ICLU] | `lucide:clock-check` |

## 집·가구 — Home & Household

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-852 | 소파 — sofa | 부품 | 거실 좌석 가구를 나타냄, 팔걸이 달린 긴 의자 모양 | 확인 [ICLU] | `lucide:sofa` |
| ICO-853 | 침대 — bed | 부품 | 침실 가구·숙박 정보를 나타냄, 매트리스 얹힌 침대 모양 | 확인 [ICLU] | `lucide:bed` |
| ICO-854 | 안락의자 — armchair | 부품 | 1인용 좌석 가구를 나타냄, 팔걸이 달린 낱개 의자 모양 | 확인 [ICLU] | `lucide:armchair` |
| ICO-855 | 스탠드 조명 — lamp | 부품 | 실내조명·전등 기구를 나타냄, 갓 씌운 조명 모양 | 확인 [ICLU] | `lucide:lamp` |
| ICO-856 | 현관문 — door | 부품 | 출입구·현관 위치를 나타냄, 손잡이 달린 문짝 모양 | 확인 [ICSET] | `tabler:door` |
| ICO-857 | 창문 — window | 부품 | 채광·환기 기능이 있는 창을 나타냄, 십자 창틀 모양 | 확인 [ICSET] | `tabler:window` |
| ICO-858 | 욕조 — bath | 부품 | 목욕 공간·욕조 설비를 나타냄, 다리 달린 욕조 모양 | 확인 [ICLU] | `lucide:bath` |
| ICO-859 | 샤워부스 — shower | 부품 | 샤워 시설·세면 공간을 나타냄, 물줄기 떨어지는 샤워기 모양 | 확인 [ICSET] | `lucide:shower-head` |
| ICO-860 | 변기 — toilet | 부품 | 화장실 위생 설비를 나타냄, 뚜껑 달린 좌변기 모양 | 확인 [ICLU] | `lucide:toilet` |
| ICO-861 | 세탁기 — washing machine | 부품 | 의류 세탁 가전을 나타냄, 원형 창 달린 세탁기 모양 | 확인 [ICLU] | `lucide:washing-machine` |
| ICO-862 | 냉장고 — refrigerator | 부품 | 식재료 보관 가전을 나타냄, 손잡이 두 칸 달린 냉장고 모양 | 확인 [ICLU] | `lucide:refrigerator` |
| ICO-863 | 전자레인지 — microwave | 부품 | 조리·해동용 가전을 나타냄, 창 달린 사각 전자레인지 모양 | 확인 [ICLU] | `lucide:microwave` |
| ICO-864 | 오븐 — oven | 부품 | 굽는 조리 가전을 나타냄, 문 달린 오븐 모양 | 확인 [ICSET] | `tabler:cooker` |
| ICO-866 | 선풍기 — fan | 부품 | 실내 송풍 가전을 나타냄, 날개 달린 선풍기 모양 | 확인 [ICLU] | `lucide:fan` |
| ICO-867 | 에어컨 — air conditioner | 부품 | 냉난방 가전을 나타냄, 바람 나오는 벽걸이 에어컨 모양 | 확인 [ICSET] | `tabler:air-conditioning` |
| ICO-868 | 벽난로 — fireplace | 부품 | 실내 난방·온기를 나타냄, 불꽃 이는 난로 모양 | 확인 [ICLU] | `lucide:heater` |
| ICO-869 | 청소기 — vacuum | 부품 | 바닥 청소 가전을 나타냄, 긴 손잡이 달린 청소기 모양 | 확인 [ICSET] | `tabler:vacuum-cleaner` |
| ICO-870 | 빗자루 — broom | 부품 | 청소 도구를 나타냄, 긴 자루 달린 빗자루 모양 | 확인 [ICLU] | `lucide:broom` |
| ICO-871 | 다리미 — iron | 부품 | 의류 다림질 가전을 나타냄, 손잡이 달린 다리미 모양 | 확인 [ICSET] | `tabler:ironing` |
| ICO-872 | 책상 — desk | 부품 | 업무·학습용 가구를 나타냄, 다리 네 개 달린 책상 모양 | 확인 [ICSET] | `tabler:desk` |
| ICO-873 | 블라인드 — blinds | 부품 | 창가 채광 조절 가구를 나타냄, 가로 살 겹친 블라인드 모양 | 확인 [ICLU] | `lucide:blinds` |
| ICO-874 | 화분 — potted plant | 부품 | 실내 관엽식물 장식을 나타냄, 화분에 심긴 식물 모양 | 확인 [ICSET] | `lucide:plant-pot` |
| ICO-875 | 스마트홈 — smart home | 부품 | 가전 자동제어·홈 IoT 기능을 나타냄, 집 안에 신호파 그려진 모양 | 확인 [ICSET] | `tabler:smart-home` |
| ICO-876 | 욕실 — bathroom | 부품 | 욕실·화장실 공간 전체를 나타냄, 세면대와 거울 있는 공간 모양 | 확인 [ICSET] | `lucide:bath` |
| ICO-877 | 주방 싱크대 — kitchen sink | 부품 | 주방 설거지 공간을 나타냄, 수도꼭지 달린 싱크대 모양 | 확인 [ICSET] | `lucide:faucet` |
| ICO-878 | 전등 스위치 — light switch | 부품 | 조명 켜고 끄는 벽 스위치를 나타냄, 사각 스위치 판 모양 | 확인 [ICSET] | `tabler:switch` |
| ICO-879 | 식기세척기 — dishwasher | 부품 | 식기 자동 세척 가전을 나타냄, 문 달린 식기세척기 모양 | 확인 [ICSET] | `material:dishwasher` |
| ICO-880 | 의자 — chair | 부품 | 식탁·사무용 좌석 가구를 나타냄, 등받이 있는 낱개 의자 모양 | 확인 [ICSET] | `lucide:armchair` |
| ICO-988 | 환기구 — air vent | 부품 | 실내 환기·통풍 설비를 나타냄, 격자무늬 통풍구 모양 | 확인 [ICLU] | `lucide:air-vent` |

## 음식·음료 — Food & Drink

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-865 | 냄비 — cooking pot | 부품 | 조리 도구·요리 기능을 나타냄, 손잡이 두 개 달린 냄비 모양 | 확인 [ICLU] | `lucide:cooking-pot` |
| ICO-881 | 커피 — coffee | 부품 | 커피 메뉴·카페 서비스를 나타냄, 김 나는 커피잔 모양 | 확인 [ICLU] | `lucide:coffee` |
| ICO-882 | 탄산음료 — cup | 부품 | 탄산음료·컵 음료 메뉴를 나타냄, 빨대 꽂힌 컵 모양 | 확인 [ICLU] | `lucide:cup-soda` |
| ICO-883 | 차 — tea | 부품 | 차 종류 음료 메뉴를 나타냄, 티백 담긴 찻잔 모양 | 확인 [ICSET] | `tabler:mug` |
| ICO-884 | 와인 — wine | 부품 | 와인·주류 메뉴를 나타냄, 다리 달린 와인잔 모양 | 확인 [ICLU] | `lucide:wine` |
| ICO-885 | 맥주 — beer | 부품 | 맥주 메뉴·주류 판매를 나타냄, 거품 얹힌 맥주잔 모양 | 확인 [ICLU] | `lucide:beer` |
| ICO-886 | 칵테일 — cocktail | 부품 | 칵테일·바 메뉴를 나타냄, 삼각형 마티니잔 모양 | 확인 [ICLU] | `lucide:martini` |
| ICO-887 | 피자 — pizza | 부품 | 피자 메뉴·배달 음식을 나타냄, 한 조각 피자 모양 | 확인 [ICLU] | `lucide:pizza` |
| ICO-888 | 햄버거 — hamburger | 부품 | 햄버거·패스트푸드 메뉴를 나타냄, 패티 낀 햄버거 모양 | 확인 [ICLU] | `lucide:hamburger` |
| ICO-889 | 케이크 — cake | 부품 | 생일·기념일 케이크 메뉴를 나타냄, 촛불 꽂힌 케이크 모양 | 확인 [ICLU] | `lucide:cake` |
| ICO-890 | 쿠키 — cookie | 부품 | 쿠키·디저트 메뉴를 나타냄, 초코칩 박힌 쿠키 모양 | 확인 [ICLU] | `lucide:cookie` |
| ICO-891 | 아이스크림 — ice cream | 부품 | 아이스크림 디저트 메뉴를 나타냄, 그릇에 담긴 아이스크림 모양 | 확인 [ICLU] | `lucide:ice-cream-bowl` |
| ICO-892 | 사과 — apple | 부품 | 과일·신선식품 메뉴를 나타냄, 잎 달린 사과 모양 | 확인 [ICLU] | `lucide:apple` |
| ICO-893 | 당근 — carrot | 부품 | 채소·건강식 메뉴를 나타냄, 잎 달린 당근 모양 | 확인 [ICLU] | `lucide:carrot` |
| ICO-894 | 달걀 — egg | 부품 | 달걀·조식 요리 재료를 나타냄, 둥근 달걀 한 알 모양 | 확인 [ICLU] | `lucide:egg` |
| ICO-895 | 육류 — meat | 부품 | 고기 요리·정육 메뉴를 나타냄, 뼈 달린 닭다리 모양 | 확인 [ICLU] | `lucide:drumstick` |
| ICO-896 | 빵 — bread | 부품 | 베이커리·빵 메뉴를 나타냄, 부풀어 오른 식빵 모양 | 확인 [ICSET] | `tabler:bread` |
| ICO-897 | 샐러드 — salad | 부품 | 채소 샐러드 메뉴를 나타냄, 그릇에 담긴 채소 모양 | 확인 [ICLU] | `lucide:salad` |
| ICO-898 | 수프 — soup | 부품 | 국물 요리·수프 메뉴를 나타냄, 김 나는 그릇 모양 | 확인 [ICLU] | `lucide:soup` |
| ICO-899 | 식기류 — utensils | 부품 | 식당·식사 관련 기능을 나타냄, 포크와 나이프 모양 | 확인 [ICLU] | `lucide:utensils` |
| ICO-900 | 요리사 모자 — chef hat | 부품 | 요리·주방 관련 기능을 나타냄, 주름진 흰 모자 모양 | 확인 [ICLU] | `lucide:chef-hat` |
| ICO-901 | 우유 — milk | 부품 | 유제품·조식 재료를 나타냄, 손잡이 달린 우유팩 모양 | 확인 [ICLU] | `lucide:milk` |
| ICO-902 | 물병 — water bottle | 부품 | 생수·음료 휴대 용기를 나타냄, 뚜껑 달린 물병 모양 | 확인 [ICSET] | `tabler:bottle` |
| ICO-903 | 체리 — cherry | 부품 | 과일 토핑·디저트 재료를 나타냄, 줄기로 이어진 체리 두 알 모양 | 확인 [ICLU] | `lucide:cherry` |
| ICO-904 | 포도 — grape | 부품 | 과일 메뉴·와인 재료를 나타냄, 송이로 뭉친 포도알 모양 | 확인 [ICLU] | `lucide:grape` |
| ICO-905 | 바나나 — banana | 부품 | 과일 메뉴·간식거리를 나타냄, 굽어진 바나나 모양 | 확인 [ICLU] | `lucide:banana` |
| ICO-906 | 레몬 — lemon | 부품 | 과일 재료·상큼한 맛을 나타냄, 단면 자른 레몬 모양 | 확인 [ICLU] | `lucide:citrus` |
| ICO-907 | 고추 — pepper | 부품 | 매운 맛·향신 채소를 나타냄, 꼭지 달린 고추 모양 | 확인 [ICSET] | `tabler:pepper` |
| ICO-908 | 팝콘 — popcorn | 부품 | 간식·영화관 매점 메뉴를 나타냄, 통에 담긴 팝콘 모양 | 확인 [ICLU] | `lucide:popcorn` |
| ICO-909 | 사탕 — candy | 부품 | 사탕·군것질 메뉴를 나타냄, 양끝 비틀린 사탕 포장 모양 | 확인 [ICLU] | `lucide:candy` |
| ICO-910 | 밥그릇 — bowl rice | 부품 | 한식·주식 메뉴를 나타냄, 김 나는 밥그릇 모양 | 확인 [ICSET] | `tabler:bowl` |
| ICO-912 | 와인병 — wine bottle | 부품 | 와인 판매·주류 상품을 나타냄, 라벨 붙은 와인병 모양 | 확인 [ICLU] | `lucide:bottle-wine` |
| ICO-913 | 치즈 — cheese | 부품 | 유제품·치즈 메뉴를 나타냄, 구멍 뚫린 치즈 조각 모양 | 확인 [ICSET] | `tabler:cheese` |
| ICO-914 | 아보카도 — avocado | 부품 | 건강식 재료를 나타냄, 씨 보이는 아보카도 단면 모양 | 확인 [ICSET] | `tabler:avocado` |
| ICO-915 | 물컵 — glass water | 부품 | 생수·식수 제공을 나타냄, 물 채워진 유리컵 모양 | 확인 [ICLU] | `lucide:glass-water` |
| ICO-916 | 커피콩 — coffee bean | 부품 | 원두·커피 재배를 나타냄, 반으로 갈라진 커피콩 모양 | 확인 [ICLU] | `lucide:bean` |

## 옷·미용 — Clothing & Beauty

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-1187 | 셔츠 — shirt | 부품 | 상의 의류를 나타냄, 깃과 소매 있는 셔츠 모양 | 확인 [ICLU] | `lucide:shirt` |
| ICO-1188 | 원피스 — dress | 부품 | 여성 원피스 의류를 나타냄, 허리선 있는 치마 모양 | 확인 [ICSET] | `phosphor:dress` |
| ICO-1189 | 바지 — pants | 부품 | 하의 의류를 나타냄, 두 다리로 나뉜 바지 모양 | 확인 [ICSET] | `phosphor:pants` |
| ICO-1190 | 신발 — shoe | 부품 | 신발 종류를 나타냄, 끈 달린 일반 신발 모양 | 확인 [ICSET] | `tabler:shoe` |
| ICO-1191 | 부츠 — boot | 부품 | 목이 긴 신발을 나타냄, 발목까지 감싸는 부츠 모양 | 확인 [ICSET] | `tabler:shoe` |
| ICO-1192 | 하이힐 — high heel | 부품 | 굽 높은 여성 구두를 나타냄, 뾰족한 힐이 달린 신발 | 확인 [ICSET] | `phosphor:high-heel` |
| ICO-1193 | 모자 — hat | 부품 | 챙 있는 모자를 나타냄, 둥근 챙 두른 중절모 모양 | 확인 [ICSET] | `emoji:🎩` |
| ICO-1194 | 캡모자 — cap | 부품 | 야구모자류를 나타냄, 앞챙 달린 캡모자 실루엣 | 확인 [ICSET] | `tabler:cap-straight` |
| ICO-1195 | 안경 — glasses | 부품 | 시력 보정용 안경을 나타냄, 렌즈와 다리 달린 모양 | 확인 [ICLU] | `lucide:glasses` |
| ICO-1196 | 선글라스 — sunglasses | 부품 | 햇빛 차단용 안경을 나타냄, 짙은 렌즈 낀 선글라스 | 확인 [ICSET] | `tabler:sunglasses` |
| ICO-1197 | 핸드백 — handbag | 부품 | 여성용 손가방을 나타냄, 손잡이 달린 핸드백 모양 | 확인 [ICLU] | `lucide:handbag` |
| ICO-1198 | 백팩 — backpack | 부품 | 등에 메는 가방을 나타냄, 어깨끈 두 개 달린 배낭 | 확인 [ICLU] | `lucide:backpack` |
| ICO-1199 | 반지 — ring | 부품 | 손가락 장신구를 나타냄, 보석 박힌 반지 모양 | 확인 [ICSET] | `lucide:gem` |
| ICO-1200 | 넥타이 — tie | 부품 | 정장용 넥타이를 나타냄, 목에 매는 길쭉한 천 모양 | 확인 [ICSET] | `tabler:tie` |
| ICO-1201 | 스카프 — scarf | 부품 | 목에 두르는 의류를 나타냄, 길게 늘어진 스카프 모양 | 확인 [ICSET] | `emoji:🧣` |
| ICO-1202 | 양말 — socks | 부품 | 발에 신는 의류를 나타냄, 발목까지 오는 양말 한 켤레 | 확인 [ICSET] | `tabler:sock` |
| ICO-1203 | 벙어리장갑 — mitten | 부품 | 손가락이 나뉘지 않은 겨울용 벙어리장갑을 나타냄 | 확인 [ICSET] | `emoji:🧤` |
| ICO-1204 | 후드티 — hoodie | 부품 | 모자 달린 상의를 나타냄, 앞주머니 있는 후드티 | 확인 [ICSET] | `phosphor:hoodie` |
| ICO-1205 | 재킷 — jacket | 부품 | 겉옷 상의를 나타냄, 지퍼가 달린 재킷 실루엣 모양 | 확인 [ICSET] | `tabler:jacket` |
| ICO-1206 | 조끼 — vest | 부품 | 소매 없는 겉옷을 나타냄, 단추 달린 조끼 모양 | 확인 [ICSET] | `emoji:🦺` |
| ICO-1207 | 옷걸이 — hanger | 부품 | 옷 보관·옷장 기능을 나타냄, 갈고리 달린 옷걸이 | 확인 [ICSET] | `tabler:hanger` |
| ICO-1210 | 향수 — perfume | 부품 | 향수 제품을 나타냄, 분무기 달린 유리병 모양 | 확인 [ICSET] | `tabler:perfume` |
| ICO-1211 | 개어 놓은 셔츠 — shirt folded | 부품 | 정리·세탁 완료 의류를 나타냄, 개어서 쌓아 둔 셔츠 | 확인 [ICSET] | `lucide:shirt` |

## 의료·건강 — Medical & Health

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-989 | 심박동 — heart pulse | 부품 | 심장 건강·바이탈 측정을 나타냄, 파형 선 지나는 하트 모양 | 확인 [ICLU] | `lucide:heart-pulse` |
| ICO-990 | 청진기 — stethoscope | 부품 | 진찰·의사 상담 기능을 나타냄, 귀걸이와 원판 달린 청진기 모양 | 확인 [ICLU] | `lucide:stethoscope` |
| ICO-991 | 알약 — pill | 부품 | 약 복용·처방 정보를 나타냄, 반씩 색 다른 캡슐 모양 | 확인 [ICLU] | `lucide:pill` |
| ICO-992 | 정제약 — pills | 부품 | 여러 알 단위 약 복용을 나타냄, 둥근 알약 여러 개 모양 | 확인 [ICLU] | `lucide:tablets` |
| ICO-993 | 주사기 — syringe | 부품 | 예방접종·채혈 시술을 나타냄, 눈금 새겨진 주사기 모양 | 확인 [ICLU] | `lucide:syringe` |
| ICO-994 | 병원 — hospital | 부품 | 의료기관 위치를 나타냄, 십자 표시 달린 병원 건물 모양 | 확인 [ICLU] | `lucide:hospital` |
| ICO-995 | 구급상자 — first aid kit | 부품 | 응급처치 용품함을 나타냄, 십자 표시 달린 상자 모양 | 확인 [ICSET] | `tabler:first-aid-kit` |
| ICO-996 | 밴드 — bandage | 부품 | 상처 소독·응급처치를 나타냄, 붙이는 반창고 모양 | 확인 [ICLU] | `lucide:bandage` |
| ICO-997 | 의료 표시 — medical cross | 부품 | 의료·약국 관련 기능임을 나타냄, 굵은 십자가 모양 | 확인 [ICLU] | `lucide:cross` |
| ICO-998 | 뇌 — brain | 부품 | 신경과·정신건강 진료를 나타냄, 주름 잡힌 뇌 모양 | 확인 [ICLU] | `lucide:brain` |
| ICO-999 | 치아 — tooth | 부품 | 치과 진료·구강 건강을 나타냄, 뿌리 두 갈래 달린 치아 모양 | 확인 [ICSET] | `tabler:dental` |
| ICO-1000 | 뼈 — bone | 부품 | 정형외과·골격 관련 진료를 나타냄, 양끝 둥근 뼈다귀 모양 | 확인 [ICLU] | `lucide:bone` |
| ICO-1001 | 바이러스 — virus | 부품 | 감염병·백신 관련 정보를 나타냄, 돌기 달린 둥근 바이러스 모양 | 확인 [ICLU] | `lucide:virus` |
| ICO-1002 | 세균 — bacteria | 부품 | 위생·감염 관리 정보를 나타냄, 꼬리 달린 타원형 세균 모양 | 확인 [ICSET] | `lucide:germ` |
| ICO-1003 | 폐 — lungs | 부품 | 호흡기내과 진료를 나타냄, 양쪽으로 갈라진 폐 모양 | 확인 [ICSET] | `tabler:lungs` |
| ICO-1004 | 청력 — ear hearing | 부품 | 이비인후과·보청기 서비스를 나타냄, 귀 안쪽 모양 | 확인 [ICLU] | `lucide:ear` |
| ICO-1005 | 목발 — crutches | 부품 | 재활·거동 보조 기구를 나타냄, 겨드랑이 받침 달린 목발 모양 | 확인 [ICSET] | `tabler:crutches` |
| ICO-1006 | 혈액 — blood drop | 부품 | 헌혈·혈액검사 정보를 나타냄, 한 방울 맺힌 핏방울 모양 | 확인 [ICSET] | `lucide:droplet` |
| ICO-1007 | 마스크 — mask | 부품 | 감염 예방·위생 수칙을 나타냄, 끈 달린 보건용 마스크 모양 | 확인 [ICSET] | `tabler:mask` |
| ICO-1008 | 체중계 — weight scale | 부품 | 체중 측정·건강 관리를 나타냄, 눈금판 달린 체중계 모양 | 확인 [ICSET] | `lucide:scale` |
| ICO-1009 | 입원 병상 — hospital bed | 부품 | 입원실·병상 안내를 나타냄, 난간 달린 병원 침대 모양 | 확인 [ICSET] | `tabler:emergency-bed` |
| ICO-1010 | 진료 기록 — clipboard pulse | 부품 | 진료 차트·검사 결과지를 나타냄, 파형선 그려진 클립보드 모양 | 확인 [ICSET] | `tabler:clipboard-heart` |
| ICO-1011 | 약병 — vial | 부품 | 백신·검체 보관 용기를 나타냄, 뚜껑 달린 작은 유리병 모양 | 확인 [ICSET] | `lucide:test-tube` |
| ICO-1012 | 엑스레이 — x ray | 부품 | 영상 촬영·방사선 검사를 나타냄, 필름에 비친 뼈 모양 | 확인 [ICSET] | `lucide:bone` |
| ICO-1013 | 간호사 — nurse | 부품 | 간호 인력·병동 서비스를 나타냄, 캡 쓴 간호사 얼굴 모양 | 확인 [ICSET] | `tabler:nurse` |
| ICO-1014 | 심박수 — heart rate | 부품 | 실시간 맥박 측정값을 나타냄, 숫자 곁들인 심전도 파형 모양 | 확인 [ICSET] | `tabler:heart-rate-monitor` |
| ICO-1015 | 처방전 — prescription | 부품 | 약 처방 내역 서류를 나타냄, 서명란 있는 처방전 용지 모양 | 확인 [ICSET] | `tabler:prescription` |

## 스포츠·운동 — Sports & Fitness

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-1016 | 덤벨 — dumbbell | 부품 | 근력 운동·헬스장 종목을 나타냄, 아령을 든 모습 | 확인 [ICLU] | `lucide:dumbbell` |
| ICO-1017 | 미식축구공 — football | 부품 | 미식축구 종목을 나타냄, 타원형 공에 실밥 무늬 | 확인 [ICSET] | `tabler:ball-american-football` |
| ICO-1018 | 축구공 — soccer ball | 부품 | 축구 종목을 나타냄, 오각형 무늬 있는 둥근 공 | 확인 [ICSET] | `tabler:ball-football` |
| ICO-1019 | 농구공 — basketball | 부품 | 농구 종목을 나타냄, 줄무늬 있는 오렌지색 공 | 확인 [ICSET] | `tabler:ball-basketball` |
| ICO-1020 | 야구공 — baseball | 부품 | 야구 종목을 나타냄, 실밥 무늬 새겨진 흰 공 | 확인 [ICSET] | `tabler:ball-baseball` |
| ICO-1021 | 테니스 — tennis | 부품 | 테니스 종목을 나타냄, 라켓과 노란 공을 같이 그림 | 확인 [ICSET] | `tabler:ball-tennis` |
| ICO-1022 | 배구공 — volleyball | 부품 | 배구 종목을 나타냄, 육각 무늬 있는 흰색 공 모양 | 확인 [ICLU] | `lucide:volleyball` |
| ICO-1023 | 골프 — golf | 부품 | 골프 종목을 나타냄, 깃발 꽂힌 홀에 놓인 공 | 확인 [ICSET] | `tabler:golf` |
| ICO-1024 | 아이스하키 — hockey | 부품 | 아이스하키 종목을 나타냄, 스틱으로 퍽을 치는 모습 | 확인 [ICSET] | `tabler:ice-skating` |
| ICO-1025 | 크리켓 — cricket | 부품 | 크리켓 종목을 나타냄, 배트와 세 개의 그루터기 | 확인 [ICSET] | `tabler:cricket` |
| ICO-1026 | 럭비 — rugby | 부품 | 럭비 종목을 나타냄, 길쭉한 타원형 공 모양을 그림 | 확인 [ICSET] | `tabler:rugby` |
| ICO-1027 | 수영 — swimming | 부품 | 수영 종목을 나타냄, 물살을 가르며 나아가는 사람 | 확인 [ICSET] | `tabler:swimming` |
| ICO-1028 | 달리기 — running | 부품 | 달리기·육상 종목을 나타냄, 팔다리를 뻗은 뛰는 사람 | 확인 [ICSET] | `tabler:run` |
| ICO-1029 | 스키 — skiing | 부품 | 스키 종목을 나타냄, 두 폴을 짚고 활강하는 사람 | 확인 [ICSET] | `material:downhill_skiing` |
| ICO-1030 | 스노보드 — snowboarding | 부품 | 스노보드 종목을 나타냄, 보드 위에서 점프하는 사람 | 확인 [ICSET] | `tabler:snowboarding` |
| ICO-1031 | 서핑 — surfing | 부품 | 서핑 종목을 나타냄, 파도 위에서 보드를 타는 사람 | 확인 [ICSET] | `material:surfing` |
| ICO-1032 | 스케이트보드 — skateboard | 부품 | 스케이트보드 종목을 나타냄, 보드를 타는 사람 모습 | 확인 [ICSET] | `tabler:skateboard` |
| ICO-1033 | 복싱 — boxing | 부품 | 복싱 종목을 나타냄, 글러브를 낀 두 주먹 모양 | 확인 [ICSET] | `phosphor:boxing-glove` |
| ICO-1034 | 카약 — kayak | 부품 | 카약·조정 종목을 나타냄, 노를 젓는 좁은 배 모양 | 확인 [ICLU] | `lucide:kayak` |
| ICO-1035 | 등산 — hiking | 부품 | 등산 활동을 나타냄, 지팡이 짚고 배낭 멘 사람 | 확인 [ICSET] | `tabler:trekking` |
| ICO-1036 | 요가 — yoga | 부품 | 요가 활동을 나타냄, 명상 자세로 앉은 사람 모습 | 확인 [ICSET] | `tabler:yoga` |
| ICO-1037 | 탁구 — ping pong | 부품 | 탁구 종목을 나타냄, 작은 라켓과 흰 공 조합 | 확인 [ICSET] | `tabler:ping-pong` |
| ICO-1038 | 볼링 — bowling | 부품 | 볼링 종목을 나타냄, 나란히 선 핀과 굴러오는 공 | 확인 [ICSET] | `tabler:ball-bowling` |
| ICO-1039 | 호루라기 — whistle | 부품 | 심판이 경기를 부르거나 멈출 때 부는 도구를 나타냄 | 확인 [ICLU] | `lucide:whistle` |
| ICO-1040 | 과녁 — target | 부품 | 목표·득점 지점을 나타냄, 동심원 그려진 표적판 | 확인 [ICLU] | `lucide:target` |
| ICO-1041 | 체커기 — flag checkered | 부품 | 경주 완주·결승선 통과를 나타냄, 흑백 체크무늬 깃발 | 확인 [ICSET] | `lucide:flag` |
| ICO-1042 | 헬멧 — helmet | 부품 | 안전 보호구 착용이 필요한 종목을 나타냄, 머리 보호구 | 확인 [ICSET] | `tabler:helmet` |
| ICO-1043 | 운동화 — sneaker | 부품 | 운동·러닝용 신발을 나타냄, 끈 달린 운동화 모양 | 확인 [ICSET] | `lucide:sport-shoe` |
| ICO-1044 | 줄넘기 — jump rope | 부품 | 줄넘기 운동을 나타냄, 손잡이 달린 긴 줄 모양 | 확인 [ICSET] | `tabler:jump-rope` |
| ICO-1045 | 전광판 — scoreboard | 부품 | 경기 점수·기록판을 나타냄, 숫자가 표시된 전광판 | 확인 [ICSET] | `tabler:scoreboard` |
| ICO-1046 | 바벨 — barbell | 부품 | 웨이트 트레이닝 종목을 나타냄, 양쪽에 원판 끼운 역기 | 확인 [ICLU] | `lucide:weight` |
| ICO-1047 | 배드민턴 — badminton | 부품 | 배드민턴 종목을 나타냄, 라켓과 셔틀콕 조합 모양 | 확인 [ICSET] | `material:badminton` |

## 게임·장난감 — Games & Toys

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-362 | 게임패드 — gamepad | 부품 | 게임용 조작 장치 | 확장 [MK] · 대조 [ICLU] | `lucide:gamepad` |
| ICO-1049 | 주사위 — dice | 부품 | 무작위 결과·확률 요소를 나타냄, 눈금 있는 정육면체 | 확인 [ICLU] | `lucide:dice-1` |
| ICO-1050 | 퍼즐 조각 — puzzle piece | 부품 | 퍼즐 장르나 조립식 기능을 나타냄, 요철 있는 조각 모양 | 확인 [ICLU] | `lucide:puzzle` |
| ICO-1051 | 조이스틱 — joystick | 부품 | 게임 조작 장치·오락실을 나타냄, 레버 달린 조종간 | 확인 [ICLU] | `lucide:joystick` |
| ICO-1052 | 체스 나이트 — chess knight | 부품 | 체스 말 나이트를 나타냄, 말머리를 조각한 모양 | 확인 [ICLU] | `lucide:chess-knight` |
| ICO-1053 | 체스 킹 — chess king | 부품 | 체스 말 킹을 나타냄, 십자가 얹은 왕관 모양 | 확인 [ICLU] | `lucide:chess-king` |
| ICO-1054 | 체스 퀸 — chess queen | 부품 | 체스 말 퀸을 나타냄, 뾰족한 왕관을 쓴 모양 | 확인 [ICLU] | `lucide:chess-queen` |
| ICO-1055 | 체스 폰 — chess pawn | 부품 | 체스 말 폰을 나타냄, 가장 작고 흔한 말 모양 | 확인 [ICLU] | `lucide:chess-pawn` |
| ICO-1056 | 트럼프 카드 — playing cards | 부품 | 카드 게임을 나타냄, 두 장이 겹쳐진 트럼프 카드 | 확인 [ICLU] | `lucide:playing-cards` |
| ICO-1057 | 클로버 무늬 — club suit | 부품 | 카드 클로버 무늬를 나타냄, 세 잎 클로버 모양 | 확인 [ICLU] | `lucide:club` |
| ICO-1058 | 스페이드 무늬 — spade suit | 부품 | 카드 스페이드 무늬를 나타냄, 검은 물방울 모양 | 확인 [ICLU] | `lucide:spade` |
| ICO-1059 | 하트 무늬 — heart suit | 부품 | 카드 하트 무늬를 나타냄, 붉은 하트 한 개 모양 | 확인 [ICLU] | `lucide:heart` |
| ICO-1060 | 다이아 무늬 — diamond suit | 부품 | 카드 다이아몬드 무늬를 나타냄, 붉은 마름모 모양 | 확인 [ICLU] | `lucide:diamond` |
| ICO-1062 | 쌍검 — swords | 부품 | 전투·대전 모드를 나타냄, 교차한 칼 두 자루 | 확인 [ICLU] | `lucide:swords` |
| ICO-1063 | 해골 — skull | 부품 | 사망·위험·게임오버 상태를 나타냄, 해골 모양 | 확인 [ICLU] | `lucide:skull` |
| ICO-1064 | 폭탄 — bomb | 부품 | 폭발 아이템이나 위험 요소를 나타냄, 심지 달린 공 | 확인 [ICLU] | `lucide:bomb` |
| ICO-1069 | 블록 장난감 — toy brick | 부품 | 조립식 놀이·빌딩 게임을 나타냄, 요철 있는 블록 | 확인 [ICLU] | `lucide:toy-brick` |
| ICO-1071 | 오락기 — arcade | 부품 | 오락실 게임기를 나타냄, 화면과 조이스틱 달린 기계 | 확인 [ICSET] | `lucide:joystick` |
| ICO-1072 | 보물 상자 — treasure chest | 부품 | 보상·아이템 획득을 나타냄, 잠금쇠 달린 나무 상자 | 확인 [ICSET] | `tabler:treasure-chest` |
| ICO-1073 | 팩맨 — pac man | 부품 | 클래식 아케이드 게임을 나타냄, 입 벌린 원 모양 | 확인 [ICSET] | `tabler:pacman` |

## 교육·학교 — Education

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-837 | 도서관 — library | 부품 | 책 열람·자료 대출 장소를 나타냄, 세워 둔 책 두 권 모양 | 확인 [ICLU] | `lucide:library` |
| ICO-1085 | 책 — book | 부품 | 학습 자료·교재를 나타냄, 표지 닫힌 책 모양 | 확인 [ICLU] | `lucide:book` |
| ICO-1086 | 펼친 책 — book open | 부품 | 읽는 중인 교재·학습 콘텐츠를 나타냄, 펼쳐진 책 | 확인 [ICLU] | `lucide:book-open` |
| ICO-1087 | 학사모 — graduation cap | 부품 | 졸업·교육 과정 이수를 나타냄, 각진 학사모 모양 | 확인 [ICLU] | `lucide:graduation-cap` |
| ICO-1092 | 칠판 — chalkboard | 부품 | 강의·수업 도구를 나타냄, 분필로 글씨 쓰는 칠판 | 확인 [ICSET] | `tabler:chalkboard` |
| ICO-1180 | 졸업 — graduation | 부품 | 졸업식 행사를 나타냄, 학사모 쓰고 졸업장 든 모습 | 확인 [ICLU] | `lucide:graduation-cap` |

## 지도·위치 — Maps & Location

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-326 | 길찾기 — directions | 부품 | 출발지에서 목적지까지 안내 | 확장 [MK] | `tabler:directions` |
| ICO-327 | 나침반 — compass | 부품 | 어느 쪽이 북쪽인지 보임 | 확장 [MK] · 대조 [ICLU] | `lucide:compass` |
| ICO-530 | 이정표 — signpost | 부품 | 여러 목적지·메뉴로 갈라지는 방향을 안내함, 팻말 모양 | 확인 [ICLU] | `lucide:signpost` |
| ICO-641 | 발자국 — footprints | 부품 | 이동 경로나 방문 기록을 나타냄, 발자국 모양 | 확인 [ICLU] | `lucide:footprints` |
| ICO-364 | 위성 위치 — gps | 부품 | 위성으로 위치를 잡음 | 확장 [MK] · 대조 [ICLU] | `lucide:locate-fixed` |
| ICO-324 | 위치 — location pin | 부품 | 지도 위 한 지점, 물방울 모양 핀 | 확장 [MK] · 대조 [ICLU] | `lucide:map-pin` |
| ICO-325 | 내 위치 — my location | 부품 | 지금 내가 있는 곳, 조준 표시 | 확장 [MK] · 대조 [ICLU] | `lucide:locate` |
| ICO-328 | 경로 — route | 부품 | 지나갈 길의 모양 | 확장 [MK] · 대조 [ICLU] | `lucide:route` |
| ICO-329 | 주소 — address | 부품 | 집·건물의 위치 정보 | 확장 [MK] · 대조 [ICLU] | `lucide:map-pin-house` |
| ICO-330 | 지구 — globe | 부품 | 나라·언어·전 세계를 뜻함 | 확장 [MK] · 대조 [ICLU] | `lucide:globe` |
| ICO-772 | 지도 — map | 부품 | 여행지·주변 위치를 한눈에 살펴봄, 접힌 종이 지도 모양 | 확인 [ICLU] | `lucide:map` |
| ICO-773 | 위치 지도 — map pinned | 부품 | 특정 지점을 표시한 지도를 나타냄, 핀이 꽂힌 지도 모양 | 확인 [ICLU] | `lucide:map-pinned` |
| ICO-774 | 길찾기 — navigation | 부품 | 목적지까지 방향을 안내함, 화살표 달린 나침반 바늘 모양 | 확인 [ICLU] | `lucide:navigation` |
| ICO-775 | 지구본 — earth | 부품 | 세계 서비스·해외 지역을 나타냄, 둥근 지구본 모양 | 확인 [ICLU] | `lucide:earth` |
| ICO-781 | 쌍안경 — binoculars | 부품 | 관광 명소·관측 기능을 나타냄, 쌍안경 렌즈 두 개 모양 | 확인 [ICLU] | `lucide:binoculars` |
| ICO-782 | 거리뷰 — street view | 부품 | 실제 거리 사진으로 둘러보는 기능을 나타냄, 사람 선 도로 모양 | 확인 [ICSET] | `tabler:view-360` |
| ICO-783 | 주차장 — parking | 부품 | 주차 가능한 위치를 나타냄, 동그라미 안의 P 글자 모양 | 확인 [ICLU] | `lucide:circle-parking` |
| ICO-784 | 주유소 — fuel | 부품 | 주유소 위치·연료 정보를 나타냄, 주유기 모양 | 확인 [ICLU] | `lucide:fuel` |
| ICO-785 | 신호등 — traffic light | 부품 | 교차로 신호 정보를 나타냄, 세 칸짜리 신호등 모양 | 확인 [ICSET] | `tabler:traffic-lights` |
| ICO-786 | 도로 — road | 부품 | 경로·도로 상태 정보를 나타냄, 굽어진 도로 모양 | 확인 [ICLU] | `lucide:road` |
| ICO-787 | 위치 끄기 — map pin off | 부품 | 위치 공유·표시 기능을 껐음을 나타냄, 사선 그어진 위치 핀 모양 | 확인 [ICLU] | `lucide:map-pin-off` |
| ICO-788 | 위치 추가 — map pin plus | 부품 | 새 장소를 지도에 등록함을 나타냄, 플러스 달린 위치 핀 모양 | 확인 [ICLU] | `lucide:map-pin-plus` |
| ICO-789 | 방문 확인 — map pin check | 부품 | 목적지 도착·체크인 완료를 나타냄, 체크 달린 위치 핀 모양 | 확인 [ICLU] | `lucide:map-pin-check` |
| ICO-790 | 레이더 — radar | 부품 | 주변 탐지·근접 서비스 찾기를 나타냄, 회전하는 레이더 화면 모양 | 확인 [ICLU] | `lucide:radar` |
| ICO-791 | 경유지 — waypoints | 부품 | 여러 목적지를 잇는 이동 경로를 나타냄, 점으로 이은 위치 핀 여러 개 | 확인 [ICLU] | `lucide:waypoints` |

## 여행·캠핑 — Travel & Outdoors

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-776 | 캠핑 — tent | 부품 | 야영·캠핑 여행 상품을 나타냄, 세모꼴 텐트 모양 | 확인 [ICLU] | `lucide:tent` |
| ICO-777 | 캐리어 — luggage | 부품 | 여행 짐·수하물을 나타냄, 손잡이 달린 캐리어 가방 모양 | 확인 [ICLU] | `lucide:luggage` |
| ICO-778 | 항공권 — ticket plane | 부품 | 비행기 표 예매·발권 기능을 나타냄, 비행기 그려진 티켓 모양 | 확인 [ICLU] | `lucide:tickets-plane` |
| ICO-779 | 여권 — passport | 부품 | 해외여행·출입국 정보를 나타냄, 덮인 여권 표지 모양 | 확인 [ICSET] | `tabler:e-passport` |
| ICO-780 | 해변 — beach | 부품 | 휴양지·바닷가 여행 상품을 나타냄, 파라솔과 파도 모양 | 확인 [ICSET] | `tabler:beach` |
| ICO-833 | 호텔 — hotel | 부품 | 숙박 시설·객실 예약을 나타냄, 침대 표시 있는 건물 모양 | 확인 [ICLU] | `lucide:hotel` |

## 국기·깃발 — Flags

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-524 | 국기 — flag | 부품 | 나라나 언어를 그림 하나로 알려 줌 | 확장 [MK] · 대조 [ICLU] | `lucide:flag` |

## 교통 — Transportation

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-638 | 자전거 타는 사람 — person biking | 부품 | 자전거를 타는 이동 수단이나 경로를 나타냄, 자전거 모양 | 확인 [ICSET] | `lucide:bike` |
| ICO-675 | 드론 — camera drone | 부품 | 하늘에서 촬영하거나 배송하는 무인기를 나타냄, 드론 모양 | 확인 [ICLU] | `lucide:drone` |
| ICO-332 | 비행 — flight | 부품 | 항공편·먼 이동 | 확장 [MK] · 대조 [ICLU] | `lucide:plane` |
| ICO-333 | 이동 수단 — transit mode | 부품 | 걷기·차·대중교통 선택 | 확장 [MK] | `tabler:route-2` |
| ICO-792 | 자동차 — car | 부품 | 일반 승용차 이동수단을 나타냄, 옆에서 본 승용차 모양 | 확인 [ICLU] | `lucide:car` |
| ICO-793 | 버스 — bus | 부품 | 버스 노선·대중교통 이용을 나타냄, 옆에서 본 버스 모양 | 확인 [ICLU] | `lucide:bus` |
| ICO-794 | 기차 — train | 부품 | 철도·기차 이동수단을 나타냄, 정면에서 본 열차 모양 | 확인 [ICLU] | `lucide:tram-front` |
| ICO-795 | 트램 — tram | 부품 | 노면 전차 노선을 나타냄, 옆에서 본 트램 차량 모양 | 확인 [ICSET] | `lucide:tram-front` |
| ICO-796 | 지하철 — subway | 부품 | 지하철 노선·환승 정보를 나타냄, 옆에서 본 전동차 모양 | 확인 [ICSET] | `lucide:train-front-tunnel` |
| ICO-797 | 출발 항공편 — plane takeoff | 부품 | 비행기 이륙·출발 항공편을 나타냄, 위로 떠오르는 비행기 모양 | 확인 [ICLU] | `lucide:plane-takeoff` |
| ICO-798 | 도착 항공편 — plane landing | 부품 | 비행기 착륙·도착 항공편을 나타냄, 아래로 내려앉는 비행기 모양 | 확인 [ICLU] | `lucide:plane-landing` |
| ICO-799 | 여객선 — ship | 부품 | 대형 선박·크루즈 이동수단을 나타냄, 옆에서 본 큰 배 모양 | 확인 [ICLU] | `lucide:ship` |
| ICO-800 | 돛단배 — sailboat | 부품 | 요트·수상 레저 활동을 나타냄, 돛을 편 배 모양 | 확인 [ICLU] | `lucide:sailboat` |
| ICO-801 | 자전거 — bike | 부품 | 자전거 이동수단·대여 서비스를 나타냄, 옆에서 본 자전거 모양 | 확인 [ICLU] | `lucide:bike` |
| ICO-802 | 킥보드 — scooter | 부품 | 전동 킥보드 공유 서비스를 나타냄, 손잡이 달린 킥보드 모양 | 확인 [ICLU] | `lucide:scooter` |
| ICO-803 | 오토바이 — motorcycle | 부품 | 오토바이 이동수단·배달 서비스를 나타냄, 옆에서 본 오토바이 모양 | 확인 [ICLU] | `lucide:motorbike` |
| ICO-804 | 트럭 — truck | 부품 | 화물 운송·배송 차량을 나타냄, 옆에서 본 화물차 모양 | 확인 [ICLU] | `lucide:truck` |
| ICO-805 | 택시 — taxi | 부품 | 택시 호출·요금 서비스를 나타냄, 지붕 표시등 단 승용차 모양 | 확인 [ICSET] | `lucide:car-taxi-front` |
| ICO-806 | 구급차 — ambulance | 부품 | 응급 이송·구급 서비스를 나타냄, 십자 표시 있는 구급차 모양 | 확인 [ICLU] | `lucide:ambulance` |
| ICO-807 | 소방차 — fire truck | 부품 | 화재 출동·소방 서비스를 나타냄, 사다리 달린 소방차 모양 | 확인 [ICSET] | `tabler:firetruck` |
| ICO-808 | 헬리콥터 — helicopter | 부품 | 응급 이송·관광 비행을 나타냄, 회전날개 달린 헬기 모양 | 확인 [ICLU] | `lucide:helicopter` |
| ICO-809 | 트랙터 — tractor | 부품 | 농기계·농업 운송수단을 나타냄, 큰 뒷바퀴 달린 트랙터 모양 | 확인 [ICLU] | `lucide:tractor` |
| ICO-810 | 캠핑카 — caravan | 부품 | 장기 여행·차박 숙소를 나타냄, 지붕 낮은 캠핑카 모양 | 확인 [ICLU] | `lucide:caravan` |
| ICO-811 | 케이블카 — cable car | 부품 | 산악 관광·공중 이동수단을 나타냄, 줄에 매달린 곤돌라 모양 | 확인 [ICLU] | `lucide:cable-car` |
| ICO-812 | 전기차 충전 — ev charger | 부품 | 전기차 충전소 위치를 나타냄, 플러그 꽂힌 충전기 모양 | 확인 [ICLU] | `lucide:ev-charger` |
| ICO-813 | 안전 고깔 — traffic cone | 부품 | 공사 구간·통행 주의를 나타냄, 주황색 삼각 고깔 모양 | 확인 [ICLU] | `lucide:traffic-cone` |
| ICO-814 | 교통사고 — car crash | 부품 | 사고 신고·보험 접수 기능을 나타냄, 부딪힌 자동차 두 대 모양 | 확인 [ICSET] | `tabler:car-crash` |
| ICO-815 | 운전대 — steering wheel | 부품 | 운전·주행 관련 기능을 나타냄, 둥근 자동차 핸들 모양 | 확인 [ICSET] | `tabler:steering-wheel` |
| ICO-816 | 타이어 — tire | 부품 | 정비·타이어 교체 서비스를 나타냄, 둥근 바퀴 단면 모양 | 확인 [ICSET] | `tabler:wheel` |
| ICO-817 | 닻 — anchor | 부품 | 정박·항구 서비스를 나타냄, 갈고리 두 개 달린 닻 모양 | 확인 [ICLU] | `lucide:anchor` |
| ICO-818 | 여객 페리 — ferry | 부품 | 차량 동반 여객선 항로를 나타냄, 낮고 넓적한 페리선 모양 | 확인 [ICSET] | `tabler:ferry` |
| ICO-819 | 버스 정류장 — bus stop | 부품 | 버스 승하차 위치를 나타냄, 지붕 달린 정류장 표지판 모양 | 확인 [ICSET] | `tabler:bus-stop` |
| ICO-820 | 좌석 — seat | 부품 | 좌석 선택·예약 기능을 나타냄, 등받이 있는 의자 모양 | 확인 [ICSET] | `tabler:armchair-2` |
| ICO-821 | 승합차 — van | 부품 | 단체 이동·셔틀 서비스를 나타냄, 옆에서 본 승합차 모양 | 확인 [ICLU] | `lucide:van` |

## 건물·부동산 — Buildings & Real Estate

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-331 | 건물 — building | 부품 | 회사·지점 같은 장소 | 확장 [MK] · 대조 [ICLU] | `lucide:building` |
| ICO-823 | 건물 — buildings | 부품 | 여러 건물이 모인 도심 지역을 나타냄, 나란히 선 빌딩 두 채 모양 | 확인 [ICLU] | `lucide:building` |
| ICO-824 | 학교 — school | 부품 | 초중고 교육기관을 나타냄, 삼각 지붕에 깃발 달린 건물 모양 | 확인 [ICLU] | `lucide:school` |
| ICO-825 | 대학교 — university | 부품 | 고등교육기관·캠퍼스를 나타냄, 둥근 지붕에 기둥 있는 건물 모양 | 확인 [ICLU] | `lucide:university` |
| ICO-826 | 교회 — church | 부품 | 기독교 예배 장소를 나타냄, 뾰족 지붕에 십자가 달린 건물 모양 | 확인 [ICLU] | `lucide:church` |
| ICO-827 | 모스크 — mosque | 부품 | 이슬람 예배 장소를 나타냄, 돔 지붕에 초승달 달린 건물 모양 | 확인 [ICLU] | `lucide:mosque` |
| ICO-828 | 유대교회당 — synagogue | 부품 | 유대교 예배 장소를 나타냄, 별 문양 달린 회당 건물 모양 | 확인 [ICSET] | `tabler:building-church` |
| ICO-829 | 사찰 — temple | 부품 | 불교 사원·전통 사찰을 나타냄, 처마 굽은 지붕의 절 건물 모양 | 확인 [ICSET] | `lucide:church` |
| ICO-830 | 성 — castle | 부품 | 역사 유적·성곽 관광지를 나타냄, 첨탑 달린 성 건물 모양 | 확인 [ICLU] | `lucide:castle` |
| ICO-831 | 공장 — factory | 부품 | 제조업 시설·산업단지를 나타냄, 굴뚝에서 연기 나는 공장 모양 | 확인 [ICLU] | `lucide:factory` |
| ICO-832 | 주택 — house | 부품 | 단독주택·거주 공간을 나타냄, 삼각 지붕 달린 집 모양 | 확인 [ICLU] | `lucide:house` |
| ICO-834 | 관광 명소 — landmark | 부품 | 지역 대표 명소·랜드마크를 나타냄, 기둥 달린 기념 건축물 모양 | 확인 [ICLU] | `lucide:landmark` |
| ICO-835 | 경기장 — stadium | 부품 | 스포츠 경기·관중석 시설을 나타냄, 타원형 관중석 건물 모양 | 확인 [ICSET] | `tabler:building-stadium` |
| ICO-836 | 관제탑 — tower | 부품 | 공항 관제·항공 통제 시설을 나타냄, 창문 넓은 탑 건물 모양 | 확인 [ICLU] | `lucide:tower-control` |
| ICO-838 | 도시 — city | 부품 | 도시 전경·시내 지역을 나타냄, 빌딩이 늘어선 스카이라인 모양 | 확인 [ICSET] | `tabler:buildings` |
| ICO-840 | 등대 — lighthouse | 부품 | 항구·해안 안내 시설을 나타냄, 빛이 퍼지는 등대 모양 | 확인 [ICLU] | `lucide:lighthouse` |
| ICO-841 | 요새 — fort | 부품 | 군사 유적·방어 시설을 나타냄, 톱니 모양 성벽 건물 모양 | 확인 [ICSET] | `tabler:building-fortress` |
| ICO-842 | 고층빌딩 — skyscraper | 부품 | 초고층 사무·업무 지구를 나타냄, 아주 높게 솟은 빌딩 모양 | 확인 [ICSET] | `tabler:building-skyscraper` |
| ICO-843 | 주유소 건물 — gas station | 부품 | 주유소 매장·정비소 시설을 나타냄, 지붕 낮은 주유소 건물 모양 | 확인 [ICSET] | `tabler:gas-station` |
| ICO-844 | 다리 — bridge | 부품 | 강·계곡을 잇는 교량을 나타냄, 아치형 다리 모양 | 확인 [ICLU] | `lucide:bridge` |
| ICO-845 | 울타리 — fence | 부품 | 경계·출입 제한 구역을 나타냄, 나무 살 이어진 울타리 모양 | 확인 [ICLU] | `lucide:fence` |
| ICO-846 | 차고 — garage | 부품 | 주차·정비 공간을 나타냄, 셔터 문 달린 차고 건물 모양 | 확인 [ICSET] | `tabler:car-garage` |
| ICO-847 | 신규 매물 — house plus | 부품 | 새로 등록한 부동산 매물을 나타냄, 플러스가 달린 집 모양 | 확인 [ICLU] | `lucide:house-plus` |
| ICO-848 | 관심 매물 — house heart | 부품 | 찜한 부동산 매물을 나타냄, 하트가 달린 집 모양 | 확인 [ICLU] | `lucide:house-heart` |
| ICO-849 | 공동주택 — building community | 부품 | 아파트·연립 등 공동 주거지를 나타냄, 여러 세대 창문 늘어선 건물 모양 | 확인 [ICSET] | `tabler:building-community` |
| ICO-850 | 아치문 — arch | 부품 | 기념 아치·개선문 조형물을 나타냄, 반원형 아치 구조물 모양 | 확인 [ICSET] | `tabler:building-arch` |

## 자연·식물 — Nature & Plants

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-428 | 불꽃 — fire | 부품 | 인기 있음·급상승 | 확장 [MK] · 대조 [ICLU] | `lucide:flame` |
| ICO-429 | 물방울 — water drop | 부품 | 물·수분과 관련한 값 | 확장 [MK] · 대조 [ICLU] | `lucide:droplet` |
| ICO-430 | 나뭇잎 — leaf | 부품 | 친환경·절약 모드 | 확장 [MK] · 대조 [ICLU] | `lucide:leaf` |
| ICO-431 | 나무 — tree | 부품 | 자연·계층 구조를 비유함 | 확장 [MK] · 대조 [ICLU] | `lucide:tree-deciduous` |
| ICO-945 | 숲 — trees | 부품 | 산림·자연 경관을 나타냄, 나무 여러 그루 모인 모양 | 확인 [ICLU] | `lucide:trees` |
| ICO-946 | 소나무 — pine tree | 부품 | 침엽수·크리스마스 콘텐츠를 나타냄, 뾰족한 세모꼴 나무 모양 | 확인 [ICLU] | `lucide:tree-pine` |
| ICO-947 | 꽃 — flower | 부품 | 원예·꽃 배달 서비스를 나타냄, 꽃잎 다섯 장 핀 꽃 모양 | 확인 [ICLU] | `lucide:flower` |
| ICO-948 | 튤립 — tulip | 부품 | 봄꽃·화훼 상품을 나타냄, 컵 모양으로 오므린 꽃잎 모양 | 확인 [ICLU] | `lucide:flower` |
| ICO-949 | 새싹 — sprout | 부품 | 새 시작·성장 단계를 비유함, 흙에서 돋은 새싹 모양 | 확인 [ICLU] | `lucide:sprout` |
| ICO-950 | 네잎클로버 — clover | 부품 | 행운·자연 콘텐츠를 나타냄, 잎 네 장 달린 클로버 모양 | 확인 [ICLU] | `lucide:clover` |
| ICO-951 | 선인장 — cactus | 부품 | 다육식물·사막 콘텐츠를 나타냄, 가시 돋은 선인장 모양 | 확인 [ICSET] | `tabler:cactus` |
| ICO-952 | 야자수 — palm tree | 부품 | 휴양지·열대 콘텐츠를 나타냄, 위쪽에 잎 퍼진 야자나무 모양 | 확인 [ICLU] | `lucide:tree-palm` |
| ICO-953 | 산 — mountain | 부품 | 등산·자연 경관을 나타냄, 봉우리 두 개 겹친 산 모양 | 확인 [ICLU] | `lucide:mountain` |
| ICO-954 | 설산 — mountain snow | 부품 | 겨울 산·스키 관광지를 나타냄, 눈 덮인 산봉우리 모양 | 확인 [ICLU] | `lucide:mountain-snow` |
| ICO-955 | 파도 — waves | 부품 | 바다·해양 콘텐츠를 나타냄, 물결치는 가로선 여러 겹 모양 | 확인 [ICLU] | `lucide:waves-horizontal` |
| ICO-957 | 조개껍데기 — shell | 부품 | 해변·바다 콘텐츠를 나타냄, 부챗살 무늬 조개 모양 | 확인 [ICLU] | `lucide:shell` |
| ICO-958 | 화산 — volcano | 부품 | 지질 재해·화산 지형을 나타냄, 정상에서 연기 나는 산 모양 | 확인 [ICSET] | `tabler:volcano` |
| ICO-959 | 버섯 — mushroom | 부품 | 숲 생태·식용식물을 나타냄, 갓 넓은 버섯 모양 | 확인 [ICSET] | `tabler:mushroom` |
| ICO-960 | 잔디 — grass | 부품 | 정원·초지 콘텐츠를 나타냄, 가늘게 솟은 풀잎 여러 개 모양 | 확인 [ICSET] | `material:grass` |
| ICO-962 | 도토리 — acorn | 부품 | 가을·숲 열매를 나타냄, 깍정이 얹힌 도토리 모양 | 확인 [ICSET] | `tabler:acorn` |
| ICO-963 | 연꽃 — lotus | 부품 | 명상·전통 상징을 나타냄, 겹겹이 핀 연꽃 모양 | 확인 [ICSET] | `lucide:flower` |
| ICO-964 | 통나무 — log | 부품 | 목재·캠프파이어 재료를 나타냄, 둥근 단면 드러난 통나무 모양 | 확인 [ICSET] | `tabler:wood` |
| ICO-965 | 산사태 — landslide | 부품 | 자연재해 경보를 나타냄, 흙더미 무너지는 산 모양 | 확인 [ICSET] | `material:landslide` |
| ICO-968 | 지진 — earthquake | 부품 | 자연재해 경보를 나타냄, 갈라진 땅과 흔들림 표시 모양 | 확인 [ICSET] | `material:earthquake` |
| ICO-969 | 파동 — wave pulse | 부품 | 지진파·진동 감지를 나타냄, 오르내리는 파형선 모양 | 확인 [ICSET] | `tabler:wave-sine` |

## 농업·원예 — Farming & Gardening

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-839 | 헛간 — barn | 부품 | 농장 창고·축사 건물을 나타냄, 둥근 지붕 붙은 헛간 모양 | 확인 [ICSET] | `tabler:building-cottage` |
| ICO-911 | 밀 — wheat | 부품 | 곡물·제분 재료를 나타냄, 이삭 달린 밀 줄기 모양 | 확인 [ICLU] | `lucide:wheat` |
| ICO-961 | 씨앗 — seed | 부품 | 파종·재배 시작을 나타냄, 둥근 낱알 씨앗 모양 | 확인 [ICSET] | `lucide:sprout` |

## 에너지·환경 — Energy & Environment

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-851 | 풍차 — windmill | 부품 | 풍력 발전·전통 풍차 시설을 나타냄, 날개 네 개 달린 풍차 모양 | 확인 [ICSET] | `tabler:windmill` |
| ICO-956 | 재활용 — recycle | 부품 | 분리배출·친환경 활동을 나타냄, 화살표 세 개가 도는 모양 | 확인 [ICLU] | `lucide:recycle` |
| ICO-966 | 태양광 패널 — sun plant | 부품 | 친환경 에너지·태양광 발전을 나타냄, 격자무늬 패널 모양 | 확인 [ICLU] | `lucide:solar-panel` |
| ICO-970 | 퇴비 — compost | 부품 | 친환경 처리·유기물 재활용을 나타냄, 벌레와 흙이 담긴 통 모양 | 확인 [ICSET] | `material:compost` |

## 날씨·기후 — Weather

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-967 | 태풍 — hurricane | 부품 | 폭풍·기상 재해를 나타냄, 소용돌이치는 구름 모양 | 확인 [ICSET] | `lucide:tornado` |
| ICO-415 | 해 — sun | 부품 | 맑음·낮을 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:sun` |
| ICO-416 | 달 — moon | 부품 | 밤·야간 시간대를 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:moon` |
| ICO-417 | 구름 — cloudy | 부품 | 흐린 날씨 | 확장 [MK] · 대조 [ICLU] | `lucide:cloud` |
| ICO-418 | 비 — rain | 부품 | 비 오는 날씨 | 확장 [MK] · 대조 [ICLU] | `lucide:cloud-rain` |
| ICO-419 | 눈 — snow | 부품 | 눈 오는 날씨 | 확장 [MK] · 대조 [ICLU] | `lucide:cloud-snow` |
| ICO-420 | 뇌우 — thunderstorm | 부품 | 천둥·번개를 동반한 비 | 확장 [MK] · 대조 [ICLU] | `lucide:cloud-lightning` |
| ICO-421 | 바람 — wind | 부품 | 바람 세기와 방향 | 확장 [MK] · 대조 [ICLU] | `lucide:wind` |
| ICO-422 | 안개 — fog | 부품 | 시야가 흐린 상태 | 확장 [MK] · 대조 [ICLU] | `lucide:cloud-fog` |
| ICO-423 | 기온 — temperature | 부품 | 덥고 추운 정도, 온도계 | 확장 [MK] · 대조 [ICLU] | `lucide:thermometer` |
| ICO-424 | 습도 — humidity | 부품 | 공기 중 물기 정도 | 확장 [MK] · 대조 [ICLU] | `lucide:droplets` |
| ICO-425 | 일출 — sunrise | 부품 | 해가 뜨는 시각 | 확장 [MK] · 대조 [ICLU] | `lucide:sunrise` |
| ICO-426 | 일몰 — sunset | 부품 | 해가 지는 시각 | 확장 [MK] · 대조 [ICLU] | `lucide:sunset` |
| ICO-522 | 자외선 지수 — UV index | 부품 | 오늘 햇빛의 자외선 세기를 알려 줌 | 확장 [MK] · 대조 [ICLU] | `lucide:gauge` |
| ICO-523 | 대기질 — air quality | 부품 | 오늘 공기가 얼마나 깨끗한지 알려 줌 | 확장 [MK] · 대조 [ICLU] | `lucide:wind` |
| ICO-971 | 구름 조금 — cloud sun | 부품 | 맑음에 구름 낀 날씨를 나타냄, 해와 작은 구름 겹친 모양 | 확인 [ICLU] | `lucide:cloud-sun` |
| ICO-972 | 밤 구름 — cloud moon | 부품 | 야간에 구름 낀 날씨를 나타냄, 달과 작은 구름 겹친 모양 | 확인 [ICLU] | `lucide:cloud-moon` |
| ICO-973 | 이슬비 — cloud drizzle | 부품 | 가는 비 내리는 날씨를 나타냄, 구름 아래 점선 빗방울 모양 | 확인 [ICLU] | `lucide:cloud-drizzle` |
| ICO-974 | 토네이도 — tornado | 부품 | 강한 회오리바람 경보를 나타냄, 소용돌이치는 깔때기 구름 모양 | 확인 [ICLU] | `lucide:tornado` |
| ICO-975 | 우산 — umbrella | 부품 | 강수 대비·우산 필요 안내를 나타냄, 펼쳐진 우산 모양 | 확인 [ICLU] | `lucide:umbrella` |
| ICO-976 | 폭염 예보 — thermometer sun | 부품 | 고온·폭염 주의보를 나타냄, 해가 곁들여진 온도계 모양 | 확인 [ICLU] | `lucide:thermometer-sun` |
| ICO-977 | 한파 예보 — thermometer snowflake | 부품 | 저온·한파 주의보를 나타냄, 눈송이가 곁들여진 온도계 모양 | 확인 [ICLU] | `lucide:thermometer-snowflake` |
| ICO-978 | 무지개 — rainbow | 부품 | 비 갠 뒤 맑은 날씨를 나타냄, 반원으로 겹친 무지개 모양 | 확인 [ICLU] | `lucide:rainbow` |
| ICO-979 | 맑은 밤하늘 — stars | 부품 | 구름 없는 맑은 밤을 나타냄, 반짝이는 별 여러 개 모양 | 확인 [ICLU] | `lucide:sparkles` |
| ICO-980 | 우박 — cloud hail | 부품 | 우박 내리는 날씨를 나타냄, 구름 아래 동그란 얼음 알갱이 모양 | 확인 [ICLU] | `lucide:cloud-hail` |
| ICO-981 | 폭풍우 — storm | 부품 | 강한 비바람 경보를 나타냄, 번개 치는 먹구름 모양 | 확인 [ICSET] | `tabler:storm` |
| ICO-982 | 풍향계 — windsock | 부품 | 바람 세기·방향 측정을 나타냄, 깃대에 매달린 원뿔 자루 모양 | 확인 [ICSET] | `tabler:windsock` |
| ICO-983 | 초승달 밤 — moon star | 부품 | 맑은 밤 시간대를 나타냄, 초승달 옆에 작은 별 붙은 모양 | 확인 [ICLU] | `lucide:moon-star` |
| ICO-984 | 낮밤 전환 — sun moon | 부품 | 일출·일몰 시간대 전환을 나타냄, 해와 달이 반씩 합쳐진 모양 | 확인 [ICLU] | `lucide:sun-moon` |
| ICO-987 | 해 비 — cloud sun rain | 부품 | 맑다가 비 오는 변덕 날씨를 나타냄, 해와 빗방울 겹친 구름 모양 | 확인 [ICLU] | `lucide:cloud-sun-rain` |

## 우주·별자리 — Space & Zodiac

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-985 | 일식 — eclipse | 부품 | 천체 현상·일식 정보를 나타냄, 달에 가려진 해 모양 | 확인 [ICLU] | `lucide:eclipse` |
| ICO-986 | 혜성 — comet | 부품 | 천체 현상·유성 콘텐츠를 나타냄, 꼬리 끄는 혜성 모양 | 확인 [ICSET] | `tabler:comet` |
| ICO-1078 | 망원경 — telescope | 부품 | 천체 관측·천문학을 나타냄, 긴 원통형 관측 장비 | 확인 [ICLU] | `lucide:telescope` |
| ICO-1081 | 궤도 — orbit | 부품 | 천체가 도는 길·공전 운동을 나타냄, 타원 궤도 선 | 확인 [ICLU] | `lucide:orbit` |
| ICO-1082 | 행성 — planet | 부품 | 천문학·우주 분야를 나타냄, 고리 두른 행성 모양 | 확인 [ICSET] | `tabler:planet` |
| ICO-1083 | 로켓 — rocket | 부품 | 우주 발사체·빠른 성장을 나타냄, 불꽃 뿜는 로켓 | 확인 [ICLU] | `lucide:rocket` |
| ICO-1084 | 인공위성 — satellite | 부품 | 우주 통신·관측 장비를 나타냄, 태양전지판 단 위성 | 확인 [ICLU] | `lucide:satellite` |
| ICO-1093 | 은하 — galaxy | 부품 | 우주·천문학 분야를 나타냄, 소용돌이치는 성운 모양 | 확인 [ICLU] | `lucide:galaxy` |
| ICO-1094 | 미확인비행물체 — ufo | 부품 | SF·외계 소재를 나타냄, 원반 모양의 비행 물체 | 확인 [ICSET] | `tabler:ufo` |

## 동물 — Animals

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-432 | 발자국 — paw | 부품 | 반려동물 관련 항목 | 확장 [MK] · 대조 [ICLU] | `lucide:paw-print` |
| ICO-917 | 강아지 — dog | 부품 | 반려동물·동물병원 서비스를 나타냄, 앉은 개 옆모습 | 확인 [ICLU] | `lucide:dog` |
| ICO-918 | 고양이 — cat | 부품 | 반려동물 관련 서비스를 나타냄, 앉은 고양이 옆모습 | 확인 [ICLU] | `lucide:cat` |
| ICO-919 | 새 — bird | 부품 | 조류·야생동물 콘텐츠를 나타냄, 날개 편 새 모양 | 확인 [ICLU] | `lucide:bird` |
| ICO-920 | 물고기 — fish | 부품 | 수산물·수족관 콘텐츠를 나타냄, 옆에서 본 물고기 모양 | 확인 [ICLU] | `lucide:fish` |
| ICO-921 | 토끼 — rabbit | 부품 | 소동물·반려동물을 나타냄, 긴 귀 세운 토끼 모양 | 확인 [ICLU] | `lucide:rabbit` |
| ICO-922 | 거북이 — turtle | 부품 | 파충류·느린 속도를 비유함, 등딱지 진 거북 모양 | 확인 [ICLU] | `lucide:turtle` |
| ICO-923 | 달팽이 — snail | 부품 | 느린 진행 상태·연체동물을 나타냄, 껍데기 짊어진 달팽이 모양 | 확인 [ICLU] | `lucide:snail` |
| ICO-924 | 다람쥐 — squirrel | 부품 | 야생 소동물·저장 습성을 나타냄, 도토리 든 다람쥐 모양 | 확인 [ICLU] | `lucide:squirrel` |
| ICO-925 | 쥐 — rat | 부품 | 설치류·해충 방역을 나타냄, 긴 꼬리 달린 쥐 모양 | 확인 [ICLU] | `lucide:rat` |
| ICO-926 | 소 — cow | 부품 | 축산·유제품 원료를 나타냄, 뿔 달린 소 얼굴 모양 | 확인 [ICSET] | `phosphor:cow` |
| ICO-927 | 말 — horse | 부품 | 승마·목장 체험을 나타냄, 갈기 날리는 말 옆모습 | 확인 [ICSET] | `tabler:horse` |
| ICO-928 | 돼지 — pig | 부품 | 축산·저금통 콘텐츠를 나타냄, 둥근 코 달린 돼지 얼굴 모양 | 확인 [ICSET] | `tabler:pig` |
| ICO-929 | 나비 — butterfly | 부품 | 곤충·정원 콘텐츠를 나타냄, 양쪽으로 편 나비 날개 모양 | 확인 [ICSET] | `tabler:butterfly` |
| ICO-930 | 거미 — spider | 부품 | 곤충류·할로윈 콘텐츠를 나타냄, 다리 여덟 개 달린 거미 모양 | 확인 [ICSET] | `tabler:spider` |
| ICO-931 | 꿀벌 — bee | 부품 | 양봉·수분 곤충을 나타냄, 줄무늬 몸통의 벌 모양 | 확인 [ICSET] | `emoji:🐝` |
| ICO-932 | 깃털 — feather | 부품 | 새·필기 콘텐츠를 나타냄, 한 개의 새 깃털 모양 | 확인 [ICLU] | `lucide:feather` |
| ICO-933 | 새우 — shrimp | 부품 | 해산물 메뉴·수산물을 나타냄, 구부러진 새우 몸통 모양 | 확인 [ICLU] | `lucide:shrimp` |
| ICO-934 | 지렁이 — worm | 부품 | 토양 생물·낚시 미끼를 나타냄, 구불거리는 지렁이 몸통 모양 | 확인 [ICLU] | `lucide:worm` |
| ICO-935 | 비둘기 — dove | 부품 | 평화·전서구 콘텐츠를 나타냄, 날개 편 비둘기 모양 | 확인 [ICSET] | `emoji:🕊️` |
| ICO-936 | 까마귀 — crow | 부품 | 야생 조류·불길함을 비유함, 검은 까마귀 옆모습 | 확인 [ICSET] | `material:raven` |
| ICO-937 | 개구리 — frog | 부품 | 양서류·습지 생물을 나타냄, 다리 접고 앉은 개구리 모양 | 확인 [ICSET] | `emoji:🐸` |
| ICO-938 | 키위새 — kiwi bird | 부품 | 희귀 조류·뉴질랜드 상징을 나타냄, 부리 긴 둥근 몸통의 새 모양 | 확인 [ICSET] | `lucide:bird` |
| ICO-939 | 하마 — hippo | 부품 | 대형 야생동물을 나타냄, 넓적한 입 벌린 하마 모양 | 확인 [ICSET] | `emoji:🦛` |
| ICO-940 | 수달 — otter | 부품 | 수생 야생동물을 나타냄, 헤엄치는 수달 옆모습 | 확인 [ICSET] | `emoji:🦦` |
| ICO-941 | 판다 — panda | 부품 | 동물원 인기 동물을 나타냄, 검은 눈 무늬 있는 곰 모양 | 확인 [ICLU] | `lucide:panda` |
| ICO-942 | 부엉이 — owl | 부품 | 야행성 조류·지혜를 비유함, 큰 눈 달린 부엉이 모양 | 확인 [ICSET] | `material:owl` |
| ICO-943 | 사슴 — deer | 부품 | 야생 초식동물을 나타냄, 뿔 달린 사슴 얼굴 모양 | 확인 [ICSET] | `tabler:deer` |
| ICO-944 | 박쥐 — bat | 부품 | 야행성 동물·할로윈 콘텐츠를 나타냄, 날개 편 박쥐 모양 | 확인 [ICSET] | `tabler:bat` |

## 과학·실험 — Science & Lab

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-1074 | 플라스크 — flask | 부품 | 화학 실험·과학 활동을 나타냄, 둥근 밑 유리병 | 확인 [ICLU] | `lucide:flask-round` |
| ICO-1075 | 시험관 — test tube | 부품 | 화학 실험·시약 담기를 나타냄, 길쭉한 유리관 모양 | 확인 [ICLU] | `lucide:test-tube` |
| ICO-1076 | 원자 — atom | 부품 | 물리·화학 과학 분야를 나타냄, 궤도 도는 전자 | 확인 [ICLU] | `lucide:atom` |
| ICO-1077 | 현미경 — microscope | 부품 | 미세 관찰·생물 실험을 나타냄, 렌즈 달린 관찰 장비 | 확인 [ICLU] | `lucide:microscope` |
| ICO-1079 | DNA — dna | 부품 | 유전자·생명과학 분야를 나타냄, 이중나선 모양 | 확인 [ICLU] | `lucide:dna` |
| ICO-1080 | 자석 — magnet | 부품 | 자기력 실험·물리 분야를 나타냄, 말굽 모양 자석 | 확인 [ICLU] | `lucide:magnet` |
| ICO-1089 | 비커 — beaker | 부품 | 액체 계량·실험을 나타냄, 눈금 새겨진 유리컵 | 확인 [ICLU] | `lucide:beaker` |
| ICO-1232 | 스포이트 — pipette | 부품 | 소량 액체 옮기기 도구를 나타냄, 눈금 달린 스포이트 | 확인 [ICLU] | `lucide:pipette` |

## 수학·계산 — Math

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-93 | 계산 — calculate | 부품 | 값을 셈해 보여 줌, 계산기 | 확장 [MK] · 대조 [ICLU] | `lucide:calculator` |
| ICO-248 | 수식 — equation | 부품 | 셈 기호가 들어간 식을 넣음 | 확장 [MK] · 대조 [ICLU] | `lucide:sigma` |
| ICO-476 | 곱셈 기호 — multiplication sign | 부품 | 크기 표기와 곱셈, 영문 x와 구분 | 확장 [MK] · 대조 [ICLU] | `lucide:x` |
| ICO-477 | 더하기 빼기 — plus-minus sign | 부품 | 오차 범위를 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:diff` |
| ICO-478 | 같지 않음 — not equal sign | 부품 | 두 값이 다름 | 확장 [MK] · 대조 [ICLU] | `lucide:equal-not` |
| ICO-479 | 거의 같음 — approximately sign | 부품 | 어림한 값임 | 확장 [MK] · 대조 [ICLU] | `lucide:equal-approximately` |
| ICO-480 | 부등호 — inequality sign | 부품 | 크거나 같음·작거나 같음 | 확장 [MK] | `lucide:equal-approximately-not` |
| ICO-481 | 무한대 — infinity sign | 부품 | 끝이 없음·무제한 | 확장 [MK] · 대조 [ICLU] | `lucide:infinity` |
| ICO-482 | 퍼센트 — percent sign | 부품 | 백분율 표기 | 확장 [MK] · 대조 [ICLU] | `lucide:percent` |
| ICO-484 | 도 기호 — degree sign | 부품 | 온도와 각도 표기 | 확장 [MK] | `lucide:rotate-cw-square` |
| ICO-485 | 단위 기호 — unit symbol | 부품 | 용량·시간 같은 단위 약자 | 확장 [MK] | `lucide:variable` |
| ICO-521 | 합계 — sigma(Σ) | 부품 | 숫자를 모두 더한 값을 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:sigma` |
| ICO-1095 | 나눗셈 — divide | 부품 | 나누기 연산을 나타냄, 가로선 위아래 점 두 개 | 확인 [ICLU] | `lucide:divide` |
| ICO-1096 | 등호 — equal | 부품 | 같음을 나타냄, 나란한 가로선 두 개인 등호 기호 | 확인 [ICLU] | `lucide:equal` |
| ICO-1097 | 파이 — pi | 부품 | 원주율 상수를 나타냄, 그리스 문자 파이 기호 | 확인 [ICLU] | `lucide:pi` |
| ICO-1098 | 제곱근 — square root | 부품 | 제곱근 연산을 나타냄, 루트 기호와 근호선 모양 | 확인 [ICLU] | `lucide:radical` |
| ICO-1099 | 계산기 — calculator | 부품 | 수식 계산 도구를 나타냄, 버튼 배열된 계산기 | 확인 [ICLU] | `lucide:calculator` |
| ICO-1100 | 소괄호 — parentheses | 부품 | 연산 우선순위·묶음을 나타냄, 여닫는 소괄호 기호 | 확인 [ICLU] | `lucide:parentheses` |
| ICO-1101 | 오메가 — omega | 부품 | 저항·마지막 항목을 나타냄, 그리스 문자 오메가 | 확인 [ICLU] | `lucide:omega` |
| ICO-1102 | 각도 — angle | 부품 | 각의 크기·기하 측정을 나타냄, 꼭짓점서 벌어진 두 선 | 확인 [ICLU] | `lucide:angle` |
| ICO-1103 | 좌표축 — axis | 부품 | 좌표축·3차원 방향을 나타냄, 교차하는 화살표 선 | 확인 [ICLU] | `lucide:axis-3d` |
| ICO-1104 | 소수점 — decimal | 부품 | 소수 표기를 나타냄, 정수와 소수 사이에 찍는 점 | 확인 [ICSET] | `tabler:decimal` |
| ICO-1105 | 합계 — sum | 부품 | 총합 연산을 나타냄, 그리스 문자 시그마 기호 | 확인 [ICSET] | `tabler:sum` |
| ICO-1106 | 적분 — integral | 부품 | 적분 연산을 나타냄, 길게 늘어진 인테그랄 기호 | 확인 [ICSET] | `tabler:math-integral` |
| ICO-1107 | 행렬 — matrix | 부품 | 행렬 연산·배열 데이터를 나타냄, 격자로 늘어선 값 | 확인 [ICSET] | `tabler:matrix` |
| ICO-1108 | 비율 — ratio | 부품 | 두 값의 비를 나타냄, 콜론으로 나눈 두 수 표기 | 확인 [ICLU] | `lucide:ratio` |
| ICO-1109 | 델타 — delta | 부품 | 변화량·차이를 나타냄, 그리스 문자 삼각형 델타 | 확인 [ICSET] | `tabler:delta` |

## 예술·공예 — Arts & Crafts

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-1182 | 연극 가면 — theater masks | 부품 | 공연·예술 행사를 나타냄, 웃는·우는 얼굴 가면 | 확인 [ICLU] | `lucide:theater` |
| ICO-1209 | 실패 — spool thread | 부품 | 재봉·바느질 재료를 나타냄, 실이 감긴 실패 모양 | 확인 [ICLU] | `lucide:spool` |

## 기념일·행사 — Holidays & Events

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-439 | 트로피 — trophy | 부품 | 성취·순위 1등 | 확장 [MK] · 대조 [ICLU] | `lucide:trophy` |
| ICO-440 | 메달 — medal | 부품 | 달성 뱃지 | 확장 [MK] · 대조 [ICLU] | `lucide:medal` |
| ICO-1048 | 시상대 — podium | 부품 | 순위별 시상대를 나타냄, 1·2·3위로 높이가 다른 단 | 확인 [ICLU] | `lucide:podium` |
| ICO-160 | 선물 — gift | 부품 | 다른 사람에게 보내는 혜택·상품 | 확장 [MK] · 대조 [ICLU] | `lucide:gift` |
| ICO-437 | 축하 — celebration | 부품 | 목표를 이룬 순간을 알림, 폭죽 | 확장 [MK] · 대조 [ICLU] | `lucide:party-popper` |
| ICO-438 | 왕관 — crown | 부품 | 유료·최상위 등급 | 확장 [MK] · 대조 [ICLU] | `lucide:crown` |
| ICO-1168 | 생일 케이크 — birthday cake | 부품 | 생일 축하 행사를 나타냄, 촛불 여러 개 꽂힌 케이크 | 확인 [ICLU] | `lucide:cake` |
| ICO-1169 | 풍선 — balloon | 부품 | 축하·파티 분위기를 나타냄, 끈 달린 둥근 풍선 | 확인 [ICLU] | `lucide:balloon` |
| ICO-1170 | 색종이 조각 — confetti | 부품 | 축하·성공 연출을 나타냄, 흩날리는 종이 조각 | 확인 [ICSET] | `tabler:confetti` |
| ICO-1171 | 상장 — award | 부품 | 수상·인증 결과를 나타냄, 도장 찍힌 상장 종이 | 확인 [ICLU] | `lucide:award` |
| ICO-1172 | 리본 — ribbon | 부품 | 수상·기념 장식을 나타냄, 매듭 묶인 리본 모양 | 확인 [ICLU] | `lucide:ribbon` |
| ICO-1173 | 입장권 — ticket | 부품 | 행사 참가·예매를 나타냄, 절취선 있는 입장권 | 확인 [ICLU] | `lucide:ticket` |
| ICO-1174 | 크리스마스트리 — christmas tree | 부품 | 크리스마스 연휴를 나타냄, 별과 장식 단 나무 | 확인 [ICSET] | `tabler:christmas-tree` |
| ICO-1175 | 눈사람 — snowman | 부품 | 겨울 시즌·연휴 분위기를 나타냄, 눈덩이 쌓은 눈사람 | 확인 [ICSET] | `tabler:snowman` |
| ICO-1176 | 지팡이 사탕 — candy cane | 부품 | 크리스마스 시즌 장식을 나타냄, 지팡이 모양 줄무늬 사탕 | 확인 [ICLU] | `lucide:candy-cane` |
| ICO-1177 | 호박 — pumpkin | 부품 | 할로윈 시즌을 나타냄, 얼굴 새긴 주황색 호박 | 확인 [ICSET] | `tabler:pumpkin-scary` |
| ICO-1178 | 초 — candle | 부품 | 기념일·추모 행사를 나타냄, 불 붙은 초 한 자루 | 확인 [ICSET] | `tabler:candle` |
| ICO-1179 | 샴페인 — champagne | 부품 | 축하 건배·기념 행사를 나타냄, 거품 이는 샴페인 잔 | 확인 [ICSET] | `tabler:glass-champagne` |

## 종교·문화 — Religion & Culture

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-1184 | 메노라 — menorah | 부품 | 하누카 명절을 나타냄, 가지가 아홉 개인 촛대 모양 | 확인 [ICSET] | `tabler:menorah` |
| ICO-1185 | 다윗의 별 — star of david | 부품 | 유대교 상징을 나타냄, 삼각형 두 개 겹친 육각별 | 확인 [ICSET] | `tabler:jewish-star` |
| ICO-1186 | 초승달과 별 — star and crescent | 부품 | 이슬람 상징을 나타냄, 초승달과 별이 나란한 모양 | 확인 [ICSET] | `tabler:building-mosque` |

## 판타지·신화 — Fantasy & Myth

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-1061 | 검 — sword | 부품 | 전투·공격 아이템을 나타냄, 칼자루와 칼날 한 자루 | 확인 [ICLU] | `lucide:sword` |
| ICO-1065 | 마법 지팡이 — wand | 부품 | 마법 사용·주문 아이템을 나타냄, 별 달린 지팡이 | 확인 [ICLU] | `lucide:wand` |
| ICO-1066 | 물약 — potion | 부품 | 회복·버프 아이템을 나타냄, 병에 담긴 색색 액체 | 확인 [ICSET] | `lucide:flask-conical` |
| ICO-1067 | 드래곤 — dragon | 부품 | 판타지 몬스터·보스 캐릭터를 나타냄, 날개 달린 용 | 확인 [ICSET] | `tabler:dragon` |
| ICO-1068 | 활과 화살 — bow arrow | 부품 | 원거리 공격 무기 아이템을 나타냄, 활과 화살 한 벌 | 확인 [ICLU] | `lucide:bow-arrow` |
| ICO-1119 | 유령 — ghost | 부품 | 장난·할로윈 소재를 나타냄, 팔 벌린 흰 유령 모양 | 확인 [ICLU] | `lucide:ghost` |

## 브랜드·로고 — Brands & Logos

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-619 | 위챗 — wechat | 부품 | 중국에서 널리 쓰는 메신저 앱을 나타냄, 말풍선 로고 | 확인 [ICSET] | `tabler:brand-wechat` |
| ICO-1128 | 깃허브 — github | 부품 | 그 서비스로 로그인·저장소 이동함을 나타냄, 모양·색은 깃허브 규정대로 | 확인 [ICSET] | `tabler:brand-github` |
| ICO-1129 | 깃랩 — gitlab | 부품 | 그 서비스로 로그인·저장소 이동함을 나타냄, 모양·색은 깃랩 규정대로 | 확인 [ICSET] | `tabler:brand-gitlab` |
| ICO-1130 | 구글 — google | 부품 | 그 서비스로 로그인·검색 이동함을 나타냄, 모양·색은 구글 규정대로 | 확인 [ICSET] | `tabler:brand-google` |
| ICO-1131 | 애플 — apple logo | 부품 | 그 서비스로 로그인·기기 연동함을 나타냄, 모양·색은 애플 규정대로 | 확인 [ICLU] | `lucide:apple` |
| ICO-1132 | 안드로이드 — android | 부품 | 안드로이드 운영체제·기기임을 나타냄, 모양·색은 구글 규정대로 | 확인 [ICSET] | `tabler:brand-android` |
| ICO-1133 | 윈도우 — windows | 부품 | 윈도우 운영체제·기기임을 나타냄, 모양·색은 마이크로소프트 규정대로 | 확인 [ICSET] | `tabler:brand-windows` |
| ICO-1134 | 페이스북 — facebook | 부품 | 그 서비스로 로그인·공유함을 나타냄, 모양·색은 메타 규정대로 | 확인 [ICSET] | `tabler:brand-facebook` |
| ICO-1135 | 인스타그램 — instagram | 부품 | 그 서비스로 로그인·공유·이동함을 나타냄, 모양·색은 메타 규정대로 | 확인 [ICSET] | `tabler:brand-instagram` |
| ICO-1136 | 엑스 — x twitter | 부품 | 그 서비스로 로그인·공유·이동함을 나타냄, 모양·색은 엑스 규정대로 | 확인 [ICSET] | `tabler:brand-x` |
| ICO-1137 | 유튜브 — youtube | 부품 | 그 서비스로 영상 시청·공유함을 나타냄, 모양·색은 유튜브 규정대로 | 확인 [ICSET] | `tabler:brand-youtube` |
| ICO-1138 | 링크드인 — linkedin | 부품 | 그 서비스로 로그인·이력 공유함을 나타냄, 모양·색은 링크드인 규정대로 | 확인 [ICSET] | `tabler:brand-linkedin` |
| ICO-1139 | 슬랙 — slack | 부품 | 그 서비스로 로그인·알림 연동함을 나타냄, 모양·색은 슬랙 규정대로 | 확인 [ICSET] | `tabler:brand-slack` |
| ICO-1140 | 디스코드 — discord | 부품 | 그 서비스로 로그인·이동함을 나타냄, 모양·색은 디스코드 규정대로 | 확인 [ICSET] | `tabler:brand-discord` |
| ICO-1141 | 왓츠앱 — whatsapp | 부품 | 그 서비스로 메시지 전송·공유함을 나타냄, 모양·색은 메타 규정대로 | 확인 [ICSET] | `tabler:brand-whatsapp` |
| ICO-1142 | 텔레그램 — telegram | 부품 | 그 서비스로 메시지 전송·공유함을 나타냄, 모양·색은 텔레그램 규정대로 | 확인 [ICSET] | `tabler:brand-telegram` |
| ICO-1143 | 틱톡 — tiktok | 부품 | 그 서비스로 영상 시청·공유함을 나타냄, 모양·색은 틱톡 규정대로 | 확인 [ICSET] | `tabler:brand-tiktok` |
| ICO-1144 | 피그마 — figma | 부품 | 그 서비스로 디자인 파일 연동함을 나타냄, 모양·색은 피그마 규정대로 | 확인 [ICSET] | `tabler:brand-figma` |
| ICO-1145 | 드리블 — dribbble | 부품 | 그 서비스로 포트폴리오 공유함을 나타냄, 모양·색은 드리블 규정대로 | 확인 [ICSET] | `tabler:brand-dribbble` |
| ICO-1146 | 비핸스 — behance | 부품 | 그 서비스로 포트폴리오 공유함을 나타냄, 모양·색은 어도비 규정대로 | 확인 [ICSET] | `tabler:brand-behance` |
| ICO-1147 | 스포티파이 — spotify | 부품 | 그 서비스로 음악 재생·공유함을 나타냄, 모양·색은 스포티파이 규정대로 | 확인 [ICSET] | `tabler:brand-spotify` |
| ICO-1148 | 아마존 — amazon | 부품 | 그 서비스로 로그인·구매 이동함을 나타냄, 모양·색은 아마존 규정대로 | 확인 [ICSET] | `tabler:brand-amazon` |
| ICO-1149 | 페이팔 — paypal | 부품 | 그 서비스로 결제함을 나타냄, 모양·색은 페이팔 규정대로 | 확인 [ICSET] | `tabler:brand-paypal` |
| ICO-1150 | 스트라이프 — stripe | 부품 | 그 서비스로 결제 연동함을 나타냄, 모양·색은 스트라이프 규정대로 | 확인 [ICSET] | `tabler:brand-stripe` |
| ICO-1151 | 레딧 — reddit | 부품 | 그 서비스로 로그인·이동함을 나타냄, 모양·색은 레딧 규정대로 | 확인 [ICSET] | `tabler:brand-reddit` |
| ICO-1152 | 핀터레스트 — pinterest | 부품 | 그 서비스로 이미지 저장·공유함을 나타냄, 모양·색은 핀터레스트 규정대로 | 확인 [ICSET] | `tabler:brand-pinterest` |
| ICO-1153 | 트위치 — twitch | 부품 | 그 서비스로 방송 시청·공유함을 나타냄, 모양·색은 트위치 규정대로 | 확인 [ICSET] | `tabler:brand-twitch` |
| ICO-1154 | 드롭박스 — dropbox | 부품 | 그 서비스로 파일 저장·동기화함을 나타냄, 모양·색은 드롭박스 규정대로 | 확인 [ICSET] | `tabler:brand-dropbox` |
| ICO-1155 | 크롬 — chrome | 부품 | 크롬 브라우저로 열림을 나타냄, 모양·색은 구글 규정대로 | 확인 [ICSET] | `tabler:brand-chrome` |
| ICO-1156 | 파이어폭스 — firefox | 부품 | 파이어폭스 브라우저로 열림을 나타냄, 모양·색은 모질라 규정대로 | 확인 [ICSET] | `tabler:brand-firefox` |
| ICO-1157 | 사파리 — safari | 부품 | 사파리 브라우저로 열림을 나타냄, 모양·색은 애플 규정대로 | 확인 [ICSET] | `tabler:brand-safari` |
| ICO-1158 | npm — npm | 부품 | npm 패키지 저장소·명령을 나타냄, 모양·색은 npm 규정대로 | 확인 [ICSET] | `tabler:brand-npm` |
| ICO-1159 | 도커 — docker | 부품 | 컨테이너 실행 환경을 나타냄, 모양·색은 도커 규정대로 | 확인 [ICSET] | `tabler:brand-docker` |
| ICO-1160 | 파이썬 — python | 부품 | 파이썬 언어·실행 환경을 나타냄, 모양·색은 파이썬 재단 규정대로 | 확인 [ICSET] | `tabler:brand-python` |
| ICO-1161 | 리액트 — react | 부품 | 리액트 프레임워크·기술 스택을 나타냄, 모양·색은 메타 규정대로 | 확인 [ICSET] | `tabler:brand-react` |
| ICO-1162 | 뷰 — vue | 부품 | 뷰 프레임워크·기술 스택을 나타냄, 모양·색은 뷰 규정대로 | 확인 [ICSET] | `tabler:brand-vue` |
| ICO-1163 | 앵귤러 — angular | 부품 | 앵귤러 프레임워크·기술 스택을 나타냄, 모양·색은 구글 규정대로 | 확인 [ICSET] | `tabler:brand-angular` |
| ICO-1164 | 노드제이에스 — node js | 부품 | 노드제이에스 실행 환경을 나타냄, 모양·색은 오픈제이에스 규정대로 | 확인 [ICSET] | `tabler:brand-nodejs` |
| ICO-1165 | 노션 — notion | 부품 | 그 서비스로 로그인·문서 이동함을 나타냄, 모양·색은 노션 규정대로 | 확인 [ICSET] | `tabler:brand-notion` |
| ICO-1166 | 오픈에이아이 — openai | 부품 | 그 서비스로 로그인·API 연동함을 나타냄, 모양·색은 오픈에이아이 규정대로 | 확인 [ICSET] | `tabler:brand-openai` |
| ICO-1167 | 카카오톡 — kakao talk | 부품 | 그 서비스로 메시지 전송·로그인함을 나타냄, 모양·색은 카카오 규정대로 | 확인 [ICSET] | `tabler:brand-kakao-talk` |

## 보안·권한 — Security & Privacy

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-367 | 보안 경고 — shield alert | 부품 | 보호 상태에 문제가 생김 | 확장 [MK] · 대조 [ICLU] | `lucide:shield-alert` |
| ICO-623 | 잠긴 계정 — user lock | 부품 | 본인 확인 전까지 열리지 않는 잠긴 계정을 나타냄 | 확인 [ICLU] | `lucide:user-lock` |
| ICO-640 | 출입 배지 — id badge | 부품 | 신원이 표시된 출입증을 목에 걸거나 착용함을 나타냄 | 확인 [ICLU] | `lucide:badge` |
| ICO-55 | 잠금 — lock | 부품 | 편집·접근을 막음, 닫힌 자물쇠 | 확장 [MK] · 대조 [ICLU] | `lucide:lock` |
| ICO-56 | 잠금 해제 — unlock | 부품 | 막아 둔 것을 풂, 열린 자물쇠 | 확장 [MK] · 대조 [ICLU] | `lucide:lock-open` |
| ICO-365 | 열쇠 — key | 부품 | 접근 권한을 여는 값 | 확장 [MK] · 대조 [ICLU] | `lucide:key` |
| ICO-366 | 방패 — shield | 부품 | 보호받고 있음을 나타냄 | 확장 [MK] · 대조 [ICLU] | `lucide:shield` |
| ICO-368 | 지문 — fingerprint | 부품 | 손가락으로 본인을 확인함 | 확장 [MK] · 대조 [ICLU] | `lucide:fingerprint-pattern` |
| ICO-369 | 얼굴 인식 — face recognition | 부품 | 얼굴로 본인을 확인함 | 확장 [MK] · 대조 [ICLU] | `lucide:scan-face` |
| ICO-370 | 비밀번호 가리기 — hide password | 부품 | 입력한 글자를 점으로 덮음 | 확장 [MK] · 대조 [ICLU] | `lucide:eye-off` |
| ICO-371 | 인증 코드 — one-time code | 부품 | 한 번만 쓰는 숫자 확인값 | 확장 [MK] | `tabler:auth-2fa` |
| ICO-372 | 이중 인증 — two-factor | 부품 | 비밀번호에 확인 절차를 하나 더 붙임 | 확장 [MK] · 대조 [ICLU] | `lucide:shield-lock` |
| ICO-373 | 인증서 — certificate | 부품 | 신뢰를 증명하는 문서, 도장이 찍힌 종이 | 확장 [MK] | `tabler:certificate` |
| ICO-374 | 암호화 — encryption | 부품 | 내용을 남이 못 읽게 바꿈 | 확장 [MK] · 대조 [ICLU] | `lucide:lock` |
| ICO-376 | 신고 — report abuse | 부품 | 문제 있는 내용을 운영자에게 알림, 깃발 | 확장 [MK] · 대조 [ICLU] | `lucide:flag` |
| ICO-377 | 스팸 — spam | 부품 | 원치 않는 광고성 내용 | 확장 [MK] | `lucide:mail-warning` |
| ICO-378 | 개인정보 — privacy | 부품 | 남에게 보이면 안 되는 내 정보 | 확장 [MK] · 대조 [ICLU] | `lucide:user-shield` |
| ICO-379 | 쿠키 — cookie consent | 부품 | 방문 기록 저장 동의 | 확장 [MK] · 대조 [ICLU] | `lucide:cookie` |
| ICO-380 | 권한 — permissions | 부품 | 누가 무엇까지 할 수 있는지 | 확장 [MK] · 대조 [ICLU] | `lucide:user-key` |
| ICO-381 | 역할 — role | 부품 | 관리자·구성원 같은 자격 구분 | 확장 [MK] · 대조 [ICLU] | `lucide:user-round-cog` |
| ICO-382 | 접속 기기 — active sessions | 부품 | 지금 로그인되어 있는 기기 목록 | 확장 [MK] · 대조 [ICLU] | `lucide:monitor-check` |
| ICO-644 | 비밀번호 — password | 부품 | 계정 보호용 문자열 입력을 나타냄, 점으로 가려진 칸 | 확인 [ICSET] | `tabler:password` |
| ICO-645 | 보안 확인됨 — shield check | 부품 | 보호 상태가 정상임을 나타냄, 방패 위 체크 표시 | 확인 [ICLU] | `lucide:shield-check` |
| ICO-646 | 보호 꺼짐 — shield off | 부품 | 보안 기능이 꺼져 있음을 나타냄, 방패 위 사선 | 확인 [ICLU] | `lucide:shield-off` |
| ICO-647 | 잠금 파일 — file lock | 부품 | 다른 사람이 열어 볼 수 없게 막은 파일을 나타냄 | 확인 [ICLU] | `lucide:file-lock` |
| ICO-648 | 클라우드 보안 — cloud lock | 부품 | 온라인 저장소 자료가 암호로 보호되고 있음을 나타냄 | 확인 [ICSET] | `tabler:cloud-lock` |
| ICO-649 | CCTV — cctv | 부품 | 감시 카메라로 촬영하고 있는 중임을 나타냄, CCTV 모양 | 확인 [ICLU] | `lucide:cctv` |
| ICO-650 | 보안 위협 차단 — bug off | 부품 | 악성 코드·침입 시도를 막았음을 나타냄, 벌레 위 사선 | 확인 [ICLU] | `lucide:bug-off` |
| ICO-655 | 닫힌 문 — door closed | 부품 | 출입이 막혀 있는 상태를 나타냄, 닫힌 문 모양 | 확인 [ICLU] | `lucide:door-closed` |
| ICO-657 | 사용자 보호 — user shield | 부품 | 특정 사용자의 계정·개인정보를 보호함을 나타냄 | 확인 [ICLU] | `lucide:user-shield` |
| ICO-658 | 보호 추가 — shield plus | 부품 | 보호·보험 등 보장 항목을 추가함을 나타냄, 방패 위 플러스 | 확인 [ICLU] | `lucide:shield-plus` |
| ICO-659 | 잠금 확인 — lock check | 부품 | 잠금 설정이 올바르게 적용됐는지 확인함을 나타냄 | 확인 [ICLU] | `lucide:lock-keyhole-open` |
| ICO-660 | 홍채 인식 — eye scan | 부품 | 눈을 스캔해서 본인임을 확인함을 나타냄, 홍채 인식 | 확인 [ICLU] | `lucide:scan-eye` |
| ICO-661 | 익명 모드 — spy | 부품 | 신원을 감추고 몰래 살펴봄을 나타냄, 트렌치코트와 모자 | 확인 [ICSET] | `tabler:spy` |

## 안전·치안·군사 — Safety, Police & Military

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-652 | 소화기 — fire extinguisher | 부품 | 화재 예방과 비상 대응용 장비를 나타냄, 소화기 모양 | 확인 [ICLU] | `lucide:fire-extinguisher` |
| ICO-656 | 화재 경보 — alarm | 부품 | 화재·비상 상황을 알리는 경보 장치를 나타냄, 연기 감지 경보 | 확인 [ICLU] | `lucide:alarm-smoke` |
| ICO-1090 | 방사능 — radiation | 부품 | 방사선 위험·경고를 나타냄, 세 갈래 삼분할 표지 | 확인 [ICLU] | `lucide:radiation` |
| ICO-1091 | 생물학적 위험 — biohazard | 부품 | 감염·생물 위험 물질 경고를 나타냄, 삼중 원 표지 | 확인 [ICLU] | `lucide:biohazard` |

## 법·정치·사회 — Law, Politics & Society

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-653 | 법봉 — gavel | 부품 | 약관이나 법적 판단, 정책과 관련된 항목을 나타냄 | 확인 [ICLU] | `lucide:gavel` |
| ICO-654 | 공정성 저울 — scale balance | 부품 | 규정 위반 여부 등 공정한 판단 기준을 나타냄 | 확인 [ICLU] | `lucide:scale` |

## 아이콘 규칙 — Icon Guidelines

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 | 그림 |
|---|---|---|---|---|---|
| ICO-497 | 아이콘 격자와 시각 보정 — icon grid | 기준 | 같은 상자 안에서 원·삼각형은 살짝 키워 크기가 같아 보이게 하는 규칙 | 확장 [MK] | — |
| ICO-498 | 선 굵기와 끝 모양 통일 — stroke weight | 기준 | 모든 아이콘의 선 두께·모서리 둥글기·끝 처리를 한 값으로 맞추는 규칙 | 확장 [MK] | — |
| ICO-499 | 채움형과 선형 구분 — filled and outline | 기준 | 선형은 평소, 채움형은 선택·활성으로 뜻을 갈라 쓰는 규칙 | 확장 [MK] | — |
| ICO-500 | 아이콘 이름은 뜻으로 — semantic naming | 기준 | 모양이 아니라 쓰임으로 이름 붙여 그림을 바꿔도 코드가 안 바뀌게 하는 규칙 | 확장 [MK] | — |
| ICO-501 | 한 화면 한 세트 — single icon family | 기준 | 여러 아이콘 묶음을 섞어 쓰지 않고 예외가 필요하면 다시 그리는 규칙 | 확장 [MK] | — |
| ICO-502 | 좌우 반전 대상 — icon mirroring | 기준 | 오른쪽에서 왼쪽으로 읽는 언어에서 뒤집을 아이콘과 그대로 둘 아이콘을 가르는 규칙 | 확장 [MK] | — |
| ICO-503 | 상태 짝 아이콘 — state pair | 기준 | 지금 상태를 보일지 누르면 될 상태를 보일지 한쪽으로 정해 짝끼리 맞추는 규칙 | 확장 [MK] | — |
| ICO-504 | 아이콘 위 표식 — overlay badge | 기준 | 점·숫자·작은 표식을 아이콘에 얹을 때의 자리와 최대 개수 | 확장 [MK] | — |
| ICO-505 | 보조 기호 붙이기 — modifier mark | 기준 | 기본 아이콘에 플러스·자물쇠 같은 작은 기호를 붙여 파생 뜻을 만드는 규칙 | 확장 [MK] | — |
| ICO-506 | 아이콘 움직임 허용 범위 — icon motion | 기준 | 진행 중임을 알릴 때만 움직이고 장식으로는 움직이지 않는 규칙 | 확장 [MK] | — |
| ICO-507 | 남의 상표 아이콘 사용 — brand mark usage | 기준 | 다른 회사 로고는 색·모양을 바꾸지 않고 제공처 규정대로 쓰는 규칙 | 확장 [MK] | — |
| ICO-508 | 아이콘과 글자 기호 선택 — icon or character | 기준 | 화살표·체크를 그림으로 그릴지 글자로 쓸지 가르는 규칙 | 확장 [MK] | — |
| ICO-1238 | 아이콘 대체 텍스트 — icon text alternative | 기준 | 아이콘만 있는 버튼은 같은 뜻의 대체 글을 달아 화면 읽기 프로그램이 읽게 하는 규칙 | 확인 [WCAG22] | — |
| ICO-1239 | 아이콘 명암 대비 — icon contrast | 기준 | 아이콘과 배경의 명암 대비를 3:1 이상으로 두어 저시력 사용자도 구분하게 하는 규칙 | 확인 [WCAG22] | — |
| ICO-1240 | 아이콘 누르는 영역 — touch target size | 기준 | 아이콘 버튼의 누르는 영역을 최소 24×24 CSS 픽셀로 두어 오터치를 줄이는 규칙 | 확인 [WCAG22] | — |
| ICO-1241 | 아이콘 광학 크기 — optical size | 기준 | 화면 크기에 맞춰 획 두께를 20~48dp 범위로 조정해 작은 크기에서도 또렷하게 보이는 규칙 | 확인 [ICMS] | — |
| ICO-1242 | 검은 채움 스타일 — Black fill | 기준 | 도형 전체를 검정 한 색으로 꽉 채운 모양임, 실루엣만으로 뜻이 통해야 할 때 고름 | 확인 [ICFL] | — |
| ICO-1243 | 검은 선 스타일 — Black outline | 기준 | 색 없이 검은 윤곽선만으로 그린 모양임, 단색 인쇄나 굵은 선이 필요할 때 고름 | 확인 [ICFL] | — |
| ICO-1244 | 색 채움 플랫 스타일 — Flat (Color fill) | 기준 | 윤곽선 없이 면을 여러 색으로 채운 평면 모양임, 산뜻하고 단순한 화면 인상이 필요할 때 고름 | 확인 [ICFL] | — |
| ICO-1245 | 색 선 스타일 — Lineal color | 기준 | 면은 색으로 채우고 테두리·장식은 검은 선으로 그린 모양임, 선명한 윤곽과 색을 함께 쓰고 싶을 때 고름 | 확인 [ICFL] | — |
| ICO-1246 | 그러데이션 스타일 — Gradient | 기준 | 한 색에서 다른 색으로 서서히 번지는 색을 쓴 모양임, 화려하고 입체적인 인상이 필요할 때 고름 | 확인 [ICFL] | — |
| ICO-1247 | 손그림 스타일 — Hand-drawn | 기준 | 손으로 그린 듯 느슨한 도형과 고르지 않은 선을 쓴 모양임, 친근하고 캐주얼한 톤이 필요할 때 고름 | 확인 [ICFL] | — |
