'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function MultiToggleNavigation({items=navigationGroups,label='전체 탐색',current}){return (<nav className="ds-nav ds-multi-toggle-navigation" aria-label={label}><NavigationTree items={items} current={current} toggle/></nav>);}
