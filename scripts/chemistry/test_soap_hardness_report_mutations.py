import json,re,tempfile
from pathlib import Path
from validate_soap_hardness_report import validate
html=Path('reports/chemistry-expansion/CL-0109/reference-practical.html').read_text();out=[]
def change(key,part,fn):
 p=re.compile(r'(<section class="worked" data-key="'+re.escape(key)+r'">[\s\S]*?<p class="'+part+r'">)([\s\S]*?)(</p>)')
 m=p.search(html);assert m;return html[:m.start(2)]+fn(m[2])+html[m.end(2):]
mutations={
 'wrong-subtraction-operator-with-zero-dose':change('control.remainingStockSoapMol','substitution',lambda s:s.replace('−','+',1)),
 'wrong-sample-operand-hidden-by-zero-calcium':change('control.calciumMol','substitution',lambda s:s.replace('50.000000000000000','75.000000000000000',1)),
 'wrong-hardness-unit':change('mixed.initialHardnessMgL','result',lambda s:s.replace('mg/L as CaCO₃','mol/L')),
 'invented-free-soap':change('mixed.freeOleateMol','result',lambda s:'0.01 mol'),
 'invented-foam':change('control.foamProxy','result',lambda s:'1 index'),
 'wrong-stock-mass':change('control.remainingStockG','result',lambda s:'21 g'),
 'missing-worked-block':re.sub(r'<section class="worked"[\s\S]*?</section>','',html,count=1),
 'missing-observation-table':html.replace('<table>','<div>',1),
 'wrong-counterion-factor':change('mixed.chlorideMol','substitution',lambda s:s.replace('2 ×','1 ×',1)),
 'wrong-table-volume-unit':html.replace('<th>Sample mL</th>','<th>Sample L</th>',1),
 'wrong-table-observation':html.replace('<td>0.0000000000000000</td>','<td>1.0000000000000000</td>',1)
}
for name,bad in mutations.items():
 assert bad!=html,name
 with tempfile.TemporaryDirectory()as d:
  p=Path(d)/'bad.html';p.write_text(bad)
  try:validate(p)
  except (AssertionError,ValueError):out.append({'mutation':name,'rejected':True})
  else:raise AssertionError('Corrupted report escaped: '+name)
Path('reports/chemistry-expansion/CL-0109/report-mutation-checks.json').write_text(json.dumps(out,indent=2)+'\n')
print(len(out),'report corruptions rejected')
