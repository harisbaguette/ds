'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function UtilityHeader({title='산책 기록',items=navigationLinks,utilities=[{label:'로그인',href:'#login'},{label:'도움말',href:'#help'}],current}){return (<header className="ds-nav ds-utility-header"><nav className="ds-nav-utility" aria-label="보조 탐색"><NavigationLinks items={utilities}/></nav><div className="ds-site-header"><strong className="ds-nav-brand">{title}</strong><nav aria-label="주 탐색"><NavigationLinks items={items} current={current}/></nav></div></header>);}
