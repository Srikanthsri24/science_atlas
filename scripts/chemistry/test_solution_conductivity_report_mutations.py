import json,re,sys,tempfile
from pathlib import Path
from validate_solution_conductivity_report import validate
source=Path(sys.argv[1]).read_text();cases=[]
def change(name,old,new):assert old in source,name;cases.append((name,source.replace(old,new,1)))
change('cell constant formula changed','Kcell = l / A','Kcell = A / l')
change('conductivity conversion operand changed','0.0000055 / 100</code>','0.0000055 / 1000</code>')
change('conductivity unit changed','0.0000055 S/m</p>','0.0000055 S/cm</p>')
change('unavailable working falsely numeric','<p class="result">Unavailable</p>','<p class="result">0 S</p>')
change('unavailable table falsely zero','<td>Unavailable</td>','<td>0</td>')
change('magnitude calculation operator changed','0.05 * 5.4999999999999996e-8</code>','0.05 + 5.4999999999999996e-8</code>')
change('snapshot falsely verified','Guided snapshot before verification','Verified guided ideal bulk reading')
change('guide base forged','"guideBase":{"sampleId":"kcl001","gapCm":1','"guideBase":{"sampleId":"kcl001","gapCm":2')
change('guide time forged','"guideSeconds":112.5','"guideSeconds":150')
change('duplicate working identity','data-key="width"','data-key="gap"')
change('molality header falsified','Molality (mol/kg solvent)','Molarity (mol/L solution)')
pattern=r'(<article data-trial="27" data-key="current">.*?<p class="result">)([^<]+)(</p>)';assert re.search(pattern,source,re.S);cases.append(('tiny positive water current erased',re.sub(pattern,lambda m:m[1]+'0 A'+m[3],source,count=1,flags=re.S)))
with tempfile.TemporaryDirectory()as directory:
 path=Path(directory)/'corrupt.html'
 for name,html in cases:
  path.write_text(html)
  try:validate(path)
  except(AssertionError,KeyError,ValueError):continue
  raise AssertionError('Accepted corruption: '+name)
print(json.dumps(dict(rejectedCorruptions=len(cases),checks=[n for n,_ in cases])))
