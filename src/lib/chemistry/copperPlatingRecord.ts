import{validatePlating,platingState,platingGuide,copperConstants as C,type PlatingInputs}from'./copperElectroplating';
export interface PlatingTrial extends PlatingInputs{guideBase:PlatingInputs|null;guideSeconds:number|null;note:string}
export interface PlatingRecord{plan:string;conclusion:string;trials:PlatingTrial[]}
const clean=(x:unknown)=>typeof x==='string'?x.slice(0,4000):'',f=(x:number|null)=>x===null?'Unavailable':Number(x.toPrecision(12)).toString(),esc=(x:unknown)=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export function validatePlatingTrial(raw:unknown):PlatingTrial{
 const q=validatePlating(raw),r=raw as PlatingTrial;let base:PlatingInputs|null=null;
 if(r.guideSeconds===null){if(r.guideBase!==null)throw new RangeError('Manual observation must have no guide base')}
 else{if(typeof r.guideSeconds!=='number')throw new TypeError('Explicit guide time or manual null required');base=validatePlating(r.guideBase);const expected=platingGuide(r.guideSeconds,base).inputs;if(JSON.stringify(q)!==JSON.stringify(expected))throw new RangeError('Observation differs from its guide base/time')}
 return{...q,guideBase:base,guideSeconds:r.guideSeconds,note:clean(r.note)};
}
export function validatePlatingRecord(raw:unknown):PlatingRecord{
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw new TypeError('Copper plating notebook required');const r=raw as PlatingRecord;if(!Array.isArray(r.trials)||r.trials.length>40)throw new RangeError('At most40observations');return{plan:clean(r.plan),conclusion:clean(r.conclusion),trials:r.trials.map(validatePlatingTrial)};
}
export function platingSnapshotLabel(t:PlatingTrial){return t.guideSeconds===null?'Manual source-history snapshot':t.guideSeconds<140?'Guided snapshot before verification':'Verified guided reference'}
export const platingHeaders=[
 ['Trial','Source history: A, s, connection','Configured current (A)','Source switch requested on?','Initial copper anode (g)','Initial cathode (g)','Exposed width (cm)','Exposed height (cm)','Guide seconds or manual','Snapshot status','Student observation'],
 ['Trial','Elapsed physical time (s)','Energized physical time (s)','Requested coulomb budget (C)','Passed charge (C)','Finite anode charge ceiling (C)','Unmet charge demand (C)','Anode exhausted?','Active current now (A)','Bath net copper change (mol)'],
 ['Trial','Initial anode (g)','Final anode (g)','Anode loss (g)','Initial cathode (g)','Final cathode (g)','Cathode gain (g)','Initial electrode total (g)','Final electrode total (g)','Numerical mass-account residual (g)'],
 ['Trial','Exposed area (cm²)','Exposed area (m²)','Copper deposit (mg)','Deposit volume (cm³)','Average film thickness (cm)','Average film thickness (m)','Average film thickness (µm)','Active current density (A/m²)'],
];
export function platingRows(q:PlatingTrial,index:number){const s=platingState(q);return[
 [index+1,q.history.map(r=>`${f(r.currentA)} A × ${f(r.durationS)} s (${r.connected?'connected':'disconnected'})`).join('; ')||'No source-history segments',f(q.currentA),q.connected?'Yes':'No',f(q.anodeInitialG),f(q.cathodeInitialG),f(q.widthCm),f(q.heightCm),q.guideSeconds??'Manual',platingSnapshotLabel(q),q.note],
 [index+1,...[s.elapsedS,s.energizedS,s.requestedChargeC,s.passedChargeC,s.chargeLimitC,s.unmetChargeDemandC].map(f),s.depleted?'Yes':'No',f(s.activeCurrentA),f(s.bathNetCopperChangeMol)],
 [index+1,...[q.anodeInitialG,s.anodeFinalG,s.anodeLossG,q.cathodeInitialG,s.cathodeFinalG,s.cathodeGainG,s.initialElectrodeMassG,s.finalElectrodeMassG,s.massAccountResidualG].map(f)],
 [index+1,...[s.areaCm2,s.areaM2,s.depositMassMg,s.depositVolumeCm3,s.thicknessCm,s.thicknessM,s.thicknessMicrometre,s.currentDensityAm2].map(f)],
]}
export interface PlatingWorking{key:string;title:string;formula:string;substitution:string;result:number|null;unit:string;reason:string}
export function platingCalculations(q:PlatingInputs):PlatingWorking[]{
 const s=platingState(q),b:PlatingWorking[]=[];const add=(key:string,title:string,formula:string,substitution:string,result:number|null,unit:string,reason='')=>b.push({key,title,formula,substitution,result,unit,reason});
 add('chargeCeiling','Finite copper charge ceiling','Qlimit = (manodeInitial / MCu) × 2 × F',`(${q.anodeInitialG} / ${C.molarMassGMol}) * 2 * ${C.faradayCMol}`,s.chargeLimitC,'C');
 let prior=0;
 for(const seg of s.segments){const i=seg.index,remaining=Math.max(0,s.chargeLimitC-prior);
  add(`request${i}`,`Requested budget in segment ${i+1}`,'Qrequest = connectedFlag × I × duration',`${seg.connected?1:0} * ${seg.currentA} * ${seg.durationS}`,seg.requestC,'C','A requested budget is not proof that this charge passed after cutoff.');
  add(`remaining${i}`,`Available charge before segment ${i+1}`,'Qavailable = max(0, Qlimit - Qprevious)',`max(0, ${s.chargeLimitC} - ${prior})`,remaining,'C');
  add(`delivered${i}`,`Passed charge in segment ${i+1}`,'Qsegment = min(Qavailable, Qrequest)',`min(${remaining}, ${seg.requestC})`,seg.deliveredC,'C');
  add(`activeTime${i}`,`Energized duration in segment ${i+1}`,'tactive = Qsegment / I',seg.currentA>0?`${seg.deliveredC} / ${seg.currentA}`:'Not evaluated',seg.currentA>0?seg.activeS:null,'s',seg.currentA>0?'':'No current: division by zero is not evaluated; energized duration is0s by definition.');
  prior=seg.requestC>=remaining?s.chargeLimitC:prior+seg.deliveredC;
 }
 add('elapsed','Elapsed physical time','telapsed = sum(segment durations)',q.history.length?q.history.map(r=>r.durationS).join(' + '):'0',s.elapsedS,'s');
 add('requested','Total requested budget','Qrequested = sum(connectedFlag × I × duration)',q.history.length?q.history.map(r=>`(${r.connected?1:0} * ${r.currentA} * ${r.durationS})`).join(' + '):'0',s.requestedChargeC,'C');
 add('passed','Total passed charge','Qpassed = min(Qrequested, Qlimit)',`min(${s.requestedChargeC}, ${s.chargeLimitC})`,s.passedChargeC,'C');
 add('unmet','Unserved source demand','Qunmet = Qrequested - Qpassed',`${s.requestedChargeC} - ${s.passedChargeC}`,s.unmetChargeDemandC,'C','This budget never passed through the ideal copper reaction.');
 add('electronMol','Electron amount','ne = Qpassed / F',`${s.passedChargeC} / ${C.faradayCMol}`,s.electronMol,'mol');
 add('depositMass','Deposited copper mass','mCu = min(manodeInitial, Qpassed × MCu / (2 × F))',`min(${q.anodeInitialG}, ${s.passedChargeC} * ${C.molarMassGMol} / (2 * ${C.faradayCMol}))`,s.depositMassG,'g','At the exact finite-inventory boundary, deposited mass is set to the initial anode inventory.');
 add('copperMol','Copper amount','nCu = mCu / MCu',`${s.depositMassG} / ${C.molarMassGMol}`,s.copperMol,'mol');
 add('anodeFinal','Final copper anode mass','manodeFinal = manodeInitial - mCu',`${q.anodeInitialG} - ${s.depositMassG}`,s.anodeFinalG,'g');
 add('cathodeFinal','Final cathode mass','mcathodeFinal = mcathodeInitial + mCu',`${q.cathodeInitialG} + ${s.depositMassG}`,s.cathodeFinalG,'g');
 add('initialTotal','Initial electrode total','minitial = manodeInitial + mcathodeInitial',`${q.anodeInitialG} + ${q.cathodeInitialG}`,s.initialElectrodeMassG,'g');
 add('finalTotal','Final electrode total','mfinal = manodeFinal + mcathodeFinal',`${s.anodeFinalG} + ${s.cathodeFinalG}`,s.finalElectrodeMassG,'g');
 add('residual','Numerical account residual','residual = mfinal - minitial',`${s.finalElectrodeMassG} - ${s.initialElectrodeMassG}`,s.massAccountResidualG,'g','Floating-point diagnostic only; not experimental uncertainty.');
 add('area','Single exposed face area','Acm2 = widthCm × heightCm',`${q.widthCm} * ${q.heightCm}`,s.areaCm2,'cm²');
 add('areaSI','Convert exposed area','Am2 = Acm2 / 10000',`${s.areaCm2} / 10000`,s.areaM2,'m²');
 add('volume','Dense copper coating volume','Vcm3 = mCu / rhoCu',`${s.depositMassG} / ${C.densityGCm3}`,s.depositVolumeCm3,'cm³');
 add('thicknessCm','Average film thickness','dcm = Vcm3 / Acm2',`${s.depositVolumeCm3} / ${s.areaCm2}`,s.thicknessCm,'cm');
 add('thicknessM','Thickness in SI units','dm = dcm / 100',`${s.thicknessCm} / 100`,s.thicknessM,'m');
 add('thicknessMicro','Thickness in micrometres','dµm = dcm × 10000',`${s.thicknessCm} * 10000`,s.thicknessMicrometre,'µm');
 add('currentDensity','Active current density','j = Iactive / Am2',`${s.activeCurrentA} / ${s.areaM2}`,s.currentDensityAm2,'A/m²','Current density is an account from the supplied current; no morphology/transport prediction follows.');
 return b;
}
export const platingProcedure=[
 'Predict which electrode gains mass. Identify the positive copper anode and the negative masked conductive cathode in a copper(II) electrolyte.',
 'Start a fresh trial with independently stated initial masses and exposed width/height. Only one fully immersed face is exposed; other surfaces are masked.',
 'Record source-current, connection and duration segments. Source changes preserve earlier history; changes to initial masses or exposed geometry start a fresh comparison.',
 'Pause before recording. Note requested coulomb budget and actual passed charge separately. The ideal source opens when the finite copper anode is exhausted.',
 'Use Cu → Cu2+ +2e− at the anode and Cu2+ +2e− → Cu at the cathode. Apply m=QMCu/(2F), bounded by available anode copper.',
 'Record ideal final electrode masses and verify anode loss equals cathode gain. Net bath copper is unchanged in this ideal soluble-anode model.',
 'Calculate coating volume m/rho and average thickness V/A, retaining units. A magnified cross-section is a display aid; read its labelled scale.',
 'Write an exam-style result, substituted calculations, conclusion and limitations. These are ideal virtual readings, not a measured coating-quality or safety certification.',
];
export function platingReport(raw:unknown){const r=validatePlatingRecord(raw),rows=r.trials.map(platingRows);return`<!doctype html><html lang="en"><meta charset="utf-8"><title>CL-0122 · Copper electroplating practical</title><style>body{font:16px system-ui;max-width:1100px;margin:32px auto;padding:16px;color:#172238}table{border-collapse:collapse;width:100%;font-size:12px;margin:20px 0}th,td{border:1px solid #ccd4df;padding:7px;text-align:left;overflow-wrap:anywhere}article{break-inside:avoid;border-bottom:1px solid #ddd;padding:10px}code{overflow-wrap:anywhere}@media print{body{margin:0}table{font-size:9px}}</style><h1>Copper electroplating: mass, charge and thickness</h1><p>VisionariesAI Labs Private Limited · CL-0122</p><h2>Aim</h2><p>Relate actual passed charge to copper transfer and average uniform film thickness, respecting a finite soluble copper anode.</p><h2>Apparatus</h2><p>Virtual regulated DC source, copper anode, masked conductive cathode, adequate well-mixed copper(II) electrolyte, timer, ideal mass readouts and magnified coating cross-section.</p><h2>Safety</h2><p>Virtual only; no real chemicals or currents are produced. Real electroplating requires teacher supervision, approved low-voltage equipment, suitable protective equipment and proper chemical-waste handling. Do not connect household mains to liquids.</p><h2>Prediction and plan</h2><p>${esc(r.plan)}</p><h2>Procedure</h2><ol>${platingProcedure.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><h2>Observations</h2>${platingHeaders.map((headers,i)=>`<table><thead><tr>${headers.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(x=>`<tr>${x[i].map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`).join('')}<h2>Worked calculations</h2>${r.trials.map((q,i)=>`<h3>Trial ${i+1}</h3>${platingCalculations(q).map(w=>`<article data-trial="${i}" data-key="${w.key}"><h4>${esc(w.title)}</h4><p class="formula">${esc(w.formula)}</p><code>${esc(w.substitution)}</code><p class="result">${w.result===null?'Unavailable':esc(f(w.result)+' '+w.unit)}</p><p>${esc(w.reason)}</p></article>`).join('')}`).join('')}<h2>Result and conclusion</h2><p>${esc(r.conclusion)}</p><h2>Precautions and limitations</h2><p>Unity current efficiency, adequate well-mixed copper(II) bath, soluble copper anode, uniform dense copper film on one masked exposed face. Automatic ideal source cutoff at anode exhaustion; requested unserved coulomb budget is not passed charge. No voltage, conductivity, concentration gradients, adhesion, porosity, roughness, side-reactions or transport-rate prediction. MCu=${C.molarMassGMol} g/mol and rhoCu=${C.densityGCm3} g/cm³ are rounded references; F=${C.faradayCMol} C/mol derives from exact SI constants. Fixture geometry does not establish initial substrate mass. Numerical mass residual is not experimental error. Internal functional review is not independent expert or official curriculum certification.</p><script id="copper-plating-record-inputs" type="application/json">${JSON.stringify(r).replace(/</g,'\\u003c')}</script></html>`}
