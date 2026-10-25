import{universePresentation}from'../universe/stories';import{isUniverseKind}from'../../lib/universeTypes';import{universeSpecs}from'../../lib/universeSpecs';
import type{Kind,Parameters,SceneProps}from'./types';import{defaults,planets}from'./types';import{storyState,chapterAt,chapterStart}from'./stories';import{falling,reaction}from'../../lib/batchModels';
export const demonstrationDuration=30;
export const staticStudies:Kind[]=['cell','ionic','lens','ph','mitosis','mirrors','covalent','enzyme','genetics'];
export const motionDescriptions:Record<Kind,string>={...Object.fromEntries(Object.entries(universeSpecs).map(([k,v])=>[k,v.description])) as Record<import('../../lib/universeTypes').UniverseKind,string>,pendulum:'Follow the bob, changing velocity and energy exchange.',circuit:'Follow charge markers around the closed circuit; watch the switch and source.',atom:'Follow symbolic electron markers and compare the shells.',cell:'Follow a labelled cargo packet from the nucleus through ER and Golgi to the membrane.',solar:'Follow orbital motion; the time scale is compressed and stated.',refraction:'Follow wavefront markers into the boundary and along reflected/transmitted rays.',photosynthesis:'Follow light, water, carbon and product markers through the chloroplast.',breathing:'Follow lung expansion, diaphragm movement and airflow. Lung-shape motion is amplified; numerical values are unchanged.',buoyancy:'Dip and release the block; compare the changing force arrows.',ionic:'Follow the transfer highlight, ion movement and lattice assembly.',freefall:'Watch one complete fall, then a clearly marked repeated release.',spring:'Watch the mass move while the spring compresses and extends.',waves:'Follow a crest to the right and the gold material point vertically.',lens:'Follow light packets from the object through the lens to the image.',induction:'Watch the coil rotate and the signed voltage change with flux.',gas:'Watch particles and the piston; compare volume, temperature and pressure.',kinetics:'Watch reactant markers become product as concentration falls.',ph:'Watch dilution, the pH pointer and the changing concentration readouts.',diffusion:'Follow representative solute traffic across the membrane as the gradient falls.',mitosis:'Watch chromosome alignment, sister separation and daughter-cell formation.',projectile:'Follow a complete launch and the changing velocity components.',mirrors:'Follow incident and reflected light packets; dashed lines remain construction lines.',bernoulli:'Follow tracers accelerating through the constriction and the pressure heads.',capacitor:'Follow charge around the wire and onto plates; no charge crosses the gap.',covalent:'Watch atoms approach, shared pairs appear and the selected bonds stretch.',chromatography:'Watch the front rise and the mixture separate into moving bands.',equilibrium:'Watch conversion in both directions while the two rates approach balance.',enzyme:'Follow a representative binding/release cycle and the initial-rate curve.',genetics:'Follow one allele from each parent into each Punnett pairing.',neuron:'Follow the voltage pulse and the refractory region along the axon.'};
const noop=()=>{};
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;
const smooth=(u:number)=>u*u*(3-2*u);
export function animationFrame(kind:Kind,storyTime:number,elapsed:number,baseParameters?:Partial<Parameters>):SceneProps&{action:string;index:number;loopPhase:number}{const chapter=chapterAt(kind,storyTime),source=storyState(kind,storyTime),p={...source.p},beat=((elapsed%6)+6)%6/6,travel=smooth(beat),osc=(1-Math.cos(beat*Math.PI*2))/2;let sceneTime=source.sceneTime;
 switch(kind){
 case'pendulum':sceneTime=elapsed;break;
 case'circuit':sceneTime=elapsed*2;p.closed=chapter.index===0?beat>.3:true;break;
 case'atom':sceneTime=elapsed*1.8;break;
 case'cell':sceneTime=elapsed*2;break;
 case'solar':{const planet=planets.find(v=>v.name===chapter.chapter.focus);p.daysPerSecond=planet?planet.period/6:200;sceneTime=elapsed;break}
 case'refraction':sceneTime=elapsed*2;break;
 case'photosynthesis':sceneTime=elapsed*2.5;break;
 case'breathing':sceneTime=elapsed;p.breathingRate=12;break;
 case'buoyancy':if(chapter.index===1)p.immersion=osc*100;if(chapter.index>=3)sceneTime=beat*12;break;
 case'ionic':if(chapter.index<2)p.ionized=beat>=.58;if(chapter.index===2)p.separation=mix(.7,.282,travel);if(chapter.index===3)p.separation=mix(.2,.282,osc);break;
 case'freefall':{const f=falling(0,p.fallHeight,p.fallMass,p.fallArea,p.airDrag);sceneTime=beat*f.impactTime*1.18;break}
 case'spring':sceneTime=elapsed;break;
 case'waves':sceneTime=elapsed;break;
 case'lens':sceneTime=elapsed;break;
 case'induction':sceneTime=elapsed*.8;break;
 case'gas':sceneTime=elapsed*2;if(chapter.index===1)p.gasVolume=mix(2,1,osc);break;
 case'kinetics':{const rate=reaction(0,p.reactionTemp,p.concentration,p.catalyst);sceneTime=beat*rate.halfLife*3;break}
 case'ph':p.dilution=10**(travel*3);break;
 case'diffusion':sceneTime=beat*45;break;
 case'mitosis':p.divisionProgress=Math.min(99.999,chapter.index*20+travel*19.999);break;
 case'projectile':sceneTime=beat*2*p.launchSpeed*Math.sin(p.launchAngle*Math.PI/180)/p.launchGravity*1.15;break;
 case'mirrors':sceneTime=elapsed;break;
 case'bernoulli':sceneTime=elapsed*2;break;
 case'capacitor':sceneTime=beat*5*p.rcResistance*1000*p.rcCapacitance*1e-6;break;
 case'covalent':if(chapter.index>0)p.bondStretch=(chapter.index===4?12:8)*Math.sin(beat*2*Math.PI);break;
 case'chromatography':sceneTime=beat*10/p.frontSpeed;break;
 case'equilibrium':sceneTime=beat*40;break;
 case'enzyme':if(chapter.index===0)p.substrate=2;if(chapter.index===2||chapter.index===4)p.substrate=mix(2,20,osc);break;
 case'genetics':p.geneticReveal=chapter.index<2?0:Math.min(4,Math.floor(beat*5));break;
 case'neuron':sceneTime=beat*(100/p.nerveSpeed+4);break;
 }
 // Manual parameters are accepted for the standalone animation preview, if supplied.
 if(isUniverseKind(kind)){const v=universePresentation(kind,chapter.index,chapter.progress,elapsed);Object.assign(p,v.p);sceneTime=v.time;}
 if(baseParameters)Object.assign(p,baseParameters);
 return{kind,p,time:sceneTime,labels:true,selected:'',onSelect:noop,focus:source.focus,phase:beat,guided:true,presentationTime:elapsed,animated:true,chapterIndex:chapter.index,action:motionDescriptions[kind],index:chapter.index,loopPhase:beat};
}
export function demonstrationFrame(kind:Kind,time:number){const i=Math.min(4,Math.floor(time/6)),u=Math.min(1,(time-i*6)/6),chapter=chapterAt(kind,chapterStart(kind,i)).chapter;return animationFrame(kind,chapterStart(kind,i)+u*chapter.duration,time)}
export function canAutoPlay(){return typeof window==='undefined'||!window.matchMedia('(prefers-reduced-motion: reduce)').matches}

export function bindingMotion(phase:number,inhibited:boolean){const u=Math.max(0,Math.min(1,phase));if(!inhibited)return{substrateX:u<.35?mix(2.3,1.15,u/.35):u<.65?1.15:mix(1.15,2.3,(u-.65)/.35),product:u>=.65,inhibitorY:1.15,inhibitorX:1.2};return{substrateX:u<.45?2.3:u<.65?mix(2.3,1.15,(u-.45)/.2):u<.8?1.15:mix(1.15,2.3,(u-.8)/.2),product:u>=.8,inhibitorY:u<.2?mix(1.15,0,u/.2):u<.4?0:mix(0,1.15,Math.min(1,(u-.4)/.2)),inhibitorX:1.2}}
