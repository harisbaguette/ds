# 67. 게임 플레이 HUD·전투 표시

[패턴 사전 색인과 사용법](<../패턴 사전 색인과 사용법.md>)의 67번 분류 GHD다. 항목 ID·종류·근거 표기 규칙은 색인 문서의 "목록을 읽는 기준"을 따르고, 근거 칸의 출처 기호는 [레퍼런스 출처 대장](<../레퍼런스 출처 대장.md>)의 "출처 기호표"에서 원문으로 이어진다.

이 분류는 플레이하는 동안 화면 위에 떠 있는 표시를 모은다. 체력·자원·탄약 같은 상태값, 조준점과 명중 표시 같은 전투 피드백, 목표 표식과 나침반 같은 길 안내, 킬 피드와 핑 같은 소통 표시, 그리고 HUD를 숨기거나 옮기는 설정을 모바일과 PC·콘솔 양쪽에서 다룬다. HUD 전체 틀·미니맵 자체·가상 조이스틱·안전영역은 41번 GAM에 있으므로, 여기서는 그 안의 세부 부품과 판단 기준만 다룬다.

| ID | 항목 | 종류 | 역할·사용할 때 | 근거 |
|---|---|---|---|---|
| GHD-01 | 네 갈래 HUD 구분 — diegetic·non-diegetic·spatial·meta | 기준 | 표시가 게임 세계 안에 있는지로 나눔 | 확인 [QHBTHUD] |
| GHD-02 | 비디제틱 표시 — non-diegetic HUD | 기준 | 세계 밖 겹층에 수치를 그려 빠르게 읽힘 | 확인 [QHBTHUD] · 대조 [QHWIKIHUD] |
| GHD-03 | 디제틱 표시 — diegetic interface | 기준 | 캐릭터 몸·장비에 정보를 새겨 몰입 유지 | 확인 [QHBTHUD] · 대조 [QHWIKIHUD] |
| GHD-04 | 공간 표시 — spatial element | 기준 | 세계 속 윤곽·표지로 길과 대상을 알림 | 확인 [QHBTHUD] |
| GHD-05 | 메타 지각 표시 — meta-perception | 기준 | 붉어진 화면처럼 몸 상태를 감각으로 전함 | 확인 [QHBTHUD] |
| GHD-06 | 메타 표현 — meta-representation | 기준 | 게임 속 휴대폰 화면 등으로 정보를 보임 | 확인 [QHBTHUD] |
| GHD-07 | 신호 흔적 — signifier | 기준 | 총구 연기·핏자국으로 상태를 넌지시 알림 | 확인 [QHBTHUD] |
| GHD-08 | 상황 반응 HUD — context-sensitive HUD | 기준 | 필요할 때만 나타났다 사라지게 함 | 확인 [QHBTHUD] · 대조 [QHWIKIHUD] |
| GHD-09 | 최소 HUD — minimal HUD | 기준 | 표시를 거의 없애 화면을 비움, 길 안내 대안 필요 | 확인 [QHWIKIHUD] · 대조 [QHBTHUD] |
| GHD-10 | 단순하고 깨끗한 HUD — clean HUD | 기준 | 꼭 필요한 값만 남기고 나머지는 덜어 냄 | 확인 [QHROLBOB] |
| GHD-11 | HUD 정보 우선순위 — information hierarchy | 기준 | 살고 죽는 값을 가장 크고 가깝게 둠 | 확장 [MK] · 대조 [QHROLBOB] |
| GHD-12 | 가장자리 배치 — edge and corner placement | 기준 | 가운데는 비우고 네 귀퉁이에 모음 | 확장 [MK] · 대조 [QHGDMMAP] |
| GHD-13 | 명령·정보 한곳 모으기 — unified information pane | 기준 | 흩어진 명령·정보를 아래 한 판에 모음 | 확인 [QHRTSUI] |
| GHD-14 | 색 의미 고정 — consistent color coding | 기준 | 아군 파랑·적 빨강처럼 색 뜻을 끝까지 유지 | 확장 [MK] · 대조 [XAGCB] |
| GHD-15 | 색만으로 전하지 않기 — no color-only cue | 기준 | 모양·글자·소리를 색과 함께 씀 | 확인 [XAGCB] |
| GHD-16 | 숫자와 바 고르기 — number vs bar | 기준 | 정확한 값은 숫자, 흐름은 바로 보임 | 확인 [QHKOWIKI] · 대조 [QHVERSEUI] |
| GHD-17 | HUD 글자 최소 크기 — minimum HUD text size | 기준 | 1080p에서 콘솔 26px·PC 18px 이상 | 확인 [QHXAG101] |
| GHD-18 | HUD 대비와 받침판 — contrast and backing plate | 기준 | 배경 위 글자에 반투명 판을 깔아 읽힘 확보 | 확인 [QHXAG102] · 대조 [XAGCS] |
| GHD-19 | 여러 감각 동시 신호 — multi-channel cue | 기준 | 피해를 화면과 소리로 함께 알림 | 확인 [QHAGDHUD] · 대조 [XAGCB] |
| GHD-20 | 월드 공간 UI — world-space UI | 기준 | 표시를 장면 속 물체 옆에 붙여 그림 | 확인 [QHUNIWS] |
| GHD-21 | 위쪽 보조 메뉴 — secondary controls at top | 기준 | 일시정지·지도 버튼은 위쪽에 작게 둠 | 확인 [QHHIGGC] |
| GHD-22 | 플레이어 체력 바 — health bar | 부품 | 남은 체력을 막대 길이로 한눈에 보임 | 확인 [QHUMGQS] · 대조 [QHVERSEUI] |
| GHD-23 | 체력 숫자 — health numbers | 부품 | 바 옆에 정확한 수치를 함께 보임 | 확인 [QHVERSEUI] |
| GHD-24 | 하트 칸 체력 — heart containers | 부품 | 체력을 하트 개수로 셈, 작은 수치에 알맞음 | 확인 [QHKOWIKI] |
| GHD-25 | 실드 바 — shield bar | 부품 | 체력 위 방어막을 다른 색 바로 따로 보임 | 확인 [QHUEFNHB] · 대조 [QHVERSEUI] |
| GHD-26 | 방어구 칸 — armor pips | 부품 | 방어구 내구를 칸 단위로 나눠 보임 | 확장 [MK] |
| GHD-27 | 스태미나 바 — stamina bar | 부품 | 달리기·회피 여력을 쓸 때만 띄움 | 확장 [MK] · 대조 [QHGUIDB] |
| GHD-28 | 마나·기력 바 — mana or energy bar | 부품 | 기술에 쓸 자원을 체력과 다른 색으로 보임 | 확인 [QHUMGQS] |
| GHD-29 | 경험치 바와 레벨 — XP bar and level | 부품 | 다음 레벨까지 남은 양을 얇은 띠로 보임 | 확인 [QHVERSEUI] |
| GHD-30 | 늦게 줄어드는 체력 바 — trailing damage bar | 부품 | 깎인 몫을 잠깐 남겨 맞은 양을 보임 | 확장 [MK] |
| GHD-31 | 아군 체력 바 — teammate health | 부품 | 팀원 체력을 옆 명단에 작게 모음 | 확인 [QHWIKIHUD] · 대조 [QHVERSEUI] |
| GHD-32 | 머리 위 이름표 바 — overhead nameplate | 부품 | 캐릭터 머리 위에 이름과 체력을 띄움 | 확인 [QHUEFNHB] · 대조 [QHUNIWS] |
| GHD-33 | 머리 위 표시 이중 테두리 — double outline | 기준 | 밝은 배경에서도 머리 위 표시가 보이게 | 확인 [QHXAG102] |
| GHD-34 | 보스 체력 바 — boss health bar | 부품 | 화면 위나 아래에 길고 굵게 따로 둠 | 확인 [QHWIKIHUD] · 대조 [QHGUIDB] |
| GHD-35 | 보스 다단 바 — multi-phase boss bar | 부품 | 단계마다 바를 겹쳐 남은 페이즈를 보임 | 확장 [MK] |
| GHD-36 | 양쪽 대전 체력 바 — versus health bars | 부품 | 두 선수 체력 바를 위쪽 좌우에 마주 놓음 | 확인 [QHWIKIHUD] |
| GHD-37 | 은신 게이지 — stealth meter | 부품 | 적에게 들킬 정도를 눈금으로 보임 | 확인 [QHWIKIHUD] |
| GHD-38 | 속도계 — speedometer | 부품 | 탈것의 지금 속도를 구석에 숫자로 보임 | 확인 [QHWIKIHUD] |
| GHD-39 | 탄약 카운터 — ammo counter | 부품 | 탄창 안 탄과 예비탄을 나눠 보임 | 확인 [QHUMGQS] · 대조 [QHWIKIHUD] |
| GHD-40 | 재장전 알림 — reload prompt | 부품 | 탄이 떨어지면 조준점 가까이에 알림 | 확장 [MK] |
| GHD-41 | 장착 무기 표시 — equipped item | 부품 | 지금 든 무기·도구를 아이콘으로 보임 | 확인 [QHVERSEUI] · 대조 [QHGUIDB] |
| GHD-42 | 무기 바퀴 — weapon wheel | 구성 | 누르고 있는 동안 둥글게 무기를 고름 | 확인 [QHGUIDB] |
| GHD-43 | 투척 궤적 — throwing arc | 부품 | 던질 물건이 떨어질 곳을 곡선으로 그림 | 확인 [QHGUIDB] |
| GHD-44 | 조준점 — crosshair | 부품 | 화면 가운데에 총구가 향한 곳을 표시 | 확인 [QHWIKIHUD] · 대조 [QHGUIDB] |
| GHD-45 | 점 조준점 — dot reticle | 부품 | 작은 점 하나로 시야를 덜 가림 | 확장 [MK] · 대조 [QHROLBOB] |
| GHD-46 | 확산 조준점 — dynamic spread crosshair | 부품 | 움직이면 벌어져 탄이 퍼지는 폭을 보임 | 확장 [MK] |
| GHD-47 | 조준점 모양·색 고르기 — crosshair customization | 부품 | 조준점 모양과 색을 사용자가 바꿈 | 확인 [QHGAGXH] · 대조 [QHCWACC] |
| GHD-48 | 명중 표시 — hit marker | 부품 | 맞히면 조준점에 짧은 표시가 번쩍임 | 확인 [QHCWACC] |
| GHD-49 | 머리·몸 명중 구분 — headshot hit feedback | 부품 | 머리 명중은 다른 모양으로 따로 알림 | 확인 [QHVALHIT] |
| GHD-50 | 처치 확인 표시 — kill confirm marker | 부품 | 쓰러뜨리면 해골이나 붉은 표시로 확정 | 확장 [MK] |
| GHD-51 | 목표 고정 표시 — lock-on target | 부품 | 고정한 적 몸에 표적 테를 씌움 | 확인 [QHGUIDB] |
| GHD-52 | 겨눈 대상 정보 — target info panel | 부품 | 겨눈 적의 이름·체력을 위쪽에 띄움 | 확장 [MK] · 대조 [QHGUIDB] |
| GHD-53 | 피해 숫자 — damage numbers | 부품 | 준 피해량을 숫자로 알림, 튀는 움직임은 GFX | 확인 [QHD4DMG] |
| GHD-54 | 치명타 숫자 — critical hit number | 부품 | 치명타는 더 크고 다른 색으로 구분 | 확장 [MK] |
| GHD-55 | 피해 숫자 줄여 쓰기 — abbreviated damage number | 기준 | 10000을 10k처럼 짧게 써 겹침을 줄임 | 확인 [QHD4DMG] |
| GHD-56 | 피격 방향 표시 — damage direction indicator | 부품 | 맞은 쪽 화면 둘레에 붉은 호를 띄움 | 확인 [XAGCB] · 대조 [QHGAGDIR] |
| GHD-57 | 수류탄 경고 표시 — grenade indicator | 부품 | 근처 수류탄 쪽을 깜박이는 아이콘으로 | 확인 [QHGAGDIR] |
| GHD-58 | 낮은 체력 화면 붉어짐 — low health vignette | 부품 | 위험할 때 화면 가장자리를 붉게 물들임 | 확인 [QHBTHUD] |
| GHD-59 | 심장 소리 경고 — heartbeat cue | 부품 | 체력이 낮으면 심장 소리로 긴박감을 줌 | 확인 [QHBTHUD] · 대조 [QHAGDHUD] |
| GHD-60 | 방향 핏자국 — directional blood splatter | 부품 | 총알이 온 쪽 화면에 핏자국을 뿌림 | 확인 [QHBTHUD] |
| GHD-61 | 상태 효과 아이콘 — status effect icons | 부품 | 걸린 버프·디버프를 체력 옆에 줄지어 보임 | 확인 [QHFFBUFF] |
| GHD-62 | 버프 위·디버프 아래 — buff up and debuff down | 기준 | 이로운 효과와 해로운 효과를 방향으로 구분 | 확인 [QHFFBUFF] |
| GHD-63 | 남은 지속시간 — effect duration | 부품 | 아이콘 아래에 남은 초를 숫자로 보임 | 확장 [MK] |
| GHD-64 | 상태 아이콘 묶음 배치 — grouped status icons | 부품 | 묶음마다 위치·크기·투명도를 따로 정함 | 확인 [QHFFBSEP] |
| GHD-65 | 쿨다운 원형 게이지 — radial cooldown | 부품 | 아이콘을 시계 방향으로 덮어 남은 시간을 보임 | 확장 [MK] · 대조 [QHKOWIKI] |
| GHD-66 | 스킬 바 — hotbar | 구성 | 숫자키에 맞춘 기술 칸을 아래에 줄지어 둠 | 확장 [MK] · 대조 [QHGUIDB] |
| GHD-67 | 단축키 글자 — keybind label | 부품 | 기술 칸 귀퉁이에 누를 키를 적음 | 확장 [MK] |
| GHD-68 | 모바일 스킬 버튼 부채꼴 — skill button arc | 구성 | 오른손 엄지 둘레에 기술 버튼을 둥글게 | 확인 [QHHIGGC] |
| GHD-69 | 엄지 닿는 곳 배치 — thumb reach placement | 기준 | 자주 누르는 버튼을 엄지 가까이 둠 | 확인 [QHHIGGC] |
| GHD-70 | 손가락 가림 피하기 — finger occlusion | 기준 | 누른 상태가 손가락 밖에서도 보이게 함 | 확인 [QHHIGGC] |
| GHD-71 | 쉬면 흐려지는 조작부 — fading virtual controls | 부품 | 안 쓸 때는 버튼을 흐리게 해 화면 확보 | 확인 [QHHIGGC] |
| GHD-72 | 시전 취소 영역 — cancel cast zone | 부품 | 끌던 손가락을 이곳에 놓으면 기술 취소 | 확장 [MK] |
| GHD-73 | 궁극기 충전 게이지 — ultimate charge meter | 부품 | 큰 기술까지 모인 비율을 퍼센트로 보임 | 확장 [MK] · 대조 [QHOW2PN] |
| GHD-74 | 콤보 카운터 — combo counter | 부품 | 이어 맞힌 횟수를 크게 세어 보임 | 확인 [QHGUIDB] |
| GHD-75 | 점수 표시 — score display | 부품 | 지금 점수를 화면 위쪽에 계속 보임 | 확인 [QHWIKIHUD] · 대조 [QHGUIDB] |
| GHD-76 | 타이머 — clock and timer | 부품 | 남은 시간이나 흐른 시간을 숫자로 보임 | 확인 [QHGUIDB] · 대조 [QHWIKIHUD] |
| GHD-77 | 라운드 정보 — round info | 부품 | 몇 번째 판인지와 판 점수를 함께 보임 | 확인 [QHVERSEUI] |
| GHD-78 | 남은 인원 수 — player count | 부품 | 살아남은 사람 수를 구석에 보임 | 확인 [QHVERSEUI] |
| GHD-79 | 처치 수 — elimination counter | 부품 | 내가 쓰러뜨린 수를 작게 세어 보임 | 확인 [QHVERSEUI] |
| GHD-80 | 양 팀 생존자 수 — team status indicator | 부품 | 킬 피드 위에 양 팀 살아 있는 수를 보임 | 확인 [QHOW226] |
| GHD-81 | 구매 대기열 표시 — build queue | 부품 | 다음 살 물건과 모은 돈 진행을 보임 | 확인 [QHLOL243] |
| GHD-82 | 남은 돈 깜박임 — unspent gold alert | 부품 | 살 때를 놓치면 돈 숫자를 노랗게 깜박임 | 확인 [QHLOL243] |
| GHD-83 | 목표 표식 — waypoint marker | 부품 | 가야 할 곳 위에 아이콘을 띄움 | 확인 [QHGUIDB] |
| GHD-84 | 거리 표시 — distance readout | 부품 | 표식 아래에 남은 거리를 미터로 보임 | 확장 [MK] |
| GHD-85 | 화면 밖 방향 화살표 — off-screen indicator | 부품 | 안 보이는 목표 쪽 가장자리에 화살표 | 확인 [QHGDMMAP] |
| GHD-86 | 나침반 바 — compass bar | 부품 | 위쪽 띠에 방위와 목표 방향을 보임 | 확인 [QHGUIDB] · 대조 [QHWIKIHUD] |
| GHD-87 | 퀘스트 화살표 — quest arrow | 부품 | 다음 목적지를 화살표 하나로 가리킴 | 확인 [QHWIKIHUD] |
| GHD-88 | 길 표지 불빛 — checkpoint beacon | 부품 | 다음 지점을 세계 속 빛기둥으로 보임 | 확인 [QHBTHUD] |
| GHD-89 | 윤곽선 강조 — outline highlight | 부품 | 벽 너머 아군·물건을 윤곽선으로 보임 | 확인 [QHBTHUD] |
| GHD-90 | 미니맵 회전 — rotating minimap | 부품 | 내가 보는 쪽이 늘 위가 되게 돌림 | 확장 [MK] |
| GHD-91 | 미니맵 북쪽 고정 — north-up minimap | 부품 | 지도는 두고 내 화살표만 돌림 | 확장 [MK] |
| GHD-92 | 미니맵 확대 단계 — minimap zoom | 부품 | 속도나 버튼에 따라 넓게 또는 좁게 봄 | 확장 [MK] |
| GHD-93 | 미니맵 아이콘 색 고르기 — minimap icon color | 부품 | 나·아군·적 표시 색을 사용자가 정함 | 확인 [XAGCB] |
| GHD-94 | 미니맵 경보 효과 — minimap alert | 부품 | 위험한 곳을 지도 위 번쩍임과 소리로 알림 | 확인 [QHLOL243] |
| GHD-95 | 소리 시각화 — visualize sound effects | 부품 | 발소리·총소리 방향을 아이콘으로 보임 | 확인 [QHVERSEUI] |
| GHD-96 | 지역 이름 알림 — area name banner | 부품 | 새 지역에 들어서면 이름을 잠깐 띄움 | 확인 [QHGUIDB] |
| GHD-97 | 킬 피드 — kill feed | 부품 | 누가 누구를 쓰러뜨렸는지 구석에 흘림 | 확인 [QHOW226] · 대조 [QHGUIDB] |
| GHD-98 | 전투 기록 — combat log | 부품 | 주고받은 피해를 줄글로 쌓아 둠 | 확인 [QHGUIDB] |
| GHD-99 | 획득 알림 줄 — pickup stream | 부품 | 주운 물건을 옆에 차례로 띄움 | 확인 [QHVERSEUI] · 대조 [QHGUIDB] |
| GHD-100 | 상황 배너 — game state banner | 부품 | 점령·라운드 시작을 가운데 크게 알림 | 확인 [QHGUIDB] |
| GHD-101 | 해금 알림 — unlock toast | 부품 | 해금·업적을 구석에 잠깐 띄움 | 확인 [QHGUIDB] |
| GHD-102 | HUD 속 임무 추적기 — pinned mission tracker | 부품 | 고정한 임무 한두 개를 옆에 띄움 | 확인 [QHGUIDB] |
| GHD-103 | 누르는 동안 성적표 — hold-to-show scoreboard | 구성 | 탭 키를 누르는 동안만 전원 성적을 보임 | 확장 [MK] · 대조 [QHOW2PN] |
| GHD-104 | 팀 명단 — team info panel | 부품 | 팀원 이름·상태를 옆에 세로로 모음 | 확인 [QHVERSEUI] |
| GHD-105 | 핑 — ping marker | 부품 | 한 번 눌러 가리킨 곳을 팀 화면에 표시 | 확인 [QHAPEXPG] |
| GHD-106 | 상황 핑 — contextual ping | 흐름 | 가리킨 대상에 맞춰 핑 뜻을 알아서 정함 | 확인 [QHAPEXPG] · 대조 [QHOW2PN] |
| GHD-107 | 핑 바퀴 — ping wheel | 구성 | 누르고 있으면 적·이동 등 핑 종류를 고름 | 확인 [QHOW2PN] · 대조 [QHAPEXPG] |
| GHD-108 | 마지막 목격 핑 — last seen ping | 부품 | 사라진 적이 마지막에 있던 곳을 표시 | 확인 [QHOW2PN] |
| GHD-109 | 핑한 적 체력 표시 — enemy health ping | 부품 | 핑한 적이 약하면 아이콘에 따로 표시 | 확인 [QHOW2PN] |
| GHD-110 | 쓰러진 뒤 핑 — post-death ping | 흐름 | 쓰러진 뒤에도 잠깐 핑을 쓸 수 있게 함 | 확인 [QHOW2PN] |
| GHD-111 | 소통 바퀴 — communication wheel | 구성 | 짧은 말을 바퀴에서 골라 바로 보냄 | 확인 [QHOW205] · 대조 [QHGUIDB] |
| GHD-112 | 감정 표현 바퀴 — emote wheel | 구성 | 몸짓·음성 대사를 둥글게 골라 씀 | 확인 [QHOW2PN] · 대조 [QHGUIDB] |
| GHD-113 | 채팅 겹층 — chat overlay | 부품 | 대화창을 반투명하게 띄우고 곧 흐리게 함 | 확인 [XAGCS] · 대조 [QHXAG101] |
| GHD-114 | 말하는 사람 표시 — voice speaking indicator | 부품 | 지금 말하는 사람 옆에 스피커 아이콘 | 확인 [XAGCB] |
| GHD-115 | 상호작용 알림 — interaction prompt | 부품 | 가까이 가면 E 눌러 열기처럼 뜸 | 확인 [QHVERSEUI] · 대조 [QHGUIDB] |
| GHD-116 | 무기 줍기 알림 — weapon pickup prompt | 부품 | 바닥 무기 이름과 줍기 키를 띄움 | 확인 [QHGUIDB] |
| GHD-117 | 순간 버튼 입력 — quick time event prompt | 부품 | 연출 중 누를 버튼을 크게 번쩍임 | 확인 [QHGUIDB] |
| GHD-118 | 조작 안내 겹층 — controls reference | 부품 | 처음 한동안 조작법을 구석에 띄움 | 확인 [QHGUIDB] |
| GHD-119 | RTS 자원 카운터 — resource counter | 부품 | 모은 자원 수를 종류별로 나란히 보임 | 확장 [MK] · 대조 [QHVERSEUI] |
| GHD-120 | 유닛 선택 테 — selection circle | 부품 | 고른 유닛 발밑에 테를 둘러 표시 | 확장 [MK] |
| GHD-121 | 선택 유닛 정보판 — selection panel | 구성 | 고른 유닛 정보와 명령을 아래에 모음 | 확인 [QHRTSUI] |
| GHD-122 | 부대 번호 — control group badge | 부품 | 숫자키로 묶은 부대 번호를 띄움 | 확장 [MK] · 대조 [QHRTSUI] |
| GHD-123 | 배치 미리보기 — placement ghost | 부품 | 지을 건물 자리를 반투명으로 미리 보임 | 확인 [QHGUIDB] |
| GHD-124 | 안전지대 타이머 — storm timer | 부품 | 구역이 좁아지기까지 남은 시간을 보임 | 확인 [QHVERSEUI] |
| GHD-125 | 자기장 경고 — storm notification | 부품 | 구역이 줄어들 때 경고 문구를 띄움 | 확인 [QHVERSEUI] |
| GHD-126 | 부활 카운트다운 — respawn countdown | 부품 | 다시 나오기까지 남은 초를 크게 보임 | 확장 [MK] |
| GHD-127 | 아군 부활 진행 바 — ally respawn progress | 부품 | 쓰러진 팀원이 돌아올 때까지 진행을 보임 | 확인 [QHOW226] |
| GHD-128 | 관전 대상 표시 — spectating target | 부품 | 지금 보는 선수 이름과 바꾸는 키를 띄움 | 확장 [MK] |
| GHD-129 | 연출 중 HUD 숨김 — hide HUD in cinematics | 흐름 | 컷신 동안 표시를 모두 걷었다 되돌림 | 확장 [MK] · 대조 [QHVERSEUI] |
| GHD-130 | HUD 전체 끄기 — hide HUD toggle | 부품 | 조준점만 남기고 표시를 모두 끔 | 확인 [QHVERSEUI] |
| GHD-131 | 요소별 켜고 끄기 — per-element toggle | 부품 | 조준점·명중 표시를 하나씩 켜고 끔 | 확인 [QHCWACC] |
| GHD-132 | HUD 투명도 조절 — HUD opacity | 부품 | 버튼·표시를 반투명하게 해 시야 확보 | 확인 [QHPUBGUI] · 대조 [QHWR61] |
| GHD-133 | HUD 크기 조절 — HUD scale | 부품 | 표시 크기를 키우거나 줄임 | 확인 [QHGAGRES] · 대조 [QHXAG101] |
| GHD-134 | HUD 경계 조절 — HUD bounds | 부품 | 넓은 화면에서 HUD를 안쪽으로 모음 | 확인 [QHCWACC] · 대조 [UNRSAFE] |
| GHD-135 | HUD 색 바꾸기 — HUD color | 부품 | 표시 색을 배경에 맞게 바꿈 | 확인 [QHXAG102] |
| GHD-136 | HUD 편집 모드 — HUD layout editor | 흐름 | 표시 위치를 끌어 옮기고 저장함 | 확인 [QHGAGREA] · 대조 [QHWR61] |
| GHD-137 | 배치 틀 고르기 — layout presets | 부품 | 미리 만든 몇 가지 배치 중에서 고름 | 확인 [QHGAGREA] |
