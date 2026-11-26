import test from 'node:test';
import assert from 'node:assert/strict';
import {loadTs} from './load-ts.mjs';
const G=await loadTs('src/lib/chemistry/coolingCrystalGeometry.ts');
const M=await loadTs('src/lib/chemistry/coolingCrystalGrowth.ts');
const q=M.defaultCoolingCrystalInputs;
const near=(a,b,e=1e-8)=>assert.ok(Math.abs(a-b)<e,`${a} vs ${b}`);
function signedVolume(vertices) {
  let sum=0;
  for(let i=0;i<vertices.length;i+=9) {
    const [ax,ay,az,bx,by,bz,cx,cy,cz]=vertices.slice(i,i+9);
    sum+=(ax*(by*cz-bz*cy)+ay*(bz*cx-bx*cz)+az*(bx*cy-by*cx))/6;
  }
  return sum;
}
test('actual rotated triangle mesh encloses the required solid volume',()=>{
  for(const mass of [0,.000001,.2,10,24.2,48.4,64.2]) {
    const triangles=G.coolingSolidTriangles(mass);
    near(signedVolume(triangles),mass/2.109);
    if(mass>0) assert.equal(triangles.length,21*16*9);
  }
});
test('actual fluid mesh excludes crystal interiors rather than adding volume twice',()=>{
  for(const waterG of [50,100]) for(const saltG of [40,80])
    for(const program of ['fast','slow']) for(const timeS of [0,120,600,1200,2400]) {
      const input={...q,waterG,saltG,timeS},s=G.coolingCrystalGeometry(input,program);
      near(signedVolume(G.coolingLiquidTriangles(input,program)),waterG+.45*s.dissolvedG,1e-7);
      near(s.liquidDepthCm*s.floorAreaCm2-s.crystalVolumeCm3,s.solutionVolumeCm3);
    }
});
test('rotated reference forms stay separated, inside the vessel and below the liquid at all inventory corners',()=>{
  const a=G.coolingVessel;
  for(const waterG of [50,75,100]) for(const saltG of [40,60,80]) {
    // Continuously sweep every physically possible solid inventory, independent of integration.
    const maximum= saltG-waterG*.316;
    for(let i=0;i<=100;i++) {
      const mass=Math.max(0,maximum)*i/100,d=G.coolingCrystalDimensions(mass);
      const solution=waterG+.45*(saltG-mass);
      const area=a.sides*a.radiusCm**2*Math.sin(2*Math.PI/a.sides)/2;
      const depth=(solution+mass/2.109)/area;
      assert.ok(d.heightCm<=depth+1e-8,`submerged ${waterG}/${saltG}/${mass}`);
      assert.ok(2*d.rotatedHalfWidthCm<=a.spacingCm);
      for(const center of G.coolingCentres)
        assert.ok(Math.hypot(Math.abs(center[0])+d.rotatedHalfWidthCm,
          Math.abs(center[2])+d.rotatedHalfWidthCm)<a.radiusCm*Math.cos(Math.PI/a.sides));
      assert.ok(depth<a.heightCm);
    }
  }
});
test('apparatus count is fixed weighted geometry, separate from effective sites and equivalent size',()=>{
  assert.equal(G.coolingCentres.length,21);
  const a=G.coolingCrystalGeometry({...q,timeS:1200},'fast');
  const b=G.coolingCrystalGeometry({...q,timeS:1200},'slow');
  near(a.perMassG*21,a.crystalG);near(b.perMassG*21,b.crystalG);
  assert.ok(a.sites>b.sites && a.meanEquivalentRadiusCm<b.meanEquivalentRadiusCm);
  near(a.widthCm,b.widthCm,1e-6); // Apparatus volume alone must not masquerade as mean size.
});
test('histories contain only elapsed evidence, both cooling boundaries and exact final state',()=>{
  for(const program of ['fast','slow']) for(const timeS of [0,119.37,120,600,1200]) {
    const history=G.coolingHistory({...q,timeS},program);
    assert.equal(history[0].timeS,0);assert.equal(history.at(-1).timeS,timeS);
    assert.ok(history.every((p,i)=>p.timeS<=timeS && (!i||p.timeS>history[i-1].timeS)));
    for(const t of [120,600])if(t<=timeS)assert.ok(history.some(p=>p.timeS===t));
    near(history.at(-1).solid,M.coolingCrystalState({...q,timeS},program).crystalG);
  }
});
test('negative or nonfinite geometry inventories are rejected',()=>{
  for(const mass of [-1,NaN,Infinity])assert.throws(()=>G.coolingSolidTriangles(mass),RangeError);
});
