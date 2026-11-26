"""Independent validation of actual GUI observations and downloaded report."""
from pathlib import Path
import json,html
r=Path(__file__).parent;before=json.loads((r/'ui-record-before-reload.json').read_text());after=json.loads((r/'ui-record-after-reload.json').read_text());assert before==after;assert len(after['rows'])==32
profiles={'Sand, gravel and prepared salt solution':(10,15,1),'Sand, gravel and salt-free liquid':(10,15,0),'More fine sand in prepared salt solution':(20,10,1)}
for row in after['rows']:
 assert len(row)==21
 T=float(row[1]);sand,gravel,C=profiles[row[2]];V,S,F=map(float,row[3:6]);f=min(1,T/60);salt=C*V/100;ret=lambda w:f*((sand if 150>=w else 0)+(gravel if 3000>=w else 0));rs,rf=ret(S),ret(F);passed=lambda value:(sand+gravel)*f-value
 expected={6:V*(1-f),7:(sand+gravel)*(1-f),8:rs,9:rf,10:passed(rs),11:passed(rf),12:V*f,13:V*f,14:salt*f,15:salt*f,18:2*V,19:salt}
 for i,value in expected.items():assert abs(float(row[i])-value)<.00000051,(row[0],i,row[i],value)
 for i in[16,17]:
  if f==0:assert row[i]=='Undefined'
  else:assert abs(float(row[i])-C)<.00000051
 assert abs(float(row[7])+float(row[8])+float(row[10])-(sand+gravel))<.00000051
 assert abs(float(row[7])+float(row[9])+float(row[11])-(sand+gravel))<.00000051
report=(r/'ui-exported-practical.html').read_text();assert report.count('Formula: ')==34*32;assert report.count('<h3>Trial')==32;assert before['prediction'] in html.unescape(report) and before['conclusion'] in html.unescape(report);assert not ('NaN' in report or 'Infinity' in report)
print('32 actual GUI trials independently verify grain/liquid/salt balances andopening boundaries;exact notebook persistence and1088 exported worked calculation blocks passed.')
