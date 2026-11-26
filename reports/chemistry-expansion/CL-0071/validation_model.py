"""Independent closed-form process reconstruction; no production imports."""
import math
def smooth(x):
 u=min(1,max(0,x));return u*u*(3-2*u)
def state(row):
 t,S,A,W,h,w,n=map(float,[row[i] for i in [1,3,4,5,6,7,8]]);n=int(n)
 f=smooth((t-200)/200);d=smooth(t/200)
 done=min(n,max(0,math.floor((t-400)/100)))
 local=max(0,t-400-done*100) if done<n else 0
 fill=smooth(local/50);drain=smooth((local-50)/50)
 residueSalt=S*h/W*(h/(h+w))**done*(1-drain*w/(h+w)) if t>=400 else S*h/W*f
 rw=h*f+w*(fill-drain);fw=(W-h)*f+done*w+drain*w
 reserve=n*w-done*w-fill*w
 dry=smooth((t-700)/500);airR=rw*dry;airF=fw*dry;rw-=airR;fw-=airF
 sourceSalt=S*(1-d*f);rs=residueSalt;fs=S-sourceSalt-rs
 rd=min(rs,.36*rw);fd=min(fs,.36*fw);rc=rs-rd;fc=fs-fd
 final=S*h/W*(h/(h+w))**n;product=S-final
 return dict(t=t,S=S,A=A,W=W,h=h,w=w,n=n,done=done,sourceSalt=sourceSalt,sourceSand=A*(1-f),sourceWater=W*(1-f),sand=A*f,rs=rs,rw=rw,fs=fs,fw=fw,rd=rd,fd=fd,rc=rc,fc=fc,reserve=reserve,airR=airR,airF=airF,air=airR+airF,final=final,product=product,purity=100*A/(A+final),recovery=100*fc/S,initialWater=W+n*w,initialMass=S+A+W+n*w)
