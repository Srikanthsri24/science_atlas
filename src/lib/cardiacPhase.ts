/** Chosen normalized teaching windows, not measured clinical phase durations or a pressure solver. */
export function cardiacPhase(phase:number){if(!Number.isFinite(phase))throw new RangeError('Finite phase required');const p=phase-Math.floor(phase),ease=(u:number)=>u*u*(3-2*u);return{avOpen:p<.15||p>=.58,outflowOpen:p>=.22&&p<.5,ventricularScale:p<.22?1:p<.5?1-.14*ease((p-.22)/.28):p<.58?.86:.86+.14*ease((p-.58)/.42),atrialScale:p<.15?1-.08*Math.sin(p/.15*Math.PI):1,title:p<.15?'Atrial contraction / ventricular filling':p<.22?'Isovolumetric contraction':p<.5?'Ventricular ejection':p<.58?'Isovolumetric relaxation':'Ventricular filling'};}
export const cardiacValveFacts:Record<string,string>={
'Tricuspid valve':'The inlet between right atrium and right ventricle admits filling flow. Its section guide closes before ventricular ejection.',
'Mitral valve':'The inlet between left atrium and left ventricle admits filling flow. Its section guide closes before ventricular ejection.',
'Pulmonary valve':'This outlet directs blood from the right ventricle toward the pulmonary trunk and lungs. The guide opens during ejection and closes before filling.',
'Aortic valve':'This outlet directs blood from the left ventricle into the aorta. The guide opens during ejection and closes before filling.'};
