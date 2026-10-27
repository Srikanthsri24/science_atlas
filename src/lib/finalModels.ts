export const EPS0=8.8541878128e-12,K=1/(4*Math.PI*EPS0),MU0=4*Math.PI*1e-7,C=299792458;
export function pointCharge(qNano:number,r:number){const q=qNano*1e-9;return{field:K*q/r**2,potential:K*q/r}}
export function network(voltage:number,r1:number,r2:number,parallel:boolean){const resistance=parallel?1/(1/r1+1/r2):r1+r2,current=voltage/resistance,i1=parallel?voltage/r1:current,i2=parallel?voltage/r2:current,v1=i1*r1,v2=i2*r2;return{resistance,current,i1,i2,v1,v2,power:voltage*current,p1:i1*i1*r1,p2:i2*i2*r2}}
export function solenoid(current:number,turns:number,length:number,radius:number){return MU0*turns*current/(2*Math.sqrt(radius**2+length**2/4))}
export function motional(B:number,length:number,v:number){return{emfY:-B*length*v,forcePerPositiveChargeY:-B*v}}
export function magnifier(fCm:number,ratio:number){const u=fCm*ratio,v=fCm*u/(u-fCm);return{u,v,m:-v/u,relaxedAngular:25/fCm}}
export function emWave(amplitude:number,fMHz:number,phase:number){const frequency=fMHz*1e6;return{electric:amplitude*Math.sin(phase),magnetic:amplitude/C*Math.sin(phase),magneticAmplitude:amplitude/C,wavelength:C/frequency,frequency,period:1/frequency}}
