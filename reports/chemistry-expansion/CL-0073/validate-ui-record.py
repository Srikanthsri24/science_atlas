"""Independent reconstruction from actual visible table inputs and downloaded HTML."""
from pathlib import Path
import json,math,re,html
p=Path(__file__).parent
rows=json.loads((p/'actual-ui-rows.json').read_text());report=(p/'actual-ui-report.html').read_text()
atomic={'He':4.002602,'H':1.008,'C':12.011,'N':14.007,'O':15.999};species={'He':{'He':1},'H₂':{'H':2},'N₂':{'N':2},'O₂':{'O':2},'O₃':{'O':3},'H₂O':{'H':2,'O':1},'CO₂':{'C':1,'O':2},'CH₄':{'C':1,'H':4}}
samples={'Monatomic helium':('He',None),'Diatomic oxygen':('O₂',None),'Triatomic ozone':('O₃',None),'Pure water vapour':('H₂O',None),'Pure carbon dioxide':('CO₂',None),'Pure methane':('CH₄',None),'Nitrogen + oxygen reference':('N₂','O₂'),'Helium + oxygen':('He','O₂'),'Water vapour + carbon dioxide':('H₂O','CO₂'),'Unreacted hydrogen + oxygen':('H₂','O₂'),'Oxygen + ozone: one element, two substances':('O₂','O₃'),'Water vapour + oxygen':('H₂O','O₂')}
def reference(row):
 a,b=samples[row[1]];N=int(row[3]);Na=int(row[4]);Nb=int(row[5]);L=float(row[17]);T=float(row[18]);counts={k:v for k,v in [(a,Na),(b,Nb)] if k and v};atoms={}
 for k,v in counts.items():
  for j,n in species[k].items():atoms[j]=atoms.get(j,0)+n*v
 masses={k:sum(atomic[j]*n for j,n in species[k].items()) for k in counts};weighted=sum(counts[k]*masses[k] for k in counts);V=L**3;amount=N/6.02214076e23;mass=weighted/6.02214076e23;mean=weighted/N;P=N*1.380649e-23*T/(V*1e-27);classification='mixture' if len(counts)>1 else 'element' if len(atoms)==1 else 'compound'
 return locals()
def near(a,b,where):
 assert math.isclose(float(a),b,abs_tol=1e-30 if abs(b)<1e-15 else 6e-7,rel_tol=2e-8),(where,a,b)
sections=re.findall(r'<h3>Trial \d+:.*?</h3><ol>(.*?)</ol>',report,re.S);assert len(sections)==len(rows)
checks=0;worked=0
for i,(row,section) in enumerate(zip(rows,sections)):
 s=reference(row);assert int(row[4])+int(row[5])==int(row[3]);assert row[14]==s['classification'];assert int(row[6])==len(s['counts']) and int(row[7])==len(s['atoms']);assert int(row[8])==sum(s['atoms'].values());checks+=5
 for k,j in enumerate(['He','H','C','N','O'],9):assert int(row[k])==s['atoms'].get(j,0);checks+=1
 for k,v in {19:s['V'],20:s['amount'],21:s['mass'],22:s['mean'],23:s['P'],24:s['Na']/s['N'],25:s['Nb']/s['N'],26:s['Na']*s['masses'].get(s['a'],0)/s['weighted'],27:s['Nb']*s['masses'].get(s['b'],0)/s['weighted'],28:s['Na']/s['N']*s['P'],29:s['Nb']/s['N']*s['P']}.items():near(row[k],v,(i,k));checks+=1
 values={'Entity inventory':s['N'],'Distinct substances present':len(s['counts']),'Total atom inventory':sum(s['atoms'].values()),'Distinct element identities':len(s['atoms']),'Cube volume in nanometres':s['V'],'Cube volume in metres':s['V']*1e-27,'Total represented amount':s['amount'],'Total represented mass':s['mass'],'Mean molar mass':s['mean'],'Ideal reference pressure':s['P'],'Number-fraction closure':1,'Mass-fraction closure':1,'Partial-pressure closure':s['P']}
 for k,count in s['counts'].items():
  M=s['masses'][k];values.update({f'{k}: relative molecular/atomic mass':M,f'{k}: entity fraction':count/s['N'],f'{k}: represented amount':count/6.02214076e23,f'{k}: represented mass':count*M/6.02214076e23,f'{k}: mass fraction':count*M/s['weighted'],f'{k}: ideal partial pressure':count/s['N']*s['P']})
 for j,count in s['atoms'].items():values.update({f'{j}: atom inventory':count,f'{j}: atom fraction':count/sum(s['atoms'].values())})
 blocks=re.findall(r'<li><b>(.*?)</b>.*?<p>Result: (.*?)</p></li>',section,re.S);assert len(blocks)==len(values)+1
 for title,value in blocks:
  title=html.unescape(title);value=html.unescape(value)
  if title=='Evidence-based classification':assert value==s['classification']
  else:near(value.split(' ')[0],values[title],(i,title))
  worked+=1
assert report.count('<table>')==3 and not re.search(r'https?://',report)
assert '&lt;evidence&gt;' in report and '<evidence>' not in report
out={'status':'passed','actualGuiTrials':len(rows),'independentObservationChecks':checks,'downloadedWorkedResults':worked,'printTables':3,'escapedWriting':True,'companyOnly':True};(p/'independent-ui-record-validation.json').write_text(json.dumps(out,indent=2)+'\n');print(out)
