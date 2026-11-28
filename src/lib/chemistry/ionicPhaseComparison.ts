import { conductivityState, validateConductivity, defaultConductivity, type ConductivityInputs } from './solutionConductivity';

/** CL-0120: ideal fixed-lattice versus aqueous KCl charge transport.
 * No solid conductivity measurement, defect physics or dissolution kinetics. */
export type IonicPhase = 'solid' | 'solution' | 'water';
export interface IonicPhaseInputs {
  phase: IonicPhase;
  cell: ConductivityInputs;
}
export const defaultIonicPhase: IonicPhaseInputs = {
  phase: 'solid', cell: { ...defaultConductivity, sampleId: 'kcl001' },
};
export function validateIonicPhase(raw: unknown): IonicPhaseInputs {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new TypeError('Phase comparison inputs required');
  const r = raw as IonicPhaseInputs;
  if (!['solid', 'solution', 'water'].includes(r.phase)) throw new RangeError('Unknown material phase');
  const cell = validateConductivity(r.cell);
  if (!['kcl001', 'kcl01', 'kcl1'].includes(cell.sampleId)) throw new RangeError('Select a KCl reference for the paired comparison');
  return { phase: r.phase, cell };
}
export function ionicPhaseState(raw: unknown) {
  const q = validateIonicPhase(raw);
  const aqueous = conductivityState({ ...q.cell, sampleId: q.phase === 'water' ? 'water' : q.cell.sampleId });
  const fixedLattice = q.phase === 'solid';
  const currentRmsA = fixedLattice ? 0 : aqueous.currentRmsA;
  const instantCurrentA = fixedLattice ? 0 : aqueous.instantCurrentA;
  const readingAvailable = !fixedLattice && aqueous.excited;
  return {
    inputs: q, fixedLattice, temperatureC: 25,
    appliedVoltageRmsV: aqueous.cellVoltageRmsV,
    instantVoltageV: aqueous.instantVoltageV,
    currentRmsA, instantCurrentA,
    meanPowerW: aqueous.cellVoltageRmsV * currentRmsA,
    positiveIonDirection: fixedLattice ? 0 : aqueous.positiveIonDirection,
    negativeIonDirection: fixedLattice ? 0 : aqueous.negativeIonDirection,
    externalElectronDirection: fixedLattice ? 0 : aqueous.externalElectronDirection,
    assignedSolutionConductivitySM: fixedLattice ? null : aqueous.conductivitySM,
    reconstructedConductivitySM: readingAvailable ? aqueous.reconstructedConductivitySM : null,
    measuredConductanceS: readingAvailable ? aqueous.measuredConductanceS : null,
    solidConductivitySM: null,
    readingAvailable,
    carrierDescription: fixedLattice ? 'K+ and Cl− already exist at fixed lattice sites; no bulk translational drift in this idealization.' : q.phase === 'water' ? 'Ideal water background: H3O+ and OH− carry the small bulk current.' : 'Pre-existing K+ and Cl− ions are dispersed and hydrated; opposite drift carries liquid current.',
    interpretation: fixedLattice ? 'Zero ideal transport current is a model condition, not a measured zero solid conductivity. Defects, humidity and temperature dependence are excluded.' : aqueous.excited ? 'Ideal in-phase aqueous bulk reading; electrode interface and reactive currents excluded.' : 'No inverse conductivity reading without a connected, wetted and nonzero source.',
    aqueousReference: aqueous,
  };
}
export function ionicPhaseGuide(seconds: number, base: IonicPhaseInputs) {
  if (!Number.isFinite(seconds) || seconds < 0 || seconds > 150) throw new RangeError('Guide time 0–150 seconds required');
  const q = validateIonicPhase(base);
  const stage = seconds < 20 ? 0 : seconds < 45 ? 1 : seconds < 65 ? 2 : seconds < 100 ? 3 : seconds < 125 ? 4 : seconds < 140 ? 5 : 6;
  const titles = ['Predict the charge carriers', 'Inspect the solid ionic lattice', 'Separate and hydrate existing ions', 'Follow aqueous ionic drift', 'Compare the water background', 'Reverse the AC field', 'Write the evidence-based conclusion'];
  const phase: IonicPhase = stage <= 2 ? 'solid' : stage === 4 ? 'water' : 'solution';
  return { seconds, stage, title: titles[stage], recordable: seconds >= 140,
    // Explanatory dissolution progress is not used as an electrical mixing law.
    dissolutionIllustration: stage === 2 ? (seconds - 45) / 20 : stage > 2 ? 1 : 0,
    inputs: { ...q, phase, cell: { ...q.cell, phaseCycle: (seconds % 4) / 4 } },
  };
}
