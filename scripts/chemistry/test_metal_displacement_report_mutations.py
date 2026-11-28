"""Prove report auditing rejects corrupted science, provenance and worked operands."""
import json,re
from pathlib import Path
from validate_metal_displacement_report import validate,Report
p=Path('reports/chemistry-expansion/CL-0123');html=(p/'report-fixture.html').read_text();parsed=Report();parsed.feed(html);checks=[]
def reject(name,changed):
 assert changed!=html,name
 try:validate(changed)
 except(AssertionError,TypeError,ValueError,KeyError,ZeroDivisionError):checks.append(name)
 else:raise AssertionError('Accepted '+name)
def replace(name,old,new):
 assert old in html,name
 reject(name,html.replace(old,new,1))
replace('solution volume unit changed','<th>Solution volume (mL)</th>','<th>Solution volume (L)</th>')
replace('deposit mass unit changed','<th>Deposited target metal (g)</th>','<th>Deposited target metal (kg)</th>')
replace('undefined conversion falsely evaluated','<p class="result">Unavailable</p>','<p class="result">0 1</p>')
replace('false verified manual snapshot','<td>Manual controlled-extent snapshot</td>','<td>Verified guided reference</td>')
replace('guide time forged','"guideSeconds":139.9','"guideSeconds":140')
replace('electron stoichiometry changed','ne = 2 × x','ne = 1 × x')
replace('sulfate charge sign changed','negativeEq = -2 × nSO4','negativeEq = 2 × nSO4')
for name,key,predicate,value in [
 ('nonreaction deposit invented','deposit',lambda b:float(b['result'].split()[0])==0,'0.1 g'),
 ('tiny positive deposit erased','deposit',lambda b:0<float(b['result'].split()[0])<1e-5,'0 g'),
 ('reacted extent erased','extent',lambda b:float(b['result'].split()[0])>0,'0 mol'),
 ('spectator sulfate removed','sulfate',lambda b:float(b['result'].split()[0])>0,'0 mol'),
 ('element conservation corrupted','FeFinal',lambda b:True,'1 mol'),
 ('false mass residual','massResidual',lambda b:True,'0.001 g'),
]:
 b=next(b for b in parsed.blocks if b['key']==key and predicate(b));m=re.search(rf'<article data-trial="{b["trial"]}" data-key="{key}">.*?</article>',html,re.S);assert m
 changed=re.sub(r'<p class="result">[^<]+</p>',f'<p class="result">{value}</p>',m.group())
 reject(name,html[:m.start()]+changed+html[m.end():])
b=next(b for b in parsed.blocks if b['key']=='extent'and float(b['result'].split()[0])>0);m=re.search(rf'<article data-trial="{b["trial"]}" data-key="extent">.*?</article>',html,re.S);assert m
changed=m.group().replace('<code>'+b['substitution']+'</code>','<code>'+b['result'].split()[0]+'</code>');reject('same result loses substitution operands',html[:m.start()]+changed+html[m.end():])
(p/'report-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')
