"""Challenge CL-0107 report verification with wrong physics, operators, units and evidence."""
import re,json,tempfile
from pathlib import Path
from validate_salt_corrosion_report import validate
root=Path('reports/chemistry-expansion/CL-0107');source=(root/'reference-practical.html').read_text()
def alter(key,field,value,index=0):
 pattern=r'(<section class="worked" data-key="'+re.escape(key)+r'">[\s\S]*?<p class="'+field+r'">)([^<]*)(</p>)';matches=list(re.finditer(pattern,source));assert matches;match=matches[index];return source[:match.start(2)]+value+source[match.end(2):]
cases={
 'wrong-operator-same-operands':alter('a.saltG','substitution','50 + 0.005 /100'),
 'wrong-primary-electron-count':alter('a.convertedIronMol','substitution','min(0.5 /55.845,0 / (3 * 96485.33212331001))'),
 'cathodic-only-oxygen-ceiling':alter('b.oxygenCeilingAM2','result','9 A/m\u00b2',1),
 'missing-open-account-input':alter('b.externalInputG','result','0 g',1),
 'wrong-worked-mass-unit':alter('a.convertedIronG','result','0 kg'),
 'wrong-table-density-unit':source.replace('Saved entered density g/mL','Saved entered density g/L',1),
 'erased-trace-penetration':alter('a.penetrationPerFaceMm','result','0 mm',12),
 'current-after-metal-exhaustion':alter('a.instantaneousCurrentA','result','0.001 A',11),
 'reversed-paired-comparison':alter('deltaIronLossG','result','-1 g',1),
 'false-initial-control-flag':source.replace('<td>false</td>','<td>true</td>',1)}
results=[]
with tempfile.TemporaryDirectory()as folder:
 for name,html in cases.items():
  path=Path(folder)/(name+'.html');path.write_text(html)
  try:validate(path)
  except AssertionError:results.append({'mutation':name,'rejected':True})
  else:raise AssertionError('Mutation escaped: '+name)
(root/'report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print('PASS',len(results),'report mutations rejected')
