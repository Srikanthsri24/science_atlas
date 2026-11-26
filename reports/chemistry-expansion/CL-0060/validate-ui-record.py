from pathlib import Path
import json,runpy,math,sys
root=Path(__file__).parent
m=runpy.run_path(str(root/'validate-rendered.py'))
data=json.loads((root/(sys.argv[1] if len(sys.argv)>1 else 'actual-practical-record.json')).read_text())
for i,(q,row) in enumerate(zip(data['record']['trials'],data['rows'])):
 assert len(row)==22 and int(row[0])==i+1
 s=m['physics'](q,q['program']);n=s['sites'];x=s['solid'];sigma=s['supersaturation'];area=m['area'](x,n)
 duration=q['fastCoolingS']*(q['slowMultiplier'] if q['program']=='slow' else 1)
 expected=[q['timeS'],q['waterG'],q['saltG'],q['fastCoolingS'],q['slowMultiplier'],q['growthFluxGcm2s'],q['nucleationPerS'],q['threshold'],duration,s['temperature'],s['capacity'],s['dissolved'],x,n,s['meanRadius'],sigma,q['growthFluxGcm2s']*area*sigma,n*.0001,q['waterG']+q['saltG']]
 for actual,value in zip(row[2:21],expected):
  assert math.isclose(float(actual),value,rel_tol=1e-6,abs_tol=6e-7),(i,actual,value)
print('PASS:',len(data['rows']),'actual GUI observation rows, all22 columns independently reconstructed.')
