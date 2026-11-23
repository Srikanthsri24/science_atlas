export type CellPoint = [number, number, number];

export const cellStructures = {
  membrane: [2.68, 0.18, 0.38] as CellPoint,
  nucleus: [-0.86, 0.12, 0.12] as CellPoint,
  ribosome: [0.12, 0.76, 0.62] as CellPoint,
  golgi: [1.27, -0.17, 0.25] as CellPoint,
  mitochondrion: [1.12, 0.96, 0.16] as CellPoint,
};

export const cellStageNames = [
  'Selective transport',
  'RNA leaves the nucleus',
  'A protein is assembled',
  'Cargo reaches the Golgi',
  'Cargo is released',
  'Energy supports cell activity',
];

export function cellBoundary(angle: number): CellPoint {
  const contour = 1 + 0.035 * Math.sin(3 * angle) + 0.018 * Math.cos(5 * angle);
  return [2.78 * Math.cos(angle) * contour, 1.7 * Math.sin(angle) * contour, 0];
}

export function pathPoint(points: CellPoint[], progress: number): CellPoint {
  if (progress <= 0) return [...points[0]] as CellPoint;
  if (progress >= 1) return [...points[points.length - 1]] as CellPoint;
  const scaled = Math.max(0, Math.min(1, progress)) * (points.length - 1);
  const index = Math.min(points.length - 2, Math.floor(scaled));
  const fraction = scaled - index;
  const eased = fraction * fraction * (3 - 2 * fraction);
  return points[index].map((value, axis) => value + (points[index + 1][axis] - value) * eased) as CellPoint;
}

export function cellJourney(stage: number, progress: number) {
  const phase = Math.max(0, Math.min(1, progress));
  const routes: CellPoint[][] = [
    [[3.18, 0.18, 0.38], cellStructures.membrane, [2.12, 0.18, 0.38]],
    [[-0.66, 0.22, 0.48], [-0.14, 0.43, 0.62], cellStructures.ribosome],
    [cellStructures.ribosome, [0.38, 0.64, 0.62]],
    [[0.4, 0.55, 0.5], [0.7, 0.52, 0.65], [0.9, 0.1, 0.6], cellStructures.golgi],
    [[1.6, -0.23, 0.48], [2.07, -0.45, 0.56], [2.57, -0.5, 0.36]],
    [[1.12, 0.96, 0.46], [0.72, 1.19, 0.55], [0.16, 0.84, 0.65]],
  ];
  const index = Math.max(0, Math.min(routes.length - 1, stage));
  return {
    route: routes[index],
    position: pathPoint(routes[index], phase),
    phase,
    released: index === 4 && phase >= 0.82,
    chainLength: index === 2 ? Math.floor(phase * 15) : 0,
  };
}
