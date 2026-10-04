import React from 'react';
import {Breadcrumb} from './breadcrumb.jsx';
import {NavigationDisclosure} from './navigation-primitives.jsx';
export function BreadcrumbDropdown({items,label='현재 경로'}){return <div className="ds-nav ds-breadcrumb-dropdown"><NavigationDisclosure label={label}><Breadcrumb items={items}/></NavigationDisclosure></div>;}
