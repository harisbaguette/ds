# 일러스트 아이콘

검색, PNG·WebP 다운로드, 기본 UI·분류별·사용자 선택 팩을 지원합니다. 전체 항목은 안정된 ID를 사용하고, 같은 그림을 공유하는 ID는 aliases로 연결합니다. 아이콘 사용 기준은 그림 제작 대상과 별도로 관리합니다.

사용·AI 도구·파일 구조·스타일 추가·새 시트 등록은 [일러스트 사용과 관리](../../../문서/일러스트%20사용과%20관리.md)를 따릅니다.

현재 스타일의 manifest는 원본 시트의 내용 해시와 그림별 분리 좌표를 기록합니다. 원본은 ../objects/에 무손실 WebP로 저장됩니다. 512px PNG·WebP와 작은 썸네일은 요청할 때 생성합니다.

그림은 투명 배경과 정사각형 캔버스를 사용합니다. 바닥·접촉·드롭 그림자 없이 대상만 남깁니다. 잘린 그림, 이웃 그림 잔상, 잘못된 의미·브랜드 형태는 원본에서 수정하고 검수합니다.

## 제작 프롬프트

스타일을 대표하는 기존 원본을 참고 이미지로 첨부하고 대상 목록만 바꿉니다.

> Create a SQUARE 1:1 sprite sheet with three columns and three rows of equal SQUARE cells, no outer margins. Centers at x=16.67%,50%,83.33% and y=16.67%,50%,83.33%. Match only the reference MATERIAL AND COLORS, not its layout: ivory and pale cool gray, charcoal slate #303b47 details, restrained pale sage mint #cfe7dd accents, softly rounded matte illustrated forms. Front facing, even diffuse lighting, subtle modeling only inside each object. ABSOLUTELY NO ground shadows, contact shadows, cast shadows, drop shadows, halos, floors or pedestals. Every pixel outside object silhouettes must be fully transparent. No text, numbers, borders, tiles or grid lines. Each icon occupies the middle 65% of its square cell with equal visual weight. Row 1: [three subjects]. Row 2: [three subjects]. Row 3: [three subjects].
