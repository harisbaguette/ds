import React from 'react';
// One block per step, so progress reads as a count (3/5).
export function StepBar({ step = 1, steps = 5, label = '단계' }) {
  return <div className="ds-progress-block ds-step-bar" style={{ '--steps': steps }}><div className="ds-progress-label"><span>{label}</span><span>{step}/{steps}</span></div><progress className="ds-progress" value={step} max={steps} aria-label={label}>{step}/{steps}</progress></div>;
}
