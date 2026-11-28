"""Independent guided snapshot, table, formula and Decimal arithmetic audit."""
import ast,json,math,re,sys
from pathlib import Path
from validate_soap_hardness_report import Report as BaseReport
from validate_formal_ions import reference
from validate_neutral_atoms import E,target,D
from validate_neutral_atoms_report import near,tree_compare,evaluate
class Report(BaseReport):
 def handle_starttag(self,tag,attrs):
  super().handle_starttag(tag,[(k,'soap-hardness-record-inputs'if k=='id'and v=='formal-ions-record-inputs'else v)for k,v in attrs])
  if tag=='p'and self.block is not None and dict(attrs).get('class')=='formula':self.part='formula';self.block['formula']=''
HEADERS=[['Trial','Known isotope','Selected net gain target (negative = loss)','Completed net gain so far','Travelling direction','Guide seconds (or manual)','Snapshot type','Student observation'],['Trial','Atomic number Z','Mass number A (count)','Protons','Neutrons','Formal atomic charge-count label'],['Trial','Account','Electron count','Positive charge units','Electron charge units','Net charge units','Net charge C'],['Trial','Initial total electrons','Current total electrons','Electron residual','Total charge units','Total charge C','Nucleon residual','Target reached?','Endpoint verified?']]
FORMULAS={'protons':'p = Z','neutrons':'n = A - Z','massNumber':'A = p + n','atomElectrons':'eAtom = Z + completedGain - departingLossFlag','reservoirElectrons':'eReservoir = 20 - completedGain - departingGainFlag','transitElectrons':'eTransit = gainFlag + lossFlag','atomElectronChange':'delta eAtom = eAtom - Z','reservoirElectronChange':'delta eReservoir = eReservoir - 20','atomChargeUnits':'qAtom/e0 = Z - eAtom','reservoirChargeUnits':'qReservoir/e0 = 20 - eReservoir','transitChargeUnits':'qTransit/e0 = -eTransit','totalChargeUnits':'qTotal/e0 = qAtom/e0 + qReservoir/e0 + qTransit/e0','atomPositiveChargeC':'qPositive = Z * e0','atomElectronChargeC':'qElectrons = -eAtom * e0','atomChargeC':'Q = chargeUnits * e0','reservoirChargeC':'Q = chargeUnits * e0','transitChargeC':'Q = chargeUnits * e0','totalChargeC':'Q = chargeUnits * e0','totalElectrons':'eTotal = eAtom + eReservoir + eTransit','initialTotalElectrons':'eInitial = Z + 20','electronResidual':'difference = eTotal - eInitial','nucleonResidual':'difference = p + n - A','atomElectronsFromCharge':'eAtom = Z - qAtom/e0','reservoirElectronsFromCharge':'eReservoir = 20 - qReservoir/e0','positiveUnits':'positiveUnits = Z + 20','negativeUnits':'negativeUnits = -(eAtom + eReservoir + eTransit)','chargeCrossCheck':'combinedUnits = positiveUnits + negativeUnits'}
def snapshot(q):
 s=reference({k:q[k]for k in ['isotopeId','transfer','transitDirection']});t=target(q['isotopeId']);tt=q['targetTransfer'];time=q['guideSeconds'];assert type(tt)is int and-min(3,t['z'])<=tt<=3
 if time is None:assert q['transfer']==tt and q['transitDirection']=='none';label='Manual endpoint reference'
 else:
  assert type(time)in[int,float]and math.isfinite(time)and 0<=time<=150
  progress=max(D(0),min(D(1),(D(str(time))-20)/90))*abs(tt);complete=min(abs(tt),int(progress+D('1e-12')));moving=complete<abs(tt)and progress>complete;direction='gain'if tt>0 else'loss';assert q['transfer']==(1 if tt>0 else-1 if tt<0 else 0)*complete and q['transitDirection']==(direction if moving else'none')
  label='Guided transfer snapshot'if q['transitDirection']!='none'else'Verified guided endpoint'if q['transfer']==tt and time>=130 else'Guided intermediate snapshot'
 return s,label
