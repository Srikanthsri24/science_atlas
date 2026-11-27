# CL-0079 — temperature-dependent saturation comparison

Status: passed internal functional review on2026-11-27. Historical implementation notes follow;final scope/evidence is in review.json. Independent expert/official-board verification is not claimed.

Primary research read: Araújo and Morais2024,Chemistry Teacher International,
https://www.degruyterbrill.com/document/doi/10.1515/cti-2024-0004/html
Procedure section2.2: controlled water/solute masses,heating with mixing,cooling,
measuring sample temperature and onset of crystals,solubility per100g WATER.
No text,figures,media or data copied. The article supports the investigation
method,not the chosen numeric curves or kinetics below. No student-facing links.

Distinct from CL-0031 fixed25°C dose saturation and CL-0038 household solids:
two separate equal preparations in different thermostatic baths;actual SAMPLE
temperature approaches setpoint;capacity changes continuously;solid shrinks/grows;
compare strongly increasing,weakly increasing and decreasing CHOSEN solubility
trends. These are hypothetical references,not real named chemical calibrations.
Never generalise that every solid becomes more soluble on heating.

Initial equilibrium at25°C. Chosen S25/slopes:(24,.8),(35,.03),(30,-.25),units
gsolute/100gwater and per°C. K(t)=Kinf+(K0-Kinf)exp(-t/τthermal).
Dtarget=min(m,K(t)); dD/dt=(Dtarget-D)/τrelax. Exact exponential response with
analytic mass-capacity crossing;equal-rate limit handled explicitly. D+solid=m.
Instant seeded/nucleation response,no induction-time model,evaporation,solution
volume,thermal-energy/heat-of-dissolution prediction. Bath thermal response and
mass-transfer intervals are chosen teaching references. Cooling can temporarily
supersaturate before precipitation catches up;do not label transient residue as
proof of equilibrium. Solubility estimate is withheld unless excess solid remains,
|D-Dtarget|<.001g and sample is within.01°C of bath. All-dissolved loadings cannot
measure saturation capacity.

9 focused tests pass:corners/conservation/bounds,reversed trend,equal-rate limit,
independent RK4 integration through target crossing,undefined solubility guard,
invalid inputs and slowest supported response. Guide120presentation seconds maps
to max(600,16maxτ) reference seconds;slowest960s. Manual time0–1200s. Both clocks
must be exposed by future UI. No final TS/full regression/build/browser run yet
for79;78source frozen and verified separately. Next:original paired bath apparatus,
probe/temperature trace,shrinking/growing crystal volumes,record/formulas/report,
responsive/UI checks before marking ready.

## Apparatus and record implementation

Created original paired thermostatic water-jacket2D/3D views,temperature probes,
actual-temperature-versus-time trace,teacher controls,28-column observation table,
20 structured formula/substitution/result blocks and escaped exam-style HTML report.
One equivalent cube represents the aggregate undissolved inventory. It changes edge
length with mass and can project above the water. Carrier level solves displaced
volume for partial or full immersion. Actual carrier mesh has a cube cavity and
square surface opening in the partially immersed case. At20/50/100gwater and
5/20/80gsolute at two bath extremes/three times,mesh volume is within0.1mL of
analytic solution volume;cube corners fit inside radius2.5cm and level below10cm.
Apparent dissolved specific volume0.5mL/g,solid density2g/mL,water density1g/mL
are chosen geometry assumptions,not empirical substance properties. Probe and
support displacement ignored;reference jacket fluid is illustrative,not quantified.
2D heat-flow direction dashes do not encode measured energy. No CFD/heat balance.

11 focused and2938 full regression tests passed. Initial TypeScript passed.
Browser first2Dguide underway,initialconsoleempty;oneCDPobservationtimeout recovered
on same live tab with caption read,screenshot then succeeded. No app restart.
Initial20viewport SVG checks found no page overflow,but trace labels shrank too
small on mobile;changed trace to600px minimum inside scrollable keyboard-focusable
region with16px SVG text below700px. Recheck final trace/mobile layout and final
TypeScript/build after UI edits. No passed review until actual guides/3D/records/
download/camera/responsive checks finish.

## Final internal functional review
Both actual120s guides completed with recording gates.15actualGUItrials28columns;
independentactualdownloadvalidator193observations+334workedresults passed.
Model exposes exact segment substitution alongside20basic practical blocks.
12focused,2newcataloguenavigation and2941fullregressiontests passed.
Mobile graph labels initially too small;600px internally scrollable16px chart
and separate2Dsampledetail views now checked,with no leaked header/other sample.
20finalresponsivecases pass;mobile dark table/chart scroll within page.
15rows/note/plan/conclusionpersistreloadandClass6return;finalconsoleempty.
Classcardintegration caught a real missing link forboth78/79. Replaced the
duplicated opening-ID whitelist with mutable labPresentations registry and
verifiedbothactualOpenlaboratory links;addedcross-catalogue contract tests.
No frozen78source changed. Finalproofverified-temperature.png.
Cua completion_summarycalled;browser task finished,viewport/theme restored.
