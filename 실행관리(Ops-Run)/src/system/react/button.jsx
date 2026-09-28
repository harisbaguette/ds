import React from 'react';
export function Button({ children, look, variant = 'primary', size = 'md', loading = false, disabled, className = '', type = 'button', ...props }) {
  return <button {...props} type={type} className={`ds-button ${className}`} data-variant={variant} data-size={size} data-look={look} disabled={disabled || loading} aria-busy={loading || undefined}>
    {loading && <span className="ds-spinner" aria-hidden="true" />}{children}
  </button>;
}