def expressions(q,s):
 z=s['protons'];n=s['neutrons'];a=s['massNumber'];t=q['transfer'];gain=int(q['transitDirection']=='gain');loss=int(q['transitDirection']=='loss');ae=s['atomElectrons'];re=s['reservoirElectrons'];te=s['transitElectrons'];aq=s['atomChargeUnits'];rq=s['reservoirChargeUnits'];tq=s['transitChargeUnits'];total=s['totalElectrons'];initial=s['initialTotalElectrons']
 return dict(protons=str(z),neutrons=f'{a}-{z}',massNumber=f'{z}+{n}',atomElectrons=f'{z}+{t}-{loss}',reservoirElectrons=f'20-{t}-{gain}',transitElectrons=f'{gain}+{loss}',atomElectronChange=f'{ae}-{z}',reservoirElectronChange=f'{re}-20',atomChargeUnits=f'{z}-{ae}',reservoirChargeUnits=f'20-{re}',transitChargeUnits=f'-{te}',totalChargeUnits=f'{aq}+{rq}+{tq}',atomPositiveChargeC=f'{z}*{E}',atomElectronChargeC=f'-{ae}*{E}',atomChargeC=f'{aq}*{E}',reservoirChargeC=f'{rq}*{E}',transitChargeC=f'{tq}*{E}',totalChargeC=f'0*{E}',totalElectrons=f'{ae}+{re}+{te}',initialTotalElectrons=f'{z}+20',electronResidual=f'{total}-{initial}',nucleonResidual=f'{z}+{n}-{a}',atomElectronsFromCharge=f'{z}-{aq}',reservoirElectronsFromCharge=f'20-{rq}',positiveUnits=f'{z}+20',negativeUnits=f'-({ae}+{re}+{te})',chargeCrossCheck=f'{z+20}+{-total}')
def unit(k):return'C'if k.endswith('C')else'elementary-charge units'if k.endswith('Units')or k=='chargeCrossCheck'else'count'
def validate(path):
 p=Report();p.feed(Path(path).read_text());r=json.loads(p.payload);trials=r['trials'];assert len(trials)<=40 and len(p.tables)==4 and len(p.blocks)==27*len(trials)
 for table,h in zip(p.tables,HEADERS):assert table[0]==h
 assert [len(t)-1 for t in p.tables]==[len(trials),len(trials),3*len(trials),len(trials)]
 tc=oc=0;seen=set()
 for i,q in enumerate(trials):
  s,label=snapshot(q);r0=p.tables[0][i+1];assert len(r0)==8 and r0[:5]==[str(i+1),q['isotopeId'],str(q['targetTransfer']),str(q['transfer']),q['transitDirection']]and r0[6:]==[label,q['note']]
  if q['guideSeconds']is None:assert r0[5]=='Manual'
  else:near(r0[5],q['guideSeconds'])
  tc+=8;assert p.tables[1][i+1]==[str(i+1),str(s['protons']),str(s['massNumber']),str(s['protons']),str(s['neutrons']),s['formalNotation']];tc+=6
  for j,(account,e,positive,charge,coulombs)in enumerate([('Atomic reference',s['atomElectrons'],s['protons'],s['atomChargeUnits'],s['atomChargeC']),('Reservoir',s['reservoirElectrons'],20,s['reservoirChargeUnits'],s['reservoirChargeC']),('In transit',s['transitElectrons'],0,s['transitChargeUnits'],s['transitChargeC'])]):
   row=p.tables[2][1+3*i+j];assert row[:2]==[str(i+1),account]and len(row)==7
   for actual,want in zip(row[2:],[e,positive,-e,charge,coulombs]):near(actual,want);tc+=1
  reached=q['transitDirection']=='none'and q['transfer']==q['targetTransfer'];verified=reached and(q['guideSeconds']is None or q['guideSeconds']>=130);row=p.tables[3][i+1];assert row[:5]==[str(i+1),str(s['initialTotalElectrons']),str(s['totalElectrons']),'0','0']and row[6:]==['0','Yes'if reached else'No','Yes'if verified else'No'];near(row[5],0);tc+=9
 for b in p.blocks:
  i=b['trial'];key=b['key'];assert(i,key)not in seen;seen.add((i,key));q=trials[i];s,_=snapshot(q);expected=expressions(q,s)[key];actual=b['substitution'];assert b['formula']==FORMULAS[key],(key,'formula');oc+=tree_compare(ast.parse(actual,mode='eval').body,ast.parse(expected,mode='eval').body,actual,expected)
  match=re.fullmatch(r'([-+0-9.eE]+) (.+)',b['result']);assert match and match[2]==unit(key),(key,b['result']);near(match[1],evaluate(expected));near(match[1],evaluate(actual))
 return dict(observations=len(trials),workedResults=len(p.blocks),operandChecks=oc,tableFieldChecks=tc)
if __name__=='__main__':print('PASS',json.dumps(validate(sys.argv[1])))
