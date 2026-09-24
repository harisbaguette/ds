# 패토브 시각 자산

- `mark.svg`: 기존 패토브 로고 정본. 형태·색 유지.
- `icons/*.svg`: 기존 `시안/2026-09-23/패토브-재설계/app.js`의 SVG 경로 분리.
- `illustrations/cat.svg`, `seascape.svg`: 기존 `style-lab.js`의 선화·풍경 SVG 분리.
- 풍경의 해 위치는 제목과 겹치지 않게 조정했다. `seascape-banner.svg`는 같은 팔레트·배를 가로 폼 머리말에 맞게 재구성했다.
- `icons/check.svg`는 성공 표시의 원과 중복되지 않도록 바깥 원을 제거했다.
- `illustrations/empty-box.svg`: 빈 상태를 설명하는 상자 도형.
- `illustrations/cat-resting-alpha.png`: `imagegen`으로 제작한 최종 선화. [생성 기록·재생성 지시](illustrations/generation.md).
- `fonts/PretendardVariable.woff2`: 기존 로컬 자산 재사용. 동봉한 SIL OFL 라이선스 적용.
- `fonts/Outfit-Variable.woff2`: Google Fonts의 [Outfit 원본](https://github.com/google/fonts/tree/main/ofl/outfit)을
  WOFF2 컨테이너로 변환. 글리프 변경 없음. 동봉한 SIL OFL 라이선스 적용.

폰트와 SVG를 로컬에 포함하므로 외부 CDN 연결과 OS에 설치된 폰트에 의존하지 않는다.

전체 출처는 [ASSETS.md](../ASSETS.md)에 기록한다. 아이콘 변경 후 `python scripts/build-icons.py`를 실행하면
`src/ui/icons.js`가 갱신된다. 파일 실행에서도 스타일의 색상을 정확히 따르도록 인라인 SVG로 묶는다.
