export const foundationKinds=['animals','senses','food','waterstates','house','force','shadow','sound','daynight','safety','measurement','robot','classifier'] as const;
export type FoundationKind=typeof foundationKinds[number];
export const isFoundationKind=(k:string):k is FoundationKind=>(foundationKinds as readonly string[]).includes(k);
