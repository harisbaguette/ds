'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function SiteFooter({items=navigationLinks,title='산책 기록',information='함께 걷고 기록합니다.'}){return (<footer className="ds-nav ds-site-footer"><strong>{title}</strong><nav aria-label="하단 탐색"><NavigationLinks items={items}/></nav><p>{information}</p></footer>);}
