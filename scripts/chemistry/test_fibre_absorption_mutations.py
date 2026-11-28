import copy,json
from pathlib import Path
from validate_fibre_absorption import validate
rows=json.loads(Path('reports/chemistry-expansion/CL-0112/core-reference.json').read_text());validate(rows);out=[]
for key in['uptakeG','strongAtLiftG','drainableAtLiftG','drainableRemainingG','drainedG','retainedG','remainingBathG','wetCouponG','dryBasisGainPercent','wetBasisWaterPercent','indicatedWaterG','materialResidualG','waterResidualG','wetGrossMilliG']:
 bad=copy.deepcopy([rows[100]]);bad[0]['cells'][0][key]+=.01 if not key.endswith('MilliG')else 1
 try:validate(bad)
 except AssertionError:out.append({'field':key,'rejected':True})
 else:raise AssertionError('Corruption escaped: '+key)
tiny=rows[-4];assert 0<tiny['cells'][0]['retainedG']<1e-12
bad=copy.deepcopy([tiny]);bad[0]['cells'][0]['retainedG']=0
try:validate(bad)
except AssertionError:out.append({'field':'erased-tiny-positive-retained-water','rejected':True})
else:raise AssertionError('Erased retained water escaped')
Path('reports/chemistry-expansion/CL-0112/core-mutation-checks.json').write_text(json.dumps(out,indent=2)+'\n');print(len(out),'core corruptions rejected')
