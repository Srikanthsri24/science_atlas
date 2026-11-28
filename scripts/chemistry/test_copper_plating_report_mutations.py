import json,re
from pathlib import Path
from validate_copper_plating_report import validate,Report
p=Path('reports/chemistry-expansion/CL-0122');html=(p/'report-fixture.html').read_text();parsed=Report();parsed.feed(html);checks=[]
def reject(name,changed):
 assert changed!=html,name
 try:validate(changed)
 except(AssertionError,TypeError,ValueError,KeyError,ZeroDivisionError):checks.append(name)
 else:raise AssertionError('Accepted '+name)
def replace(name,old,new):assert old in html,name;reject(name,html.replace(old,new,1))
replace('passed charge header falsely requested','<th>Passed charge (C)</th>','<th>Requested charge (C)</th>')
replace('thickness units wrong','<th>Average film thickness (µm)</th>','<th>Average film thickness (mm)</th>')
replace('zero-current division falsely evaluated','<p class="result">Unavailable</p>','<p class="result">0 s</p>')
replace('guide time forged','"guideSeconds":45.1','"guideSeconds":115')
replace('false review-stage label','<td>Manual source-history snapshot</td>','<td>Verified guided reference</td>')
replace('density formula changed','Vcm3 = mCu / rhoCu','Vcm3 = mCu * rhoCu')
for name,key,predicate,transform in [
 ('same-value source substitution loses operands','request0',lambda b:b['substitution']=='1 * 0.5 * 600',lambda x:x.replace('<code>1 * 0.5 * 600</code>','<code>300</code>')),
 ('tiny positive mass erased','depositMass',lambda b:0<float(b['result'].split()[0])<1e-5,lambda x:re.sub(r'<p class="result">[^<]+</p>','<p class="result">0 g</p>',x)),
 ('unserved demand erased','unmet',lambda b:float(b['result'].split()[0])>0,lambda x:re.sub(r'<p class="result">[^<]+</p>','<p class="result">0 C</p>',x)),
 ('passed charge exceeds finite inventory','passed',lambda b:0<float(b['result'].split()[0])<100,lambda x:re.sub(r'<p class="result">[^<]+</p>','<p class="result">600 C</p>',x)),
 ('false numerical mass residual','residual',lambda b:True,lambda x:re.sub(r'<p class="result">[^<]+</p>','<p class="result">0.001 g</p>',x)),
 ('anode loss ignored','anodeFinal',lambda b:0<float(b['result'].split()[0])<1,lambda x:re.sub(r'<p class="result">[^<]+</p>','<p class="result">1 g</p>',x)),
]:
 b=next(b for b in parsed.blocks if b['key']==key and predicate(b));match=re.search(rf'<article data-trial="{b["trial"]}" data-key="{key}">.*?</article>',html,re.S);assert match;reject(name,html[:match.start()]+transform(match.group())+html[match.end():])
(p/'report-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')
