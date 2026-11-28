import copy,json,sys
from pathlib import Path
from validate_solution_conductivity import validate
rows=json.loads(Path(sys.argv[1]).read_text());base=next(r for r in rows if r['state']['excited']and r['input']['phaseCycle']==.25);cases=[]
for field in['conductivitySM','conductivityScm','conductivityMicroScm','cellConstantMInv','bulkConductanceS','currentRmsA','meanPowerW','instantCurrentA','positiveIonDirection','negativeIonDirection','externalElectronDirection','reconstructedConductivitySM']:
 r=copy.deepcopy(base);r['state'][field]+=1;cases.append((field,r))
for selector in[lambda r:not r['input']['connected'],lambda r:r['input']['immersedDepthCm']==0,lambda r:r['input']['voltageRmsV']==0]:
 r=copy.deepcopy(next(r for r in rows if selector(r)));r['state']['reconstructedConductivitySM']=0;cases.append(('falsezero conductivity reading',r))
r=copy.deepcopy(base);r['state']['sample']['molalityMolKg']=99;cases.append(('molality changed',r))
for name,r in cases:
 try:validate([r])
 except AssertionError:continue
 raise AssertionError('Accepted corruption: '+name)
print(json.dumps(dict(rejectedCorruptions=len(cases),checks=[name for name,_ in cases])))
