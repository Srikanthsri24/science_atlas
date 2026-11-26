import math

def state(t=0,water=100,mass=50,r=2,prepared=64,mu=1,sample='flocculated'):
 N=1 if sample=='primary' else prepared;rM=r*1e-6;Rf=rM*math.sqrt(N);Vp=4*math.pi*rM**3/3;Vf=4*math.pi*Rf**3/3;phi=N*Vp/Vf;rho=1000+1650*phi;eta=mu/1000;dry=2650*N*Vp;count=mass*1e-6/dry;Vs=mass/2650;V0=water+Vs;p0=Vs/V0;po=p0/phi;vrel=2*(rho-1000)*9.81*Rf**2/(9*eta);v=vrel*(1-po);up=vrel*po;Re=2*Rf*1000*vrel/eta;H=V0/10;beta=.6*phi;Bmax=Vs/(10*beta);end=(H-Bmax)/(100*v)
 # Solve growing-bed height from the solid-flux jump, independently of time/end fraction.
 b=min(Bmax,p0*100*v*t/(beta-p0));f=b/Bmax;z=max(b,H-100*v*t);hc=max(0,z-b);hclear=H-z;mb=mass*f;mc=mass-mb;vsb=Vs*f;vsc=Vs-vsb;vb=10*b;vc=10*hc;vclear=10*hclear;wb=vb-vsb;wc=vc-vsc;wt=wb+wc+vclear;conc=mc/(vc/1000) if vc>1e-12 else None;F=(rho-1000)*Vf*9.81;drag=6*math.pi*eta*Rf*vrel;Mb=wb+mb/1000;Mc=wc+mc/1000;Mclear=vclear;M0=water+mass/1000;tau=2*rho*Rf**2/(9*eta)
 return locals()
