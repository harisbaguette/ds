'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function SiteMap({items=navigationGroups,title='사이트 전체 지도',current}){return (<nav className="ds-nav ds-site-map" aria-label={title}><h2>{title}</h2><NavigationTree items={items} current={current}/></nav>);}
