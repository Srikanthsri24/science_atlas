"""Independent actual observations and downloaded worked report; no app imports."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,html,math
p=Path(__file__).parent;before=json.loads((p/'ui-record-before-reload.json').read_text());after=json.loads((p/'ui-record-after-reload.json').read_text());assert before==after
assert [len(t['rows']) for t in after['tables']]==[12,10,15];allrows={};expectedCalc={};samples=['ice','paper','reaction']
for sample,table in zip(samples,after['tables']):
 for row in table['rows']:
  assert len(row)==(18 if sample=='reaction' else 13);trial=int(row[0]);P=float(row[1]);f=min(1,P);r=max(0,P-1);allrows[trial]=(sample,row)
  outcome='Restoration test not complete' if P<2 else 'Restored material and phase under this test' if sample=='ice' else 'Not restored by this classroom operation'
  if sample=='ice':
   m=float(row[2]);liquid=m*(f-r);ice=m-liquid;add=m*334*f;removed=m*334*r;V1=ice/.917;V2=liquid/.9998;expected={3:ice,4:liquid,5:add,6:removed,7:add-removed,8:V1,9:V2,10:m};assert row[11]==outcome;calc=[m/1000,f,r,liquid,ice,add,removed,add-removed,V1,V2,m,0]
  elif sample=='paper':
   m=float(row[2]);N=int(float(row[3]));cp=N*f;complete=min(N,math.floor(cp+8*2.220446049250313e-16*N));u=max(0,cp-complete);thick=m/80;length=(complete+u)*10;area=2*length*thick;gap=.8*f*(1-r);expected={4:complete,5:u,6:complete+1,7:thick,8:length,9:area,10:gap};assert row[11]==outcome;calc=[thick,cp,complete,u,complete+1,length,area,gap,m,None,None]
  else:
   b=float(row[2]);acidmmol=float(row[3]);nb=b/84.006;na=acidmmol/1000;xi=min(nb,na)*f;remainingb=max(0,b-xi*84.006);initialacid=na*60.052;remainingacid=max(0,initialacid-xi*60.052);W0=100-initialacid;acetate=xi*82.034;formed=xi*18.015;water=W0+formed;gas=xi*44.009;L=xi*8.314462618*298.15/101325*1000;cond=remainingb+remainingacid+acetate+water;total=cond+gas;limit='both' if abs(nb-na)<1e-12 else 'bicarbonate' if nb<na else 'acid';assert row[4]==limit;assert row[16]==outcome;expected={5:xi*1000,6:remainingb,7:remainingacid,8:acetate,9:formed,10:W0,11:water,12:gas,13:L,14:cond,15:total};calc=[nb,na,xi,remainingb,initialacid,remainingacid,W0,acetate,formed,water,gas,L,cond,total,min(nb,na),100*xi/min(nb,na),None]
  for col,value in expected.items():assert abs(float(row[col])-value)<.00000051,(sample,trial,col,row[col],value)
  expectedCalc[trial]=calc
assert sorted(allrows)==list(range(1,38));report=(p/'ui-exported-practical.html').read_text();assert 'VisionariesAI Labs' in report and not re.search(r'https?://',report)
for field in ['prediction','conclusion']:assert html.escape(after[field],quote=True) in report
class Tables(HTMLParser):
 def __init__(self):super().__init__();self.tables={};self.current=None;self.row=None;self.cell=None
 def handle_starttag(self,tag,attrs):
  if tag=='table':self.current=dict(attrs).get('data-change-table');self.tables[self.current]=[]
  if tag=='tr' and self.current is not None:self.row=[]
  if tag=='td' and self.current is not None:self.cell=''
 def handle_data(self,data):
  if self.cell is not None:self.cell+=data
 def handle_endtag(self,tag):
  if tag=='td' and self.cell is not None:self.row.append(self.cell);self.cell=None
  if tag=='tr' and self.current is not None and self.row:self.tables[self.current].append(self.row)
  if tag=='table':self.current=None
parser=Tables();parser.feed(report)
for sample,table in zip(samples,after['tables']):
 groups=[[0,1,2,3,4,5,6,7,17],[0,1,8,9,10,11,12,13,14,15,16]] if sample=='reaction' else [list(range(13))]
 for j,columns in enumerate(groups):assert parser.tables[f'{sample}-{j}']==[[row[i] for i in columns] for row in table['rows']]
blocks=re.findall(r'<li><strong>(.*?)</strong><p><code>(.*?)</code></p><p>Substitution: (.*?)</p><p>Result: (.*?)</p></li>',report);assert len(blocks)==509
cursor=0
for trial in range(1,38):
 sample,row=allrows[trial]
 for j,value in enumerate(expectedCalc[trial]):
  title,formula,sub,result=[html.unescape(v) for v in blocks[cursor]];cursor+=1;assert title and formula and sub and result
  if value is not None:
   actual=float(re.search(r'-?\d+(?:\.\d+)?',result).group());assert abs(actual-value)<.00000051,(trial,title,actual,value)
  elif sample=='paper' and j==9:assert ('intact' if float(row[1])==0 else 'broken') in result
  else:assert ('Physical change' if sample=='paper' else 'Chemical change') in result
print('37 actual GUI trials across12 ice/10 paper/15 reaction records independently verified. Exact reload,4 print tables and509 worked results passed.')
