'use client';
import React,{useId} from 'react';
import {AnchorJump,NavigationLinks,navigationLinks} from './navigation-primitives.jsx';
export function FooterAnchor({footerId,items=navigationLinks,children}){const id=useId();return <div className="ds-nav ds-footer-anchor"><AnchorJump targetId={footerId??id}>하단 메뉴로 이동</AnchorJump>{children}{!footerId&&<footer id={id} tabIndex={-1}><nav aria-label="하단 메뉴"><NavigationLinks items={items}/></nav></footer>}</div>;}
