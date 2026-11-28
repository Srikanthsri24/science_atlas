import re,json,tempfile
from pathlib import Path
from validate_neutral_atoms_report import validate
p=Path('reports/chemistry-expansion/CL-0115/reference-practical.html');source=p.read_text();assert validate(p)['workedResults']==1520
block=re.search(r'<section class="worked" data-key="constructed.protonChargeC">.*?</section>',source).group();neutron=re.search(r'<section class="worked" data-key="constructed.neutrons">.*?</section>',source).group()
mutations={
'wrong-charge-result':source.replace(block,re.sub(r'(<p class="result">).*?(</p>)',r'\g<1>1 C\2',block),1),
'wrong-charge-unit':source.replace(block,block.replace(' C</p>',' count</p>'),1),
'erased-elementary-charge':source.replace(block,re.sub(r'(<p class="substitution">).*?(</p>)',r'\g<1>1 * 0\2',block),1),
'wrong-charge-operator':source.replace(block,re.sub(r'(<p class="substitution">)(.*?)(</p>)',lambda m:m[1]+m[2].replace(' * ',' + ',1)+m[3],block),1),
'wrong-symbolic-charge':source.replace(block,block.replace('Qp = pPlaced * e0','Qp = pPlaced + e0'),1),
'reversed-neutron-subtraction':source.replace(neutron,neutron.replace('n = A - Z','n = Z - A'),1),
'missing-work':source.replace(block,'',1),
'duplicate-work':source.replace(block,block+block,1),
'wrong-mass-number-unit':source.replace('Mass number A (count)</th>','Mass number A (u)</th>',1),
'wrong-charge-table-unit':source.replace('Positive charge C</th>','Positive charge eV</th>',1),
'wrong-reference-identity':source.replace('<td>Constructed</td>','<td>Comparison</td>',1),
'false-isotope-classification':source.replace('<td>Yes</td>','<td>No</td>',1),
}
results=[]
with tempfile.TemporaryDirectory()as tmp:
 for name,html in mutations.items():
  assert html!=source,'Unchanged corruption: '+name;out=Path(tmp)/'report.html';out.write_text(html)
  try:validate(out)
  except (AssertionError,ValueError,KeyError):results.append({'corruption':name,'rejected':True})
  else:raise AssertionError('Escaped corruption: '+name)
Path('reports/chemistry-expansion/CL-0115/report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print(len(results),'report corruptions rejected')
