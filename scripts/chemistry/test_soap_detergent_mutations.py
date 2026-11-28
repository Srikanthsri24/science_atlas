import copy,json
from pathlib import Path
from validate_soap_detergent import validate
rows=json.loads(Path('reports/chemistry-expansion/CL-0110/core-reference.json').read_text());out=[]
for key in['freeSurfactantMol','sodiumMol','chlorideMol','initialHardnessMgL','residualHardnessMgL','materialResidualG','aqueousChargeResidualMol','deliveredCarrierG','formulaMassGmol','remainingStockG']:
 bad=copy.deepcopy(rows[:1]);bad[0]['state']['cells'][3][key]+=.01
 try:validate(bad)
 except AssertionError:out.append({'field':key,'rejected':True})
 else:raise AssertionError('Corruption escaped: '+key)
for key,value in[('availableFraction',0),('nonionicCmcReferencePosition','above_reference_band'),('isSoap',True)]:
 bad=copy.deepcopy(rows[:1]);bad[0]['state']['cells'][3][key]=value
 try:validate(bad)
 except AssertionError:out.append({'field':key,'rejected':True})
 else:raise AssertionError('Corruption escaped: '+key)
Path('reports/chemistry-expansion/CL-0110/core-mutation-checks.json').write_text(json.dumps(out,indent=2)+'\n');print(len(out),'corruptions rejected')
