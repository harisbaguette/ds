'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function HamburgerMenu({items=navigationLinks,label='메뉴',current}){return (<nav className="ds-nav ds-hamburger-menu" aria-label="주 탐색"><NavigationDisclosure label={label}><NavigationLinks items={items} current={current}/></NavigationDisclosure></nav>);}
