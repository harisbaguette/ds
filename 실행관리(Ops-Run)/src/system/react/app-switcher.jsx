'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function AppSwitcher({items=navigationLinks,label='앱 전환',current}){return (<nav className="ds-nav ds-app-switcher" aria-label="연결된 앱"><NavigationDisclosure label={label}><NavigationLinks items={items} current={current} rail/></NavigationDisclosure></nav>);}
