/** CL-0075: passive-tracer diffusion in matched sealed channels.
 * Conservative 160-cell, no-flux finite-volume model; generic chosen D values,
 * not measured properties of a named substance. No convection or reactions.
 */
export type DiffusionClock = 'equal' | 'matched';
export interface GasLiquidInputs {
 lengthMm:number; areaMm2:number; massUg:number;
 gasDiffusivityM2S:number; liquidDiffusivityM2S:number;
 mode:DiffusionClock; timeSeconds:number; scaledTime:number; gateClosed:boolean;
}
export const defaultGasLiquid:GasLiquidInputs={lengthMm:20,areaMm2:100,massUg:1,gasDiffusivityM2S:1e-5,liquidDiffusivityM2S:1e-9,mode:'equal',timeSeconds:0,scaledTime:0,gateClosed:true};
export const diffusionCells=160;
const N=diffusionCells;
const modes=Array.from({length:N/2},(_,j)=>{
 const k=2*j+1,basis=Array.from({length:N/2},(_,i)=>Math.cos(Math.PI*k*(i+.5)/N));
 return {basis,a:4/(N*N)*basis.reduce((a,b)=>a+b,0),lambda:4*N*N*Math.sin(Math.PI*k/(2*N))**2};
});
export function validateGasLiquid(q:GasLiquidInputs){
 for(const [v,lo,hi] of [[q.lengthMm,10,30],[q.areaMm2,25,100],[q.massUg,.5,2],[q.gasDiffusivityM2S,5e-6,2e-5],[q.liquidDiffusivityM2S,5e-10,2e-9],[q.timeSeconds,0,120],[q.scaledTime,0,.5]])if(!Number.isFinite(v)||v<lo||v>hi)throw new RangeError('Diffusion preparation outside supported range');
 if(!['equal','matched'].includes(q.mode)||typeof q.gateClosed!=='boolean')throw new RangeError('Known clock and partition state required');
}
export function diffusionWeights(theta:number){
 if(!Number.isFinite(theta)||theta<0)throw new RangeError('Nonnegative dimensionless time required');
 if(theta===0)return Array.from({length:N},(_,i)=>i<N/2?2/N:0);
 const w=Array(N).fill(0) as number[],terms=modes.map(m=>m.a*Math.exp(-m.lambda*theta));
 for(let i=0;i<N/2;i++){
  const raw=1/N+modes.reduce((s,m,j)=>s+terms[j]*m.basis[i],0);
  if(raw<1/N-1e-10||raw>2/N+1e-10)throw new Error('Diffusion spectral bounds violated');
  w[i]=Math.max(1/N,Math.min(2/N,raw));w[N-1-i]=2/N-w[i];
 }
 return w;
}
const contrast=(theta:number)=>N*modes.reduce((s,m)=>s+m.a*Math.exp(-m.lambda*theta)*m.basis[0],0);
let lo=0,hi=1;for(let i=0;i<64;i++){const mid=(lo+hi)/2;if(contrast(mid)>.05)lo=mid;else hi=mid;}
export const diffusionUniformTheta=(lo+hi)/2;
export function gasLiquidState(q:GasLiquidInputs,medium:'gas'|'liquid'){
 validateGasLiquid(q);if(!['gas','liquid'].includes(medium))throw new RangeError('Known medium required');
 const diffusivityM2S=medium==='gas'?q.gasDiffusivityM2S:q.liquidDiffusivityM2S,D=diffusivityM2S*1e6;
 const seconds=q.mode==='equal'?q.timeSeconds:q.scaledTime*q.lengthMm**2/D;
 const theta=q.gateClosed?0:D*seconds/q.lengthMm**2,weights=diffusionWeights(theta),dx=q.lengthMm/N;
 const concentrationsUgMl=weights.map(w=>q.massUg*w/(q.areaMm2*dx)*1000);
 const rightMassUg=q.massUg*weights.slice(N/2).reduce((a,b)=>a+b,0),leftMassUg=q.massUg-rightMassUg;
 // Finite-grid face flux; the ideal continuum step has singular initial flux.
 const gridFluxUgMm2S=q.gateClosed?0:D*(concentrationsUgMl[N/2-1]-concentrationsUgMl[N/2])/1000/dx;
 const meanUgMl=1000*q.massUg/(q.areaMm2*q.lengthMm),maxRelativeDeviation=Math.max(...concentrationsUgMl.map(c=>Math.abs(c/meanUgMl-1)));
 return {medium,diffusivityM2S,seconds,theta,weights,concentrationsUgMl,leftMassUg,rightMassUg,totalMassUg:leftMassUg+rightMassUg,meanUgMl,gridFluxUgMm2S,transferUgS:gridFluxUgMm2S*q.areaMm2,maxRelativeDeviation,nearlyUniform:maxRelativeDeviation<=.05,uniformSeconds:q.gateClosed?null:diffusionUniformTheta*q.lengthMm**2/D,volumeMl:q.areaMm2*q.lengthMm/1000,dxMm:dx};
}
export function gasLiquidGuide(t:number){
 if(!Number.isFinite(t)||t<0||t>120)throw new RangeError('Guide lasts120seconds');
 if(t<10)return{mode:'equal' as const,timeSeconds:0,scaledTime:0,gateClosed:true,caption:'Two sealed channels begin with tracer in the left half. The central partition prevents exchange.'};
 if(t<50)return{mode:'equal' as const,timeSeconds:(t-10)/2,scaledTime:0,gateClosed:false,caption:'Equal physical clocks: gas spreads faster for the chosen diffusion coefficients. Colour represents concentration, not visible gas.'};
 if(t<60)return{mode:'matched' as const,timeSeconds:0,scaledTime:0,gateClosed:true,caption:'Reset for a second trial. Next, compare matching diffusion progress using different physical clocks.'};
 return{mode:'matched' as const,timeSeconds:0,scaledTime:Math.min(.4,(t-60)*.008),gateClosed:false,caption:'Matched Dt/L² gives identical concentration profiles. Read both physical clocks: this is not an equal-time comparison.'};
}
