/** Fit camera-space apparatus bounds into the unobscured viewport area.
 * Shift is in camera-space world units; the caller moves camera and target
 * together, preserving orientation and every scientific scene coordinate.
 */
export function stirringCameraFit(width:number,height:number,minX:number,maxX:number,minY:number,maxY:number,portrait:boolean,focus:boolean){if(![width,height,minX,maxX,minY,maxY].every(Number.isFinite)||width<=0||height<=0||maxX<=minX||maxY<=minY)throw new RangeError('Positive viewport and finite nonempty bounds required');const top=portrait?62:44,bottom=portrait?10:focus?84:66,usableHeight=Math.max(20,height-top-bottom),zoom=.92*Math.min(Math.max(20,width-24)/(maxX-minX),usableHeight/(maxY-minY));return{zoom,shiftX:(minX+maxX)/2,shiftY:(minY+maxY)/2+(top-bottom)/(2*zoom),top,bottom}}
