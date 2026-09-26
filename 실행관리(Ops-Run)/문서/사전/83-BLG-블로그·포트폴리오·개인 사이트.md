# 83. 블로그·포트폴리오·개인 사이트

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 83번 분류 ID다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

개인이나 작은 팀이 자기 글과 작품을 올리는 블로그·포트폴리오·개인 사이트의 화면 관례를 모은다. 워드프레스·Ghost·Substack·Medium·GitHub Pages와 브런치·velog·티스토리·네이버 블로그의 설정과 화면 조각, 개발 블로그와 디지털 정원, 포트폴리오·에이전시·크리에이터 사이트의 구성을 PC·모바일·인쇄 기준으로 다룬다. 글 머리·목차·각주·댓글·공유·작품 격자처럼 편집기(EDT·RTE)·회사 소개 사이트(WEB)·소셜(SOC)·콘텐츠 뷰어(CNT)에 이미 있는 항목은 여기서 다시 적지 않는다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| BLG-01 | 블로그 첫 화면 방식 — Homepage Displays | 기준 | 첫 화면을 최신 글 목록이나 고정 쪽으로 정함 | 확인 [RBWPREAD] |
| BLG-02 | 글 목록 전용 쪽 — Posts Page | 기준 | 첫 화면은 소개로 두고 글 목록을 따로 모음 | 확인 [RBWPREAD] |
| BLG-03 | 한 쪽당 글 수 — Posts per Page | 기준 | 글 목록 한 쪽에 몇 편을 보일지 정함 | 확인 [RBWPREAD] |
| BLG-04 | 더보기 자르기 — Read More Break | 부품 | 목록에는 글 앞부분만 두고 나머지는 링크로 넘김 | 확인 [RBWPMORE] |
| BLG-05 | 발췌 끝 표시 — Excerpt Separator | 기준 | 목록에 보일 요약이 끝나는 자리를 표시로 정함 | 확인 [RBJEKPST] |
| BLG-06 | 글 형식 — Post Formats | 기준 | 짧은 글·인용·링크·사진 글마다 목록 모양을 달리함 | 확인 [RBWPFMT] |
| BLG-07 | 층 있는 분류와 평면 태그 구분 — Categories vs Tags | 기준 | 큰 갈래는 층으로, 작은 주제는 꼬리표로 나눔 | 확장 [MK] · 대조 [RBJEKPST] |
| BLG-08 | 대표 태그 — Primary Tag | 기준 | 첫 번째 태그를 글의 대표 분류로 씀 | 확인 [RBGSTTAG] |
| BLG-09 | 내부 태그 — Internal Tag | 부품 | 방문자에게 안 보이는 정리용 꼬리표를 붙임 | 확인 [RBGSTTAG] |
| BLG-10 | 글 달력 — Calendar Widget | 부품 | 달력에서 날짜를 눌러 그날 쓴 글을 봄 | 확인 [RBWPCAL] |
| BLG-11 | 태그 구름 — Tag Cloud | 부품 | 많이 쓴 태그일수록 글자를 크게 보여줌 | 확인 [RBWPTAG] · 대조 [RBTSKIN] |
| BLG-12 | 무작위 태그 상자 — Random Tags | 부품 | 태그 몇 개를 무작위로 골라 둘러보게 함 | 확인 [RBTSKIN] |
| BLG-13 | 사이드바 상자 쌓기 — Sidebar Widget Area | 구성 | 글 옆 칸에 소개·분류·최근 글 상자를 쌓음 | 확인 [RBTSKIN] |
| BLG-14 | 분류별 글 수 — Category Post Count | 부품 | 분류 이름 옆에 들어 있는 글 개수를 붙임 | 확장 [MK] |
| BLG-15 | 최근 댓글 상자 — Recent Comments Widget | 부품 | 새로 달린 댓글을 옆 칸에 모아 보여줌 | 확인 [RBTSKIN] |
| BLG-16 | 공지 글 종류 — Notice Post Type | 기준 | 일반 글과 따로 블로그 공지만 모아 관리함 | 확인 [RBTSKIN] |
| BLG-17 | 방문자 수 표시 — Visitor Counter | 부품 | 블로그를 찾은 사람 수를 숫자로 보여줌 | 확인 [RBTSKIN] |
| BLG-18 | 글 상태 이름표 — Post Status | 부품 | 초안·예약·검토 대기·비공개인지 이름표로 알림 | 확인 [RBWPSTAT] |
| BLG-19 | 비밀번호 보호 글 — Password-Protected Post | 흐름 | 비밀번호를 넣은 사람만 글을 읽게 함 | 확인 [RBWPPASS] · 대조 [RBTSKIN] |
| BLG-20 | 보호 글 제목 머리말 — Protected Prefix | 부품 | 잠긴 글 제목 앞에 보호됨 표시를 붙임 | 확인 [RBWPPASS] |
| BLG-21 | 비공개 글 — Private Post | 기준 | 쓴 사람과 관리자만 볼 수 있게 글을 숨김 | 확인 [RBWPPASS] |
| BLG-22 | 고유 주소 짓기 규칙 — Permalink Structure | 기준 | 글 주소를 날짜나 제목으로 짓는 방식을 정함 | 확인 [RBWPPERM] |
| BLG-23 | 고유 주소 고정 — Stable Permalink | 기준 | 한번 정한 글 주소는 바꾸지 않음, 바꾸면 링크가 깨짐 | 확인 [RBWPPERM] |
| BLG-24 | 분류 주소 앞말 — Category and Tag Base | 기준 | 분류·태그 쪽 주소의 앞부분 낱말을 정함 | 확인 [RBWPPERM] |
| BLG-25 | 옮긴 글 주소 넘겨주기 — Post Redirect | 흐름 | 옛 글 주소로 온 사람을 새 주소로 보냄 | 확장 [MK] · 대조 [RBGHDOM] |
| BLG-26 | 화면 틀 고르는 순서 — Template Hierarchy | 기준 | 글·쪽·분류마다 쓸 화면 틀을 정한 순서로 고름 | 확인 [RBWPTPL] |
| BLG-27 | 날짜 있는 글과 고정 쪽 구분 — Posts vs Pages | 기준 | 날짜 순 글과 소개 같은 고정 쪽을 나눔 | 확장 [MK] · 대조 [RBWPTPL] |
| BLG-28 | 사이트 이름과 한 줄 소개 — Site Title and Tagline | 부품 | 블로그 이름과 짧은 소개를 머리에 둠 | 확장 [MK] |
| BLG-29 | 글 머리 정보 — Front Matter | 기준 | 글 맨 위에 제목·날짜·태그를 따로 적어 둠 | 확인 [RBGHJEK] |
| BLG-30 | 날짜 붙은 글 파일 이름 — Dated Post Filename | 기준 | 파일 이름 앞 날짜로 글이 쓰인 날을 정함 | 확인 [RBJEKPST] |
| BLG-31 | 초안 폴더 — Drafts Folder | 기준 | 올리지 않을 글은 따로 두고 미리보기로만 봄 | 확인 [RBJEKPST] |
| BLG-32 | 정적 사이트 테마 — Static Site Theme | 기준 | 남이 만든 틀을 골라 사이트 겉모습을 정함 | 확인 [RBGHJEK] |
| BLG-33 | 계정 사이트와 저장소 사이트 주소 — User vs Project Site | 기준 | 계정 이름 주소와 저장소별 하위 주소를 나눔 | 확인 [RBGHPAGE] |
| BLG-34 | 내 도메인 연결 — Custom Domain | 흐름 | 내가 산 주소로 블로그가 열리게 이어 줌 | 확인 [RBGHDOM] · 대조 [RBGHPAGE] |
| BLG-35 | 도메인 소유 확인 — Domain Verification | 흐름 | 남이 내 주소를 가로채지 못하게 주인을 확인함 | 확인 [RBGHDOM] |
| BLG-36 | www 주소 하나로 묶기 — Apex and www Redirect | 기준 | www 주소와 기본 주소를 한쪽으로 모아 줌 | 확인 [RBGHDOM] |
| BLG-37 | 플랫폼 안 하위 주소 — Platform Handle URL | 기준 | 플랫폼 주소 뒤에 내 아이디를 붙여 블로그를 엶 | 확장 [MK] |
| BLG-38 | 글 주소 목록 파일 — XML Sitemap | 부품 | 검색 로봇에게 모든 글 주소 목록을 알림 | 확인 [RBWPMAP] |
| BLG-39 | 피드 전문과 요약 선택 — Feed Full Text or Excerpt | 기준 | 구독 피드에 글 전체나 요약만 싣도록 고름 | 확인 [RBWPREAD] |
| BLG-40 | 피드 주소 자동 알림 — RSS Autodiscovery | 기준 | 구독 앱이 블로그 피드 주소를 스스로 찾게 함 | 확장 [MK] |
| BLG-41 | 검색 엔진 노출 막기 — Discourage Search Engines | 기준 | 검색 결과에 블로그가 뜨지 않게 부탁함 | 확인 [RBWPREAD] |
| BLG-42 | 검색용 글 정보 표시 — Schema Markup | 기준 | 검색 엔진이 글 제목·날짜를 제대로 읽게 표시함 | 확인 [RBHUGEMB] |
| BLG-43 | 방문 기록 도구 연결 — Analytics Snippet | 기준 | 방문 통계 도구를 설정 한 줄로 사이트에 붙임 | 확인 [RBHUGEMB] |
| BLG-44 | 서버 없는 사이트 검색 — Static Search | 모듈 | 서버 없이 만든 사이트 안 글을 낱말로 찾음 | 확인 [RBPAGEF] |
| BLG-45 | 밝기 모드 세 칸 전환 — Theme Toggle | 부품 | 기기 설정·밝게·어둡게 중 하나를 골라 둠 | 확장 [MK] |
| BLG-46 | 코드 색 묶음 — Syntax Highlight Theme | 기준 | 코드 색 묶음을 골라 글 전체에 똑같이 씀 | 확인 [RBHUGOHL] |
| BLG-47 | 밝기별 코드 색 짝 — Light and Dark Code Theme | 기준 | 밝은 화면과 어두운 화면에 맞는 코드 색을 짝지음 | 확장 [MK] |
| BLG-48 | 코드 줄 번호 — Line Numbers | 부품 | 코드 줄마다 번호를 붙여 가리키기 쉽게 함 | 확인 [RBHUGOHL] |
| BLG-49 | 강조한 코드 줄 — Highlighted Lines | 부품 | 설명하는 코드 줄만 배경색으로 칠해 둠 | 확인 [RBHUGOHL] |
| BLG-50 | 코드 언어·파일 이름표 — Code Block Title | 부품 | 코드 위에 언어와 파일 이름을 적어 둠 | 확장 [MK] |
| BLG-51 | 바뀐 줄 비교 코드 — Diff Code Block | 부품 | 더한 줄은 초록, 뺀 줄은 빨강으로 보임 | 확장 [MK] |
| BLG-52 | 긴 코드 옆으로 밀기 — Code Horizontal Scroll | 기준 | 휴대폰에서 긴 코드 줄은 옆으로 밀어 봄 | 확장 [MK] |
| BLG-53 | 깃허브 저장소 카드 — Repository Card | 부품 | 저장소 이름·설명·별 수를 카드 한 장으로 보임 | 확장 [MK] |
| BLG-54 | 코드 조각 끼워 넣기 — Gist Embed | 부품 | 따로 올린 코드 조각을 글 안에 불러옴 | 확인 [RBGHJEK] |
| BLG-55 | 작동 화면과 코드 버튼 — Demo and Source Links | 부품 | 실제 작동 화면과 코드 저장소로 바로 보냄 | 확장 [MK] |
| BLG-56 | 기술 이름표 배지 — Tech Stack Badges | 부품 | 쓴 기술을 작은 이름표로 한 줄에 늘어놓음 | 확장 [MK] |
| BLG-57 | 오래된 글 알림 — Outdated Post Notice | 부품 | 쓴 지 오래돼 내용이 낡았을 수 있다고 알림 | 확장 [MK] |
| BLG-58 | 이 쪽 고치기 링크 — Edit on GitHub | 부품 | 글 원본 파일을 고치러 저장소로 바로 감 | 확장 [MK] |
| BLG-59 | 기여 잔디 그래프 — Contribution Graph | 부품 | 날마다 한 일의 양을 네모 칸으로 보여줌 | 확인 [RBGHCONT] |
| BLG-60 | 오늘 배운 것 모음 — TIL Collection | 모듈 | 날마다 배운 짧은 기록을 한곳에 쌓아 둠 | 확장 [MK] |
| BLG-61 | 깃허브 토론 댓글 — giscus | 모듈 | 깃허브 토론 게시판을 글 아래 댓글 창으로 씀 | 확인 [RBGISCUS] |
| BLG-62 | 외부 댓글 서비스 붙이기 — Disqus Embed | 모듈 | 남이 운영하는 댓글 서비스를 글 아래 붙임 | 확인 [RBHUGEMB] |
| BLG-63 | 댓글 승인 대기 — Comment Moderation Queue | 흐름 | 주인이 허락해야 새 댓글이 화면에 보임 | 확인 [RBWPDISC] |
| BLG-64 | 오래된 글 댓글 닫기 — Auto-Close Comments | 기준 | 정한 날짜가 지난 글은 댓글을 막음 | 확인 [RBWPDISC] |
| BLG-65 | 다른 블로그 링크 알림 — Pingback and Trackback | 부품 | 다른 블로그가 내 글을 링크하면 알려줌 | 확인 [RBWPDISC] |
| BLG-66 | 웹 언급 알림 — Webmention | 부품 | 다른 사이트가 내 글을 언급하면 받아 보여줌 | 확인 [RBWEBMEN] |
| BLG-67 | 방명록 — Guestbook | 모듈 | 글과 상관없이 방문자가 인사를 남기는 곳 | 확인 [RBTSKIN] |
| BLG-68 | 스킨 편집 — Skin Editor | 모듈 | 블로그 틀의 코드와 모양을 직접 고침 | 확인 [RBTSKIN] |
| BLG-69 | 스킨 치환자 — Skin Placeholders | 기준 | 틀 속 약속된 표시가 실제 글 내용으로 바뀜 | 확인 [RBTSKIN] |
| BLG-70 | 휴대폰 전용 틀 — Mobile Skin | 기준 | 휴대폰에서는 따로 만든 단순한 틀로 보여줌 | 확장 [MK] |
| BLG-71 | 휴대폰에서 옆 칸 내리기 — Sidebar Reflow | 구성 | 좁은 화면에서는 옆 칸 상자를 글 아래로 옮김 | 확장 [MK] |
| BLG-72 | 휴대폰 분류 서랍 — Category Drawer | 구성 | 메뉴 버튼을 누르면 분류 목록이 옆에서 나옴 | 확장 [MK] |
| BLG-73 | 서로이웃 — Mutual Neighbors | 흐름 | 서로 신청하고 받아 이웃 공개 글을 함께 봄 | 확장 [MK] |
| BLG-74 | 이웃 공개 범위 — Neighbors-Only Post | 기준 | 이웃으로 맺은 사람에게만 글을 보여줌 | 확장 [MK] |
| BLG-75 | 블로그 프롤로그 — Blog Prologue | 모듈 | 첫 화면을 대표 글과 사진 묶음으로 꾸밈 | 확장 [MK] |
| BLG-76 | 글 퍼가기 허용 설정 — Scrap Permission | 기준 | 남이 내 글을 퍼갈 수 있게 할지 정함 | 확장 [MK] |
| BLG-77 | 본문 위 글 목록 펼치기 — Post List Toggle | 부품 | 글 위에 같은 분류 제목 목록을 펼쳐 고름 | 확장 [MK] |
| BLG-78 | 블로그 통계 화면 — Blog Statistics | 모듈 | 날짜별 조회 수와 들어온 검색어를 봄 | 확장 [MK] |
| BLG-79 | 광고 수익 연결 — Ad Network Setup | 흐름 | 광고 서비스에 가입해 글 사이에 광고를 넣음 | 확장 [MK] |
| BLG-80 | 작가 신청 심사 — Writer Application | 흐름 | 글 샘플을 내고 심사를 통과해야 글을 발행함 | 확장 [MK] |
| BLG-81 | 글 묶음 책 — Brunch Book | 모듈 | 글 여러 편을 표지와 차례가 있는 책처럼 묶음 | 확장 [MK] |
| BLG-82 | 여러 작가 묶음 — Publication | 모듈 | 한 주제 아래 여러 작가 글을 모아 펴냄 | 확장 [MK] |
| BLG-83 | 작가에게 제안하기 — Author Proposal | 흐름 | 출간·강연·협업 제안을 작가에게 보냄 | 확장 [MK] |
| BLG-84 | 블로그 옮기기 — Export and Import | 흐름 | 글과 댓글을 파일로 빼내 다른 블로그로 옮김 | 확장 [MK] |
| BLG-85 | 원래 글 주소 밝히기 — Canonical Link | 기준 | 다시 올린 글이 처음 올린 글을 가리키게 함 | 확장 [MK] |
| BLG-86 | 여러 저자 표시 — Multiple Authors | 부품 | 글 하나에 쓴 사람 여럿을 나란히 적음 | 확장 [MK] · 대조 [RBGSTPUB] |
| BLG-87 | 글 요약 따로 쓰기 — Custom Excerpt | 부품 | 본문과 따로 짧은 요약을 적어 둠 | 확인 [RBGSTPUB] |
| BLG-88 | 글마다 읽을 사람 고르기 — Post Access Level | 기준 | 공개·회원·유료·등급 중 누가 읽을지 정함 | 확인 [RBGSTPRT] |
| BLG-89 | 올리기와 메일 보내기 선택 — Publish and Email | 흐름 | 사이트에 올릴지 메일로 보낼지 둘 다 할지 고름 | 확인 [RBGSTEM] |
| BLG-90 | 받는 독자 나누기 — Newsletter Segment | 기준 | 무료·유료·등급별로 메일 받을 사람을 나눔 | 확인 [RBGSTEM] |
| BLG-91 | 다른 작가 추천 — Recommendations | 모듈 | 내 구독자에게 다른 작가를 소개해 줌 | 확인 [RBGSTREC] |
| BLG-92 | 창립 회원 등급 — Founding Member | 부품 | 돈을 더 내고 먼저 지지하는 맨 위 등급 | 확장 [MK] |
| BLG-93 | 구독 환영 첫 화면 — Welcome Page | 모듈 | 처음 온 사람에게 구독부터 권하는 첫 화면 | 확장 [MK] |
| BLG-94 | 유료 회원 댓글 — Paid-Only Comments | 기준 | 돈을 낸 회원만 댓글을 달 수 있게 함 | 확장 [MK] |
| BLG-95 | 여러 번 누르는 박수 — Clap | 부품 | 한 사람이 여러 번 눌러 좋은 정도를 나타냄 | 확장 [MK] |
| BLG-96 | 지금 하는 일 쪽 — Now Page | 모듈 | 요즘 집중하는 일을 한 쪽에 적어 둠 | 확인 [RBNOW] |
| BLG-97 | 쓰는 도구 쪽 — Uses Page | 모듈 | 쓰는 장비와 프로그램을 목록으로 보여줌 | 확인 [RBUSES] |
| BLG-98 | 개인 소개 쪽 — About Me | 모듈 | 사진과 하는 일, 걸어온 길을 한 쪽에 적음 | 확장 [MK] |
| BLG-99 | 경력 정리 쪽 — CV Page | 모듈 | 학력·경력·기술을 웹 한 쪽에 정리함 | 확장 [MK] |
| BLG-100 | 인쇄용 이력서 내려받기 — PDF Résumé | 부품 | 종이로 뽑을 이력서를 파일로 받게 함 | 확장 [MK] |
| BLG-101 | 발표 모음 쪽 — Talks Page | 모듈 | 강연마다 영상과 발표 자료를 모아 둠 | 확장 [MK] |
| BLG-102 | 쓴 글·논문 목록 — Publications List | 모듈 | 펴낸 글과 논문을 해마다 정리해 보여줌 | 확장 [MK] |
| BLG-103 | 메일 주소 가리기 — Email Obfuscation | 기준 | 스팸 로봇이 메일 주소를 긁어 가지 못하게 함 | 확장 [MK] |
| BLG-104 | 계정 아이콘 줄 — Social Links Row | 부품 | 깃허브·링크드인 같은 계정 아이콘을 한 줄로 둠 | 확장 [MK] |
| BLG-105 | 즐겨 읽는 블로그 목록 — Blogroll | 부품 | 내가 즐겨 읽는 다른 블로그를 걸어 둠 | 확장 [MK] |
| BLG-106 | 사이트 고리 — Webring | 부품 | 이전·다음 버튼으로 같은 주제 사이트를 돌아봄 | 확인 [RBWIKIWR] |
| BLG-107 | 디지털 정원 — Digital Garden | 기준 | 날짜 순서 대신 주제 연결로 글을 엮어 둠 | 확장 [MK] · 대조 [RBGARDEN] |
| BLG-108 | 글 자람 단계 — Growth Stage | 부품 | 새싹·꽃봉오리·늘푸름으로 글이 다듬어진 정도를 알림 | 확장 [MK] · 대조 [RBGARDEN] |
| BLG-109 | 이 글을 가리키는 글 — Backlinks | 부품 | 이 글을 링크한 다른 글을 아래에 모아 보임 | 확장 [MK] · 대조 [RBGARDEN] |
| BLG-110 | 만든 도구 밝히기 — Built-With Credit | 부품 | 바닥글에 사이트를 만든 도구를 적어 둠 | 확장 [MK] |
| BLG-111 | 글 사용 허락 표시 — Creative Commons Notice | 부품 | 글을 퍼가도 되는 조건을 글 아래 밝힘 | 확장 [MK] |
| BLG-112 | 작품 개요 표 — Project Overview | 부품 | 작품 첫머리에 역할·기간·도구·팀을 표로 둠 | 확장 [MK] · 대조 [RBNNGPF] |
| BLG-113 | 내 몫 밝히기 — State Your Role | 기준 | 팀 작업에서 내가 맡은 부분을 분명히 적음 | 확인 [RBNNGPF] |
| BLG-114 | 과정 보여주기 — Show the Process | 기준 | 결과만 말고 조사·스케치 과정도 함께 보임 | 확인 [RBNNGPF] |
| BLG-115 | 작품 적게 고르기 — Curate 3–5 Projects | 기준 | 잘한 작품 서너 개만 골라 깊게 보여줌 | 확인 [RBNNGPF] |
| BLG-116 | 비밀 작업 가려 보이기 — NDA Blur | 기준 | 회사 비밀 부분은 흐리게 가려서 보여줌 | 확인 [RBNNGPF] |
| BLG-117 | 비밀번호 걸린 작품 — Protected Case Study | 흐름 | 받은 사람만 비밀번호를 넣어 작품을 열어 봄 | 확장 [MK] · 대조 [RBWPPASS] |
| BLG-118 | 작품에서 배운 점 — Learnings | 부품 | 작품 끝에 아쉬운 점과 배운 점을 적음 | 확장 [MK] |
| BLG-119 | 다음 작품 넘김 — Next Project | 부품 | 작품을 다 보면 다음 작품으로 바로 넘어감 | 확장 [MK] |
| BLG-120 | 함께 만든 사람 — Credits | 부품 | 같이 만든 사람 이름과 맡은 일을 적음 | 확장 [MK] |
| BLG-121 | 쓴 프로그램 꼬리표 — Tools Used | 부품 | 작품에 쓴 프로그램을 꼬리표로 붙여 둠 | 확장 [MK] |
| BLG-122 | 화면 작품 기기 틀 — Device Mockup | 부품 | 화면 작업을 휴대폰·노트북 그림 안에 넣어 보임 | 확장 [MK] |
| BLG-123 | 인쇄용 포트폴리오 — Print Portfolio | 모듈 | 면접에 가져갈 종이나 PDF 작품 묶음을 만듦 | 확인 [RBNNGPF] |
| BLG-124 | 첫 화면 한 줄 소개 — Intro Statement | 부품 | 누구이고 무엇을 하는지 첫 화면에 한 줄로 밝힘 | 확장 [MK] |
| BLG-125 | 일감 받는 중 표시 — Available for Work | 부품 | 지금 새 일을 맡을 수 있는지 표시해 둠 | 확장 [MK] |
| BLG-126 | 주문 그림 접수 상태 — Commission Status | 부품 | 주문 작업을 받는지와 기다리는 줄을 알림 | 확장 [MK] |
| BLG-127 | 할 수 있는 일과 값 — Services and Rates | 모듈 | 맡을 수 있는 일과 기본 값을 정리해 보여줌 | 확장 [MK] |
| BLG-128 | 대표 영상 첫 화면 — Showreel Hero | 모듈 | 대표 작업 영상을 첫 화면에 크게 틀어 둠 | 확장 [MK] |
| BLG-129 | 작업 의뢰서 — Project Brief Form | 흐름 | 일의 종류·일정·예산을 받아 상담을 시작함 | 확장 [MK] |
| BLG-130 | 예산 구간 버튼 — Budget Range Chips | 부품 | 예산을 구간 버튼 중 하나로 고르게 함 | 확장 [MK] |
