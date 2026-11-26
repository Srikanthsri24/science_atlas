# Canvas containment audit before final delivery

CL-0056's narrow-phone theatre review exposed a weakness in earlier layout probes: a canvas element can retain old dimensions while its actual clipping wrapper shrinks to zero or a tiny region. Positive canvas.getBoundingClientRect().height alone is insufficient evidence of a useful displayed view.

CL-0056 fixes its own canvas-wrapper selector using a descendant `:has(canvas)` and checks the direct wrapper's actual height/containment. Its fullscreen caption has a bounded scrolling height and expanded notes have bounded space.

Before the final all-labs completion audit, revisit older reviewed labs (especially ones using `>div:has(>canvas)`) with the stronger visible-wrapper probe. This is a follow-up risk identified from shared patterns, not a claim that every older lab is broken. Check at least narrow portrait theatre, short landscape theatre, normal phone landscape and expanded notes. Where an issue is observed, reopen the affected review, fix it, retest and refresh hashes/evidence. Do not silently change frozen reviewed files or claim this cross-lab audit has already passed.
