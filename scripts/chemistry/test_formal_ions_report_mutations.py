import re,json,tempfile
from pathlib import Path
from validate_formal_ions_report import validate
p=Path('reports/chemistry-expansion/CL-0116/reference-practical.html');source=p.read_text();assert validate(p)['workedResults']==540
block=re.search(r'<section class="worked" data-key="atomElectrons">.*?</section>',source).group();charge=re.search(r'<section class="worked" data-key="atomChargeC">.*?</section>',source).group()
mutations={
'wrong-electron-result':source.replace(block,re.sub(r'(<p class="result">).*?(</p>)',r'\g<1>99 count\2',block),1),
'wrong-electron-unit':source.replace(block,block.replace(' count</p>',' C</p>'),1),
'wrong-symbolic-transfer-sign':source.replace(block,block.replace('Z + completedGain','Z - completedGain'),1),
'wrong-substitution-operator':source.replace(block,re.sub(r'(<p class="substitution">)(.*?)(</p>)',lambda m:m[1]+m[2].replace(' + ',' - ',1)+m[3],block),1),
'erased-coulomb-charge':source.replace(charge,re.sub(r'(<p class="result">).*?(</p>)',r'\g<1>0 C\2',charge),1),
'wrong-coulomb-constant':source.replace(charge,re.sub(r'(<p class="substitution">).*?(</p>)',r'\g<1>1 * 1e-18\2',charge),1),
'missing-work':source.replace(block,'',1),
'duplicate-work':source.replace(block,block+block,1),
'wrong-mass-number-unit':source.replace('Mass number A (count)</th>','Mass number A (u)</th>',1),
'wrong-charge-table-unit':source.replace('Net charge C</th>','Net charge eV</th>',1),
'erased-travelling-electron':source.replace('<td>In transit</td><td>1</td>','<td>In transit</td><td>0</td>',1),
'false-verified-endpoint':source.replace('Guided transfer snapshot','Verified guided endpoint',1),
'wrong-pool-identity':source.replace('<td>Reservoir</td>','<td>Atomic reference</td>',1),
}
results=[]
with tempfile.TemporaryDirectory()as tmp:
 for name,html in mutations.items():
  assert html!=source,'Unchanged corruption: '+name;out=Path(tmp)/'report.html';out.write_text(html)
  try:validate(out)
  except (AssertionError,ValueError,KeyError):results.append({'corruption':name,'rejected':True})
  else:raise AssertionError('Escaped corruption: '+name)
Path('reports/chemistry-expansion/CL-0116/report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print(len(results),'report corruptions rejected')
