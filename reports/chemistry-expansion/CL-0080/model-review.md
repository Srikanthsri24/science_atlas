# CL-0080 — construct an observed solubility curve from trials

Status: core and practical-record implementation;12focused tests pass. No geometry,UI or browser review yet.

Investigation method: controlled known masses,initial complete dissolution,
cooling and recording first detectable crystal/clouding temperature,then multiple
loadings to construct a curve. PrimaryAraújoMorais2024procedure was actually read
for79 in the preceding goal turn;it supports the method,not the numeric reference:
https://www.degruyterbrill.com/document/doi/10.1515/cti-2024-0004/html
No text,figures or empirical data copied. Private engineering reference only.

Distinct from79 two-temperature saturation comparison and59/60 crystal growth:
80is an event-detection/measurement-series/inference experiment. A single clear
known preparation cools;first DETECTABLE residue is an operational event,not an
instantaneous equilibrium observation. Preserve its temperature after later
cooling. Collect several loadings,plot observed loading ratio versus measured
cloud temperature,fit a line and inspect residuals. HighR² cannot exclude common
systematic bias. Need at least3distinct observed temperatures;5loadings recommended.

Chosen generic material S(T)=24+0.8(T−25)g/100gWATER. This is NOT empirical KNO3
data or an official textbook mapping. Start clear/equilibrated70°C,programmed
linear cooling0.05–0.5°C/s to10°C,water20–100g,loading16–56g/100gwater. All initial
loads below70°Ccapacity. Exactfirstorder precipitation lagτ1–20s,no delayed
nucleation/evaporation/heatbalance. AfterequilibriumcrossingatTeq,the target
capacity decreases linearly;solid=a[u−τ(1−exp(−u/τ))],a=water×.8×coolingrate/100.
After10°Cfloor,dissolved mass relaxes exponentially to fixedcapacity. D+solid=m.
Bisection locates solid0.005–0.05g threshold;all supported roots occur before
floor. This threshold is chosen,not a calibrated optical scattering detector.

Thermometer offset±1°C,reporting increment.1/.5/1°C;mass .01/.1g andwater .1/1g
increments. Observed cloud method uses initial weighed solute/water loading ratio;
finite detectable residue and finite relaxation make this an APPROXIMATE observed
solubility estimate,not actual dissolved mass at the event. Explain this bias.
No division by total solution mass. First-event temperature retained even when
current temperature later falls. Regression requires3distinct temperatures and
reports means,Sxx/Sxy,slope,intercept,SSE/SST,R²,25°Cestimate. Constant-response
bias can preserve a perfect line while shifting the intercept;test demonstratesit.

Guide120s,cooling progresses tofirsteventduring0–100presentationseconds,then
holds event for20s of measurement/report explanation. Bothclocks must be exposed.
Manualreference0–1800s. Planneddefaultseriesloadings20,28,36,44,52g/100gwater
(generictrueTeq20,30,40,50,60°C),withoriginalcoolingapparatus,magnifieddetector,
scatter/fitgraph,observations/formulas/substitutions/report. Not yet implemented.

10focusedtestsPASS:independentRK4throughrampandfloor,corners/conservation/event
bracketing,measurementrounding/bias,slowercooling,correctsolventdenominator,
degeneratefitguards,perfectlinebiasedintercept,guideclock/invalidstates.
Do not markready until records/viewers/actualbrowser/responsive review complete.
79scientificsources frozen;80core editable. NewmutablelabPresentations registry
must get an80description when80dedicatedrouteisadded;contracttestsrequireit.

Record implementation added:22observationcolumns,18trialcalculationblocks,10fit
calculationblocks,validated60trialstorage,eligible-eventfiltering,escapedexam
report. Earlycomparisonsarekeptbutexcludedfromfit. Firsteventreadingretained
afterfurthercooling. Testsverifyfinite-detectorloadingratioexceedsactualdissolved
ratioatclouding;reportexplainsthatapproximation.12focusedPASS. Finalworkspace
TypeScriptincludingnewrecordcompletedexit0(session53940);nofinal80UIchecks.

## Reopened review — replay and automatic framing

An actual replay from3Daggregate inspection retained that crop at0.2s,so the
opening cooling stage was hidden. Previous review archived as
review-before-camera-follow.json and catalogue80reopened before source edits;
81returned toplanned. Underlying24trial data and numerical calculations unchanged.
Watch/replay now remount the viewer toreset inspection/zoom/magnification. Guide
phase drives overview for0–60s,detector detail(2D)/physical aggregate detail(3D)
for60–100s,and overview for100–120s. Manual inspection/camera action overrides
follow;Followguideview resumes it. Nativepointer/wheel handlers takecontrol but
nativegesture verification remains unverified. Clockreplaycontrol also calls the
same new-investigation viewreset. Newphase/view contract test. Freshfull2D/3D
replay and actualmanual-follow checks required before restoringready.


## Final follow-camera correction
Reopened and fixed cropped replay.120s guide follows overview→aggregate/detector→overview;3D aggregate auto cutaway makes residue visible. Manual camera override andFollowcontrol tested320px. Final full3D120srun passed after fix;2Dfull120sfollowrun passed.24actualobservations retained on reviewed-card return. FinalTypeScriptandVitebuildpassed.19focused/2958fullregressiontests before CL81. Internal engineering review only;see review.json and camera-follow-check.json.
