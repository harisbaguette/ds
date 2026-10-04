'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function StepList({items=navigationSteps,current=1,label='신청 단계'}){return (<nav className="ds-nav ds-step-list" aria-label={label}><ol>{items.map((item,i)=><li key={i} data-complete={i<current} aria-current={i===current?'step':undefined}><span className="ds-nav-step-number" aria-hidden="true">{i+1}</span><div>{item.href?<a href={safeLink(item.href)}>{item.label}</a>:<span>{item.label}</span>}{i<current&&<span className="ds-nav-step-state">완료</span>}</div></li>)}</ol></nav>);}
