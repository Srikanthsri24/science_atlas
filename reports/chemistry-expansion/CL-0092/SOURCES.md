# Private scientific audit · CL-0092

Primary guidance read2026-11-27:

- NIST TN1297 §3, Type A evaluation: statistical treatment of independent observations,including standard deviation of the mean. https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-3-type-evaluation-standard-uncertainty
- NIST TN1297 §5, combined standard uncertainty: components/covariances,corrections for significant systematic effects,and distinction between correction uncertainty and error. https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-5-combined-standard-uncertainty

- NIST TN1297 AppendixA.4 Eq(A-4)/(A-5), exact sample-mean and standard-deviation-of-the-mean formulas inspected. https://www.nist.gov/pml/nist-technical-note-1297/nist-tn-1297-appendix-law-propagation-uncertainty

Application interpretation: this is an original simulated balance exercise,not NIST-certified data. Repeatability estimates alone are not a full measurement uncertainty. Mean/range arithmetic is suitable for the basic lesson; sample SD and s/√n are optional advanced context. No automatic confidence percentage is attached. The chosen pseudo-normal spread and exact reference specimen mass are simulation inputs,not empirically calibrated distributions. The reproducible PRNG is computationally deterministic and not cryptographic; its samples illustrate an ideal independent-reading model. Empty-check randomness,drift,scale-factor error,linearity,temperature influence,reference uncertainty and physical pan dynamics are omitted. Fixed offset is not reduced by collecting more observations. Quantization residual after zero correction remains possible. Company references only in frontend; official-board mapping pending.

Implementation preserves original generated observations and SI/gram conversions. The corrected series subtracts one common empty indication;it is not a collection of independently calibrated corrections. Neither s/√n nor zero displayed variation is called total uncertainty or proof of accuracy. Final internal engineering evidence in review.json;official curriculum mapping remains pending.
