import json,copy
from pathlib import Path
from validate_soap_hardness import validate
rows=json.loads(Path('reports/chemistry-expansion/CL-0109/core-reference.json').read_text())
out=[]
for key in['freeOleateMol','calciumPrecipitatedMol','magnesiumRemainingMol','chlorideMol','materialResidualG','aqueousChargeResidualMol','initialHardnessMgL','residualHardnessMgL','foamProxy','remainingStockG','deliveredCarrierG']:
 bad=copy.deepcopy(rows[:1]);bad[0]['cells'][3][key]+=.01
 try:validate(bad)
 except AssertionError:out.append({'field':key,'rejected':True})
 else:raise AssertionError('Corruption escaped: '+key)
Path('reports/chemistry-expansion/CL-0109/core-mutation-checks.json').write_text(json.dumps(out,indent=2)+'\n')
print(len(out),'corruptions rejected')
