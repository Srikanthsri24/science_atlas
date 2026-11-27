import type{CurveGuidePhase}from'./solubilityCurve';
/** Automatic framing follows the scientific clock,not elapsed wall-clock time. */
export const curveGuideViews={cooling:{diagram:'overview',scene:'overview'},growth:{diagram:'detector',scene:'aggregate'},event:{diagram:'overview',scene:'overview'}}as const satisfies Record<CurveGuidePhase,{diagram:string;scene:string}>;
