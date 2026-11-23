import * as THREE from 'three';
// Deterministic original microsurface: no fetched assets and no random frame-to-frame noise.
export function specimenTexture(){
 const size=64,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const n=Math.sin(x*12.9898+y*78.233)*43758.5453;
  const value=Math.round(125+35*(n-Math.floor(n)) + 12*Math.sin(x*.4)*Math.cos(y*.31));
  const i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=value;data[i+3]=255;
 }
 const texture=new THREE.DataTexture(data,size,size);texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
 texture.repeat.set(3,3);texture.needsUpdate=true;return texture;
}
