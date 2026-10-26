export const dnaExamples=['ATGGCTTTT','ATGGCCTTC','ATGTATTTT'] as const;
export const rnaExamples=['AUGGCUUUU','AUGGCCUUC','AUGUAUUUU'] as const;
export const complementDNA=(s:string)=>{if(!/^[ACGT]*$/.test(s))throw new RangeError('DNA alphabet required');return[...s].map(b=>({A:'T',T:'A',G:'C',C:'G'}[b])).join('')};
export const codingToRNA=(s:string)=>{complementDNA(s);return s.replaceAll('T','U')};
const code:Record<string,string>={AUG:'Met',UAU:'Tyr',GCU:'Ala',GCC:'Ala',UUU:'Phe',UUC:'Phe'};
export function translateExample(rna:string){if(rna.length%3)throw new RangeError('Complete codons required');return Array.from({length:rna.length/3},(_,i)=>{const c=rna.slice(i*3,i*3+3);if(!code[c])throw new RangeError('This teaching table covers only displayed example codons');return code[c]})}
export function energyChain(input:number,efficiency:number){if(!Number.isFinite(input)||input<0||!Number.isFinite(efficiency)||efficiency<0||efficiency>1)throw new RangeError('Invalid energy budget');return{producer:input,herbivore:input*efficiency,secondary:input*efficiency**2,tertiary:input*efficiency**3}}
