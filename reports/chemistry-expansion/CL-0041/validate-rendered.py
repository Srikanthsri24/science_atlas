"""Run from repo root. Independent physics/volume reconstruction; no app import."""
import json,math,re
from pathlib import Path
p=Path('reports/chemistry-expansion/CL-0041');raw=json.loads((p/'rendered-states.json').read_text());checks=[]
initial_ml=100+2/2.65;h0_cm=initial_ml/12.5;bmax_cm=(2/2.65)/(12.5*.6);concentration=2/initial_ml
for d in raw:
 r=d['radiusUm']*1e-6;drive=(2650-1000)*4*math.pi*r**3/3*9.81;lo=0;hi=2*(2650-1000)*9.81*r*r/(9*.001)
 for _ in range(80):
  v=(lo+hi)/2;reynolds=2*r*1000*v/.001;drag=6*math.pi*.001*r*v*(1+.15*reynolds**.687)
  if drag<drive:lo=v
  else:hi=v
 speed=(lo+hi)/2;t=d['waitS'];q=d['withdrawalMl'];sc=d['scale'];layers={v['name']:v for v in d['layers']};bed=layers['bed']['height']/sc;cloud=layers['cloud']['height']/sc;clear=layers['clear']['height']/sc;top=bed+cloud+clear
 expected_bed=bmax_cm*min(1,speed*100*t/(h0_cm-bmax_cm));expected_top=h0_cm-q/12.5;cloud_top=max(expected_bed,h0_cm-speed*100*t);expected_cloud=max(0,min(expected_top,cloud_top)-expected_bed)
 assert abs(bed-expected_bed)<1e-10,(d['case'],'bed');assert abs(top-expected_top)<1e-10,(d['case'],'top');assert abs(cloud-expected_cloud)<1e-10,(d['case'],'cloud')
 for name,layer in layers.items():assert abs(layer['width']/sc-5)<1e-12,(d['case'],'width',name)
 assert abs(layers['bed']['y']-(layers['cloud']['y']+layers['cloud']['height']))<1e-8
 assert abs(layers['cloud']['y']-(layers['clear']['y']+layers['clear']['height']))<1e-8
 receiver_q=d['receiver']['height']/sc*12.5;assert abs(receiver_q-q)<1e-10
 assert abs(top*12.5+receiver_q-initial_ml)<1e-10
 bed_g=bed*12.5*.6*2.65;source_susp=cloud*12.5*concentration;receiver_sand=2-bed_g-source_susp
 if abs(receiver_sand)<1e-10:receiver_sand=0
 receiver_water=q-receiver_sand/2.65;source_water=100-receiver_water;source_sand=bed_g+source_susp;wet=source_water+source_sand
 expected_values={'Settled sand':bed_g,'Source suspension':source_susp,'Receiver sand':receiver_sand,'Receiver water':receiver_water,'Sand retained':source_sand/2*100,'Wet source residue':wet}
 for title,value in expected_values.items():
  actual=float(re.search(r'[-+]?\d*\.?\d+',d['texts'][d['texts'].index(title)+1]).group());tol=.00501 if title=='Sand retained' else .000501
  assert abs(actual-value)<=tol,(d['case'],title,actual,value)
 expected_ids={i for i in range(144) if h0_cm*(i+.5)/144-speed*100*t>expected_bed and h0_cm*(i+.5)/144-speed*100*t<=expected_top};assert {v['index'] for v in d['markers']}==expected_ids,(d['case'],'marker set')
 bottom_px=layers['bed']['y']+layers['bed']['height']
 for m in d['markers']:
  height=(bottom_px-m['cy'])/sc;expect=h0_cm*(m['index']+.5)/144-speed*100*t;assert abs(height-expect)<1e-8
  world_x=(m['cx']-d['originX'])/sc;assert -7.5<world_x<-2.5
 assert abs(source_water+receiver_water-100)<1e-10;assert abs(source_sand+receiver_sand-2)<1e-10
 checks.append({'case':d['case'],'passed':True,'settledSandG':bed_g,'sourceSuspendedSandG':source_susp,'receiverSandG':receiver_sand,'receiverWaterMl':receiver_water,'totalG':source_water+source_sand+receiver_water+receiver_sand,'actualVisibleMarkers':len(expected_ids)})
by_name={d['case']:d for d in raw}
a=by_name.get('manual-settling-paused');b=by_name.get('manual-settling-after-resume')
if a and b:
 assert b['waitS']>a['waitS'];ma={m['index']:m for m in a['markers']};mb={m['index']:m for m in b['markers']};assert mb[143]['cy']>ma[143]['cy']
a=by_name.get('manual-transfer-playing-before');b=by_name.get('manual-transfer-playing-after')
if a and b:
 assert a['waitS']==b['waitS'];assert b['withdrawalMl']>a['withdrawalMl'];assert len(a['flow'])==len(b['flow'])==12;assert a['flow']!=b['flow'];assert a['markers']==b['markers']
(p/'independent-gui-validation.json').write_text(json.dumps({'method':'No application model imported. Independently solve corrected sphere drag, reconstruct actual SVG bed/cloud/clear/receiver box volumes and masses, verify each visible marker height and phase, compare every displayed mass/percentage and verify pause/resume/frozen-transfer behaviour.','passed':len(checks),'failed':0,'states':checks},indent=2)+'\n');print('Independent actual-rendered checks:',len(checks),'passed')
