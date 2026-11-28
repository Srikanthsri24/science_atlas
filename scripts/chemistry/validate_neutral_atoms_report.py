"""Independent integer/Decimal report arithmetic, original inputs, table and
operator/operand audit. Mass number remains a count, not an atomic mass."""
import ast,json,re,math,sys
from pathlib import Path
from validate_soap_hardness_report import Report as BaseReport
from validate_neutral_atoms import reference,target,E,D
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):
  super().handle_starttag(tag,[(k,'soap-hardness-record-inputs'if k=='id'and v=='neutral-atoms-record-inputs'else v)for k,v in attrs])
  if tag=='p'and self.block is not None and dict(attrs).get('class')=='formula':self.part='formula';self.block['formula']=''
FORMULAS={'atomicNumber':'Z = target p','massNumber':'A = target p + target n','neutrons':'n = A - Z','neutralElectrons':'eNeutral = Z','chargeUnits':'Q/e0 = pPlaced - ePlaced','protonChargeC':'Qp = pPlaced * e0','electronChargeC':'Qe = -ePlaced * e0','chargeC':'Q = (pPlaced - ePlaced) * e0','K':'K = counted first-shell tokens','L':'L = counted second-shell tokens','M':'M = counted third-shell tokens','shellSum':'ePlaced = K + L + M','neutronProtonRatio':'N/P = nPlaced / pPlaced','protonFraction':'fP = pPlaced / A','neutronFraction':'fN = nPlaced / A','totalTokens':'T = pPlaced + nPlaced + ePlaced','nucleonResidual':'difference = pPlaced + nPlaced - A','deltaProtons':'delta p = Zright - Zleft','deltaNeutrons':'delta n = (Aright - Zright) - (Aleft - Zleft)','deltaElectrons':'delta eNeutral = Zright - Zleft','deltaMassNumber':'delta A = Aright - Aleft','massDifferenceCheck':'delta A = delta p + delta n','deltaChargeUnits':'delta(Q/e0) = (Zright - eRight) - (Zleft - eLeft)'}
HEADERS=[['Trial','Constructed isotope','Comparison isotope','Placed proton count','Placed neutron count','Placed electron count','Student observation'],['Trial','Reference','Isotope','Atomic number Z','Mass number A (count)','Protons p','Neutrons n','Electrons e','K-shell count','L-shell count','M-shell count','Ground-state configuration'],['Trial','Reference','Isotope','Positive charge C','Electron charge C','Net charge C','Net charge in elementary-charge units','Neutron/proton count ratio','Proton nucleon fraction','Neutron nucleon fraction'],['Trial','Left isotope','Right isotope','Same element?','Same isotope?','Right minus left: proton count','Right minus left: neutron count','Right minus left: electron count','Right minus left: mass number','Right minus left: net charge units']]
def near(a,b):
 a,b=D(str(a)),D(str(b));assert abs(a-b)<=abs(b)*D('1e-15'),(str(a),str(b))
def tree_compare(a,b,asource,bsource):
 assert type(a)==type(b),(ast.dump(a),ast.dump(b))
 if isinstance(b,ast.Constant):assert type(a.value)in[int,float]and type(b.value)in[int,float];near(ast.get_source_segment(asource,a),ast.get_source_segment(bsource,b));return 1
 if isinstance(b,ast.UnaryOp):assert type(a.op)==type(b.op);return tree_compare(a.operand,b.operand,asource,bsource)
 if isinstance(b,ast.BinOp):assert type(a.op)==type(b.op);return tree_compare(a.left,b.left,asource,bsource)+tree_compare(a.right,b.right,asource,bsource)
 raise AssertionError('Unsupported operation')
def evaluate(s):
 def ev(n):
  if isinstance(n,ast.Constant):return D(ast.get_source_segment(s,n))
  if isinstance(n,ast.UnaryOp)and isinstance(n.op,ast.USub):return -ev(n.operand)
  if isinstance(n,ast.BinOp):
   a,b=ev(n.left),ev(n.right)
   if isinstance(n.op,ast.Add):return a+b
   if isinstance(n.op,ast.Sub):return a-b
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
  raise AssertionError('Unsupported arithmetic')
 return ev(ast.parse(s,mode='eval').body)
