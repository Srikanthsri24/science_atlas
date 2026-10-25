import{useEffect,useRef,useState}from'react';
/** One clock drives the scene, captions and progress. Pauses while the tab is hidden. */
export function useClock(duration:number,options:{autoPlay?:boolean;loop?:boolean}={}){const[time,setTime]=useState(0),[playing,setPlaying]=useState(Boolean(options.autoPlay)),[speed,setSpeed]=useState(1);const last=useRef(0);
 useEffect(()=>{if(!playing)return;let raf=0,accumulator=0;last.current=performance.now();const tick=(now:number)=>{const dt=Math.min((now-last.current)/1000,.1);last.current=now;if(document.visibilityState==='visible'){accumulator+=dt;if(accumulator>=1/30){const elapsed=accumulator*speed;accumulator=0;setTime(t=>options.loop?(t+elapsed)%duration:Math.min(duration,t+elapsed))}}raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf)},[playing,speed,duration,options.loop]);
 useEffect(()=>{if(time>=duration&&!options.loop)setPlaying(false)},[time,duration,options.loop]);
 const seek=(t:number)=>{setTime(Math.max(0,Math.min(duration,t)));setPlaying(false)};
 return{time,playing,speed,setSpeed,seek,setPlaying,replay:()=>{setTime(0);setPlaying(true)},toggle:()=>{if(time>=duration)setTime(0);setPlaying(p=>!p)}};}
