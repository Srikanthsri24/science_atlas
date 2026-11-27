/** CL-0095: discrete, explicitly illustrative reference-card comparison.
 * No continuous dye calibration, pigment pKa or household pH is inferred.
 */
export const cabbageReferencePH = [2, 4, 7, 9, 11] as const;
export type CabbagePH = typeof cabbageReferencePH[number];
export type CabbageFractions = [number, number, number, number, number, number];
export interface CabbageInputs {
  sampleMl: number;
  indicatorDoseUl: number;
  testPH: CabbagePH;
  fractions: CabbageFractions;
}
export const defaultCabbage: CabbageInputs = {
  sampleMl: 10, indicatorDoseUl: 25, testPH: 4,
  fractions: [0, 0, 0, 0, 0, 0],
};
export const cabbageTeachingCards = [
  { pH: 2, category: 'pink', colour: '#cc527f' },
  { pH: 4, category: 'pink', colour: '#cc527f' },
  { pH: 7, category: 'violet-blue', colour: '#7d78c4' },
  { pH: 9, category: 'blue-green', colour: '#4b9eab' },
  { pH: 11, category: 'green', colour: '#729d51' },
] as const;
export const cabbageLimitations = 'Selected teaching reference cards, not measured RGB calibration or a universal cabbage transition table. The pH values are imposed, independently maintained reference conditions at ideal25°C; trace indicator loading, buffering chemistry, activities, temperature changes, ageing and mixing kinetics are not calculated. Partial-dose hatching means the comparison protocol is incomplete, not a predicted grey solution. Matching listed reference cards does not prove an exact pH, a continuous pH interval, or chemical identity. Free-ion concentrations are optional ideal calculations, not colour measurements or conserved ion inventories.';
export function checkCabbage(q: CabbageInputs) {
  if (!q || !Number.isFinite(q.sampleMl) || q.sampleMl < 5 || q.sampleMl > 20 ||
      !Number.isFinite(q.indicatorDoseUl) || q.indicatorDoseUl < 5 || q.indicatorDoseUl > 50 ||
      !cabbageReferencePH.includes(q.testPH) || !Array.isArray(q.fractions) || q.fractions.length !== 6 ||
      !Array.from(q.fractions).every(v => Number.isFinite(v) && v >= 0 && v <= 1)) {
    throw new RangeError('Six valid delivery fractions,5–20mL references,5–50µL indicator and a selected reference pH required');
  }
}
export function cabbageIdealIons(pH: number) {
  if (!Number.isFinite(pH) || pH < 2 || pH > 11) throw new RangeError('Reference pH2–11 required');
  const hydrogenM = 10 ** -pH, pOH = 14 - pH, hydroxideM = 10 ** -pOH;
  return { pH, pOH, hydrogenM, hydroxideM, productM2: hydrogenM * hydroxideM,
    kwResidualM2: hydrogenM * hydroxideM - 1e-14,
    logResidual: -Math.log10(hydrogenM) - pH };
}
export function cabbageState(q: CabbageInputs = defaultCabbage) {
  checkCabbage(q);
  const tubes = [...cabbageReferencePH, q.testPH].map((pH, i) => {
    const card = cabbageTeachingCards.find(c => c.pH === pH)!;
    const fraction = q.fractions[i], deliveredUl = q.indicatorDoseUl * fraction;
    const deliveredMl = deliveredUl / 1000, volumeMl = q.sampleMl + deliveredMl;
    const complete = fraction === 1;
    return { index: i, id: i === 5 ? 'test' : `reference-${pH}`,
      name: i === 5 ? 'Investigation' : `Reference pH${pH}`, fraction,
      sampleMl: q.sampleMl, plannedIndicatorUl: q.indicatorDoseUl,
      deliveredUl, deliveredMl, volumeMl, volumeL: volumeMl / 1000,
      indicatorVolumeFraction: deliveredMl / volumeMl,
      volumeResidualMl: volumeMl - q.sampleMl - deliveredMl,
      complete, category: complete ? card.category : 'not-ready',
      colour: complete ? card.colour : '#8e9caa',
      ...cabbageIdealIons(pH) };
  });
  const initialStockUl = 6 * q.indicatorDoseUl;
  const deliveredTotalUl = tubes.reduce((sum, t) => sum + t.deliveredUl, 0);
  const remainingStockUl = q.indicatorDoseUl * q.fractions.reduce((sum, fraction) => sum + (1 - fraction), 0);
  const references = tubes.slice(0, 5), investigation = tubes[5];
  const ready = tubes.every(t => t.complete);
  const matchingReferences = ready ? references.filter(t => t.category === investigation.category).map(t => t.pH) : [];
  const inference = !ready ? 'Finish the selected indicator dose in all six tubes before comparing the reference cards.' :
    matchingReferences.length > 1 ? `The investigation matches the selected pH${matchingReferences.join(' and pH')} cards. This shared shade cannot distinguish those references;it does not establish a continuous pH interval.` :
    `The investigation matches the selected pH${matchingReferences[0]} card in this teaching set. A single matching card does not prove exact pH or chemical identity.`;
  return { tubes, references, investigation, initialStockUl, deliveredTotalUl, remainingStockUl,
    stockResidualUl: initialStockUl - deliveredTotalUl - remainingStockUl,
    initialSamplesMl: 6 * q.sampleMl,
    finalTubesMl: tubes.reduce((sum, t) => sum + t.volumeMl, 0),
    systemVolumeResidualMl: tubes.reduce((sum, t) => sum + t.volumeMl, 0) + remainingStockUl / 1000 - (6 * q.sampleMl + initialStockUl / 1000),
    ready, matchingReferences, inference };
}
export function cabbagePair(q: CabbageInputs, left: number, right: number) {
  const s = cabbageState(q);
  if (!Number.isInteger(left) || !Number.isInteger(right) || left < 0 || left > 5 || right < 0 || right > 5) throw new RangeError('Two tube indices0–5 required');
  const a = s.tubes[left], b = s.tubes[right], deltaPH = b.pH - a.pH;
  return { left, right, deltaPH, hydrogenRatioLeftToRight: a.hydrogenM / b.hydrogenM,
    tenPowerDelta: 10 ** deltaPH,
    sameTeachingCategory: a.complete && b.complete ? a.category === b.category : null };
}
export function cabbageGuide(seconds: number, preparation: CabbageInputs = defaultCabbage) {
  checkCabbage(preparation);
  if (!Number.isFinite(seconds) || seconds < 0 || seconds > 120) throw new RangeError('Guide0–120s required');
  // Six independent additions:5s approach +9s delivery each. Comparison holds104–120s.
  const fractions = [0, 1, 2, 3, 4, 5].map(i => Math.max(0, Math.min(1, (seconds - (20 + i * 14)) / 9))) as CabbageFractions;
  const activeIndex = seconds < 15 || seconds >= 104 ? null : Math.min(5, Math.floor((seconds - 15) / 14));
  const stage = seconds < 15 ? 'prepare' : seconds < 85 ? 'prepare-references' : seconds < 104 ? 'prepare-investigation' : 'compare';
  const inputs = { ...preparation, fractions }, state = cabbageState(inputs);
  const caption = stage === 'prepare' ? 'Read the five imposed reference pH values. These original colour cards are illustrative,not a measured universal calibration.' :
    stage === 'prepare-references' ? 'Add the same selected indicator dose to each separate reference. Record the dose and endpoint only after the selected addition is complete.' :
    stage === 'prepare-investigation' ? 'Prepare the investigation with the same procedure. Its independently specified pH is distinct from what colour matching can establish.' : state.inference;
  return { durationSeconds: 120, inputs, state, activeIndex, stage, caption };
}
