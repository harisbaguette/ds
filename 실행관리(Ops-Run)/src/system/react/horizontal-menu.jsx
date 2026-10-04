'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function HorizontalMenu({items=navigationLinks,label='주 탐색',current}){return (<nav className="ds-nav ds-horizontal-menu" aria-label={label}><NavigationLinks items={items} current={current}/></nav>);}
