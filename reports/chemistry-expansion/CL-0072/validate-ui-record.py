"""Independent closed-form reference, using only actual rendered observation inputs."""
import json,math,re,html
from pathlib import Path
p=Path(__file__).parent
rows=json.loads((p/'actual-ui-rows.json').read_text())
report=(p/'actual-ui-report.html').read_text()
def reference(r):
 t,m,P,U,F,Ti,target=map(float,r[1:8]);C=m*4.18+40;pb=max(0,P-U*80);tb=(-C/U*math.log1p(-U*80/P) if U else C*80/P) if P>U*80 else None
 # GUI milestone buttons seek an exact predicted time +1 microsecond; the table prints time to6 decimals.
 if tb is not None and abs(t-(tb+1e-6))<6e-7:t=tb+1e-6
 rate=pb/2256.4;duration=(m-10)/rate if tb is not None else None;cut=tb+duration if tb is not None else None
 if cut is not None and abs(t-(cut+1e-6))<6e-7:t=cut+1e-6
 cap0=F*4.18*(35-Ti);f0=min(1,cap0/pb) if pb else 0
 target0=tb+target/(rate*f0) if tb is not None and rate*f0>0 and target<=(m-10)*f0 else None
 if target0 is not None and abs(t-(target0+1e-6))<6e-7:t=target0+1e-6
 warm=min(t,tb) if tb is not None else t;Tw=20+P/U*(-math.expm1(-U*warm/C)) if U else 20+P*warm/C
 bt=min(max(0,t-tb),duration) if tb is not None else 0;ev=rate*bt;left=m-ev;rc=left*4.18+40;cool=max(0,t-cut) if cut is not None else 0;T=20+80*math.exp(-U*cool/rc) if cool else Tw
 cap=F*4.18*(35-Ti);f=min(1,cap/pb) if pb else 0;rec=f*ev;esc=ev-rec;active=min(t,cut) if cut is not None else t;qin=P*active
 losswarm=P*warm-C*(Tw-20);lossboil=U*80*bt;losscool=rc*(100-T) if cool else 0;loss=losswarm+lossboil+losscool;hs=rc*(T-20);hr=rec*4.18*80;he=esc*(4.18*80+2256.4);qc=rec*2256.4;through=F*bt;rho=.99816+(.95835-.99816)*(T-20)/80
 maximum=(m-10)*f;tt=tb+target/(rate*f) if tb is not None and rate*f>0 and target<=maximum+1e-10 else None;boiling=tb is not None and t>=tb and t<cut
 mean=Ti+qc/(through*4.18) if through else None;out=Ti+rate*f*2256.4/(F*4.18) if boiling and F else None
 return locals()
def near(a,b,where):
 assert math.isclose(float(a),b,abs_tol=1.2e-6,rel_tol=8e-8),(where,a,b)
checks=0;worked=0
sections=re.findall(r'<h3>Trial \d+:.*?</h3><ol>(.*?)</ol>',report,re.S)
assert len(sections)==len(rows)
for i,(r,section) in enumerate(zip(rows,sections)):
 s=reference(r)
 expected={9:s['T'],12:s['left'],13:s['rec'],14:s['esc'],15:s['f'],16:s['left']/s['rho'],17:s['rec']/.95835,18:s['qin'],19:s['loss'],20:s['hs'],21:s['hr'],22:s['he'],23:s['qc'],24:s['hs']+s['hr']+s['he']+s['qc']+s['loss'],25:s['through']}
 for k,v in expected.items():near(r[k],v,(i,k));checks+=1
 for k,key in [(10,'tb'),(11,'cut'),(26,'mean'),(27,'out'),(29,'tt')]:
  if s[key] is None:assert r[k].startswith('Not '),(i,k,r[k])
  else:near(r[k].split(' · ')[0],s[key],(i,k))
  checks+=1
 for k,v in [(28,100 if s['rec'] else None),(30,s['qin']/s['rec'] if s['rec'] else None),(31,s['through']/s['rec'] if s['rec'] else None)]:
  if v is None:assert r[k].startswith('Not ')
  else:near(r[k],v,(i,k))
  checks+=1
 values={'Reference temperature rise':80,'Initial feed and vessel heat capacity':s['C'],'Source heat loss at boiling':s['U']*80,'Available power for boiling':s['pb'],'Predicted boiling start':s['tb'],'Elapsed warming interval':s['warm'],'Temperature at the end of the warming interval':s['Tw'],'Feed available before automatic cutoff':s['m']-10,'Reference vapour production rate':s['rate'],'Predicted boiling duration':s['duration'],'Predicted automatic heater cutoff':s['cut'],'Actual boiling interval so far':s['bt'],'Active heater time':s['active'],'Evaporated feed':s['ev'],'Feed remaining in source':s['left'],'Remaining source heat capacity':s['rc'],'Elapsed post-cutoff cooling':s['cool'],'Current source temperature':s['T'],'Allowed coolant temperature rise':35-s['Ti'],'Ideal condenser latent-heat capacity':s['cap'],'Predicted vapour capture fraction':s['f'],'Recovered feed water':s['rec'],'Escaped feed water':s['esc'],'Primary-feed conservation':s['m'],'Temperature-dependent liquid-density reference':s['rho'],'Source liquid volume':s['left']/s['rho'],'Hot collected liquid volume':s['rec']/.95835,'Delivered thermal input':s['qin'],'Delivered thermal input in watt-hours':s['qin']/3600,'Ambient loss during warming':s['losswarm'],'Ambient loss during boiling':s['lossboil'],'Ambient loss after cutoff':s['losscool'],'Total ambient heat loss':s['loss'],'Source sensible heat reference':s['hs'],'Hot collected-water sensible heat':s['hr'],'Escaped-vapour enthalpy reference':s['he'],'Latent heat transferred to coolant':s['qc'],'Complete reference heat balance':s['qin'],'External cooling-water throughput':s['through'],'Mean cooling-water outlet temperature':s['mean'],'Current cooling-water outlet temperature':s['out'],'Collected liquid temperature reference':100 if s['rec'] else None,'Maximum capture-limited collection':s['maximum'],'Predicted target-collection time':s['tt'],'Current feed-water recovery':100*s['rec']/s['m'],'Delivered heat per recovered gram':s['qin']/s['rec'] if s['rec'] else None,'Coolant demand per recovered gram':s['through']/s['rec'] if s['rec'] else None,'Collection if once-through coolant is discarded':s['rec']-s['through'],'Current generated-vapour rate':s['rate'] if s['boiling'] else 0,'Current recovered-water rate':s['rate']*s['f'] if s['boiling'] else 0,'Current escaped-water rate':s['rate']*(1-s['f']) if s['boiling'] else 0}
 blocks=re.findall(r'<li><b>(.*?)</b>.*?<p>Result: (.*?)</p></li>',section,re.S);assert len(blocks)==51
 for title,value in blocks:
  title=html.unescape(title);value=html.unescape(value)
  if values[title] is None:assert value.startswith('Not '),(i,title,value)
  else:near(value.split(' ')[0],values[title],(i,title))
  worked+=1
assert report.count('<table>')==3 and not re.search(r'https?://',report)
assert '&lt;design&gt;' in report and '<design>' not in report
out={'status':'passed','actualGuiTrials':len(rows),'independentObservationChecks':checks,'downloadedWorkedResults':worked,'printTables':3,'companyOnly':True,'escapedWriting':True}
(p/'independent-ui-record-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(out)
