import*as THREE from'three';import{planets}from'./types';
const textureCache=new Map<string,THREE.CanvasTexture>();
export function planetTexture(name:string){if(textureCache.has(name))return textureCache.get(name)!;const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;const ctx=canvas.getContext('2d')!,image=ctx.createImageData(512,256);const color=new THREE.Color(planets.find(p=>p.name===name)?.color??(name==='Moon'?'#9da5af':'#ffc260'));
 for(let y=0;y<256;y++)for(let x=0;x<512;x++){const u=x/512*Math.PI*2,v=y/256*Math.PI,grain=Math.sin(x*12.13+y*4.17)*Math.cos(y*17.33+x*3.01);let r=color.r,g=color.g,b=color.b;const wave=Math.sin(v*36+Math.sin(u*3)*.5)+Math.sin(v*75)*.3;
 if(name==='Earth'){const land=Math.sin(u*2.1+Math.cos(v*2.7)*2)+Math.sin(u*4.5-v*3.1)*.45+Math.cos(u*7.1+v*4.2)*.25;const polar=Math.abs(Math.cos(v))>.92;if(polar){r=.82;g=.89;b=.91}else if(land>.48){r=.18+grain*.025;g=.37+grain*.025;b=.23}else{r=.035;g=.18;b=.34}const cloud=Math.sin(u*9+v*8+Math.sin(v*8)*3)+Math.cos(v*18-u*5);if(cloud>1.55){r=r*.4+.55;g=g*.4+.58;b=b*.4+.6}}
 else if(['Jupiter','Saturn'].includes(name)){const band=.78+wave*.13;r*=band;g*=band;b*=band;const storm=(x-350)**2/1000+(y-165)**2/100;if(name==='Jupiter'&&storm<1){r=.52;g=.24;b=.13}}
 else if(name==='Sun'){const n=.9+grain*.12+Math.sin(u*25+v*38)*.05;r=1;g=.53*n;b=.13*n}
 else{const n=.87+grain*.045+Math.sin(u*12)*Math.sin(v*11)*.08;r*=n;g*=n;b*=n}
 const i=(y*512+x)*4;image.data[i]=Math.min(255,r*255);image.data[i+1]=Math.min(255,g*255);image.data[i+2]=Math.min(255,b*255);image.data[i+3]=255}
 ctx.putImageData(image,0,0);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;textureCache.set(name,texture);return texture;}
