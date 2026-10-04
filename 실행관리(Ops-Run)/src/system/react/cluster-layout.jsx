import React from 'react';

export function ClusterLayout({children,aside,secondary,media,secondaryMedia,header,footer,label="줄바꿈 묶음",columns=3,className='',...props}){
 return <div {...props} className={'ds-layout ds-cluster-layout '+className} data-columns={Math.min(6,Math.max(2,Math.trunc(Number(columns))||3))}>{children ?? <><span>숲</span><span>산책</span><span>기록</span><span>계절</span></>}</div>;
}
