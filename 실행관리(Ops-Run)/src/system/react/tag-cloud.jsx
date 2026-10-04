'use client';
import React from 'react';
import {safeLink} from './safe-link.jsx';
import {navigationLinks,navigationGroups,navigationSteps,NavigationLinks,NavigationTree,NavigationDisclosure,AnchorJump} from './navigation-primitives.jsx';
export function TagCloud({items=[{label:'숲',href:'#forest',count:24},{label:'물가',href:'#river',count:9},{label:'정원',href:'#garden',count:4}],label='주제 탐색'}){const maximum=Math.max(1,...items.map(i=>Number(i.count)||0));return (<nav className="ds-nav ds-tag-cloud" aria-label={label}><ul>{items.map((item,i)=><li key={i} data-rank={Math.min(3,Math.max(1,Math.ceil((Number(item.count)||0)/maximum*3)))}><a href={safeLink(item.href)}>{item.label} <span>{Math.max(0,Number(item.count)||0)}건</span></a></li>)}</ul></nav>);}
