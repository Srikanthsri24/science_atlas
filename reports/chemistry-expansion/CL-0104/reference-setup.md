Independent reference dependency only; the frontend has no Python/server dependency.

Install with the bundled Python: `python -m pip install --target /tmp/atlas-chemistry-reference-libs -r reports/chemistry-expansion/CL-0104/reference-requirements.txt`. Run `scripts/chemistry/validate_surface_area.py` with that Python. App/tests need only existing Node dependencies. High-precision analytic integration/inversion is independent of the application RK4 algorithm.
