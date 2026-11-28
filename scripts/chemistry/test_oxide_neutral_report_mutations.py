import json,re
from pathlib import Path
from validate_oxide_neutral_report import validate,Report
p=Path('reports/chemistry-expansion/CL-0125');html=(p/'report-fixture.html').read_text();parsed=Report();parsed.feed(html);checks=[]
def reject(name,changed):
 assert changed!=html,name
 try:validate(changed)
 except(AssertionError,TypeError,ValueError,KeyError,ZeroDivisionError):checks.append(name)
 else:raise AssertionError('Accepted '+name)
def replace(name,old,new):
 assert old in html,name
 reject(name,html.replace(old,new,1))
replace('volume unit changed','<th>Mixed carbon solution (L)</th>','<th>Mixed carbon solution (mL)</th>')
replace('left pH fabricated','<p class="result">Unavailable</p>','<p class="result">7 1</p>')
replace('manual snapshot falsely verified','<td>Manual paired-station snapshot</td>','<td>Verified guided reference</td>')
replace('guide time forged','"guideSeconds":139.9','"guideSeconds":140')
replace('acid stoichiometry changed','nH,used = min(nH, 2 × x)','nH,used = min(nH, x)')
replace('neutral pool formula replaced by molecular carbonic acid','nCO2star = CT × a0 × VC','nH2CO3 = CT × a0 × VC')
for name,key,predicate,value in [
 ('positive copper amount erased','copperIons',lambda b:float(b['result'].split()[0])>0,'0 mol'),
 ('tiny undelivered volume erased','storedVolume',lambda b:0<float(b['result'].split()[0])<1e-10,'0 mL'),
 ('delivered sodium not accounted','sodiumC',lambda b:float(b['result'].split()[0])>0,'0 mol/L'),
 ('carbon atom account corrupted','carbonTotal',lambda b:True,'1 mol'),
 ('bicarbonate amount erased','bicarbonate',lambda b:float(b['result'].split()[0])>0,'0 mol'),
 ('carbonate amount erased','carbonate',lambda b:float(b['result'].split()[0])>0,'0 mol'),
 ('right pH forced neutral','pH',lambda b:abs(float(b['result'].split()[0])-7)>1,'7 1'),
 ('root replaced by unphysical hydrogen concentration','hydrogenRoot',lambda b:True,'1 mol/L'),
]:
 b=next(b for b in parsed.blocks if b['key']==key and predicate(b));m=re.search(rf'<article data-trial="{b["trial"]}" data-key="{key}">.*?</article>',html,re.S);assert m
 changed=re.sub(r'<p class="result">[^<]+</p>',f'<p class="result">{value}</p>',m.group());reject(name,html[:m.start()]+changed+html[m.end():])
for name,key in [('same-value extent loses operands','extent'),('root coefficients lost','hydrogenRoot')]:
 b=next(b for b in parsed.blocks if b['key']==key and float(b['result'].split()[0])>0);m=re.search(rf'<article data-trial="{b["trial"]}" data-key="{key}">.*?</article>',html,re.S);assert m
 changed=m.group().replace('<code>'+b['substitution']+'</code>','<code>'+b['result'].split()[0]+'</code>');reject(name,html[:m.start()]+changed+html[m.end():])
(p/'report-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')
