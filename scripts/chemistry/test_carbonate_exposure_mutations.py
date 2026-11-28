import copy,json
from pathlib import Path
from validate_carbonate_exposure import validate
rows=json.loads(Path('reports/chemistry-expansion/CL-0111/core-reference.json').read_text());out=[]
for key in['specimenLostG','remainingSpecimenG','generatedWaterG','carbonDioxideMol','capturedGasMl','escapedGasG','nitrateMol','remainingAcidMol','aqueousChargeResidualMol','materialResidualG','retainedAccountG']:
 bad=copy.deepcopy(rows[:1]);bad[0]['cells'][2][key]+=.01
 try:validate(bad)
 except AssertionError:out.append({'field':key,'rejected':True})
 else:raise AssertionError('Corruption escaped: '+key)
tiny=next(r for r in reversed(rows)if 0<r['cells'][2]['specimenLostG']<1e-18)
bad=copy.deepcopy([tiny]);bad[0]['cells'][2]['specimenLostG']=0
try:validate(bad)
except AssertionError:out.append({'field':'erased-small-positive-carbonate-conversion','rejected':True})
else:raise AssertionError('Small positive conversion was erased without rejection')
Path('reports/chemistry-expansion/CL-0111/core-mutation-checks.json').write_text(json.dumps(out,indent=2)+'\n');print(len(out),'core corruptions rejected')
