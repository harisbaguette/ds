# 패토브 시각 자산

- icons/objects/: 내용 해시로 관리하는 무손실 일러스트 원본.
- icons/styles.json: 설치된 스타일 목록.
- icons/illustrated/manifest.json: ID·원본·분리 좌표·공유 관계.
- icons/ui/: 현재 앱의 메뉴와 버튼용 WebP.
- mark.svg: 패토브 브랜드 로고.
- fonts/: Pretendard·Outfit과 동봉 라이선스.
- illustrations/: 개별 시안과 스타일 참고 자산. 출처는 [자산 장부](../ASSETS.md)에 있습니다.

일러스트 검색·팩·AI 도구·저장 구조는 [일러스트 사용과 관리](../문서/일러스트%20사용과%20관리.md)를 따릅니다.

원본이나 UI 매핑을 바꾼 뒤 npm run build를 실행합니다. PNG·WebP 다운로드는 원본에서 필요할 때 생성하며, 배포 이미지 캐시는 Git에 저장하지 않습니다.
