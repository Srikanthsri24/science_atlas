# CL-0040 — magnetic pickup model draft

This is an original internal teaching reference, not calibrated iron, sand, an electromagnet design or official curriculum certification. UI and browser review are still pending. It is not counted as a completed lab.

Each of24 enlarged iron markers represents1000 independent kernels, not a physical clump. Individual mass0.4–0.6mg gives12g iron in total;36g pure quartz sand remains at the source. Pure quartz response and mechanical entrainment are neglected. Real sand can contain magnetic minerals. Ideal product purity therefore must never be advertised as an empirical separation guarantee.

A prescribed local-axis field is B(y)=p B0 exp[−(h−y)/ell], ell=8mm, pole p=±1, h=4–20mm, B0=0–8mT. This is a local-axis approximation, not a global Maxwell field or field solved from a coil/current. The induced reversible moment is mu=m sigma tanh(B/Bs), with illustrative specific saturation sigma and field scale Bs. They deliberately vary among reference kernels; they are not measured material properties. Force is mu dB/dy, upwards for either pole. A stationary kernel stays supported if this force does not exceed weight. Otherwise one-dimensional RK4 at0.0001s integrates gravity and magnetic force until ideal contact at the fixed pickup face. Contact dissipates kinetic energy and holds the kernel. No lateral motion, drag, collisions, shielding, hysteresis, remanence or demagnetisation is solved. Magnetic work is the integral of mu(B)dB, not mu(B)B; differentiating the latter would double count a response term.

The guide is110s:10s introduction,70s showing the first0.13 physical seconds at approximately0.001857×,10s advancing0.13–0.3s at0.017×,20s conclusion. Clearly label physical and guide time and the deliberate slow motion. Show source iron, rising iron and captured iron separately; source sand remains36g. A0.3s interval endpoint does not imply all grains have settled. Capture leaves iron on the pickup face, not in a separate vessel. Numeric precision does not represent instrument accuracy.

Internal scientific reference checks, retained outside student-facing UI/report:
- [Feynman Lectures II15, current-loop forces and nonuniform fields](https://www.feynmanlectures.caltech.edu/II_15.html)
- [Feynman Lectures II34, induced moments and magnetic work](https://www.feynmanlectures.caltech.edu/II_34.html)
- [Durham Mathematical Methods in Physics II, magnetic dipole force](https://www.maths.dur.ac.uk/users/aristomenis.donos/MMP/Lectures.html)

These references support the principles, not the chosen numerical reference parameters. Explanations and code are original; no textbook passages or proprietary assets are copied.
