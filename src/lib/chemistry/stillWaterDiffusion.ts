/** CL-0037: reflecting finite-volume diffusion in a magnified closed microcell.
 * No injection transient, stirring, buoyant convection, reaction or calibrated dye optics.
 * Radius and viscosity are reference teaching parameters, not measured food-dye data.
 */
export const diffusionReference={cells:24,boltzmannJK:1.380649e-23,temperatureK:298.15,viscosityPaS:.00089,massMicrogram:.02} as const;
const N=diffusionReference.cells;
const basis=Array.from({length:N},(_,k)=>Array.from({length:N},(_,i)=>Math.cos(Math.PI*k*(i+.5)/N)));
const raw=Array.from({length:N},(_,i)=>Math.exp(-.5*(((i+.5)/N-.5)/.08)**2));
const norm=raw.reduce((a,b)=>a+b,0),initial=raw.map(x=>x/norm);
const coefficients=basis.map(b=>2/N*b.reduce((v,x,i)=>v+x*initial[i],0));
export function stillWaterDiffusion(sideMM=2,radiusNM=.7,timeS=0){
 if(!Number.isFinite(sideMM)||sideMM<1||sideMM>4||!Number.isFinite(radiusNM)||radiusNM<.5||radiusNM>1.5||!Number.isFinite(timeS)||timeS<0||timeS>3600)throw new RangeError('Side 1–4 mm, effective radius 0.5–1.5 nm and time 0–3600 s required');
 const r=diffusionReference,D=r.boltzmannJK*r.temperatureK/(6*Math.PI*r.viscosityPaS*radiusNM*1e-9),diffusivityMM2S=D*1e6,dx=sideMM/N;
 const decay=coefficients.map((a,k)=>a*Math.exp(-4*diffusivityMM2S/dx**2*Math.sin(Math.PI*k/(2*N))**2*timeS));
 const weights=timeS===0?initial.slice():Array.from({length:N},(_,i)=>Math.max(0,1/N+decay.reduce((v,a,k)=>k?v+a*basis[k][i]:v,0)));
 const sum=weights.reduce((a,b)=>a+b,0);for(let i=0;i<N;i++)weights[i]/=sum;
 const variance=weights.reduce((v,p,i)=>v+p*((i+.5)*dx-sideMM/2)**2,0)+dx**2/12;
 const initialVariance=initial.reduce((v,p,i)=>v+p*((i+.5)*dx-sideMM/2)**2,0)+dx**2/12;
 const excess=N*weights.reduce((v,p)=>v+(p-1/N)**2,0),cv=Math.sqrt(3*excess+3*excess**2+excess**3);
 return{sideMM,radiusNM,timeS,diffusivityM2S:D,diffusivityMM2S,dx,weights,massMicrogram:r.massMicrogram,volumeMicrolitre:sideMM**3,meanConcentration:r.massMicrogram/sideMM**3,peakConcentration:r.massMicrogram*Math.max(...weights)**3/dx**3,axisVarianceMM2:variance,radialRmsMM:Math.sqrt(3*variance),initialVarianceMM2:initialVariance,freeSpaceVarianceMM2:initialVariance+2*diffusivityMM2S*timeS,coefficientOfVariation:cv,nearlyUniform:cv<=.05};
}
export function diffusionVoxelConcentrations(sideMM=2,radiusNM=.7,timeS=0){const s=stillWaterDiffusion(sideMM,radiusNM,timeS),field=new Float32Array(N**3);for(let z=0;z<N;z++)for(let y=0;y<N;y++)for(let x=0;x<N;x++)field[x+N*(y+N*z)]=s.massMicrogram*s.weights[x]*s.weights[y]*s.weights[z]/s.dx**3;return field}
export function stillWaterGuide(t:number){if(!Number.isFinite(t)||t<0||t>110)throw new RangeError('Guide time 0–110 seconds required');return{timeS:Math.min(1800,Math.max(0,(t-10)*22.5)),caption:t<10?'A magnified microcell contains a concentrated central dye spot. Predict where colour will spread without stirring.':t<45?'Diffusion spreads dye down concentration gradients. The clock is accelerated: this is a millimetre-scale cell, not a full beaker mixing in seconds.':t<90?'The concentrated region broadens while the total dye stays constant. Closed walls prevent dye leaving; no stirring or convection is modelled.':'Compare the concentration pattern with the start. Record elapsed model time, cell size and concentration spread. Nearly uniform colour does not mean the dye disappeared.'}}
