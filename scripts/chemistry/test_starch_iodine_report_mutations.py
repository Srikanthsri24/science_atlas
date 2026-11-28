"""Check the independent report auditor rejects deliberate report corruptions."""
import json,re,tempfile
from pathlib import Path
from validate_starch_iodine_report import validate
source_path=Path('reports/chemistry-expansion/CL-0113/reference-practical.html')
source=source_path.read_text()
assert validate(source_path)['workedResults']==1584
block=re.search(r'<section class="worked" data-key="starch.starchG">.*?</section>',source).group()
def change_result(text):
 return re.sub(r'(<p class="result">).*?(</p>)',r'\g<1>42 g\2',text)
mutations={
 'wrong-result':source.replace(block,change_result(block),1),
 'wrong-unit':source.replace(block,block.replace(' g</p>',' kg</p>'),1),
 'wrong-operator':source.replace(block,re.sub(r'(<p class="substitution">)(.*?)(</p>)',lambda m:m[1]+m[2].replace(' × ',' + ',1)+m[3],block),1),
 'missing-calculation':source.replace(block,'',1),
 'duplicate-calculation':source.replace(block,block+block,1),
 'wrong-transfer-volume-unit':source.replace('Stock left mL','Stock left L',1),
 'wrong-capacity-basis':source.replace('Selected capacity mol equivalents</th>','Selected capacity mol starch</th>',1),
 'wrong-atom-unit':source.replace('Iodine atom residual mol</th>','Iodine atom residual g</th>',1),
 'false-untested-control':source.replace('No iodine inventory — untested reference','Negative starch test',1),
 'wrong-sample-identity':source.replace('<td>starch</td>','<td>glucose</td>',1),
}
results=[]
with tempfile.TemporaryDirectory() as tmp:
 for name,html in mutations.items():
  assert html!=source,'Mutation did not change fixture: '+name
  p=Path(tmp)/'report.html';p.write_text(html)
  try:validate(p)
  except (AssertionError,ValueError,KeyError):results.append({'corruption':name,'rejected':True})
  else:raise AssertionError('Corruption escaped: '+name)
Path('reports/chemistry-expansion/CL-0113/report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n')
print(len(results),'report corruptions rejected')
