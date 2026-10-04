'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function OverflowNavigation({items=navigationLinks,label='주 탐색',current}){return (<nav className="ds-nav ds-overflow-navigation" aria-label={label} tabIndex={0}><NavigationLinks items={items} current={current}/></nav>);}
