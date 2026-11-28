"""Independent HTML arithmetic, table, unavailable reading and guide-provenance audit."""
import ast,json,sys,math
from pathlib import Path
from decimal import Decimal as D
from html.parser import HTMLParser
from validate_ionic_phase import expected
class Report(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.payload='';self.script=False;self.tables=[];self.table=None;self.row=None;self.cell=False;self.blocks=[];self.block=None;self.part=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='script'and a.get('id')=='ionic-phase-record-inputs':self.script=True
  if tag=='table':self.table=[]
  if tag=='tr':self.row=[]
  if tag in ['th','td']:self.cell=True;self.row.append('')
  if tag=='article':self.block=dict(trial=int(a['data-trial']),key=a['data-key'],formula='',substitution='',result='')
  if self.block is not None:
   if tag=='code':self.part='substitution'
   if tag=='p'and a.get('class')in ['formula','result']:self.part=a['class']
 def handle_data(self,s):
  if self.script:self.payload+=s
  if self.cell:self.row[-1]+=s
  if self.block is not None and self.part:self.block[self.part]+=s
 def handle_endtag(self,tag):
  if tag=='script':self.script=False
  if tag in ['th','td']:self.cell=False
  if tag=='tr':self.table.append(self.row);self.row=None
  if tag=='table':self.tables.append(self.table);self.table=None
  if tag in ['p','code']:self.part=None
  if tag=='article':self.blocks.append(self.block);self.block=None

def near(a,b):
 a,b=D(str(a)),D(str(b));assert abs(a-b)<=abs(b)*D('6e-12'),(str(a),str(b))
def expr(s):
 def ev(n):
  if isinstance(n,ast.Constant):return D(ast.get_source_segment(s,n))
  if isinstance(n,ast.UnaryOp)and isinstance(n.op,ast.USub):return -ev(n.operand)
  if isinstance(n,ast.BinOp):
   a,b=ev(n.left),ev(n.right)
   if isinstance(n.op,ast.Mult):return a*b
   if isinstance(n.op,ast.Div):return a/b
  raise AssertionError('Unexpected arithmetic')
 return ev(ast.parse(s,mode='eval').body)
FORMULAS={'voltage':'Vcell = connectedFlag × Vconfigured','gap':'l = gapCm / 100','area':'A = (widthCm / 100) × (depthCm / 100)','solidCurrent':'Itransport = 0 (fixed-lattice model condition)','solidConductivity':'No solid conductivity measurement','reference':'κ = selected fixed-temperature reference','conductance':'G = κ × A / l','current':'Irms = Vcell × G','microCurrent':'IµA = IA × 1000000','cellConstant':'K = l / A','inverseG':'Greading = Irms / Vcell','inverseKappa':'κreading = Greading × K','power':'Pmean = Vrms × Irms'}
UNITS={'voltage':'V','gap':'m','area':'m²','solidCurrent':'A','reference':'S/m','conductance':'S','current':'A','microCurrent':'µA','cellConstant':'m⁻¹','inverseG':'S','inverseKappa':'S/m','power':'W'}
def operand_tree(actual,expected):
 def compare(a,b):
  assert type(a)==type(b),(ast.dump(a),ast.dump(b))
  if isinstance(b,ast.Constant):near(a.value,b.value);return
  if isinstance(b,ast.UnaryOp):assert type(a.op)==type(b.op);compare(a.operand,b.operand);return
  assert isinstance(b,ast.BinOp)and type(a.op)==type(b.op);compare(a.left,b.left);compare(a.right,b.right)
 compare(ast.parse(actual,mode='eval').body,ast.parse(expected,mode='eval').body)
HEADERS=[['Trial','Material','Paired KCl reference','Gap (cm)','Width (cm)','Contact depth (cm)','Configured Vrms (V)','Source connected?','Phase cycle','Guide seconds or manual','Snapshot status','Student observation'],['Trial','Applied Vrms (V)','Ideal transport Irms (A)','Instantaneous voltage (V)','Instantaneous transport current (A)','Ideal mean power (W)','Inverse reading available?'],['Trial','Assigned aqueous κ (S/m)','Bulk G reading (S)','Reconstructed aqueous κ (S/m)','Solid conductivity measurement','Positive-ion drift sign','Negative-ion drift sign','Interpretation']]
def validate(html):
 p=Report();p.feed(html);data=json.loads(p.payload);trials=data['trials'];assert len(p.tables)==3
 for table,headers in zip(p.tables,HEADERS):assert table[0]==headers and len(table)==len(trials)+1 and all(len(row)==len(headers) for row in table)
 checks=0
 for i,q in enumerate(trials):
  t=q['guideSeconds'];cell=q['cell'];phase=q['phase']
  if t is None:assert q['guideBase']is None;label='Manual snapshot'
  else:
   assert 0<=t<=150;base=q['guideBase'];assert base is not None
   stage=0 if t<20 else 1 if t<45 else 2 if t<65 else 3 if t<100 else 4 if t<125 else 5 if t<140 else 6
   assert phase==('solid'if stage<=2 else 'water'if stage==4 else 'solution')
   for k,v in base['cell'].items():
    if k=='phaseCycle':near(cell[k],(t%4)/4)
    else:assert cell[k]==v
   label='Guided snapshot before verification'if t<140 else 'Verified guide stage'
  assert p.tables[0][i+1][1:3]==[phase,cell['sampleId']];assert p.tables[0][i+1][10]==label;assert p.tables[0][i+1][11]==q['note']
  for col,k in [(3,'gapCm'),(4,'widthCm'),(5,'immersedDepthCm'),(6,'voltageRmsV'),(8,'phaseCycle')]:near(p.tables[0][i+1][col],cell[k])
  assert p.tables[0][i+1][7]==('Yes'if cell['connected']else 'No')
  ex=expected(q);solid=phase=='solid';area=D(str(cell['widthCm']))*D(str(cell['immersedDepthCm']))/10000;gap=D(str(cell['gapCm']))/100;kap=ex['assignedSolutionConductivitySM'];G=None if solid else kap*area/gap
  vals={'voltage':ex['appliedVoltageRmsV'],'gap':gap,'area':area,'power':ex['meanPowerW']}
  if solid:vals.update(solidCurrent=D(0),solidConductivity=None)
  else:vals.update(reference=kap,conductance=G,current=ex['currentRmsA'],microCurrent=ex['currentRmsA']*1000000,cellConstant=gap/area if area else None,inverseG=ex['measuredConductanceS'],inverseKappa=ex['reconstructedConductivitySM'])
  blocks=[b for b in p.blocks if b['trial']==i];assert len(blocks)==len(vals)and set(b['key']for b in blocks)==set(vals)
  for b in blocks:
   k=b['key'];v=vals[k];assert b['formula']==FORMULAS[k]
   if v is None:assert b['substitution']=='Not evaluated'and b['result']=='Unavailable'
   else:
    number,unit=b['result'].split(' ',1);assert unit==UNITS[k];near(number,v);near(expr(b['substitution']),v)
   if v is not None:
    expressions={'voltage':f"{int(cell['connected'])} * {cell['voltageRmsV']}",'gap':f"{cell['gapCm']} / 100",'area':f"({cell['widthCm']} / 100) * ({cell['immersedDepthCm']} / 100)",'power':f"{ex['appliedVoltageRmsV']} * {ex['currentRmsA']}"}
    if solid:expressions['solidCurrent']='0'
    else:expressions.update(reference=str(kap),conductance=f"{kap} * {area} / {gap}",current=f"{ex['appliedVoltageRmsV']} * {G}",microCurrent=f"{ex['currentRmsA']} * 1000000",cellConstant=f"{gap} / {area}",inverseG=f"{ex['currentRmsA']} / {ex['appliedVoltageRmsV']}",inverseKappa=f"{ex['measuredConductanceS']} * {gap/area if area else 0}")
    operand_tree(b['substitution'],expressions[k])
   checks+=1
  for col,k in [(1,'appliedVoltageRmsV'),(2,'currentRmsA'),(3,'instantVoltageV'),(4,'instantCurrentA'),(5,'meanPowerW')]:near(p.tables[1][i+1][col],ex[k])
  assert p.tables[1][i+1][6]==('Yes'if ex['readingAvailable']else 'No')
  for col,k in [(1,'assignedSolutionConductivitySM'),(2,'measuredConductanceS'),(3,'reconstructedConductivitySM')]:
   if ex[k]is None:assert p.tables[2][i+1][col]=='Unavailable'
   else:near(p.tables[2][i+1][col],ex[k])
  assert p.tables[2][i+1][4]=='Not measured';near(p.tables[2][i+1][5],ex['positiveIonDirection']);near(p.tables[2][i+1][6],ex['negativeIonDirection'])
 return dict(observations=len(trials),workedBlocks=checks)
if __name__=='__main__':print('PASS',json.dumps(validate(Path(sys.argv[1]if len(sys.argv)>1 else 'reports/chemistry-expansion/CL-0120/report-fixture.html').read_text())))
