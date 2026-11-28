import json,sys,tempfile
from pathlib import Path
from validate_particle_arrangements_report import validate
source=Path(sys.argv[1]).read_text();cases=[]
def change(name,old,new):assert old in source,name;cases.append((name,source.replace(old,new,1)))
change('sharing operand altered with unchanged zero result','0 * 0.125</code>','0 * 1</code>')
change('sharing formula changed','Neffective(group) = raw copies * sharing weight','Neffective(group) = raw copies / sharing weight')
change('formula-unit operand changed','4 * 1</code>','8 * 1</code>')
change('raw copy charge erased','-1 elementary-charge units</p>','0 elementary-charge units</p>')
change('unit falsified','0.5 normalized cell units</p>','0.5 nm</p>')
change('arithmetic operator changed','1 / 2</code>','1 * 2</code>')
change('sharing table weight changed','<td>0.125</td>','<td>1</td>')
change('neighbour distance changed','<td>0.5</td>','<td>1</td>')
change('verification falsely claimed','Guided inspection before verification','Verified guided comparison')
change('guide timing forged','"guideSeconds":65','"guideSeconds":150')
change('molecular identity erased','<td>CH4</td>','<td>NaCl</td>')
change('table header omitted','<th>Periodic representative</th>','<th>Representative</th>')
change('duplicate calculation key','data-key="rawSites"','data-key="cells"')
with tempfile.TemporaryDirectory()as d:
 path=Path(d)/'mutated.html'
 for name,html in cases:
  path.write_text(html)
  try:validate(path)
  except(AssertionError,KeyError,ValueError):continue
  raise AssertionError('Accepted corruption: '+name)
print(json.dumps(dict(rejectedCorruptions=len(cases),checks=[name for name,_ in cases])))
