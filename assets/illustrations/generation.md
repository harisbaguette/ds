# 선화 고양이 제작 기록

2026-09-24. `imagegen`으로 생성하고 편집했다. 자산을 Python으로 그리거나 수정하지 않았다.

채택 자산: `cat-resting-alpha.png` — 1536×1024, RGBA, 투명 배경.
앱에서는 작은 빈 상태, 집중 화면, 입력 화면, 저장 빈 화면에 사용한다.

## 선택 과정

1. 책 위에서 쉬는 고양이 선화: 첫 결과는 묘사가 많고 사실적인 비중이 높아 반려했다.
2. 사용자가 보관한 잠자는 고양이 선화 이미지를 직접 확인한 뒤, 적은 선·둥근 실루엣·작은 표정을 기준으로 새로 생성했다.
   `cat-resting-v2.png`는 이 단계의 기록이다.
3. 고양이·책의 모양과 내부 흰색을 유지하면서 바깥 배경을 투명하게 편집했다.
   최종 렌더에서 직사각형 배경이 보이지 않고 선의 인상이 유지되는 것을 확인했다.

## 재생성용 프롬프트

아래는 이번 지시를 재현할 수 있도록 정리한 프롬프트다. 호출 원문의 복사본은 아니다.

> A very simple original black monoline doodle of a round sleeping cat curled up on a thin notebook.
> Minimal Japanese stationery illustration: relaxed silhouette, tiny closed eyes, one black ear,
> approximately eighteen clean curves, no fur texture, no hatching, no realistic anatomy rendering,
> no shading, no lettering. Keep the cat and notebook filled white inside the outlines.
> Center the complete subject with comfortable breathing room. Transparent background outside the subject.
> Preserve crisp expressive lines that stay legible at a small UI illustration size.

배경 편집 지시: 채택한 고양이와 책의 선·비례·내부 흰색은 그대로 두고, 대상 바깥 배경만 투명하게 한다.
참고 이미지는 선의 절제와 분위기를 판단하는 자료로 사용했고, 그 원본 파일은 앱에 포함하지 않았다.
