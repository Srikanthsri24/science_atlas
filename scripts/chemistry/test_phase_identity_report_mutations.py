"""Ensure CL-0105 report audit rejects incorrect practical evidence."""
import json,re,tempfile
from pathlib import Path
from validate_phase_identity_report import validate
root=Path('reports/chemistry-expansion/CL-0105');source=(root/'reference-practical.html').read_text()
def alter(key,field,value,index=0):
 pattern=r'(<section class="worked" data-key="'+key+r'">[\s\S]*?<p class="'+field+r'">)([^<]*)(</p>)'
 matches=list(re.finditer(pattern,source));assert matches
 match=matches[index]
 return source[:match.start(2)]+value+source[match.end(2):]
cases={'wrong-latent-energy':alter('maximumFusionJ','result','999 J'),'wrong-oxygen-operand':alter('oxygenInitialG','substitution','0.01 × 32.5'),'wrong-tiny-product':alter('oxideG','result','0 g',14),'wrong-return-heat-sign':alter('returnPhaseHeatJ','result','6680 J',-1),'false-classification':source.replace('<td>false</td>','<td>true</td>',1)}
results=[]
with tempfile.TemporaryDirectory()as folder:
 for name,html in cases.items():
  path=Path(folder)/f'{name}.html';path.write_text(html)
  try:validate(path)
  except AssertionError:results.append({'mutation':name,'rejected':True})
  else:raise AssertionError('Mutation escaped: '+name)
(root/'report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print('PASS',len(results),'report mutations rejected')
