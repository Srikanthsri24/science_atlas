from html.parser import HTMLParser
from pathlib import Path
import math,json,re
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.cells=[];self.active=False
 def handle_starttag(self,t,a):
  if t=='td':self.active=True;self.cells.append('')
 def handle_endtag(self,t):
  if t=='td':self.active=False
 def handle_data(self,d):
  if self.active:self.cells[-1]+=d
out=Path(__file__).parent
src=max(Path('/Users/macbookpro/Downloads').glob('CL-0075-diffusion-practical*.html'),key=lambda p:p.stat().st_mtime)
text=src.read_text();p=Parser();p.feed(text);assert len(p.cells)%17==0
checks=0
for j in range(len(p.cells)//17):
 row=p.cells[j*17:(j+1)*17];L,A,m,D,t=map(float,[row[3],row[4],row[5],row[7],row[8]]);N=160;theta=0 if row[2]=='closed' else D*1e6*t/L**2;w=[1/N]*N
 if theta==0:w=[2/N if i<N//2 else 0 for i in range(N)]
 else:
  for k in range(1,N,2):
   a=4/N**2*sum(math.cos(math.pi*k*(i+.5)/N) for i in range(N//2));e=math.exp(-4*N*N*math.sin(math.pi*k/(2*N))**2*theta)
   for i in range(N):w[i]+=a*e*math.cos(math.pi*k*(i+.5)/N)
 right=m*sum(w[N//2:]);mean=m/(A*L/1000);flux=0 if row[2]=='closed' else D*1e6*m*(w[N//2-1]-w[N//2])/(A*(L/N)**2)
 expected={9:theta,10:m-right,11:right,12:m,13:mean,14:flux,15:flux*A,16:max(abs(v*N-1) for v in w)*100}
 for col,v in expected.items():assert abs(float(row[col])-v)<max(1e-10,abs(v)*1e-6),(j,col,row[col],v);checks+=1
assert 'Compare equal preparations at equal clocks' in text and 'Excludes convection.' in text
assert '<table>' in text and '@media print' in text and 'Grid-face flux =' in text
(out/'actual-ui-report.html').write_text(text)
(out/'download-validation.json').write_text(json.dumps({'checks':checks,'rows':len(p.cells)//17,'tableColumns':17,'method':'Independent Python cosine finite-volume reconstruction from actual downloaded preparations, including closed-partition controls','passed':True},indent=2))
print(checks,'derived quantities passed across',len(p.cells)//17,'actual downloaded rows')
