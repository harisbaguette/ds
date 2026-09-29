import React from 'react';
import { ResultGrid } from './result-grid.jsx';
// The same records as one-line rows, for comparing names quickly.
export function ResultList(props) { return <ResultGrid {...props} className="ds-result-list" />; }
