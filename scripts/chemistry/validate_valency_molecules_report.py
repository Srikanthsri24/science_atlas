"""Independent HTML tables, input timing, formulas, expression trees and units."""
import ast,json,re,math,sys
from pathlib import Path
from html.parser import HTMLParser
from validate_valency_molecules import TARGETS,ELEMENTS,canon
from validate_neutral_atoms_report import tree_compare,evaluate
class Report(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.payload='';self.script=False;self.tables=[];self.table=None;self.row=None;self.cell=False;self.blocks=[];self.block=None;self.part=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='script'and a.get('id')=='valency-molecules-record-inputs':self.script=True
  if tag=='table':self.table=[]
  if tag=='tr':self.row=[]
  if tag in['th','td']:self.cell=True;self.row.append('')
  if tag=='article':self.block=dict(trial=int(a['data-trial']),key=a['data-key'],formula='',substitution='',result='')
  if self.block is not None:
   if tag=='code':self.part='substitution'
   if tag=='p'and a.get('class')in['formula','result']:self.part=a['class']
 def handle_data(self,s):
  if self.script:self.payload+=s
  if self.cell:self.row[-1]+=s
  if self.block is not None and self.part:self.block[self.part]+=s
 def handle_endtag(self,tag):
  if tag=='script':self.script=False
  if tag in['th','td']:self.cell=False
  if tag=='tr':self.table.append(self.row);self.row=None
  if tag=='table':self.tables.append(self.table);self.table=None
  if tag in['p','code']:self.part=None
  if tag=='article':self.blocks.append(self.block);self.block=None
NAMES={'H2':'Hydrogen','Cl2':'Chlorine','HCl':'Hydrogen chloride','H2O':'Water','NH3':'Ammonia','CH4':'Methane','N2':'Nitrogen','CO2':'Carbon dioxide'}
HEADERS=[['Trial','Selected reference','Target formula','Placed atoms','Guide seconds or manual','Construction status','Student observation'],['Trial','Atom ID','Element','Location account','Valence electrons','Bond allowance','Bond-order sum','Lone pairs','Unassigned placed electrons','Electrons around atom','Duet/octet target'],['Trial','Endpoint A','Endpoint B','Bond order','Shared pairs','Shared electrons'],['Trial','Total valence electrons','Unplaced inventory electrons','Shared electrons','Nonbonding electrons','Unassigned placed electrons','Residual','Target connectivity?','Completed reference?','Verified endpoint?']]
def snapshot(q):
 atoms,target,pairs=TARGETS[q['targetId']];placed=q['placed'];assert len(placed)==len(set(placed))and set(placed)<=set(atoms);orders={a:0 for a in atoms};edges=[]
 for b in q['bonds']:
  assert b['a']in placed and b['b']in placed and b['a']!=b['b']and type(b['order'])is int and 1<=b['order']<=3
  edges.append(canon((b['a'],b['b'],b['order'])));orders[b['a']]+=b['order'];orders[b['b']]+=b['order']
 assert len(edges)==len({e[:2]for e in edges})
 for a,n in q['lonePairs'].items():assert a in placed and type(n)is int and n>0
 for a,e in atoms.items():assert orders[a]<=ELEMENTS[e][1]and orders[a]+2*q['lonePairs'].get(a,0)<=ELEMENTS[e][0]
 time=q['guideSeconds']
 if time is not None:
  assert type(time)in[int,float]and math.isfinite(time)and 0<=time<=150
  actions=[('place',a)for a in atoms]+[('bond',a,b)for a,b,n in target for _ in range(n)]+[('pair',a)for a,n in pairs.items()for _ in range(n)]
  count=min(len(actions),math.floor(max(0,min(1,(time-15)/110))*len(actions)+1e-12));ep=[];eb={};el={}
  for action in actions[:count]:
   if action[0]=='place':ep.append(action[1])
   elif action[0]=='bond':k=tuple(sorted(action[1:]));eb[k]=eb.get(k,0)+1
   else:a=action[1];el[a]=el.get(a,0)+1
  assert sorted(placed)==sorted(ep)and {e[:2]:e[2]for e in edges}==eb and q['lonePairs']==el
 total=sum(ELEMENTS[e][0]for e in atoms.values());tray=sum(ELEMENTS[e][0]for a,e in atoms.items()if a not in placed);bo=sum(b['order']for b in q['bonds']);lp=sum(q['lonePairs'].values());u={a:ELEMENTS[e][0]-orders[a]-2*q['lonePairs'].get(a,0)if a in placed else 0 for a,e in atoms.items()};unassigned=sum(u.values());connection=sorted(edges)==sorted(map(canon,target));complete=len(placed)==len(atoms)and connection and all(q['lonePairs'].get(a,0)==pairs.get(a,0)for a in atoms);verified=complete and(time is None or time>=140);label='Unfinished construction snapshot'if not complete else'Completed manual reference'if time is None else'Verified guided reference'if verified else'Completed construction before verification';assert total==tray+2*bo+2*lp+unassigned
 return dict(atoms=atoms,orders=orders,u=u,total=total,tray=tray,bo=bo,lp=lp,unassigned=unassigned,connection=connection,complete=complete,verified=verified,label=label)
def workings(q,s):
 out={};add=lambda k,f,x,result,unit='electrons':out.update({k:(f,x,result,unit)})
 atoms=s['atoms'];add('total','Etotal = sum(atom valence electrons)',' + '.join(str(ELEMENTS[e][0])for e in atoms.values()),s['total']);add('tray','Etray = sum(unplaced atom valence electrons)',' + '.join(str(ELEMENTS[e][0])for a,e in atoms.items()if a not in q['placed'])or'0',s['tray']);add('order','B = sum(bond orders)',' + '.join(str(b['order'])for b in q['bonds'])or'0',s['bo'],'shared pairs');add('shared','Eshared = 2 * B',f"2 * {s['bo']}",2*s['bo']);add('pairs','L = sum(assigned lone pairs)',' + '.join(str(q['lonePairs'].get(a,0))for a in atoms),s['lp'],'lone pairs');add('nonbonding','Enonbonding = 2 * L',f"2 * {s['lp']}",2*s['lp']);add('unassigned','Eunassigned = sum(unassigned placed atom electrons)',' + '.join(str(s['u'][a])for a in atoms),s['unassigned']);add('residual','Residual = Etotal - Etray - Eshared - Enonbonding - Eunassigned',f"{s['total']} - {s['tray']} - {2*s['bo']} - {2*s['lp']} - {s['unassigned']}",0);add('around','Sum(local shell counts) = 2 * Eshared + Enonbonding',f"2 * {2*s['bo']} + {2*s['lp']}",4*s['bo']+2*s['lp'],'local electron counts')
 for a,e in atoms.items():
  ve,limit=ELEMENTS[e];bo=s['orders'][a];lp=q['lonePairs'].get(a,0);around=2*bo+2*lp;shell=2 if e=='H'else 8
  add(a+':order','b = sum(incident bond orders)',' + '.join(str(b['order'])for b in q['bonds']if a in[b['a'],b['b']])or'0',bo,'bond-order units');add(a+':allowance','Remaining = allowance - b',f'{limit} - {bo}',limit-bo,'bond-order units');add(a+':nonbonding','Enonbonding(atom) = 2 * lone pairs',f'2 * {lp}',2*lp);add(a+':unassigned','Eunassigned(atom) = placedFlag * (valence - b - 2 * lone pairs)',f"{int(a in q['placed'])} * ({ve} - {bo} - 2 * {lp})",s['u'][a]);add(a+':around','Earound(atom) = 2 * b + 2 * lone pairs',f'2 * {bo} + 2 * {lp}',around,'local electron counts');add(a+':gap','Gap = target shell - local shell',f'{shell} - {around}',shell-around,'local electron counts')
 return out
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);trials=r['trials'];assert len(trials)<=40 and len(p.tables)==4
 for t,h in zip(p.tables,HEADERS):assert t[0]==h
 expected=[[],[],[],[]];ws={}
 for i,q in enumerate(trials):
  s=snapshot(q);lead=str(i+1);time=q['guideSeconds'];expected[0].append([lead,NAMES[q['targetId']],q['targetId'],str(len(q['placed'])),'Manual'if time is None else str(time).removesuffix('.0'),s['label'],q['note']])
  for a,e in s['atoms'].items():
   ve,limit=ELEMENTS[e];bo=s['orders'][a];lp=q['lonePairs'].get(a,0);expected[1].append(list(map(str,[lead,a,e,'Placed'if a in q['placed']else'Unplaced inventory',ve,limit,bo,lp,s['u'][a],2*bo+2*lp,2 if e=='H'else 8])))
  expected[2]+=[[lead,b['a'],b['b'],str(b['order']),str(b['order']),str(2*b['order'])]for b in q['bonds']]
  expected[3].append(list(map(str,[lead,s['total'],s['tray'],2*s['bo'],2*s['lp'],s['unassigned'],0,'Yes'if s['connection']else'No','Yes'if s['complete']else'No','Yes'if s['verified']else'No'])))
  for k,v in workings(q,s).items():ws[i,k]=v
 for actual,want in zip(p.tables,expected):assert actual[1:]==want,(actual[1:],want)
 assert len(p.blocks)==len(ws);seen=set();operands=0
 for b in p.blocks:
  key=(b['trial'],b['key']);assert key not in seen;seen.add(key);formula,expression,result,unit=ws[key];assert b['formula']==formula;operands+=tree_compare(ast.parse(b['substitution'],mode='eval').body,ast.parse(expression,mode='eval').body,b['substitution'],expression);assert b['result']==f'{result} {unit}';assert evaluate(b['substitution'])==result
 assert seen==set(ws)
 return dict(observations=len(trials),workedResults=len(p.blocks),operandChecks=operands,tableFields=sum(len(row)for table in expected for row in table))
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))
