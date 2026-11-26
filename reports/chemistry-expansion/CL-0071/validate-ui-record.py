"""Independent closed-form reconstruction of actual GUI observations/downloaded results."""
import json, math, re, html
from pathlib import Path
root=Path(__file__).parent
rows=json.loads((root/'actual-ui-rows.json').read_text())
report=(root/'actual-ui-report.html').read_text()
def smooth(x):
 u=min(1,max(0,x));return u*u*(3-2*u)
def state(row):
 t,S,A,W,h,w,n=map(float,[row[i] for i in [1,3,4,5,6,7,8]]);n=int(n)
 f=smooth((t-200)/200);d=smooth(t/200)
 done=min(n,max(0,math.floor((t-400)/100)))
 local=max(0,t-400-done*100) if done<n else 0
 fill=smooth(local/50);drain=smooth((local-50)/50)
 residueSalt=S*h/W*(h/(h+w))**done*(1-drain*w/(h+w)) if t>=400 else S*h/W*f
 rw=h*f+w*(fill-drain);fw=(W-h)*f+done*w+drain*w
 reserve=n*w-done*w-fill*w
 dry=smooth((t-700)/500);airR=rw*dry;airF=fw*dry;rw-=airR;fw-=airF
 sourceSalt=S*(1-d*f);rs=residueSalt;fs=S-sourceSalt-rs
 rd=min(rs,.36*rw);fd=min(fs,.36*fw);rc=rs-rd;fc=fs-fd
 final=S*h/W*(h/(h+w))**n;product=S-final
 return dict(t=t,S=S,A=A,W=W,h=h,w=w,n=n,done=done,sourceSalt=sourceSalt,sourceSand=A*(1-f),sourceWater=W*(1-f),sand=A*f,rs=rs,rw=rw,fs=fs,fw=fw,rd=rd,fd=fd,rc=rc,fc=fc,reserve=reserve,airR=airR,airF=airF,air=airR+airF,final=final,product=product,purity=100*A/(A+final),recovery=100*fc/S,initialWater=W+n*w,initialMass=S+A+W+n*w)
def near(observed,expected,context):
 assert math.isclose(float(observed),expected,rel_tol=7e-8,abs_tol=6e-7),(context,observed,expected)
checks=0
for i,row in enumerate(rows):
 s=state(row)
 expected={9:s['done'],10:s['sourceSalt'],11:s['sourceSand'],12:s['sourceWater'],13:s['sand'],14:s['rs'],15:s['rw'],16:s['fd'],17:s['fc'],18:s['fw'],19:s['reserve'],20:s['air'],21:s['recovery'],22:s['purity'],23:s['S'],24:s['A'],25:s['initialWater'],26:s['initialMass']}
 for k,v in expected.items():near(row[k],v,(i+1,k));checks+=1
 for k,water,salt in [(27,s['rw'],s['rd']),(28,s['fw'],s['fd'])]:
  if water>0:near(row[k],salt/water,(i+1,k))
  else:assert row[k]=='Not applicable: no liquid solution remains'
  checks+=1
sections=re.findall(r'<h3>Trial \d+:.*?</h3><ol>(.*?)</ol>',report,re.S)
assert len(sections)==len(rows)
results=0
for i,(row,section) in enumerate(zip(rows,sections)):
 s=state(row);S,A,W,h,w,n=[s[k] for k in ['S','A','W','h','w','n']]
 values={'Original dry mixture':S+A,'Reserved fresh wash water':n*w,'All original water in the system':W+n*w,'Initial whole-system mass':S+A+W+n*w,'Rounded reference dissolving capacity':.36*W,'Initial mother-liquor concentration':S/W,'Salt initially retained with damp sand':S*h/W,'Initial salt in the filtrate':S-S*h/W,'Water retained after one complete drainage':h,'Salt-retention factor per complete wash':h/(h+w),'Final retained salt prediction':s['final'],'Final separated salt product prediction':s['product'],'Predicted final salt recovery':100*s['product']/S,'Predicted dry sand-product purity':s['purity'],'Current source salt':s['sourceSalt'],'Current retained residue salt':s['rs'],'Current filtrate salt':s['fs'],'Current residue dissolving capacity':.36*s['rw'],'Current dissolved residue salt':s['rd'],'Current crystalline residue salt':s['rc'],'Current dissolved filtrate salt':s['fd'],'Current crystalline salt product':s['fc'],'Current dry salt recovery':s['recovery'],'Water transferred to air':s['air'],'Salt conservation':S,'Sand conservation':A,'Water conservation':s['initialWater'],'Whole-system mass conservation':s['initialMass'],'Current residue liquid concentration':s['rd']/s['rw'] if s['rw']>0 else None,'Current filtrate liquid concentration':s['fd']/s['fw'] if s['fw']>0 else None}
 for j in range(n):values[f'Predicted salt after wash {j+1}']=S*h/W*(h/(h+w))**(j+1)
 blocks=re.findall(r'<li><b>(.*?)</b>(.*?)</li>',section,re.S)
 assert len(blocks)==30+n
 for title,body in blocks:
  title=html.unescape(title);assert 'Substitution:' in body
  result=html.unescape(re.search(r'<p>Result: (.*?)</p>',body,re.S).group(1));v=values[title]
  if v is None:assert result=='Not applicable: no liquid solution remains'
  else:near(re.match(r'[+\-\d.eE]+',result).group(),v,(i+1,title))
  results+=1
assert report.count('<table>')==3
assert '&lt;balance&gt; &amp;' in report and '<balance>' not in report
assert not re.search(r'https?://',report)
out={'status':'passed','actualGuiTrials':len(rows),'independentObservationChecks':checks,'downloadedWorkedResults':results,'printTables':3,'escapedPrediction':True}
(root/'independent-ui-record-validation.json').write_text(json.dumps(out,indent=2)+'\n')
print(out)
