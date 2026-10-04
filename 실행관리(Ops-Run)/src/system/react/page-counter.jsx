'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function PageCounter({page=1,total=8,label='현재 쪽'}){const count=Math.min(10000,Math.max(1,Math.trunc(Number(total))||1)),current=Math.min(count,Math.max(1,Math.trunc(Number(page))||1));return (<output className="ds-nav ds-page-counter" aria-label={label}>{current} / {count}</output>);}
