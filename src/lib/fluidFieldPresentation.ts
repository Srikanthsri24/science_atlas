import{centrifuge}from'./universeModels';
/** A shared 1 mPa·s reference clock lets viscosity comparisons change the observed position. */
export function settlingClock(display:number,rpm:number,diameterUm:number,deltaRho:number){const u=((display%6)+6)%6/6;return u*centrifuge(0,rpm,diameterUm,deltaRho,1).settling*1.1;}
/** Unit current along each long side and its I L × B force, before visual scaling. */
export function motorSideVectors(theta:number,currentSign:number,side:number){const phi=theta-Math.PI/2;return{at:[side*.6*Math.cos(phi),0,-side*.6*Math.sin(phi)] as [number,number,number],current:[0,side*currentSign,0] as [number,number,number],force:[0,0,-side*currentSign] as [number,number,number]};}
