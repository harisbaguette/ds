'use client';
import React,{useEffect,useId,useRef,useState} from 'react';
const defaults=['출발 전','산책 코스','돌아오는 길'].map(title=>({title,body:'물과 편한 신발을 준비하세요. 동쪽 입구에서 시작해 나무와 꽃을 살펴보며 천천히 걸어갑니다. 물가 쉼터에서 잠시 쉬고 함께 기록을 나눕니다.'}));
export function ScrollspyNavigation({items=defaults,label='이 글의 순서',onCurrentChange}){
 const prefix=useId(),scroll=useRef(null),[current,setCurrent]=useState(0),active=useRef(0),callback=useRef(onCurrentChange);callback.current=onCurrentChange;
 const select=index=>{if(active.current!==index){active.current=index;setCurrent(index);callback.current?.(index);}};
 const update=()=>{const host=scroll.current,sections=[...host.children];let next=0;for(let i=0;i<sections.length;i++)if(sections[i].offsetTop<=host.scrollTop+20)next=i;if(host.scrollHeight>host.clientHeight+1&&host.scrollTop>=host.scrollHeight-host.clientHeight-1)next=sections.length-1;select(next);};
 useEffect(()=>{update();const observer=new ResizeObserver(update);observer.observe(scroll.current);return()=>observer.disconnect();},[items]);
 const jump=(event,index)=>{event.preventDefault();const node=scroll.current.children[index];scroll.current.scrollTop=node.offsetTop;node.focus({preventScroll:true});select(index);};
 return <div className="ds-nav ds-scrollspy-navigation"><nav aria-label={label}><ol>{items.map((item,i)=><li key={item.id??i}><a href={'#'+encodeURIComponent(prefix+'-'+i)} aria-current={i===current?'location':undefined} onClick={event=>jump(event,i)}>{item.title}</a></li>)}</ol></nav><div ref={scroll} className="ds-nav-scroll ds-nav-spy-scroll" tabIndex={0} role="region" aria-label="문서 내용" onScroll={update}>{items.map((item,i)=><section className="ds-nav-spy-section" key={item.id??i} id={prefix+'-'+i} tabIndex={-1}><h2>{item.title}</h2><p>{item.body}</p></section>)}</div></div>;
}
