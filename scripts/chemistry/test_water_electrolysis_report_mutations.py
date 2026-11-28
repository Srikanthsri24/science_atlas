import json,re
from pathlib import Path
from validate_water_electrolysis_report import validate,Report
p=Path('reports/chemistry-expansion/CL-0121');html=(p/'report-fixture.html').read_text();parsed=Report();parsed.feed(html);checks=[]
def reject(name,changed):
 assert changed!=html,name
 try:validate(changed)
 except(AssertionError,ValueError,TypeError,KeyError,ZeroDivisionError):checks.append(name)
 else:raise AssertionError('Accepted '+name)
def replace(name,old,new):
 assert old in html,name;reject(name,html.replace(old,new,1))
replace('current units changed','<th>Configured current (A)</th>','<th>Configured current (mA)</th>')
replace('empty ratio falsely numeric','<p class="result">Unavailable</p>','<p class="result">2 1</p>')
replace('retention operator changed','min(50, 0)','max(50, 0)')
replace('guide provenance forged','"guideSeconds":20.1','"guideSeconds":110')
replace('false verification label','<td>Manual source-history snapshot</td>','<td>Verified guided reference</td>')
replace('charge unit changed','<p class="result">0 C</p>','<p class="result">0 A</p>')
replace('zero charge changed','Q = sum(connectedFlag × I × duration)','Q = current × all elapsed time')
for name,key,selection,transform in [
 ('same-value substitution hides source operands','segment0',lambda b:b['substitution']=='1 * 0.5 * 600',lambda b:b.replace('<code>1 * 0.5 * 600</code>','<code>300</code>')),
 ('small positive volume erased','O2volume',lambda b:0<float(b['result'].split()[0])<1,lambda b:re.sub(r'<p class="result">[^<]+</p>','<p class="result">0 mL</p>',b)),
 ('overflow lost','H2overflow',lambda b:float(b['result'].split()[0])>0,lambda b:re.sub(r'<p class="result">[^<]+</p>','<p class="result">0 mL</p>',b)),
 ('retained ratio falsely stoichiometric','retainedRatio',lambda b:b['result']!='Unavailable'and float(b['result'].split()[0])!=2,lambda b:re.sub(r'<p class="result">[^<]+</p>','<p class="result">2 1</p>',b)),
]:
 b=next(b for b in parsed.blocks if b['key']==key and selection(b));pattern=rf'<article data-trial="{b["trial"]}" data-key="{key}">.*?</article>';match=re.search(pattern,html,re.S);assert match;reject(name,html[:match.start()]+transform(match.group())+html[match.end():])
(p/'report-mutation-checks.json').write_text(json.dumps(dict(rejectedCorruptions=len(checks),checks=checks),indent=2)+'\n');print('PASS',len(checks),'corruptions rejected')
