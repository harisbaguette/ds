# 작은 정원 일러스트 제작

2026-09-26. 내장 `image_gen` 도구로 새로 생성했다. CLI/API 우회는 사용하지 않았다.

최종 자산: `assets/illustrations/garden-planter.png` — 1536×1024 PNG. 생성 결과를 프로젝트로 복사해 스타일 표지와 빈 상태 예시에 연결했다. 고양이와 바다 이미지는 기존 자산을 재사용한다.

영감보관함의 두 화분 돌봄 홈화면을 눈으로 확인했다. 식물을 중심에 두는 UI 방향을 참고했고 생성 요청에는 원본 이미지를 입력하지 않았다. 크림색 화면 위에서 배경 경계·잘림 없이 표시되는지 브라우저 캡처로 확인했다.

## 실제 생성 프롬프트

```text
Use case: illustration-story. Asset type: an original reusable illustration for a gentle plant-care UI style called 작은 정원. Primary request: one lush little indoor planter garden, low wide terracotta rectangular pot with rounded corners, a small fern, broad dark green leaves, bright young green leaves, three tiny cream daisies and a single peach flower, lovingly hand-painted flat gouache illustration, quiet Japanese botanical stationery sensibility, no outlines, deliberately simple large organic shapes, very subtle paper texture. Viewpoint: front three-quarter, complete planter visible, landscape subject centered with generous transparent breathing room all around, no cropping. Palette: forest green #325746, sage #8fba8e, pale lime #cedda4, warm terracotta #c58c6c, cream #f7f5eb. Soft diffuse lighting, no shiny 3D render, no glossy surfaces. Transparent background outside the complete subject; preserve actual alpha. No text, letters, logos, watermarks, frames, UI, extra objects, or people. This is an original illustration, not a reproduction of any existing artwork.
```
