import{inkComparisonState,comparisonBandDensity,type InkComparisonInputs}from'./inkComparison';
/** Physical paper coordinates;longitudinal dye mass is normalised by the model.
 * Transverse spread,fibre tint and absorptive RGB coefficients are illustrative,
 * not calibrated concentration-to-spectrum measurements.
 * Rows run bottom-to-top for a Three DataTexture with flipY=false.
 */
export const comparisonPaper={widthCm:9,heightCm:12,thicknessCm:.03,laneXcm:[-3,-1,1,3],visualTransverseSigmaCm:.18};
export function inkComparisonPixels(q:InkComparisonInputs,width=192,height=384){
 if(!Number.isInteger(width)||!Number.isInteger(height)||width<96||width>512||height<192||height>1024)throw new RangeError('Paper texture96–512 by192–1024 required');
 const s=inkComparisonState(q),pixels=new Uint8Array(width*height*4),spread=comparisonPaper.laneXcm.map(lane=>Array.from({length:width},(_,i)=>{const x=-4.5+9*(i+.5)/width,z=(x-lane)/comparisonPaper.visualTransverseSigmaCm;return Math.exp(-.5*z*z)})),coefficient={blue:[2.8,1.3,.12],yellow:[.05,.4,2.7],magenta:[.2,2.4,.25]},dy=12/height;
 for(let j=0;j<height;j++){
  const y=12*(j+.5)/height,wet=y<=s.frontYcm,absorption=s.lanes.map(lane=>{const rgb=[0,0,0];for(const b of lane.bands){const density=comparisonBandDensity(b,y)*.5;for(let c=0;c<3;c++)rgb[c]+=coefficient[b.color][c]*density}return rgb});
  for(let i=0;i<width;i++){
   const fibre=(i*13+j*23)%5-2,bg=wet?[218+fibre,233+fibre,228+fibre]:[246+fibre,244+fibre,236+fibre],v=(j*width+i)*4;
   for(let c=0;c<3;c++){let a=0;for(let l=0;l<4;l++)a+=absorption[l][c]*spread[l][i];pixels[v+c]=Math.round(bg[c]*Math.exp(-a))}
   pixels[v+3]=255;
   if(Math.abs(y-2)<dy*.55&&i%12<7){pixels[v]=Math.min(pixels[v],133);pixels[v+1]=Math.min(pixels[v+1],137);pixels[v+2]=Math.min(pixels[v+2],139)}
   if(Math.abs(y-s.frontYcm)<dy*.55){pixels[v]=90;pixels[v+1]=150;pixels[v+2]=161}
  }
 }
 return pixels;
}
export function comparisonTextureSampleTime(q:InkComparisonInputs,playing:boolean){return playing?{...q,timeSeconds:Math.min(1500,Math.max(0,Math.round(q.timeSeconds*2)/2))}:q}
