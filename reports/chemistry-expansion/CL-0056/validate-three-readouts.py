from pathlib import Path
import json,re,math
p=Path(__file__).parent;states=json.loads((p/'3d-readout-states.json').read_text())
for v in states:
 q=v['inputs'];W,S,k,t=q['waterG'],q['saltG'],q['rateSInv'],q['timeS'];R=S*min(1,t/10);u=max(0,t-.1);A=S*min(1,u/10);C=.36*W;M=min(S,C);a=S/10;tr=min(10,C/a);end=a/k*(k*tr+math.expm1(-k*tr))
 if t<=tr+.1:D=a/k*(k*u+math.expm1(-k*u));U=A-D
 else:lag=(M-end)*math.exp(-k*(t-.1-tr));D=M-lag;U=A-M+lag
 expected=[t,S-R,R-A,U,D,W+S,150+W+S,W+S];actual=[float(n) for n in re.findall(r'\d+\.\d+',v['inventory'])];assert len(actual)==len(expected),(actual,expected);assert all(abs(x-y)<.000501 for x,y in zip(actual,expected)),(actual,expected)
 assert v['canvasWrapperHeight']>=69 and v['canvasVisibleHeight']>=69 and v['canvasMatchesWrapper'] and v['readoutsInsideStage'] and v['notesInsideStage'] and v['pageWidth']<=v['width']
print(f'{len(states)} actual 3D readouts independently match inventories;visible canvas wrappers andnotes/readouts are contained.')
