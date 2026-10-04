'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function NavigationRail({items=navigationLinks,label='작업 탐색',current}){return (<nav className="ds-nav ds-navigation-rail" aria-label={label}><NavigationLinks items={items} current={current} rail/></nav>);}
