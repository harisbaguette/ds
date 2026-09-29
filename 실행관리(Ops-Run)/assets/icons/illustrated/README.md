# 일러스트 아이콘

완성된 그림은 아이콘 탭 맨 위에 표시된다. 카드를 누르면 큰 그림과 PNG·WebP 다운로드가 열린다. 기존 사전 ID에 연결했으므로 이름·ID 검색과 왼쪽 분류도 그대로 쓴다.

개별 파일과 화면의 그림 영역은 모두 **1:1 정사각형**이다. 바닥·접촉·드롭 그림자 없이 투명 배경에 그림만 남긴다.

## 파일과 다시 빌드하기

- `source/core-01.png`: 이미지 생성 도구로 만든 1254 × 1254 정사각형 원본. 그림이 있는 4열 × 3행 영역을 `crop`으로 지정하고, 빈 두 칸과 아래쪽 여백은 내보내지 않는다.
- `source/work-01.png`: 편집·저장·복사·다운로드·업로드·체크·공유·잠금·잠금 해제, 3 × 3.
- `source/communication-01.png`: 사람·여러 사람·메일·채팅·전화·영상 통화·마이크·헤드폰·음악, 3 × 3.
- `source/commerce-01.png`: 장바구니·쇼핑백·지갑·신용카드·선물·배송·쿠폰·시계·위치, 3 × 3.
- `manifest.json`: 원본 시트, 칸 순서, 사전 ID, 파일 이름을 연결하는 목록.
- `*.png`: 512 × 512 다운로드용 파일. 실제 디테일 해상도는 원본의 각 칸 해상도에 따른다.
- `*.webp`: 512 × 512 상세 보기용.
- `*-192.webp`: 192 × 192 목록용.

프로젝트 폴더에서 실행한다. Node.js와 `npm ci`로 설치한 의존성이 필요하다.

```sh
npm run build:icons
npm run build:library
```

첫 명령은 원본을 칸별로 자르고 크기·압축 형식을 변환한다. 그림 생성 API를 호출하지 않는다. 원본·분리 설정·변환 코드·이미지 라이브러리 버전이 그대로인 묶음은 기존 파일을 재사용한다. 파일이 없어지면 다시 만든다. 캐시는 `test-results/illustrated-icons/build-cache.json`에 있으며 지워도 다시 빌드할 수 있다. 둘째 명령은 완성 파일을 사전에 연결하며, 파일 누락이나 사전 ID 중복은 오류로 알려준다.

생성된 그림이 칸 경계에 걸치면 개별 항목의 `offset: { "x": 16, "y": 0 }`처럼 분리 위치를 이동한다. 그림을 늘이거나 잘린 채로 배포하지 않는다. 이 값은 원본 픽셀 기준이며 파일 밖으로 나가는 값은 빌드가 거부한다.

이웃 그림이 따라 들어오는 칸은 원래 목록에서 `null`로 두고 같은 원본을 가리키는 1 × 1 묶음에 정사각형 `crop`을 지정한다. 채팅과 신용카드가 이 방식이다. `npm run test:icons`는 모든 PNG의 가장자리에서 잘린 그림·이웃 그림이 감지되는지도 확인한다.

## 많이 만들 때의 제작 방법

