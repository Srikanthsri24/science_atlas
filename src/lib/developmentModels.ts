const finite=(...v:number[])=>{if(v.some(x=>!Number.isFinite(x)))throw new RangeError('Finite values required')};
export function growthBend(leftRate:number,rightRate:number,hours:number,separation:number){finite(leftRate,rightRate,hours,separation);if(Math.min(leftRate,rightRate,hours)<0||separation<=0)throw new RangeError('Invalid growth geometry');const left=leftRate*hours,right=rightRate*hours;return{left,right,meanExtension:(left+right)/2,angle:(left-right)/separation}}
export function pcrCopies(initial:number,efficiency:number,cycles:number){finite(initial,efficiency,cycles);if(initial<=0||efficiency<0||efficiency>1||!Number.isInteger(cycles)||cycles<0||cycles>40)throw new RangeError('Invalid amplification inputs');return initial*(1+efficiency)**cycles}
export const tissueExamples=[
{name:'Epithelial tissue',role:'Covering, lining, absorption or secretion',process:'Illustrative absorption across a cellular sheet'},
{name:'Connective tissue',role:'Support, binding and transport in diverse forms',process:'Fibres and cells within extracellular matrix'},
{name:'Skeletal muscle tissue',role:'Force generation by contraction',process:'Illustrative shortening; not force prediction'},
{name:'Nervous tissue',role:'Communication with neurons and supporting glia',process:'Staged signal along an example neuron'},
{name:'Meristematic plant tissue',role:'Cell division contributing to growth',process:'Staged division of small actively dividing cells'},
{name:'Plant vascular tissue',role:'Xylem and phloem transport',process:'Separate illustrative water and assimilate routes'}] as const;
export const brainRegions=[{name:'Cerebrum',role:'Distributed sensory, motor and cognitive networks'},{name:'Cerebellum',role:'Coordination, timing and motor learning'},{name:'Brainstem',role:'Connecting pathways and vital regulatory functions'}] as const;
