# Responsive review — 28 October 2026

80 browser viewport cases passed: ten shared application screens at 320×740, 390×844, 844×390, 768×1024, 1024×768, 1366×768, 1920×1080 and 3840×2160.

Screens: overview, class catalogue, analytics, preferences, internal review ledger, pendulum explore/watch, concept experiment/watch/quiz.

Additional checks covered long crystallography readouts at 320px, a populated two-trial practical record, portrait 3D presentation, and landscape presentation on phone, tablet, TV and 4K TV. Nonzero 3D canvas sizes, accessible exit controls and document width were inspected. See responsive-matrix.json for evidence.

Fixed long scientific value wrapping, constrained experiment selects and grid children, increased mobile control/text sizes, and kept practical textareas at 16px. Long trial values remain inside their cards. Intentional tab/table scrolling remains available.

Scope: viewport emulation of shared layouts, not physical-device certification or all 408 concept/device combinations. Dense diagram labels require zoom or landscape viewing on small phones. Browser native fullscreen may be denied; theatre presentation is the fallback. Touch gestures, hardware performance and TV remote input require physical device testing.

Validation: 794 automated tests passed; TypeScript and production build passed. Individual advanced scene visual inspection has reached 100 of 408 initial frames; this is separate from responsive layout coverage.
