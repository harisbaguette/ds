'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function SiteHeader({title='산책 기록',items=navigationLinks,current,home='#home'}){return (<header className="ds-nav ds-site-header"><a className="ds-nav-brand" href={safeLink(home)}>{title}</a><nav aria-label="주 탐색"><NavigationLinks items={items} current={current}/></nav></header>);}
