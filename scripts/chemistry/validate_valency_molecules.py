"""Independent integer Lewis inventory audit; no source module imports."""
import json,sys
from pathlib import Path
ELEMENTS={'H':(1,1),'C':(4,4),'N':(5,3),'O':(6,2),'Cl':(7,1)}
TARGETS={'H2':({'a':'H','b':'H'},[('a','b',1)],{}),'Cl2':({'a':'Cl','b':'Cl'},[('a','b',1)],{'a':3,'b':3}),'HCl':({'a':'H','b':'Cl'},[('a','b',1)],{'b':3}),'H2O':({'o':'O','h1':'H','h2':'H'},[('o','h1',1),('o','h2',1)],{'o':2}),'NH3':({'n':'N','h1':'H','h2':'H','h3':'H'},[('n','h1',1),('n','h2',1),('n','h3',1)],{'n':1}),'CH4':({'c':'C',**{f'h{i}':'H'for i in range(1,5)}},[('c',f'h{i}',1)for i in range(1,5)],{}),'N2':({'a':'N','b':'N'},[('a','b',3)],{'a':1,'b':1}),'CO2':({'c':'C','o1':'O','o2':'O'},[('c','o1',2),('c','o2',2)],{'o1':2,'o2':2})}
def canon(b):return tuple(sorted([b[0],b[1]]))+(b[2],)
def audit(rows):
 fields=0
 for row in rows:
  q=row['input'];s=row['state'];atoms,target,pairs=TARGETS[q['targetId']];placed=q['placed'];assert len(set(placed))==len(placed)and set(placed)<=set(atoms)
  orders={i:0 for i in atoms};edges=[]
  for b in q['bonds']:
   assert b['a']in placed and b['b']in placed and b['a']!=b['b']and type(b['order'])is int and 1<=b['order']<=3
   edges.append(canon((b['a'],b['b'],b['order'])));orders[b['a']]+=b['order'];orders[b['b']]+=b['order']
  assert len({e[:2]for e in edges})==len(edges)
  unassigned=0
  for a in s['atoms']:
   i=a['id'];e=atoms[i];ve,limit=ELEMENTS[e];lp=q['lonePairs'].get(i,0);present=i in placed;assert orders[i]<=limit and orders[i]+2*lp<=ve
   remaining=ve-orders[i]-2*lp if present else 0;unassigned+=remaining
   expected=dict(id=i,element=e,placed=present,valenceElectrons=ve,bondAllowance=limit,bondOrderSum=orders[i],lonePairs=lp,remainingBondAllowance=limit-orders[i],unassignedElectrons=remaining,electronsAround=2*orders[i]+2*lp,targetShell=2 if e=='H'else 8)
   assert a==expected,(q,a,expected);fields+=len(expected)
  assert len(s['atoms'])==len(atoms)and {a['id']for a in s['atoms']}==set(atoms)
  total=sum(ELEMENTS[e][0]for e in atoms.values());tray=sum(ELEMENTS[e][0]for i,e in atoms.items()if i not in placed);bo=sum(b['order']for b in q['bonds']);lp=sum(q['lonePairs'].values());connection=sorted(edges)==sorted(map(canon,target));complete=len(placed)==len(atoms)and connection and all(q['lonePairs'].get(i,0)==pairs.get(i,0)for i in atoms)
  expected=dict(totalValenceElectrons=total,trayElectrons=tray,bondOrderTotal=bo,bondElectrons=2*bo,lonePairCount=lp,nonbondingElectrons=2*lp,unassignedElectrons=unassigned,residual=total-tray-2*bo-2*lp-unassigned,targetConnectivity=connection,complete=complete,status='Completed selected Lewis reference'if complete else'Unfinished construction — not a physical species prediction')
  for k,v in expected.items():assert s[k]==v,(k,s[k],v);fields+=1
  assert expected['residual']==0
 return dict(constructions=len(rows),integerFieldChecks=fields)
if __name__=='__main__':print('PASS',json.dumps(audit(json.loads(Path(sys.argv[1]).read_text()))))
