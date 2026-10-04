'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function PageHeader({title='산책 계획',description='다가오는 일정을 확인하세요.',items=navigationLinks,actions,headingLevel=1}){const Heading=headingLevel===2?'h2':'h1';return (<header className="ds-nav ds-page-header"><nav aria-label="상위 경로"><NavigationLinks items={items}/></nav><div><Heading>{title}</Heading>{actions}</div><p>{description}</p></header>);}
