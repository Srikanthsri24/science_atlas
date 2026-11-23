import { useId } from 'react';
import type { SceneProps } from '../types';
import { cellBoundary, cellJourney, cellStageNames, type CellPoint } from './cellJourney';

const project = (point: CellPoint) => [480 + point[0] * 112, 310 - point[1] * 112];
const path = (points: CellPoint[]) => points.map((point, index) => `${index ? 'L' : 'M'}${project(point).join(' ')}`).join(' ');

export default function CellDiagram({ p, labels, chapterIndex = 0, phase = 0, selected, onSelect, guided, time }: SceneProps) {
  const id = useId().replace(/:/g, '');
  const journey = cellJourney(guided ? chapterIndex : 3, guided ? phase : (time % 12) / 12);
  const [cargoX, cargoY] = project(journey.position);
  const outline = path(Array.from({ length: 121 }, (_, index) => cellBoundary(index / 120 * Math.PI * 2))) + 'Z';
  const inspect = (name: string) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': `Inspect ${name}`,
    onClick: () => onSelect(name),
    onKeyDown: (event: React.KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(name); } },
  });
  const callout = (name: string, anchor: CellPoint, x: number, y: number, right = false) => {
    const [ax, ay] = project(anchor);
    return <g {...inspect(name)} className='cell-callout'>
      <path d={`M${ax},${ay} L${right ? x - 16 : x + 140},${y - 5} H${x}`} fill='none' stroke={selected === name ? '#e5c58a' : '#6a888d'} strokeWidth='1.1' />
      <circle cx={ax} cy={ay} r='3' fill='#d5b67d' />
      <text x={x} y={y - 15} fill={selected === name ? '#efd29a' : '#bdcfce'} fontSize='14'>{name}</text>
    </g>;
  };
  return <svg className='science-diagram cell-specimen' viewBox='0 0 1000 620' role='img' aria-label='Animal cell cutaway and staged secretory pathway'>
    <title>Animal cell cutaway and secretory pathway</title>
    <desc>Inspect the membrane, nucleus, folded endoplasmic reticulum, mitochondrial cristae and Golgi. The moving marker follows the current narrated stage.</desc>
    <defs>
      <radialGradient id={id + 'background'}><stop stopColor='#183635' /><stop offset='1' stopColor='#07131c' /></radialGradient>
      <radialGradient id={id + 'cytoplasm'} cx='38%' cy='32%'><stop stopColor='#668b73' /><stop offset='.65' stopColor='#385b50' /><stop offset='1' stopColor='#243d38' /></radialGradient>
      <radialGradient id={id + 'nucleus'} cx='35%' cy='30%'><stop stopColor='#b2a0bd' /><stop offset='.7' stopColor='#7a668c' /><stop offset='1' stopColor='#483d59' /></radialGradient>
      <linearGradient id={id + 'mito'}><stop stopColor='#e0b68c' /><stop offset='.45' stopColor='#a47657' /><stop offset='1' stopColor='#61483b' /></linearGradient>
      <filter id={id + 'grain'}><feTurbulence baseFrequency='.24' numOctaves='2' seed='12' result='noise' /><feColorMatrix in='noise' type='saturate' values='0' /><feBlend in='SourceGraphic' mode='soft-light' /></filter>
      <clipPath id={id + 'clip'}><path d={outline} /></clipPath>
    </defs>
    <rect width='1000' height='620' fill={`url(#${id}background)`} />
    <text x='42' y='40' fill='#86a4a6' fontSize='11' letterSpacing='2'>ANIMAL CELL · STRUCTURAL CUTAWAY</text>
    <text x='42' y='65' fill='#d9e5de' fontSize='18'>{cellStageNames[chapterIndex] ?? cellStageNames[0]}</text>
    <g {...inspect('Cell membrane')}><path d={outline} fill={`url(#${id}cytoplasm)`} stroke='#9cb896' strokeWidth='7' /><path d={outline} fill='none' stroke='#d2d8ad' strokeWidth='1.6' /></g>
    <g clipPath={`url(#${id}clip)`} opacity='.13'><rect x='130' y='100' width='700' height='430' fill='#b2b9a0' filter={`url(#${id}grain)`} /></g>
    <g clipPath={`url(#${id}clip)`}>{Array.from({ length: 9 }, (_, index) => <ellipse key={index} cx='480' cy='310' rx={235 + index * 6} ry={124 + index * 5} fill='none' stroke='#96b29d' strokeWidth='.6' opacity='.13' transform={`rotate(${index * 24} 480 310)`} />)}</g>
    <g {...inspect('Rough ER')}>
      {Array.from({ length: 6 }, (_, index) => {
        const points = Array.from({ length: 50 }, (_, j) => {
          const a = -.25 + j / 49 * Math.PI * 1.45;
          const r = .92 + index * .115;
          return [-.85 + Math.cos(a) * r, .12 + Math.sin(a) * r * .76, 0] as CellPoint;
        });
        return <path key={index} d={path(points)} fill='none' stroke={index % 2 ? '#a299ae' : '#7c788e'} strokeWidth='8' strokeLinecap='round' />;
      })}
      {Array.from({ length: 40 }, (_, index) => {
        const a = -.1 + Math.floor(index / 5) / 7 * Math.PI * 1.3;
        const r = .95 + index % 5 * .13;
        const [x, y] = project([-.85 + Math.cos(a) * r, .12 + Math.sin(a) * r * .76, 0]);
        return <circle key={index} cx={x} cy={y} r='2.4' fill='#d1c7b1' />;
      })}
    </g>
    <g {...inspect('Nucleus')}>
      <ellipse cx='384' cy='297' rx='92' ry='85' fill={`url(#${id}nucleus)`} stroke='#c3acc7' strokeWidth='5' />
      {Array.from({ length: 14 }, (_, index) => <path key={index} d={path(Array.from({ length: 55 }, (_, j) => {
        const angle = j / 54 * Math.PI * 3;
        const radius = .23 + .27 * (.5 + .5 * Math.sin(angle * 2.7 + index));
        return [-.86 + radius * Math.sin(angle * 1.6 + index * 1.8), .12 + radius * Math.cos(angle * 2.3 + index), 0] as CellPoint;
      }))} fill='none' stroke={index % 2 ? '#d4bacb' : '#9982b0'} strokeWidth='1.5' opacity='.55' />)}
      <circle cx='367' cy='308' r='24' fill='#c0a0ad' stroke='#d1b2bf' strokeWidth='2' />
      {Array.from({ length: 14 }, (_, index) => <ellipse key={index} cx={384 + 90 * Math.cos(index / 14 * Math.PI * 2)} cy={297 + 83 * Math.sin(index / 14 * Math.PI * 2)} rx='4' ry='3' fill='#403c52' stroke='#d4bdcd' strokeWidth='1.5' />)}
    </g>
    {[[1.12, .96, -.28], [-1.46, -.94, .36], [.6, -1.1, -.14]].map(([x, y, angle], index) => {
      const [cx, cy] = project([x, y, 0]);
      return <g key={index} transform={`translate(${cx} ${cy}) rotate(${-angle * 180 / Math.PI})`} {...inspect('Mitochondrion')}>
        <ellipse rx='64' ry='28' fill={`url(#${id}mito)`} stroke='#d6ae83' strokeWidth='3' />
        <ellipse rx='57' ry='22' fill='#70513e' />
        {Array.from({ length: 8 }, (_, j) => <path key={j} d={`M${-44 + j * 12},-16 Q${-32 + j * 12},-7 ${-44 + j * 12},0 Q${-52 + j * 12},8 ${-42 + j * 12},17`} fill='none' stroke='#d2a77c' strokeWidth='3.5' />)}
      </g>;
    })}
    <g transform='translate(622 348) rotate(17)' {...inspect('Golgi apparatus')}>
      {Array.from({ length: 6 }, (_, index) => <path key={index} d={`M${-57 + index * 2},${-28 + index * 11} Q0,${-52 + index * 11} ${57 - index * 2},${-28 + index * 11}`} fill='none' stroke={index % 2 ? '#d1a18a' : '#a87e70'} strokeWidth='8' strokeLinecap='round' />)}
      {[0, 1, 2, 3].map(index => <circle key={index} cx={68 + index % 2 * 7} cy={-27 + index * 15} r='5' fill='#c5a78b' />)}
    </g>
    {Array.from({ length: 54 }, (_, index) => {
      const a = index * 2.399;
      const [x, y] = project([Math.cos(a) * 2.25, Math.sin(a) * 1.4, 0]);
      return <circle key={index} cx={x} cy={y} r={index % 9 === 0 ? 6 : 1.8} fill={index % 9 === 0 ? '#83a18b' : '#c5c9ad'} />;
    })}
    <g transform='translate(493 225)' {...inspect('Ribosomes')}>
      <path d='M-23 9 Q-8 3 4 9 T29 9' fill='none' stroke='#97cdd0' strokeWidth='2' />
      <ellipse cy='5' rx='11' ry='7' fill='#c4b59a' />
      <ellipse cy='-6' rx='14' ry='10' fill={selected === 'Ribosomes' ? '#f1d694' : '#e0cfad'} />
    </g>
    {guided && <path d={path(journey.route)} fill='none' stroke='#c5ae77' strokeWidth='1.4' strokeDasharray='4 6' opacity='.6' />}
    <g transform={`translate(${cargoX} ${cargoY})`}>
      {chapterIndex === 1 ? <path d='M-10 0 Q-6 -6 -2 0 T6 0 T14 0' fill='none' stroke='#9ddadc' strokeWidth='4' /> : <><circle r='14' fill='#e5bd6a' fillOpacity='.18' stroke={selected === 'Vesicle' ? '#fff1bd' : '#dbbc7b'} strokeWidth='1.5' /><circle r='4.5' fill='#f0d291' /></>}
    </g>
    {journey.chainLength > 0 && <path d={path(Array.from({ length: journey.chainLength + 1 }, (_, index) => [.12 + index * .027, .89 + index * .012 + .025 * Math.sin(index * 2), .6] as CellPoint))} fill='none' stroke='#efd099' strokeWidth='3' />}
    {journey.released && [0, 1, 2, 3].map(index => <circle key={index} cx={768 + (phase - .82) * 340 + index * 9} cy={366 + Math.sin(index) * 6} r='3' fill='#efd099' />)}
    {!p.cutaway && <path d={outline} fill='#607f6b' fillOpacity='.72' />}
    {labels && <>
      {callout('Nucleus', [-1.1, .3, 0], 45, 218)}
      {callout('Rough ER', [-.05, 1.02, 0], 100, 113)}
      {callout('Mitochondrion', [1.12, .96, 0], 824, 171, true)}
      {callout('Golgi apparatus', [1.27, -.17, 0], 824, 416, true)}
      {callout('Cell membrane', [2.55, -.5, 0], 808, 515, true)}
    </>}
    <g transform='translate(42 568)'><circle r='4' fill='#94d4d5' /><text x='12' y='4' fill='#a5bfbe' fontSize='12'>RNA message</text><circle cx='141' r='4' fill='#e7c486' /><text x='153' y='4' fill='#a5bfbe' fontSize='12'>Protein / transport cargo</text></g>
    <text x='42' y='599' fill='#6f9395' fontSize='10'>Illustrative geometry and staged timing · colour distinguishes structures and cargo</text>
  </svg>;
}
