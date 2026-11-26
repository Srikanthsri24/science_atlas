"""Independent finite-volume reconstruction of actual GUI rows/downloaded worked results."""
import json,math,re,html
from pathlib import Path
p=Path(__file__).parent
names={'Prepared single-phase solution':'solution','Settling insoluble-solid suspension':'suspension','Separating immiscible liquid reference':'oil','Ideal stable density-matched droplets':'stable'}
def reference(q,kind,band):
 V,phi,C,v,f,t=[float(q[k]) for k in ['volumeMl','dispersedFraction','dissolvedGL','frontSpeedCmS','bandFraction','timeSeconds']];H=V/12;end=H*(.6-phi)/(.6*v) if kind=='suspension' else (1-phi)*H/v if kind=='oil' else None
 if end is not None and abs(t-(end+1e-6))<6e-7:t=end+1e-6
 d=min(v*t,v*end) if end is not None else 0
 if kind=='suspension':bed=phi*d/(.6-phi);front=H-d;regions=[(0,bed,.6),(bed,front,phi),(front,H,0)]
 elif kind=='oil':clear=d;interface=H-phi*d/(1-phi);regions=[(0,clear,0),(clear,interface,phi),(interface,H,1)]
 else:regions=[(0,H,0 if kind=='solution' else phi)]
 density=2.65 if kind=='suspension' else .8 if kind=='oil' else 1
 wholeB=C*V/1000 if kind=='solution' else V*phi*density;wholeA=V*1.05-wholeB if kind=='solution' else V*(1-phi);wholeTotal=wholeA+wholeB
 yc=H*{'bottom':.15,'middle':.5,'top':.85}[band];lo=yc-H*f/2;hi=yc+H*f/2;volume=12*(hi-lo);overlaps=[max(0,min(hi,b)-max(lo,a)) for a,b,_ in regions];bVol=None if kind=='solution' else 12*sum(h*r[2] for h,r in zip(overlaps,regions));aVol=None if bVol is None else volume-bVol;bMass=C*volume/1000 if kind=='solution' else bVol*density;aMass=1.05*volume-bMass if kind=='solution' else aVol;total=aMass+bMass;concentration=1000*bMass/volume;fraction=bMass/total
 concentrations=[]
 for centre in [.15,.5,.85]:
  l=H*(centre-f/2);h=H*(centre+f/2);bv=12*sum(max(0,min(h,b)-max(l,a))*z for a,b,z in regions);concentrations.append(C if kind=='solution' else 1000*bv*density/(H*f*12))
 mean=sum(concentrations)/3;rangeGL=max(concentrations)-min(concentrations);sd=math.sqrt(sum((x-mean)**2 for x in concentrations)/3)
 return locals()
def near(a,b,context):assert math.isclose(float(a),b,abs_tol=1.2e-6,rel_tol=5e-8),(context,a,b)
rows=json.loads((p/'actual-ui-rows.json').read_text());report=(p/'actual-ui-report.html').read_text();sections=re.findall(r'<h3>Trial \d+:.*?</h3><ol>(.*?)</ol>',report,re.S);assert len(sections)==len(rows);checks=0;worked=0
for i,(row,section) in enumerate(zip(rows,sections)):
 kind=names[row[1]];band=row[2];q=dict(zip(['timeSeconds','volumeMl','dispersedFraction','dissolvedGL','frontSpeedCmS','bandFraction'],map(float,row[3:9])));s=reference(q,kind,band)
 expected={9:s['H'],10:s['lo'],11:s['hi'],12:s['volume'],15:s['bMass'],16:s['aMass'],17:s['total'],18:s['fraction'],19:s['concentration'],20:s['wholeB'],21:s['wholeA'],22:s['wholeTotal'],23:s['V'],24:s['d'],26:1 if kind=='solution' else 2,28:s['mean'],29:s['rangeGL'],30:s['sd']}
 for k,v in expected.items():near(row[k],v,(i,k));checks+=1
 for k,v in [(13,s['bVol']),(14,s['aVol']),(25,s['end'])]:
  if v is None:assert row[k].startswith('Not applicable:')
  else:near(row[k],v,(i,k))
  checks+=1
 classification='homogeneous' if kind=='solution' else 'heterogeneous';assert row[27]==classification;checks+=1
 values={'Liquid height':s['H'],'Chosen initial dispersed fraction':None if kind=='solution' else s['phi'],'Predicted separation time':s['end'],'Bounded front travel':s['d'],'Integrated whole-vessel volume':s['V'],'Whole-vessel B phase volume':None if kind=='solution' else s['V']*s['phi'],'Whole-vessel B mass':s['wholeB'],'Whole-vessel carrier-A mass':s['wholeA'],'Whole-vessel total mass':s['wholeTotal'],'Whole-vessel B concentration':1000*s['wholeB']/s['V'],'Whole-vessel B mass fraction':s['wholeB']/s['wholeTotal'],'Band centre':s['yc'],'Band thickness':s['hi']-s['lo'],'Band lower boundary':s['lo'],'Band upper boundary':s['hi'],'Finite band volume':s['volume'],'Band B phase volume':s['bVol'],'Band carrier-A phase volume':s['aVol'],'Band B mass':s['bMass'],'Band carrier-A mass':s['aMass'],'Band total mass':s['total'],'Band B mass fraction':s['fraction'],'Band B concentration':s['concentration'],'Mean of three sampled bands':s['mean'],'Three-band concentration range':s['rangeGL'],'Three-band population standard deviation':s['sd']}
 if kind=='suspension':values.update({'Wet sediment height':s['regions'][0][1],'Suspension upper front':s['regions'][1][1]})
 if kind=='oil':values.update({'Clarified lower height':s['regions'][0][1],'Upper pure-liquid interface':s['regions'][2][0]})
 for j,(a,b,z) in enumerate(s['regions'],1):
  values[f'Region {j}: total envelope volume']=12*(b-a);values[f'Band overlap with region {j}']=s['overlaps'][j-1]
  if kind!='solution':values[f'Region {j}: component-B phase volume']=12*(b-a)*z
 for bandName,c in zip(['bottom','middle','top'],s['concentrations']):values[f'{bandName}: B concentration']=c
 blocks=re.findall(r'<li><b>(.*?)</b>.*?<p>Result: (.*?)</p></li>',section,re.S);assert len(blocks)==len(values)+1,(i,len(blocks),len(values))
 for title,value in blocks:
  title=html.unescape(title);value=html.unescape(value)
  if title=='Phase-based classification':assert value==classification
  elif values[title] is None:assert value.startswith('Not applicable:')
  else:near(value.split(' ')[0],values[title],(i,title))
  worked+=1
assert report.count('<table>')==3 and not re.search(r'https?://',report)
assert '&lt;mixture&gt;' in report and '<mixture>' not in report
out={'status':'passed','actualGuiTrials':len(rows),'independentObservationChecks':checks,'downloadedWorkedResults':worked,'printTables':3,'escapedWriting':True,'companyOnly':True};(p/'independent-ui-record-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(out)
