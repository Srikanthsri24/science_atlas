import test from'node:test';import assert from'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/airExpansionGeometry.ts'),S=await loadTs('src/lib/chemistry/airExpansion.ts'),q=S.defaultAirInputs,A=M.airApparatus;
const near=(a,b,t=1e-9)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function volume(v){let total=0;for(let i=0;i<v.length;i+=9){const[a,b,c,d,e,f,g,h,j]=v.slice(i,i+9);total+=(a*(e*j-f*h)+b*(f*g-d*j)+c*(d*h-e*g))/6}return total}
test('closed gas triangle volume equals the calculated volume for both boundaries',()=>{
 for(const boundary of S.airBoundaries)for(const targetC of [5,65,85])for(const program of ['constant','return'])for(const timeSeconds of [0,60,120,240,300]){
  const p={...q,targetC,program,timeSeconds},g=M.airGeometry(p,boundary);near(volume(M.airGasTriangles(p,boundary)),g.volumeMl);near((g.gasTopY-g.gasBottomY)*M.airCrossSectionCm2,g.volumeMl);
 }
});
test('piston face follows gas height with a separate non-overlapping solid volume',()=>{
 for(const timeSeconds of [0,60,120,240]){const p={...q,timeSeconds},g=M.airGeometry(p,'piston'),v=M.airPistonTriangles(p);near(volume(v),M.airCrossSectionCm2*.35);near(g.pistonBottomY,g.gasTopY);near(Math.min(...v.filter((_,i)=>i%3===1)),g.gasTopY);near(g.rodTopY-g.pistonTopY,4)}
});
test('gas stays inside the ninety-millilitre barrel and jacket stays below every possible piston',()=>{
 for(const initialVolumeMl of [20,60])for(const initialC of [15,35])for(const targetC of [5,85])for(const conductanceWK of [.0005,.005])for(const program of ['constant','return'])for(const timeSeconds of [0,120,240,300]){
  const p={...q,initialVolumeMl,initialC,targetC,conductanceWK,program,timeSeconds};for(const boundary of S.airBoundaries){const g=M.airGeometry(p,boundary);assert.ok(g.gasTopY<g.barrelTopY);assert.ok(g.pistonTopY<g.barrelTopY);assert.ok(A.jacketTopY<g.pistonBottomY);assert.ok(g.gasTopY>g.gasBottomY)}
 }
});
test('annular jacket has correct signed material volume and a distinct gas-barrel cavity',()=>{
 const v=M.airJacketTriangles(),area=128*Math.sin(2*Math.PI/128)/2;near(volume(v),area*(A.jacketOuterRadiusCm**2-A.jacketInnerRadiusCm**2)*(A.jacketTopY-A.jacketBottomY));assert.ok(A.jacketInnerRadiusCm>A.outerRadiusCm&&A.outerRadiusCm>A.innerRadiusCm);assert.ok(A.gasBaseRadiusCm>A.outerRadiusCm&&A.gasBaseRadiusCm<A.jacketInnerRadiusCm);
});
test('jacket cap triangles leave the centre open rather than drawing two overlapping solid disks',()=>{
 const v=M.airJacketTriangles();let caps=0;
 for(let i=0;i<v.length;i+=9){const ys=[v[i+1],v[i+4],v[i+7]];if(Math.max(...ys)===Math.min(...ys)){
  const radii=[0,3,6].map(j=>Math.hypot(v[i+j],v[i+j+2]));assert.ok(radii.every(r=>r>=A.jacketInnerRadiusCm-1e-12));assert.ok(radii.some(r=>Math.abs(r-A.jacketInnerRadiusCm)<1e-12)&&radii.some(r=>Math.abs(r-A.jacketOuterRadiusCm)<1e-12));caps++;
 }}assert.equal(caps,128*4);
});
test('gauge and thermometer ranges contain every allowed pressure and temperature',()=>{
 for(const initialPressureKPa of [80,120])for(const initialC of [15,35])for(const targetC of [5,85])for(const boundary of S.airBoundaries){const g=M.airGeometry({...q,initialPressureKPa,initialC,targetC,conductanceWK:.005,timeSeconds:300},boundary);assert.ok(g.pressureGaugeFraction>0&&g.pressureGaugeFraction<1);assert.ok(g.gasThermometerFraction>0&&g.gasThermometerFraction<1);assert.ok(g.jacketThermometerFraction>0&&g.jacketThermometerFraction<1);near(g.pressureGaugeAngleRad,(-120+g.pressureGaugeFraction*240)*Math.PI/180)}
});
test('heat-progress reference stops for stationary control and grows through signed cooling',()=>{
 const control=M.airGeometry({...q,targetC:q.initialC,timeSeconds:240},'piston');assert.equal(control.absoluteHeatTransferredJ,0);
 const a=M.airGeometry({...q,program:'return',timeSeconds:120},'piston'),b=M.airGeometry({...q,program:'return',timeSeconds:240},'piston');assert.ok(b.absoluteHeatTransferredJ>a.absoluteHeatTransferredJ);assert.ok(b.heatJ<a.heatJ);assert.ok(b.pistonSpeedCmS<0);
});