def expressions(q):
 result={}
 for group,id in [('constructed',q['isotopeId']),('comparison',q['compareId'])]:
  t=target(id);p=t['z'];n=t['neutronTarget'];a=t['a'];shells=t['shells']+[0]*3;k,l,m=shells[:3]
  es={'atomicNumber':str(p),'massNumber':f'{p}+{n}','neutrons':f'{a}-{p}','neutralElectrons':str(p),'chargeUnits':f'{p}-{p}','protonChargeC':f'{p}*{E}','electronChargeC':f'-{p}*{E}','chargeC':f'({p}-{p})*{E}','K':str(k),'L':str(l),'M':str(m),'shellSum':f'{k}+{l}+{m}','neutronProtonRatio':f'{n}/{p}','protonFraction':f'{p}/{a}','neutronFraction':f'{n}/{a}','totalTokens':f'{p}+{n}+{p}','nucleonResidual':f'{p}+{n}-{a}'}
  for key,e in es.items():result[group+'.'+key]=e
 a,b=target(q['isotopeId']),target(q['compareId']);dp=b['z']-a['z'];dn=b['neutronTarget']-a['neutronTarget'];delta={'deltaProtons':f"{b['z']}-{a['z']}",'deltaNeutrons':f"({b['a']}-{b['z']})-({a['a']}-{a['z']})",'deltaElectrons':f"{b['z']}-{a['z']}",'deltaMassNumber':f"{b['a']}-{a['a']}",'massDifferenceCheck':f'{dp}+{dn}','deltaChargeUnits':f"({b['z']}-{b['z']})-({a['z']}-{a['z']})"}
 for key,e in delta.items():result['difference.'+key]=e
 return result
def unit(key):return'C'if key in ['protonChargeC','electronChargeC','chargeC']else'elementary-charge units'if key in ['chargeUnits','deltaChargeUnits']else'ratio'if key=='neutronProtonRatio'else'fraction'if key in ['protonFraction','neutronFraction']else'count'
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);trials=r['trials'];assert len(trials)<=40 and len(p.tables)==4 and len(p.blocks)==40*len(trials)
 for t,h in zip(p.tables,HEADERS):assert t[0]==h
 assert [len(t)-1 for t in p.tables]==[len(trials),2*len(trials),2*len(trials),len(trials)]
 tc=oc=0;seen=set()
 for i,q in enumerate(trials):
  state=reference({k:q[k]for k in ['isotopeId','protons','neutrons','electrons']});assert state['complete'];b=target(q['compareId']);row=p.tables[0][i+1];assert row==[str(i+1),q['isotopeId'],q['compareId'],str(q['protons']),str(q['neutrons']),str(q['electrons']),q['note']];tc+=7
  for j,id in enumerate([q['isotopeId'],q['compareId']]):
   t=target(id);z=t['z'];n=t['neutronTarget'];a=t['a'];shells=t['shells']+[0]*3;lead=[str(i+1),'Comparison'if j else'Constructed',id]
   counts=lead+list(map(str,[z,a,z,n,z,*shells[:3]]))+[t['configuration']];assert p.tables[1][1+2*i+j]==counts;tc+=len(counts)
   charge=p.tables[2][1+2*i+j];assert charge[:3]==lead and len(charge)==10
   for actual,want in zip(charge[3:],[z*E,-z*E,D(0),z-z,D(n)/z,D(z)/a,D(n)/a]):near(actual,want);tc+=1
  a=state['target'];comparison=p.tables[3][i+1];expected=[str(i+1),a['id'],b['id'],'Yes'if a['z']==b['z']else'No','Yes'if a['id']==b['id']else'No',*map(str,[b['z']-a['z'],b['neutronTarget']-a['neutronTarget'],b['z']-a['z'],b['a']-a['a'],0])];assert comparison==expected;tc+=len(expected)
 for block in p.blocks:
  i=block['trial'];key=block['key'];assert block['formula']==FORMULAS[key.split('.')[1]],(key,'formula');assert(i,key)not in seen;seen.add((i,key));expected=expressions(trials[i])[key];actual=block['substitution'];oc+=tree_compare(ast.parse(actual,mode='eval').body,ast.parse(expected,mode='eval').body,actual,expected)
  match=re.fullmatch(r'([-+0-9.eE]+) (.+)',block['result']);u=unit(key.split('.')[1]);assert match and match[2]==u,(key,block['result']);value=evaluate(expected);near(match[1],value);near(match[1],evaluate(actual))
 return dict(trials=len(trials),workedResults=len(p.blocks),operandChecks=oc,tableFieldChecks=tc)
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))
