'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function NavigationProgress({value,label='페이지 불러오는 중',loading=true}){return (<div className="ds-nav ds-navigation-progress" hidden={!loading}><progress aria-label={label} max={100} value={value==null?undefined:Math.min(100,Math.max(0,Number(value)||0))}/></div>);}
