import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { SceneProps } from '../types';
import { cellBoundary, cellJourney, cellStructures, type CellPoint } from './cellJourney';

function biologicalTexture() {
  const size = 128;
  const bytes = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const grain = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const shade = 150 + 28 * Math.sin(x * 0.18) * Math.cos(y * 0.14) + 28 * (grain - Math.floor(grain));
      const offset = (y * size + x) * 4;
      bytes[offset] = bytes[offset + 1] = bytes[offset + 2] = shade;
      bytes[offset + 3] = 255;
    }
  }
  const texture = new THREE.DataTexture(bytes, size, size, THREE.RGBAFormat);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function Fiber({ points, color, radius = 0.014, opacity = 1 }: {
  points: CellPoint[]; color: string; radius?: number; opacity?: number;
}) {
  const key = JSON.stringify(points);
  const geometry = useMemo(() => new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point))),
    Math.max(24, points.length * 4), radius, 6, false,
  ), [key, radius]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh castShadow receiveShadow geometry={geometry}><meshStandardMaterial color={color} roughness={0.6} transparent={opacity < 1} opacity={opacity} depthWrite={opacity === 1} /></mesh>;
}

function Bead({ at, radius, color }: { at: CellPoint; radius: number; color: string }) {
  return <mesh castShadow receiveShadow position={at}><sphereGeometry args={[radius, 16, 12]} /><meshStandardMaterial color={color} roughness={0.52} /></mesh>;
}

type BeadInstance = { at: CellPoint; radius: number; color: string };

