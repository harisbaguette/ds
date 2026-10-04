'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function MegaMenu({groups=navigationGroups,label='전체 탐색',current}){return (<nav className="ds-nav ds-mega-menu" aria-label={label}>{groups.map((group,i)=><NavigationDisclosure key={i} label={group.label}><div className="ds-nav-mega-body"><a href={safeLink(group.href)}>{group.label} 전체</a><NavigationTree items={group.children??[]} current={current}/></div></NavigationDisclosure>)}</nav>);}
