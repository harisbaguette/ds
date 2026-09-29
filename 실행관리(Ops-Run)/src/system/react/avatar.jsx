import React from 'react';
// A person's face spot with the presence dot on its edge. Without a photo it shows the first letter of the name.
export function Avatar({ name, online = true }) {
  return <span className="ds-avatar" role="img" aria-label={`${name}, ${online ? '접속 중' : '자리 비움'}`}><span aria-hidden="true">{[...name][0]}</span>{online && <i aria-hidden="true" />}</span>;
}
