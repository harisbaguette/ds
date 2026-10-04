'use client';
import React from 'react';
import {Drawer} from './drawer.jsx';
import {NavigationLinks,navigationLinks} from './navigation-primitives.jsx';
export function NavigationDrawer({items=navigationLinks,title='메뉴',trigger='메뉴 열기',current,fullscreen=false}){return <div className={'ds-nav ds-navigation-drawer'+(fullscreen?' ds-fullscreen-navigation':'')}><Drawer title={title} trigger={trigger}><nav aria-label={title} onClick={e=>{if(e.target.closest('a'))e.currentTarget.closest('dialog')?.close();}}><NavigationLinks items={items} current={current}/></nav></Drawer></div>;}
