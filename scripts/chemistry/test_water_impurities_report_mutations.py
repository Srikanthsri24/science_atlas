import json,re,tempfile
from pathlib import Path
from validate_water_impurities_report import validate
p=Path('reports/chemistry-expansion/CL-0114/reference-practical.html');source=p.read_text();assert validate(p)['workedResults']==1728
block=re.search(r'<section class="worked" data-key="mixture.saltG">.*?</section>',source).group();rinse=re.search(r'<section class="worked" data-key="mixture.rinseRemovedFraction">.*?</section>',source).group()
mutations={
'wrong-result':source.replace(block,re.sub(r'(<p class="result">).*?(</p>)',r'\g<1>42 g\2',block),1),
'wrong-result-unit':source.replace(block,block.replace(' g</p>',' kg</p>'),1),
'wrong-symbolic-formula':source.replace(block,block.replace('cSalt * V','cSalt + V'),1),
'wrong-substitution-operator':source.replace(block,re.sub(r'(<p class="substitution">)(.*?)(</p>)',lambda m:m[1]+m[2].replace(' * ',' + ',1)+m[3],block),1),
'wrong-loading-operand':source.replace(block,re.sub(r'(<p class="substitution">).*?(</p>)',r'\g<1>2000 * 100 / 1000000 * 1\2',block),1),
'lost-trace-stable-operation':source.replace(rinse,rinse.replace('-expm1(-','exp(-'),1),
'missing-work':source.replace(block,'',1),
'duplicate-work':source.replace(block,block+block,1),
'wrong-rinse-unit':source.replace('Actual rinse carrier g</th>','Actual rinse carrier kg</th>',1),
'wrong-concentration-basis':source.replace('Apparent passed residue mg/L original sample</th>','Apparent passed residue mg/L receiver</th>',1),
'wrong-tare-unit':source.replace('Dry filter tare g</th>','Dry filter tare mg</th>',1),
'wrong-control-identity':source.replace('<td>water</td>','<td>mixture</td>',1),
'false-nonzero-component':source.replace('<td>water</td><td>0.0000000000000000</td>','<td>water</td><td>1.0000000000000000</td>',1),
}
results=[]
with tempfile.TemporaryDirectory()as tmp:
 for name,html in mutations.items():
  assert html!=source,'Unchanged corruption: '+name;out=Path(tmp)/'report.html';out.write_text(html)
  try:validate(out)
  except (AssertionError,ValueError,KeyError,SyntaxError):results.append({'corruption':name,'rejected':True})
  else:raise AssertionError('Escaped corruption: '+name)
Path('reports/chemistry-expansion/CL-0114/report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print(len(results),'report corruptions rejected')
