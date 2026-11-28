import json,re
from pathlib import Path
from validate_metal_acid_report import validate,Report
p=Path('reports/chemistry-expansion/CL-0124');html=(p/'report-fixture.html').read_text();parsed=Report();parsed.feed(html);checks=[]
def reject(name,changed):
 assert changed!=html,name
 try:validate(changed)
 except(AssertionError,TypeError,ValueError,KeyError,ZeroDivisionError):checks.append(name)
 else:raise AssertionError('Accepted '+name)
def replace(name,old,new):
 assert old in html,name
 reject(name,html.replace(old,new,1))
replace('gas volume unit changed','<th>Generated dry gas (mL)</th>','<th>Generated dry gas (L)</th>')
replace('pressure unit changed','<th>Collection pressure (Pa)</th>','<th>Collection pressure (kPa)</th>')
replace('undefined conversion falsely evaluated','<p class="result">Unavailable</p>','<p class="result">0 1</p>')
replace('false verified manual snapshot','<td>Manual controlled-extent snapshot</td>','<td>Verified guided reference</td>')
replace('guide time forged','"guideSeconds":139.9','"guideSeconds":140')
replace('acid stoichiometry changed','nH,used = min(nH, 2 × x)','nH,used = min(nH, x)')
replace('chloride charge sign changed','negativeEq = -nCl','negativeEq = nCl')
for name,key,predicate,value in [
 ('control hydrogen invented','hydrogen',lambda b:float(b['result'].split()[0])==0,'0.1 mol'),
 ('tiny positive gas erased','gasMl',lambda b:0<float(b['result'].split()[0])<.001,'0 mL'),
 ('metal dissolution erased','metalLoss',lambda b:float(b['result'].split()[0])>0,'0 g'),
 ('overflow removed','overflowMl',lambda b:float(b['result'].split()[0])>0,'0 mL'),
 ('collector exceeds capacity','retainedMl',lambda b:True,'999 mL'),
 ('chloride conservation lost','chlorineAtomsFinal',lambda b:float(b['result'].split()[0])>0,'0 mol'),
]:
 b=next(b for b in parsed.blocks if b['key']==key and predicate(b));m=re.search(rf'<article data-trial="{b["trial"]}" data-key="{key}">.*?</article>',html,re.S);assert m
 changed=re.sub(r'<p class="result">[^<]+</p>',f'<p class="result">{value}</p>',m.group());reject(name,html[:m.start()]+changed+html[m.end():])
b=next(b for b in parsed.blocks if b['key']=='extent'and float(b['result'].split()[0])>0);m=re.search(rf'<article data-trial="{b["trial"]}" data-key="extent">.*?</article>',html,re.S);assert m
changed=m.group().replace('<code>'+b['substitution']+'</code>','<code>'+b['result'].split()[0]+'</code>');reject('same result loses operands',html[:m.start()]+changed+html[m.end():])
(p/'report-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')