1. **같은 뜻은 먼저 합친다.** 참고용 Lucide·Tabler 등 여러 세트의 비슷한 그림을 각각 다시 그리지 않는다. 화면에서 실제로 쓰는 의미를 기준으로 제작 목록을 정한다. 홈·검색처럼 자주 쓰는 것부터 만든다.
2. **이번 세트를 스타일 기준으로 고정한다.** 새 세트를 생성할 때 `source/core-01.png`를 참고 이미지로 제공한다. 재질·시점·빛·민트와 먹색 비율을 유지하고 대상 목록만 바꾼다. 이미지 생성은 세트 간 일관성이 흔들릴 수 있으므로 참고 이미지를 넣어도 검수는 필요하다. [OpenAI 이미지 생성 문서](https://developers.openai.com/api/docs/guides/image-generation)
3. **정사각형 시트 하나에 9개씩 만든다.** 관련 대상을 3 × 3으로 배치하면 빈 칸 없이 정사각형 아이콘을 분리할 수 있다. 9개를 한 요청으로 생성한다. 비용 절감 비율은 측정하지 않았다.
4. **원본 시트와 목록만 추가한다.** `manifest.json`의 `batches`에 원본 경로·행·열·사전 ID를 넣고 위 두 명령을 실행한다. 정사각형 시트와 정사각형 칸을 사용하며 빈 칸은 `null`로 적는다. 개별 카드나 검색 코드를 새로 작성할 필요가 없다.
5. **틀린 그림만 고친다.** 잘못된 실루엣·재질·배경은 이미지 생성 도구로 해당 칸을 수정한다. 대량 재생성으로 이미 맞춘 그림까지 바꾸지 않는다. 폴더의 추가·잠금 같은 파생형은 기본 그림과 공통 배지의 조합을 검토한다.
6. **실제 크기로 확인한다.** 목록 64~128px과 상세 화면에서 의미, 여백, 잘림, 다른 칸의 잔상이 없는지 본다. 색만으로 뜻을 구분하지 않는다. 16~24px 버튼 안에 쓸 그림은 디테일을 줄인 별도 소형 버전이 필요하다.

전송은 개별 WebP와 지연 로딩을 사용한다. 원본 시트와 PNG는 목록에서 불러오지 않는다. WebP는 투명도를 지원하며 파일 크기를 줄이는 데 적합하다. [Google WebP 설명](https://developers.google.com/speed/webp)

## 전체 사전 제작 목록

`production.json`은 제작 대상과 묶음별 상태를 보관한다. `node scripts/plan-illustrated-icons.mjs`로 만들며, 기존 목록이 있으면 덮어쓰지 않는다. 사전의 그림 대상 1,231개에 고유 그림 1,072개를 연결했다. 원본 기호가 완전히 같은 159개 항목은 파일을 공유한다. 기존 그림 37개에 더해 1,035개를 9개씩 115개 시트로 제작했다. 참고 세트의 원본 기호 9,677개와 가이드 항목 22개는 이 제작 목록에 포함하지 않는다.

검수한 원본을 `source/catalog-001.png`처럼 저장한 다음 아래 명령으로 등록한다.

```sh
node scripts/import-illustrated-sheet.mjs catalog-001
npm run build:icons
npm run build:library
npm run test:icons
```

전체 사전의 그림 누락과 미등록 시트까지 검사하려면 `npm run test:icons -- --complete`를 실행한다.

등록 도구는 투명도 경계로 각 그림을 찾고, 누락·겹침을 검사해 분리 좌표를 기록한다. 의미와 스타일은 원본 시트를 보고 확인해야 한다. 새 그림은 512 × 512 캔버스 안쪽 384 × 384 영역에 비율을 유지하여 넣는다. 개별 그림의 `crop`으로 분리 범위를 조정할 수 있다. 같은 원본 기호를 쓰는 사전 항목은 `aliases`로 완성 파일을 공유하며, 빌드 시 원본 기호 일치 여부를 검증한다.

## 다음 세트용 프롬프트

아래 스타일 지시와 참고 이미지를 함께 사용하고, 대상과 배치 목록을 바꾼다.

> Create a SQUARE 1:1 sprite sheet with three columns and three rows of equal SQUARE cells, no outer margins. Centers at x=16.67%,50%,83.33% and y=16.67%,50%,83.33%. Match only the reference MATERIAL AND COLORS, not its layout: ivory and pale cool gray, charcoal slate #303b47 details, restrained pale sage mint #cfe7dd accents, softly rounded matte illustrated forms. Front facing, even diffuse lighting, subtle modeling only inside each object. ABSOLUTELY NO ground shadows, contact shadows, cast shadows, drop shadows, halos, floors or pedestals. Every pixel outside object silhouettes must be fully transparent. No text, numbers, borders, tiles or grid lines. Each icon occupies the middle 65% of its square cell with equal visual weight. Row 1: [three subjects]. Row 2: [three subjects]. Row 3: [three subjects].
