'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function DirectSubnav({items=navigationGroups,label='바로 탐색',current}){return (<nav className="ds-nav ds-direct-subnav" aria-label={label}><NavigationLinks items={items} current={current} skipParents/></nav>);}
