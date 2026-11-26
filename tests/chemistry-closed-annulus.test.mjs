import test from'node:test';import assert from'node:assert/strict';import{loadTs}from'./load-ts.mjs';
const M=await loadTs('src/lib/chemistry/closedAnnulus.ts');
function volume(v){let sum=0;for(let i=0;i<v.length;i+=9){const[a,b,c,d,e,f,g,h,j]=v.slice(i,i+9);sum+=(a*(e*j-f*h)+b*(f*g-d*j)+c*(d*h-e*g))/6}return sum}
test('closed annulus has correct outward material volume for real polygonal cross sections',()=>{
 for(const sides of [8,32,128])for(const [ro,ri,h,y] of [[2,1.36,2.8,3],[8,2.65,20,-15],[3,2.85,10,0],[1,0,3,-4]]){
  const v=M.annulusTriangles(ro,ri,h,y,sides),expected=sides*Math.sin(2*Math.PI/sides)/2*(ro*ro-ri*ri)*h;assert.ok(Math.abs(volume(v)-expected)<1e-8);
 }
});
test('all annular caps join inner and outer rings without disk triangles covering the cavity',()=>{
 const v=M.annulusTriangles(8,2.65,20,-15);let caps=0;
 for(let i=0;i<v.length;i+=9){const ys=[v[i+1],v[i+4],v[i+7]];if(Math.max(...ys)===Math.min(...ys)){
  const radii=[0,3,6].map(j=>Math.hypot(v[i+j],v[i+j+2]));assert.ok(radii.every(r=>r>=2.65-1e-12));assert.ok(radii.some(r=>Math.abs(r-2.65)<1e-12)&&radii.some(r=>Math.abs(r-8)<1e-12));caps++;
 }}assert.equal(caps,128*4);
});
test('every geometric edge is paired with opposite direction, including the periodic seam',()=>{
 const v=M.annulusTriangles(2,1.36,2.8,3,32),edges=new Map();
 const key=p=>p.map(x=>Math.abs(x)<1e-10?'0':x.toFixed(9)).join(',');
 for(let i=0;i<v.length;i+=9){const p=[key(v.slice(i,i+3)),key(v.slice(i+3,i+6)),key(v.slice(i+6,i+9))];for(let j=0;j<3;j++){const a=p[j],b=p[(j+1)%3],k=[a,b].sort().join('|');edges.set(k,(edges.get(k)||0)+(a<b?1:-1))}}assert.ok([...edges.values()].every(x=>x===0));
});
test('zero-volume phases are empty and invalid dimensions cannot become geometry',()=>{
 assert.deepEqual(M.annulusTriangles(2,2,3,0),[]);assert.deepEqual(M.annulusTriangles(2,1,0,0),[]);
 for(const args of [[1,2,1,0],[2,-1,1,0],[2,1,-1,0],[2,1,1,NaN],[2,1,1,0,2]])assert.throws(()=>M.annulusTriangles(...args),RangeError);
});
