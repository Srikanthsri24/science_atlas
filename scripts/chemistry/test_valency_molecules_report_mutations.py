import json,sys,tempfile
from pathlib import Path
from validate_valency_molecules_report import validate
source=Path(sys.argv[1]).read_text();cases=[]
def change(name,old,new):
 assert old in source,name
 cases.append((name,source.replace(old,new,1)))
change('formula changed','Eshared = 2 * B','Eshared = 3 * B')
change('unit changed','0 electrons</p>','0 atoms</p>')
change('arithmetic operator changed','2 * 0</code>','2 + 0</code>')
change('operand changed','2 * 0</code>','3 * 0</code>')
change('result changed','0 electrons</p>','1 electrons</p>')
change('unfinished snapshot falsely completed','Unfinished construction snapshot','Completed manual reference')
change('verified status erased','Verified guided reference','Completed construction before verification')
change('missing shared-pair table value','<td>Shared pairs</td>','<td>Pairs</td>')if'<td>Shared pairs</td>'in source else change('table header changed','<th>Shared pairs</th>','<th>Pairs</th>')
change('missing atom observation','<td>Unplaced inventory</td>','<td>Placed</td>')
change('electron inventory changed','<td>14</td>','<td>15</td>')
change('guide time forged','"guideSeconds":42.5','"guideSeconds":150')
change('duplicate working identity','data-key="tray"','data-key="total"')
with tempfile.TemporaryDirectory()as d:
 p=Path(d)/'mutated.html'
 for name,html in cases:
  p.write_text(html)
  try:validate(p)
  except(AssertionError,KeyError,ValueError):continue
  raise AssertionError('Accepted corruption: '+name)
print(json.dumps(dict(rejectedCorruptions=len(cases),checks=[n for n,_ in cases])))
