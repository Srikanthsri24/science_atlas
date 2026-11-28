import re,json,tempfile
from pathlib import Path
from validate_zinc_protection_report import validate,NUM
html=Path('reports/chemistry-expansion/CL-0108/reference-practical.html').read_text();results=[]
def block_change(key,part,change,last=False,positive=False):
 pattern=re.compile(r'(<section class="worked" data-key="'+re.escape(key)+r'">[\s\S]*?<p class="'+part+r'">)([\s\S]*?)(</p>)')
 matches=list(pattern.finditer(html))
 if positive:matches=[m for m in matches if float(re.search(NUM,m[2])[0])>0]
 m=matches[-1]if last else matches[0];return html[:m.start(2)]+change(m[2])+html[m.end(2):]
def reject(name,mutated):
 assert mutated!=html
 with tempfile.TemporaryDirectory()as d:
  p=Path(d)/'mutated.html';p.write_text(mutated)
  try:validate(p)
  except AssertionError:results.append({'mutation':name,'rejected':True})
  else:raise AssertionError('Mutation escaped: '+name)
def replace_last_num(s):
 m=list(re.finditer(NUM,s))[-1];return s[:m.start()]+'12'+s[m.end():]
def phase_edit(column,value):
 at=html.index('<h2>Actual phase observations</h2>');row=re.search(r'<tbody><tr>([\s\S]*?)</tr>',html[at:]);start=at+row.start(1);cells=list(re.finditer(r'<td>([\s\S]*?)</td>',row[1]));m=cells[column];pos=start+m.start(1);return html[:pos]+value+html[start+m.end(1):]
reject('wrong-operator-same-operands',block_change('bare.initialZincG','substitution',lambda s:s.replace('−','+',1)))
reject('wrong-operand-hidden-by-zero-product',block_change('bare.convertedIronG','substitution',replace_last_num))
reject('wrong-worked-mass-unit',block_change('bare.convertedIronG','result',lambda s:s.rsplit(' ',1)[0]+' kg'))
reject('wrong-preparation-unit',html.replace('Iron stock g','Iron stock kg',1))
reject('wrong-phase-current',phase_edit(6,'1'))
reject('broken-phase-end',phase_edit(4,'-1'))
reject('erased-small-post-event-loss',block_change('scratched.convertedIronG','result',lambda s:'0 g',last=True))
reject('invented-detached-protective-charge',block_change('isolated.protectiveChargeC','result',lambda s:'0.1 C'))
reject('missing-external-water',block_change('bare.waterSuppliedG','result',lambda s:'0 g',positive=True))
reject('wrong-hydroxide-equivalent-unit',block_change('bare.ironHydroxideEquivalentG','result',lambda s:s.rsplit(' ',1)[0]+' mol'))
Path('reports/chemistry-expansion/CL-0108/report-mutation-checks.json').write_text(json.dumps(results,indent=2)+'\n');print('PASS',len(results),'report mutations rejected')
