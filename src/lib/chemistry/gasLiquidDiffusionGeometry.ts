import{gasLiquidState,type GasLiquidInputs}from'./gasLiquidDiffusion';
function uniform(seed:number){let x=seed|0;x=Math.imul(x^(x>>>16),0x45d9f3b);x=Math.imul(x^(x>>>16),0x45d9f3b);return((x^(x>>>16))>>>0)/4294967296;}
function normal(seed:number){return Math.sqrt(-2*Math.log(Math.max(1e-12,uniform(seed))))*Math.cos(2*Math.PI*uniform(seed^0x736ab921));}
/** Truncated Levy–Ciesielski Brownian path on theta ∈ [0,32].
 * Finite representative tracers are not molecules and do not define continuum mass.
 * 28 levels; transverse and longitudinal increments use independent hashed seeds.
 */
export function diffusionBrownian(theta:number,seed:number){if(!Number.isFinite(theta)||theta<0||theta>32)throw new RangeError('Brownian horizon0–32');const u=theta/32;let w=normal(seed)*u;for(let n=0;n<28;n++){const z=u*2**n,k=Math.floor(z),r=z-k;w+=2**(-(n+2)/2)*normal(seed^Math.imul(n+1,73856093)^Math.imul(k+1,19349663))*2*Math.min(r,1-r);}return Math.sqrt(32)*w;}
export function reflectDiffusion(x:number,length:number){const r=((x%(2*length))+2*length)%(2*length);return r<=length?r:2*length-r;}
export function gasLiquidTracers(q:GasLiquidInputs,medium:'gas'|'liquid',count=64){const s=gasLiquidState(q,medium),theta=s.diffusivityM2S*1e6*s.seconds/q.lengthMm**2,width=Math.sqrt(q.areaMm2),scale=q.lengthMm*Math.sqrt(2);return Array.from({length:count},(_,i)=>{const seed=Math.imul(i+1,83492791);return{id:i,x:reflectDiffusion((i+.5)/count*q.lengthMm/2+scale*diffusionBrownian(theta,seed),q.gateClosed?q.lengthMm/2:q.lengthMm),y:reflectDiffusion(width*uniform(seed^123)+scale*diffusionBrownian(theta,seed^54321),width),z:reflectDiffusion(width*uniform(seed^456)+scale*diffusionBrownian(theta,seed^98765),width)}})}