function BeadCloud({ entries }: { entries: BeadInstance[] }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    if (!mesh.current) return;
    const matrix = new THREE.Matrix4();
    const rotation = new THREE.Quaternion();
    entries.forEach((entry, index) => {
      matrix.compose(new THREE.Vector3(...entry.at), rotation, new THREE.Vector3(entry.radius, entry.radius, entry.radius));
      mesh.current!.setMatrixAt(index, matrix);
      mesh.current!.setColorAt(index, new THREE.Color(entry.color));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [entries]);
  return <instancedMesh ref={mesh} args={[undefined, undefined, entries.length]} castShadow receiveShadow>
    <sphereGeometry args={[1, 12, 10]} />
    <meshStandardMaterial roughness={0.6} />
  </instancedMesh>;
}

function Caption({ text, at, color = '#d8e9e6' }: { text: string; at: CellPoint; color?: string }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 96;
    const context = canvas.getContext('2d')!;
    context.fillStyle = 'rgba(5, 17, 24, .88)';
    context.beginPath();
    context.roundRect(1, 1, 510, 94, 16);
    context.fill();
    context.font = '500 30px system-ui';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = color;
    context.fillText(text, 256, 49);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    return map;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <sprite position={at} scale={[1.65, 0.31, 1]} renderOrder={20}><spriteMaterial map={texture} transparent depthTest={false} /></sprite>;
}

function FoldedMembrane({ type, index, color, texture }: {
  type: 'er' | 'golgi' | 'crista'; index: number; color: string; texture: THREE.Texture;
}) {
  const geometry = useMemo(() => {
    const vertices: number[] = [];
    const indices: number[] = [];
    const width = 40;
    const depth = 12;
    for (let v = 0; v <= depth; v++) {
      for (let u = 0; u <= width; u++) {
        const s = u / width;
        const t = v / depth;
        if (type === 'er') {
          const angle = -0.25 + s * Math.PI * 1.45;
          const radial = 0.92 + index * 0.115 + Math.cos(t * Math.PI * 2) * 0.075;
          vertices.push(-0.85 + Math.cos(angle) * radial, 0.12 + Math.sin(angle) * radial * 0.76, -0.24 + index * 0.105 + 0.025 * Math.sin(s * 19 + index) + Math.sin(t * Math.PI * 2) * 0.038);
        } else if (type === 'golgi') {
          const taper = Math.sin(s * Math.PI);
          vertices.push((s - 0.5) * (1.08 - index * 0.035), index * 0.125 + 0.1 * Math.cos((s - 0.5) * Math.PI) + 0.037 * Math.sin(t * Math.PI * 2) * taper, 0.26 * Math.cos(t * Math.PI * 2) * taper + 0.025 * Math.sin(s * 8 + index));
        } else {
          vertices.push(-0.39 + index * 0.105 + 0.035 * Math.sin(t * 6), (t - 0.5) * 0.3, 0.04 + Math.sin(s * Math.PI) * (0.12 + 0.025 * Math.cos(t * 6)));
        }
      }
    }
    for (let v = 0; v < depth; v++) for (let u = 0; u < width; u++) {
      const a = v * (width + 1) + u;
      const b = a + width + 1;
      indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
    const result = new THREE.BufferGeometry();
    result.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    result.setIndex(indices);
    result.computeVertexNormals();
    return result;
  }, [type, index]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh castShadow receiveShadow geometry={geometry}><meshPhysicalMaterial color={color} side={THREE.DoubleSide} roughness={0.48} bumpMap={texture} bumpScale={0.015} clearcoat={0.22} /></mesh>;
}

function Mitochondrion({ at, angle, texture, selected, onSelect }: {
  at: CellPoint; angle: number; texture: THREE.Texture; selected: boolean; onSelect: () => void;
}) {
  return <group position={at} rotation={[0.12, -0.1, angle]} onClick={event => { event.stopPropagation(); onSelect(); }}>
    <mesh castShadow receiveShadow scale={[0.57, 0.25, 0.25]}><sphereGeometry args={[1, 48, 32, Math.PI, Math.PI]} /><meshPhysicalMaterial color={selected ? '#e9ba86' : '#bd8060'} roughness={0.4} bumpMap={texture} bumpScale={0.035} side={THREE.DoubleSide} clearcoat={0.3} /></mesh>
    <mesh castShadow receiveShadow scale={[0.515, 0.205, 0.21]}><sphereGeometry args={[1, 40, 24, Math.PI, Math.PI]} /><meshStandardMaterial color='#684b40' side={THREE.DoubleSide} roughness={0.65} /></mesh>
    {Array.from({ length: 8 }, (_, index) => <FoldedMembrane key={index} type='crista' index={index} texture={texture} color='#d5a57e' />)}
    <Fiber points={Array.from({ length: 65 }, (_, i) => [0.57 * Math.cos(i / 64 * Math.PI * 2), 0.25 * Math.sin(i / 64 * Math.PI * 2), 0] as CellPoint)} color='#e8bc91' radius={0.012} />
  </group>;
}

export default function CellScene(props: SceneProps) {
  const { p, selected, onSelect, focus = '', labels, guided, phase = 0, chapterIndex = 0, time } = props;
  const texture = useMemo(biologicalTexture, []);
  useEffect(() => () => texture.dispose(), [texture]);
  const shell = useMemo(() => {
    const geometry = new THREE.SphereGeometry(1, 96, 64, p.cutaway ? Math.PI : 0, p.cutaway ? Math.PI : Math.PI * 2);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i), y = position.getY(i), z = position.getZ(i);
      const angle = Math.atan2(y, x);
      const shape = 1 + 0.035 * Math.sin(3 * angle) + 0.018 * Math.cos(5 * angle);
      position.setXYZ(i, x * 2.78 * shape, y * 1.7 * shape, z * 1.38);
    }
    geometry.computeVertexNormals();
    return geometry;
  }, [p.cutaway]);
  useEffect(() => () => shell.dispose(), [shell]);
  const is = (name: string) => selected === name || focus === name;
  const select = (name: string) => (event: { stopPropagation: () => void }) => { event.stopPropagation(); onSelect(name); };
  const journey = cellJourney(chapterIndex, phase);
  const rim = useMemo(() => Array.from({ length: 121 }, (_, index) => cellBoundary(index / 120 * Math.PI * 2)), []);
  const anchors: Record<string, CellPoint> = { Nucleus: cellStructures.nucleus, Mitochondrion: cellStructures.mitochondrion, 'Golgi apparatus': cellStructures.golgi, 'Cell membrane': cellStructures.membrane, 'Rough ER': [0, 0.65, 0.3], Ribosomes: cellStructures.ribosome, Vesicle: [2.1, -0.4, 0.4] };
  const selectedAnchor = anchors[selected] ?? cellStructures.nucleus;
  const cargoAt = guided ? journey.position : cellJourney(3, (time % 12) / 12).position;

  return <group>
    <fog attach='fog' args={['#07131c', 15, 30]} />
    <pointLight position={[0, 1, 3]} color='#a7d7c6' intensity={2.2} distance={9} />
    <mesh castShadow receiveShadow geometry={shell} onClick={select('Cell membrane')}>
      <meshPhysicalMaterial color={is('Cell membrane') ? '#86bda8' : '#507b70'} side={THREE.DoubleSide} roughness={0.4} bumpMap={texture} bumpScale={0.065} clearcoat={0.35} transparent opacity={p.cutaway ? 0.82 : 0.34} depthWrite={p.cutaway} />
    </mesh>
    <group position={cellStructures.membrane} rotation={[0, Math.PI / 2, 0]} onClick={select('Cell membrane')}>
      <mesh castShadow><torusGeometry args={[0.085, 0.025, 10, 24]} /><meshStandardMaterial color='#a8b6a2' roughness={0.5} /></mesh>
      <mesh position={[0, 0, 0.12]}><torusGeometry args={[0.085, 0.025, 10, 24]} /><meshStandardMaterial color='#a8b6a2' roughness={0.5} /></mesh>
    </group>
    {p.cutaway && <>
      <Fiber points={rim} color='#a2c9ad' radius={0.034} />
      <BeadCloud entries={Array.from({ length: 120 }, (_, index) => {
        const point = cellBoundary(index / 120 * Math.PI * 2);
        return [
          { at: [point[0], point[1], 0.022] as CellPoint, radius: 0.029, color: '#b7c9a0' },
          { at: [point[0] * 0.982, point[1] * 0.982, 0.022] as CellPoint, radius: 0.022, color: '#7ca68e' },
        ];
      }).flat()} />
    </>}
    {Array.from({ length: 10 }, (_, index) => <Fiber key={index} points={Array.from({ length: 18 }, (_, j) => {
      const angle = j / 17 * Math.PI * 1.7 + index * 0.51;
      return [Math.cos(angle) * (1.65 + index * 0.07), Math.sin(angle) * (0.92 + index * 0.04), -0.75 + 0.12 * Math.sin(angle * 2 + index)] as CellPoint;
    })} color='#739d8c' radius={0.007} opacity={0.28} />)}
    <group position={cellStructures.nucleus} onClick={select('Nucleus')}>
      <mesh castShadow receiveShadow scale={[0.82, 0.76, 0.7]}><sphereGeometry args={[1, 64, 48, p.cutaway ? Math.PI : 0, p.cutaway ? Math.PI : Math.PI * 2]} /><meshPhysicalMaterial color={is('Nucleus') ? '#b6a0c7' : '#887498'} bumpMap={texture} bumpScale={0.045} roughness={0.48} side={THREE.DoubleSide} clearcoat={0.25} /></mesh>
      <mesh castShadow receiveShadow scale={[0.775, 0.718, 0.66]}><sphereGeometry args={[1, 48, 32, Math.PI, Math.PI]} /><meshStandardMaterial color='#5b4b6b' side={THREE.DoubleSide} roughness={0.7} /></mesh>
      <Bead at={[-0.16, -0.09, 0.12]} radius={0.23} color='#baa2b7' />
      {Array.from({ length: 14 }, (_, index) => <Fiber key={index} points={Array.from({ length: 30 }, (_, j) => {
        const a = j / 29 * Math.PI * 3;
        const radius = 0.23 + 0.27 * (0.5 + 0.5 * Math.sin(a * 2.7 + index));
        return [radius * Math.sin(a * 1.6 + index * 1.8), radius * Math.cos(a * 2.3 + index), 0.24 * Math.sin(a * 2.1 + index)] as CellPoint;
      })} color={index % 2 ? '#b69cba' : '#8f7aab'} radius={0.015} />)}
      {Array.from({ length: 14 }, (_, index) => {
        const angle = index / 14 * Math.PI * 2;
        return <mesh castShadow receiveShadow key={index} position={[0.79 * Math.cos(angle), 0.73 * Math.sin(angle), 0.025]}><torusGeometry args={[0.027, 0.01, 6, 16]} /><meshStandardMaterial color='#c8b2c7' roughness={0.5} /></mesh>;
      })}
    </group>
    <group onClick={select('Rough ER')}>
      {Array.from({ length: 6 }, (_, index) => <FoldedMembrane key={index} type='er' index={index} color={is('Rough ER') ? '#b3a6b9' : '#8b849a'} texture={texture} />)}
      <BeadCloud entries={Array.from({ length: 54 }, (_, index) => {
        const sheet = index % 6;
        const angle = -0.1 + Math.floor(index / 6) / 8 * Math.PI * 1.3;
        const radial = 0.92 + sheet * 0.115;
        return { at: [-0.85 + Math.cos(angle) * radial, 0.12 + Math.sin(angle) * radial * 0.76, -0.2 + sheet * 0.105] as CellPoint, radius: 0.031, color: '#d2c3b6' };
      })} />
    </group>
    <Mitochondrion at={[1.12, 0.96, 0.16]} angle={-0.28} texture={texture} selected={is('Mitochondrion')} onSelect={() => onSelect('Mitochondrion')} />
    <Mitochondrion at={[-1.46, -0.94, 0.1]} angle={0.36} texture={texture} selected={is('Mitochondrion')} onSelect={() => onSelect('Mitochondrion')} />
    <Mitochondrion at={[0.6, -1.1, 0.13]} angle={-0.14} texture={texture} selected={is('Mitochondrion')} onSelect={() => onSelect('Mitochondrion')} />
    <group position={[1.27, -0.48, 0.25]} rotation={[0.1, 0.12, -0.3]} onClick={select('Golgi apparatus')}>
      {Array.from({ length: 6 }, (_, index) => <FoldedMembrane key={index} type='golgi' index={index} color={is('Golgi apparatus') ? '#dca993' : '#b78979'} texture={texture} />)}
      {Array.from({ length: 5 }, (_, index) => <Bead key={index} at={[0.59 + 0.06 * Math.sin(index), index * 0.11, 0.06]} radius={0.052 + index % 2 * 0.014} color='#ceb295' />)}
    </group>
    <group position={cellStructures.ribosome} onClick={select('Ribosomes')}>
      <mesh castShadow receiveShadow scale={[0.1, 0.065, 0.08]}><sphereGeometry args={[1, 24, 18]} /><meshStandardMaterial color='#cbbfa8' roughness={0.6} /></mesh>
      <mesh castShadow receiveShadow position={[0, 0.08, 0]} scale={[0.13, 0.09, 0.1]}><sphereGeometry args={[1, 24, 18]} /><meshStandardMaterial color='#e0cfad' roughness={0.6} /></mesh>
      {journey.chainLength > 0 && <Fiber points={Array.from({ length: journey.chainLength + 1 }, (_, index) => [0.03 + index * 0.025, 0.13 + index * 0.012 + 0.03 * Math.sin(index * 2), 0.02] as CellPoint)} color='#e0b66c' radius={0.018} />}
    </group>
    <group onClick={select('Ribosomes')}><BeadCloud entries={Array.from({ length: 70 }, (_, index) => {
      const angle = index * 2.399;
      const radial = 0.55 + 0.38 * Math.sqrt((index + 1) / 70);
      return {
        at: [Math.cos(angle) * 2.45 * radial + 0.015 * Math.sin(time + index), Math.sin(angle) * 1.46 * radial + 0.012 * Math.cos(time * 0.8 + index), -0.5 + 0.18 * Math.sin(index * 4)] as CellPoint,
        radius: index % 9 === 0 ? 0.066 : 0.023,
        color: index % 9 === 0 ? '#819f8d' : '#b9c1a7',
      };
    })} /></group>
    {guided && <Fiber points={journey.route} color='#c0aa72' radius={0.008} opacity={0.36} />}
    <group position={cargoAt} onClick={select(chapterIndex === 1 ? 'Nucleus' : 'Vesicle')}>
      {chapterIndex === 1 ? <Fiber points={Array.from({ length: 14 }, (_, index) => [(index - 6) * 0.013, 0.025 * Math.sin(index * 1.6), 0] as CellPoint)} color='#88d2d3' radius={0.018} /> : <>
        <mesh castShadow receiveShadow><sphereGeometry args={[journey.released ? 0.07 : 0.13, 32, 24]} /><meshPhysicalMaterial color='#e0bd77' roughness={0.3} transparent opacity={0.36} depthWrite={false} clearcoat={0.6} /></mesh>
        <Bead at={[0, 0, 0.025]} radius={0.043} color='#efce87' />
      </>}
    </group>
    {journey.released && Array.from({ length: 4 }, (_, index) => <Bead key={index} at={[2.57 + (phase - 0.82) * 3 + index * 0.075, -0.5 + 0.055 * Math.sin(index), 0.37]} radius={0.027} color='#e6c184' />)}
    {labels && !selected && <>
      <Caption text='Nucleus · chromatin' at={[-2.36, 1.47, 0.65]} />
      <Fiber points={[[-1.9, 1.31, 0.6], [-1.38, 0.65, 0.4]]} color='#8799a6' radius={0.006} />
      <Caption text='Cristae · inner membrane' at={[2.05, 1.65, 0.5]} />
      <Fiber points={[[1.85, 1.5, 0.4], [1.24, 1.06, 0.4]]} color='#8799a6' radius={0.006} />
      <Caption text='Golgi · folded cisternae' at={[2.1, -1.46, 0.5]} />
      <Fiber points={[[1.95, -1.29, 0.4], [1.51, -0.31, 0.4]]} color='#8799a6' radius={0.006} />
    </>}
    {labels && selected && <Caption text={selected} at={[selectedAnchor[0], selectedAnchor[1] + 0.6, 0.8]} />}
  </group>;
}
