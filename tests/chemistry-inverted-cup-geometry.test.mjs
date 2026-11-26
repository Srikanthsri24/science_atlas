import test from'node:test';import assert from'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/invertedCupGeometry.ts'),S=await loadTs('src/lib/chemistry/invertedCup.ts'),q=S.defaultCupInputs;
const near=(a,b,t=1e-7)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
function volume(v){let sum=0;for(let i=0;i<v.length;i+=9){const[a,b,c,d,e,f,g,h,j]=v.slice(i,i+9);sum+=(a*(e*j-f*h)+b*(f*g-d*j)+c*(d*h-e*g))/6}return sum}
test('gas and inside-water triangle volumes equal their separate cup inventories',()=>{
 for(const c of S.cupConditions)for(const timeSeconds of [0,10,25,50,90,115,140,160]){const p={...q,timeSeconds},g=M.invertedCupGeometry(p,c);near(volume(M.invertedCupGasTriangles(p,c)),g.gasVolumeMl);near(volume(M.invertedCupInsideWaterTriangles(p,c)),g.waterInsideMl);near(g.gasVolumeMl+g.waterInsideMl,g.initialGasMl)}
});
test('actual outside-water layers plus inside water conserve the finite basin material',()=>{
 for(const cupRadiusCm of [2,3])for(const cupHeightCm of [6,12])for(const basinRadiusCm of [7,10])for(const maximumInsertionCm of [0,30])for(const timeSeconds of [0,25,50,115,160])for(const c of S.cupConditions){
  const p={...q,cupRadiusCm,cupHeightCm,basinRadiusCm,maximumInsertionCm,timeSeconds},g=M.invertedCupGeometry(p,c),outside=volume(M.invertedCupOutsideWaterTriangles(p,c));near(outside,g.outsideWaterMl);near(outside+volume(M.invertedCupInsideWaterTriangles(p,c)),g.initialWaterMl);
 }
});
test('glass walls and roof occupy their exact volume without filling the open cavity',()=>{
 const g=M.invertedCupGeometry({...q,timeSeconds:50},'trapped'),p={...q,timeSeconds:50};near(volume(M.invertedCupWallTriangles(p,'trapped')),(g.outerAreaCm2-g.innerAreaCm2)*q.cupHeightCm);near(volume(M.invertedCupCapTriangles(p,'trapped')),g.outerAreaCm2*S.cupReference.capThicknessCm);
 const wall=M.invertedCupWallTriangles(p,'trapped');for(let i=0;i<wall.length;i+=3)assert.ok(Math.hypot(wall[i],wall[i+2])>=q.cupRadiusCm-1e-12);
});
test('a flooded cup contains no gas mesh and return restores empty interior water without clearing contact history',()=>{
 const deep={...q,timeSeconds:50},back={...q,timeSeconds:160};assert.deepEqual(M.invertedCupGasTriangles(deep,'vented'),[]);assert.deepEqual(M.invertedCupInsideWaterTriangles(back,'vented'),[]);assert.equal(M.invertedCupGeometry(back,'vented').markerEverContacted,true);assert.ok(M.invertedCupGasTriangles(back,'vented').length>0);
});
test('all phase boundaries share surfaces in correct order with floor and dry vent clearance',()=>{
 for(const c of S.cupConditions)for(const timeSeconds of [0,25,50,115,160]){const g=M.invertedCupGeometry({...q,timeSeconds},c);assert.ok(g.floorY<g.rimY&&g.rimY<=g.interfaceY&&g.interfaceY<=g.roofY&&g.roofY<g.outerTopY);assert.ok(g.waterAroundCupHeightCm>=0&&g.waterAboveCupHeightCm>=0);assert.ok(g.surfaceCm<S.cupReference.ventOutletY);near(g.waterBelowRimHeightCm+g.waterAroundCupHeightCm+g.waterAboveCupHeightCm,S.cupReference.waterDepthCm+g.surfaceCm)}
});
