import{mixtureMeltingState,type MixtureMeltingInputs}from './mixtureMelting';
/** Original equal reference molar volume100cm³/mol in every phase.
 * Volume is used only for an inventory cutaway: it is not measured density,
 * packing,wetting,convection or a prediction of interface morphology. */
export function mixtureMeltingGeometry(q:MixtureMeltingInputs){const s=mixtureMeltingState(q),molarVolumeCm3Mol=100,radiusCm=.25,areaCm2=Math.PI*radiusCm**2,volumePerMmol=.1;
 const liquidVolumeCm3=(s.liquidAMmol+s.liquidBMmol)*volumePerMmol,solidAVolumeCm3=s.solidAMmol*volumePerMmol,solidBVolumeCm3=s.solidBMmol*volumePerMmol;
 const liquidHeightCm=liquidVolumeCm3/areaCm2,solidAHeightCm=solidAVolumeCm3/areaCm2,solidBHeightCm=solidBVolumeCm3/areaCm2,totalHeightCm=q.amountMmol*volumePerMmol/areaCm2;
 return{molarVolumeCm3Mol,radiusCm,areaCm2,liquidVolumeCm3,solidAVolumeCm3,solidBVolumeCm3,liquidHeightCm,solidAHeightCm,solidBHeightCm,totalHeightCm,cellHeightCm:3.2,solidABottomCm:liquidHeightCm,solidBBottomCm:liquidHeightCm+solidAHeightCm};}
