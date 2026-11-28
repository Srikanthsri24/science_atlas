import json,re,tempfile
from pathlib import Path
from validate_carbonate_exposure_report import validate
source=Path('reports/chemistry-expansion/CL-0111/reference-practical.html').read_text()
assert validate('reports/chemistry-expansion/CL-0111/reference-practical.html')['workedResults']==1008
block=re.search(r'<section class="worked" data-key="acid.specimenLostG">.*?</section>',source).group()
mutations={
 'wrong-result':source.replace(block,re.sub(r'(<p class="result">).*?(</p>)',r'\g<1>42 g\2',block),1),
 'wrong-unit':source.replace(block,block.replace(' g</p>',' kg</p>'),1),
 'wrong-operator':source.replace(block,block.replace(' × ',' + '),1),
 'wrong-operand':source.replace(block,block.replace('100.086','101.086'),1),
 'missing-worked-block':source.replace(block,'',1),
 'duplicate-worked-block':source.replace(block,block+block,1),
 'invented-removal-volume':source.replace('Undefined — no specimen, no acid or no contact','1 mL',1),
 'corrupted-observation':source.replace('<td>water</td><td>0.10000000000000001</td>','<td>water</td><td>0.20000000000000001</td>',1)}
results=[]
with tempfile.TemporaryDirectory()as tmp:
 for name,html in mutations.items():
  assert html!=source,name+' did not modify the fixture';p=Path(tmp)/'report.html';p.write_text(html)
  try:validate(p)
  except (AssertionError,ValueError,KeyError):results.append({'corruption':name,'rejected':True})
  else:raise AssertionError(name+' escaped the report checker')
Path('reports/chemistry-expansion/CL-0111/report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print(len(results),'report corruptions rejected')
