import json,re,tempfile
from pathlib import Path
from validate_fibre_absorption_report import validate
source=Path('reports/chemistry-expansion/CL-0112/reference-practical.html').read_text();assert validate('reports/chemistry-expansion/CL-0112/reference-practical.html')['workedResults']==1296
block=re.search(r'<section class="worked" data-key="cotton.strongCapacityG">.*?</section>',source).group();exponent=re.search(r'<section class="worked" data-key="cotton.soakFraction">.*?</section>',source).group();rounding=re.search(r'<section class="worked" data-key="cotton.tareMilliG">.*?</section>',source).group()
mutations={
 'wrong-result':source.replace(block,re.sub(r'(<p class="result">).*?(</p>)',r'\g<1>42 g\2',block),1),
 'wrong-unit':source.replace(block,block.replace(' g</p>',' kg</p>'),1),
 'wrong-operator':source.replace(block,block.replace(' × ',' + '),1),
 'wrong-capacity-operand':source.replace(block,block.replace('0.29999999999999999','0.39999999999999999'),1),
 'reversed-exponential-sign':source.replace(exponent,exponent.replace('exp(−','exp('),1),
 'wrong-rounding-operation':source.replace(rounding,rounding.replace('floor(','exp('),1),
 'missing-worked-block':source.replace(block,'',1),
 'duplicate-worked-block':source.replace(block,block+block,1),
 'corrupt-dry-observation':source.replace('<td>cotton</td><td>1.5000000000000000</td>','<td>cotton</td><td>2.5000000000000000</td>',1),
 'wrong-observation-unit':source.replace('Wet gross indication mg','Wet gross indication kg',1),
 'confused-percentage-bases':source.replace('Model wet-basis water %','Model dry-basis water %',1)}
results=[]
with tempfile.TemporaryDirectory()as tmp:
 for name,html in mutations.items():
  assert html!=source,'Mutation did not change fixture: '+name;p=Path(tmp)/'report.html';p.write_text(html)
  try:validate(p)
  except (AssertionError,ValueError,KeyError):results.append({'corruption':name,'rejected':True})
  else:raise AssertionError('Corruption escaped: '+name)
Path('reports/chemistry-expansion/CL-0112/report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print(len(results),'report corruptions rejected')
