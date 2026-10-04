'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function JourneyNavigation({items=navigationSteps,current=1,label='신청 전체 과정'}){return (<nav className="ds-nav ds-journey-navigation" aria-label={label}><ol>{items.map((item,i)=><li key={i} aria-current={i===current?'step':undefined}><NavigationDisclosure label={(i+1)+'. '+item.label}><p>{item.description}</p>{item.href&&<a href={safeLink(item.href)}>{item.label}으로 이동</a>}</NavigationDisclosure></li>)}</ol></nav>);}
