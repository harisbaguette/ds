# 72. 게임 감각 연출·게임 필

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 72번 분류 GFX다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

게임의 조작과 화면에 손맛을 더하는 감각 연출을 담는다. 타격·흔들림·보상 공개·장면 전환·햅틱처럼 게임에서 판단이 달라지는 연출과 모바일 성능·배터리, PC 고주사율·큰 화면 조건만 넣는다. 일반 움직임 규칙은 ANM, 이징 토큰 이름은 TOK, 소리·햅틱 신호 이름은 SND, 효과 끄기 설정 화면은 GAM·GAC에 둔다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| GFX-01 | 게임 필 — game feel | 기준 | 조작·반응·연출이 합쳐진 손맛 | 확인 [QFSWINK] · 대조 [QFGFWIKI] |
| GFX-02 | 게임 필 여섯 요소 — 입력·반응·맥락·연출·비유·규칙 | 기준 | 손맛이 어디서 오는지 나눠 점검 | 확인 [QFSWINK] · 대조 [QFGFWIKI] |
| GFX-03 | 주스 — juice·juiciness | 기준 | 작은 입력에 반응을 여러 겹 쌓아 살아 있게 | 확인 [QFJUICY] · 대조 [QFJUICE] |
| GFX-04 | 입력 즉시 반응 — responsiveness | 기준 | 누른 순간 무엇이든 먼저 움직이게 | 확장 [MK] · 대조 [QFSWINK] |
| GFX-05 | 타격감 — hit feel·impact | 기준 | 맞았다는 사실을 눈·귀·손에 한꺼번에 | 확장 [MK] · 대조 [QFHITSTOP] |
| GFX-06 | 히트 스톱 — hit stop·hitlag·hit pause | 구성 | 맞는 순간 몇 프레임 멈춰 무게를 싣기 | 확인 [QFHITSTOP] |
| GFX-07 | 히트 스톱 중 떨림 — hitstop shake | 구성 | 멈춘 동안 맞은 쪽만 잘게 떨게 | 확인 [QFHITSTOP] |
| GFX-08 | 공격 세기별 멈춤 길이 차등 | 기준 | 센 공격일수록 조금 더 오래 멈춤 | 확장 [MK] |
| GFX-09 | 피격 흰색 깜빡임 — hit flash | 구성 | 맞은 대상을 한순간 하얗게 칠해 알림 | 확장 [MK] |
| GFX-10 | 넉백 — knockback | 구성 | 맞은 쪽을 뒤로 밀어 힘을 보이기 | 확장 [MK] |
| GFX-11 | 화면 흔들림 — screen shake | 구성 | 폭발·강타 때 화면을 짧게 흔들기 | 확인 [QFSWINK] · 대조 [QFCMIMP] |
| GFX-12 | 흔들림 세기 누적·감쇠 — trauma shake | 기준 | 충격을 쌓고 빠르게 잦아들게 | 확장 [MK] · 대조 [QFCAMMATH] |
| GFX-13 | 방향 있는 흔들림 — directional shake | 구성 | 맞은 쪽으로 밀리듯 한 방향으로 흔들기 | 확인 [QFCMIMP] |
| GFX-14 | 거리별 흔들림 약화 — impulse attenuation | 기준 | 폭발에서 멀수록 약하게 흔들기 | 확인 [QFCMIMP] |
| GFX-15 | 흔들어도 글씨는 고정 — HUD 제외 흔들림 | 기준 | 세상만 흔들고 체력·메뉴 글씨는 그대로 | 확장 [MK] |
| GFX-16 | 흔들려도 조준점 고정 — PC 조준 게임 | 기준 | 마우스로 겨누는 게임은 조준점을 제자리에 | 확장 [MK] |
| GFX-17 | 큰 화면 흔들림 폭 축소 — PC 모니터 | 기준 | 크고 가까운 화면에선 흔들림을 작게 | 확장 [MK] |
| GFX-18 | 카메라 반동 — camera kick | 구성 | 쏠 때 화면을 반대로 살짝 밀었다 되돌리기 | 확장 [MK] |
| GFX-19 | 카메라 순간 확대 — zoom punch | 구성 | 결정타 순간 살짝 당겼다 되돌리기 | 확장 [MK] |
| GFX-20 | 카메라 부드럽게 따라가기 — camera smoothing·lerp | 기준 | 캐릭터를 한 박자 늦게 부드럽게 따라가기 | 확인 [QFCAMMATH] |
| GFX-21 | 앞쪽 더 보여 주기 — camera look-ahead | 구성 | 가는 쪽·겨누는 쪽을 더 넓게 보이기 | 확장 [MK] · 대조 [QFCAMMATH] |
| GFX-22 | 처치 슬로 모션 — kill slow-mo | 구성 | 마지막 한 방을 느리게 보여 주기 | 확장 [MK] · 대조 [QFTSCALE] |
| GFX-23 | 게임 시간과 UI 시간 분리 — unscaled time | 기준 | 멈춤·느린 화면에서도 메뉴 연출은 제 속도 | 확인 [QFUNSCAL] · 대조 [QFGDTWN] |
| GFX-24 | 타격 파티클 — hit spark·impact particles | 부품 | 맞은 자리에 불꽃·먼지를 튀기기 | 확인 [QFSWINK] · 대조 [QFPARTI] |
| GFX-25 | 잔상·궤적 — trail·afterimage | 부품 | 빠른 움직임 뒤에 꼬리를 남겨 속도 보이기 | 확인 [QFTRAIL] |
| GFX-26 | 발사 섬광 — muzzle flash | 부품 | 쏘는 순간 총구에 짧은 빛 | 확장 [MK] |
| GFX-27 | 속도선 — speed lines | 부품 | 빨리 달릴 때 화면 가장자리 줄무늬, 세기 조절 대상 | 확인 [XAGCS] |
| GFX-28 | 강타 색 어긋남 — chromatic aberration pulse | 구성 | 큰 충격 순간 색을 잠깐 어긋나게 | 확장 [MK] |
| GFX-29 | 싸움 흔적 남기기 — permanence | 구성 | 탄피·자국을 남겨 싸운 결과를 보이기 | 확장 [MK] |
| GFX-30 | 스쿼시 앤 스트레치 — squash and stretch | 기준 | 부딪히면 납작, 튀면 길쭉하게, 부피는 그대로 | 확인 [QFDISNEY] · 대조 [QFSWINK] |
| GFX-31 | 예비 동작 — anticipation | 구성 | 큰 공격 전에 살짝 움츠려 미리 알림 | 확인 [QFDISNEY] |
| GFX-32 | 버튼 눌림 반응 — press squash·punch scale | 구성 | 누르면 줄었다가 튕기며 돌아오기 | 확장 [MK] · 대조 [QFDOTW] |
| GFX-33 | 대기 애니메이션 — idle animation | 구성 | 가만히 있어도 캐릭터·버튼이 숨 쉬듯 | 확장 [MK] |
| GFX-34 | 캐릭터 감정 반응 — reaction animation | 구성 | 결과에 따라 얼굴·몸짓으로 기분 보이기 | 확장 [MK] |
| GFX-35 | 과장 곡선 쓰임 구분 — Back·Elastic·Bounce | 기준 | 보상은 튕김, 착지는 통통처럼 곡선을 나눠 쓰기 | 확인 [QFEASE] · 대조 [QFGDTWN] |
| GFX-36 | 이징 곡선 이름표 — easings.net | 기준 | 곡선 이름을 팀이 같은 말로 부르기 | 확인 [QFEASE] |
| GFX-37 | 트윈 연쇄 조립 — Sequence·chain | 기준 | 여러 움직임을 차례·동시로 묶어 하나로 | 확인 [QFDOTW] · 대조 [QFGDTWN] |
| GFX-38 | 위젯 타임라인 애니메이션 — UMG Animation | 구성 | 키프레임으로 위젯 크기·위치·색을 시간에 맞춰 | 확인 [QFUMGANI] |
| GFX-39 | 피해 숫자 튐 — damage number pop·float | 구성 | 맞은 자리에서 숫자가 떠올랐다 흐려짐 | 확인 [QFFCT] |
| GFX-40 | 피해 숫자 흩뿌림 — random offset | 기준 | 숫자끼리 겹치지 않게 조금씩 흩기 | 확인 [QFFCT] |
| GFX-41 | 치명타 숫자 강조 — crit pop | 구성 | 치명타는 더 크고 다른 색으로 한 번 더 튐 | 확장 [MK] |
| GFX-42 | 콤보 글자 연출 — combo counter pop | 구성 | 이어 친 수가 늘수록 글자가 커지고 흔들림 | 확장 [MK] |
| GFX-43 | 연속 성공 연출 — streak·fever | 구성 | 연속 성공이 쌓이면 화면 분위기를 한 단계 올림 | 확장 [MK] |
| GFX-44 | 연속 획득 음높이 상승 — pitch ramp | 구성 | 이어서 얻을 때마다 소리를 조금씩 높임 | 확장 [MK] |
| GFX-45 | 효과음 무작위 변주 — pitch·volume variation | 기준 | 같은 소리 반복이 거슬리지 않게 살짝 바꿈 | 확장 [MK] |
| GFX-46 | 피격 붉은 테두리 — damage vignette | 구성 | 맞으면 화면 가장자리가 붉게 물듦 | 확장 [MK] |
| GFX-47 | 저체력 맥동 — low health pulse | 구성 | 체력이 적으면 테두리가 심장처럼 뛰기 | 확장 [MK] |
| GFX-48 | 전리품 튀어나옴 — loot drop pop·magnet | 구성 | 쓰러진 적에게서 보상이 튀어나와 끌려옴 | 확장 [MK] |
| GFX-49 | 획득물 날아가 담기기 — fly to inventory | 구성 | 얻은 동전이 잔액 칸으로 날아가 쌓임 | 확장 [MK] |
| GFX-50 | 보상 공개 단계 — 예고·개봉·공개·정리 | 흐름 | 상자 흔들림부터 획득 정리까지 순서대로 | 확장 [MK] |
| GFX-51 | 희귀도별 연출 길이 — rarity tiering | 기준 | 흔한 것은 짧게, 귀한 것만 길게 | 확장 [MK] |
| GFX-52 | 희귀도 예고 빛 — rarity tease | 구성 | 열기 전 빛 색으로 등급을 미리 알림, 확률 착각 주의 | 확장 [MK] |
| GFX-53 | 카드 뒤집기 공개 — card flip reveal | 구성 | 뒷면을 눌러 한 장씩 뒤집어 보기 | 확장 [MK] |
| GFX-54 | 연속 뽑기 요약 — multi-pull summary | 구성 | 여러 번 뽑은 결과를 한 화면에 모음 | 확장 [MK] |
| GFX-55 | 레벨업 팡파르 — level up fanfare | 구성 | 빛·글자·소리로 성장을 크게 축하 | 확장 [MK] |
| GFX-56 | 보상 숫자 카운트업 — tap to complete | 구성 | 경험치·재화가 올라가다 탭하면 바로 끝 | 확장 [MK] |
| GFX-57 | 진행 바 넘침 채움 — fill overflow | 구성 | 가득 차면 넘친 만큼 다음 칸에서 다시 채움 | 확장 [MK] |
| GFX-58 | 경험치 바 여러 단 상승 — multi-level fill | 구성 | 여러 레벨이 오르면 바가 여러 번 차고 비움 | 확장 [MK] |
| GFX-59 | 결과 화면 차례 등장 — result stagger | 구성 | 점수·보상·기록을 하나씩 차례로 띄움 | 확장 [MK] |
| GFX-60 | 별 획득 차례 연출 — star rating reveal | 구성 | 별이 하나씩 박히며 소리가 점점 높아짐 | 확장 [MK] |
| GFX-61 | 승리·패배 연출 길이 기준 | 기준 | 승리는 짧고 크게, 패배는 더 짧게 재도전으로 | 확장 [MK] |
| GFX-62 | 컷씬 진입 띠 — cinematic letterbox | 구성 | 위아래 검은 띠가 들어오며 이야기 장면 시작 | 확장 [MK] |
| GFX-63 | 장면 전환 가림막 — fade·loading cover | 구성 | 어두워진 사이에 불러오기를 숨기기 | 확장 [MK] |
| GFX-64 | 와이프 전환 — wipe | 구성 | 한쪽에서 쓸어 넘기듯 장면 바꾸기 | 확인 [QFWIPE] |
| GFX-65 | 아이리스 전환 — iris in·out | 구성 | 원이 좁아지며 끝, 넓어지며 시작 | 확인 [QFWIPE] |
| GFX-66 | 튜토리얼 스포트라이트 — spotlight mask | 구성 | 눌러야 할 곳만 밝히고 나머지는 어둡게 | 확장 [MK] |
| GFX-67 | 손가락 안내 애니 — tutorial hand pointer | 부품 | 손가락 그림이 눌러야 할 곳을 톡톡 | 확장 [MK] |
| GFX-68 | 타격 햅틱 맞추기 — hit haptics sync | 기준 | 맞는 순간 진동을 같이, 세기는 화면과 맞춤 | 확인 [HIG] · 대조 [QFANHPR] |
| GFX-69 | 보상 등급별 진동 세기 | 기준 | 중요한 보상일수록 진동을 한 단계 더 | 확장 [MK] · 대조 [QFANHPR] |
| GFX-70 | 소리 맞춤 진동 — audio-coupled haptics | 구성 | 효과음 흐름에 맞춰 진동을 함께 | 확인 [QFANHAP] · 대조 [QAHIGGAME] |
| GFX-71 | 눈·귀·손 신호 한 박자 — AV·haptic sync | 기준 | 화면·소리·진동이 같은 순간에 오게 | 확인 [HIG] · 대조 [QFANHPR] |
| GFX-72 | 짧고 딱 맞는 성공 연출 | 기준 | 성공 행동에 바로 붙는 짧은 연출 | 확인 [QFHIGMOT] |
| GFX-73 | 연출 스킵 원칙 — skip·두 번째부터 짧게 | 기준 | 기다리게 하지 않고, 다시 볼 땐 넘기게 | 확인 [QFHIGMOT] |
| GFX-74 | 연출 과다 금지 기준 — over-juice | 기준 | 글이 안 읽히거나 멀미 나면 줄이고 끄기 연결 | 확인 [XAGCS] · 대조 [QFHIGMOT] |
| GFX-75 | 번쩍임 한도 — 초당 3회·화면 넓이 | 기준 | 큰 번쩍임은 초당 3번 넘지 않게 | 확인 [QFXAG118] · 대조 [QFGAGFLK] |
| GFX-76 | 연출 우선순위·동시 개수 상한 | 기준 | 효과가 몰리면 중요한 것만 남기기 | 확장 [MK] |
| GFX-77 | 저사양 기기 연출 단계 — effects quality tiers | 기준 | 파티클·흔들림 양을 기기 등급별로 줄이기 | 확장 [MK] · 대조 [QFGMODE] |
| GFX-78 | 발열 때 연출 덜기 — thermal headroom | 기준 | 기기가 뜨거워지기 전에 효과부터 줄임 | 확인 [QIADPF] |
| GFX-79 | 절전 모드 연출 — battery game mode | 기준 | 배터리 모드면 화면 빠르기와 효과를 낮춤 | 확인 [QFGMODE] · 대조 [QFANFPS] |
| GFX-80 | 화면 빠르기와 무관한 연출 시간 — frame-rate independent | 기준 | 60·120·144Hz 어디서나 연출 길이가 같게 | 확인 [QFFCT] · 대조 [QFPROMO] |
| GFX-81 | 고주사율 연출 — 120Hz·ProMotion | 기준 | 움직임이 많을 때만 빠른 화면을 쓰기 | 확인 [QFPROMO] · 대조 [QFANFPS] |
