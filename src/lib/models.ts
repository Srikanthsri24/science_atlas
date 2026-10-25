/** Idealized school-science models. SI inputs and outputs throughout. */
export function pendulumPeriod(length: number, gravity = 9.81): number {
 if (![length, gravity].every(Number.isFinite) || !(length > 0 && gravity > 0)) throw new RangeError('Length and gravity must be positive');
 return 2 * Math.PI * Math.sqrt(length / gravity);
}
export function circuitValues(voltage: number, resistance: number) {
 if (!(resistance > 0) || ![voltage, resistance].every(Number.isFinite)) throw new RangeError('A finite voltage and positive resistance are required');
 return { current: voltage / resistance, power: voltage * voltage / resistance };
}
export function refract(degrees: number, n1: number, n2: number) {
 if (![degrees, n1, n2].every(Number.isFinite) || !(n1 > 0 && n2 > 0 && degrees >= 0 && degrees <= 90)) throw new RangeError('Use positive refractive indices and an incidence angle from 0 to 90 degrees');
 const sine = n1 / n2 * Math.sin(degrees * Math.PI / 180);
 return { angle: sine > 1 ? null : Math.asin(Math.min(1, sine)) * 180 / Math.PI, criticalAngle: n1 > n2 ? Math.asin(n2 / n1) * 180 / Math.PI : null, totalInternalReflection: sine > 1 };
}

/** Linear small-angle damped pendulum, released from rest; β in s⁻¹. */
export function pendulumState(t:number,length:number,gravity:number,amplitudeDegrees:number,mass=1,beta=0){
 if(![t,length,gravity,amplitudeDegrees,mass,beta].every(Number.isFinite)||t<0||length<=0||gravity<=0||mass<=0||beta<0||Math.abs(amplitudeDegrees)>15)throw new RangeError('Valid small-angle parameters required');
 const w0=Math.sqrt(gravity/length);if(beta>=w0)throw new RangeError('Underdamping required');
 const w=Math.sqrt(w0*w0-beta*beta),A=amplitudeDegrees*Math.PI/180,e=Math.exp(-beta*t),theta=A*e*(Math.cos(w*t)+beta/w*Math.sin(w*t)),angularVelocity=-A*e*w0*w0/w*Math.sin(w*t),kinetic=.5*mass*length*length*angularVelocity*angularVelocity,potential=.5*mass*gravity*length*theta*theta;
 return{theta,angularVelocity,speed:Math.abs(length*angularVelocity),kinetic,potential,energy:kinetic+potential,period:2*Math.PI/w};
}
/** Power fractions for unpolarized light at a lossless dielectric boundary. */
export function fresnel(degrees:number,n1:number,n2:number){const ray=refract(degrees,n1,n2);if(ray.totalInternalReflection)return{...ray,reflectance:1,transmittance:0};if(n1===n2)return{...ray,reflectance:0,transmittance:1};const c1=Math.cos(degrees*Math.PI/180),c2=Math.cos((ray.angle??0)*Math.PI/180),rs=(n1*c1-n2*c2)/(n1*c1+n2*c2),rp=(n2*c1-n1*c2)/(n2*c1+n1*c2),reflectance=(rs*rs+rp*rp)/2;return{...ray,reflectance,transmittance:1-reflectance};}
export function orbitalAngle(days:number,period:number,offset=0){if(![days,period,offset].every(Number.isFinite)||period<=0)throw new RangeError('Finite time and positive orbital period required');return((days/period*Math.PI*2+offset)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)}
