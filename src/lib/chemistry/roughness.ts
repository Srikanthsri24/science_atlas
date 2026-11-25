/** Synthetic surface topographies in micrometres over a 10 mm square.
 * Chosen teaching profiles, not measured material data or a standards-compliant profilometer.
 * No friction or tactile sensation is inferred from height statistics.
 */
export const roughnessSamples={glass:{name:'Polished-glass model'},wood:{name:'Wood-grain model'},abrasive:{name:'Abrasive-sheet model'}}as const;
export type RoughnessSample=keyof typeof roughnessSamples;
export type ScanAxis='x'|'z';
// Deterministic, jittered grain caps: original synthetic geometry, not a material scan.
const grainNoise=(x:number,z:number,c:number)=>{const v=Math.sin(x*127.1+z*311.7+c*74.7)*43758.5453;return v-Math.floor(v)};
const grains=Array.from({length:25*25},(_,i)=>{const ix=Math.floor(i/25)-2,iz=i%25-2,angle=grainNoise(ix,iz,5)*Math.PI*2,sx=.09+grainNoise(ix,iz,3)*.08,sz=.09+grainNoise(ix,iz,4)*.08;return{x:(ix+.5+(grainNoise(ix,iz,0)-.5)*.65)*.5,z:(iz+.5+(grainNoise(ix,iz,1)-.5)*.65)*.5,amplitude:8+grainNoise(ix,iz,2)*12,cos:Math.cos(angle),sin:Math.sin(angle),sx2:sx*sx,sz2:sz*sz}});
export function surfaceHeight(sample:RoughnessSample,xMm:number,zMm:number){
 if(!Object.hasOwn(roughnessSamples,sample)||![xMm,zMm].every(Number.isFinite)||xMm<0||xMm>10||zMm<0||zMm>10)throw new RangeError('Choose a known model and coordinates 0–10 mm');
 const tau=2*Math.PI;
 if(sample==='glass')return .12*Math.sin(tau*xMm/1.5)+.04*Math.cos(tau*zMm/2);
 if(sample==='wood')return 2*Math.sin(tau*zMm/.8)+.4*Math.sin(tau*xMm/1.7)+.3*Math.sin(tau*(xMm+zMm)/.5);
 let cap=0;const ix=Math.floor(xMm/.5),iz=Math.floor(zMm/.5);for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){const g=grains[(ix+dx+2)*25+iz+dz+2],rx=xMm-g.x,rz=zMm-g.z,u=rx*g.cos+rz*g.sin,v=-rx*g.sin+rz*g.cos;cap=Math.max(cap,g.amplitude*Math.exp(-.5*(u*u/g.sx2+v*v/g.sz2)))}return cap-4;
}
export function profileStatistics(heightsUm:readonly number[]){
 if(heightsUm.length<2||heightsUm.length>501||heightsUm.some(v=>!Number.isFinite(v)))throw new RangeError('Use 2–501 finite height readings');
 const count=heightsUm.length,meanUm=heightsUm.reduce((s,v)=>s+v,0)/count,deviations=heightsUm.map(v=>v-meanUm),meanAbsoluteDeviationUm=deviations.reduce((s,v)=>s+Math.abs(v),0)/count,rmsDeviationUm=Math.sqrt(deviations.reduce((s,v)=>s+v*v,0)/count),peakToValleyUm=Math.max(...heightsUm)-Math.min(...heightsUm);
 return{count,meanUm,meanAbsoluteDeviationUm,rmsDeviationUm,peakToValleyUm};
}
export function roughnessProfile(sample:RoughnessSample,lineMm=5,axis:ScanAxis='x',count=101){
 if(!Number.isFinite(lineMm)||lineMm<0||lineMm>10||!['x','z'].includes(axis)||!Number.isInteger(count)||count<11||count>501)throw new RangeError('Use line 0–10 mm, x/z direction and 11–501 samples');
 const readings=Array.from({length:count},(_,i)=>{const alongMm=10*i/(count-1);return{alongMm,heightUm:surfaceHeight(sample,axis==='x'?alongMm:lineMm,axis==='x'?lineMm:alongMm)}}),statistics=profileStatistics(readings.map(r=>r.heightUm));
 return{sample,lineMm,axis,lengthMm:10,spacingMm:10/(count-1),readings,...statistics};
}
export function roughnessFrame(time:number){if(!Number.isFinite(time))throw new RangeError('Finite lesson time required');const t=Math.max(0,Math.min(110,time)),sample:RoughnessSample=t<40?'glass':t<70?'wood':'abrasive',start=t<40?10:t<70?40:70,progress=Math.max(0,Math.min(1,(t-start)/25));const caption=t<10?'Identify the magnified surface, scan probe and height profile. Vertical height will be exaggerated to reveal small details.':t<40?'Scan the chosen glass model. Compare the small height deviations with the other selected surfaces.':t<70?'Scan the wood-grain model along the same line. Direction matters; a different direction can reveal different height variations.':t<100?'Scan the abrasive model. Record a complete profile before comparing its average deviation with the other samples.':'Compare equal scan lengths, spacing and direction. These synthetic height profiles do not measure friction or how a real surface feels.';return{sample,progress,scanMm:progress*10,complete:progress===1,caption};}
