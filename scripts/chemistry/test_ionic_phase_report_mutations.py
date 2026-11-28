import json
from pathlib import Path
from validate_ionic_phase_report import validate
p=Path('reports/chemistry-expansion/CL-0120');html=(p/'report-fixture.html').read_text();checks=[]
def reject(name,old,new):
 assert old in html,name
 changed=html.replace(old,new,1)
 try:validate(changed)
 except (AssertionError,ValueError,TypeError,KeyError,ZeroDivisionError):checks.append(name)
 else:raise AssertionError('Accepted corruption: '+name)
reject('solid falsely measured','<td>Not measured</td>','<td>0 S/m</td>')
reject('solid inverse fabricated','<td>Unavailable</td>','<td>0</td>')
reject('false snapshot verification','<td>Manual snapshot</td>','<td>Verified guide stage</td>')
reject('formula changed','Vcell = connectedFlag × Vconfigured','Vcell = Vconfigured')
reject('voltage unit changed','<p class="result">0.05 V</p>','<p class="result">0.05 A</p>')
reject('same-value substitution hides operands','<code>1 * 0.05</code>','<code>0.05</code>')
reject('area arithmetic changed','<code>(1 / 100) * (1 / 100)</code>','<code>(1 / 100) / (1 / 100)</code>')
reject('tiny water current erased','<p class="result">2.75e-9 A</p>','<p class="result">0 A</p>')
reject('unavailable result falsely numeric','<p class="result">Unavailable</p>','<p class="result">0 S/m</p>')
reject('reference field falsified','<td>kcl001</td>','<td>water</td>')
reject('table current unit falsified','<th>Ideal transport Irms (A)</th>','<th>Ideal transport Irms (mA)</th>')
reject('guide time forged','"guideSeconds":55','"guideSeconds":75')
(p/'report-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')
