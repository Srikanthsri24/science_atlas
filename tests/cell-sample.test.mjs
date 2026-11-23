import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './load-ts.mjs';
const { cellJourney, cellBoundary } = await loadTs('src/components/science/cell/cellJourney.ts');
const { demonstrationFrame } = await loadTs('src/components/science/animation.ts');

test('the cell demonstration visits all six narrated processes during its full sequence', () => {
  for (let stage = 0; stage < 6; stage++) {
    const frame = demonstrationFrame('cell', stage * 5 + 2.5);
    assert.equal(frame.index, stage);
    assert.ok(Math.abs(frame.phase - 0.5) < 1e-8);
  }
});

test('cell pathways preserve endpoints and finish secretion before the energy chapter', () => {
  for (let stage = 0; stage < 6; stage++) {
    const start = cellJourney(stage, 0);
    const end = cellJourney(stage, 1);
    assert.deepEqual(start.position, start.route[0]);
    assert.deepEqual(end.position, end.route.at(-1));
    for (let phase = 0; phase <= 1; phase += 0.025) {
      assert.ok(cellJourney(stage, phase).position.every(Number.isFinite));
    }
  }
  assert.equal(cellJourney(4, 0.5).released, false);
  assert.equal(cellJourney(4, 0.9).released, true);
  assert.equal(cellJourney(2, 1).chainLength, 15);
});

test('cell cut-edge contour closes without crossing its centre', () => {
  assert.ok(Math.hypot(...cellBoundary(0).map((v, i) => v - cellBoundary(2 * Math.PI)[i])) < 1e-10);
  for (let angle = 0; angle < 2 * Math.PI; angle += 0.1) {
    assert.ok(Math.hypot(...cellBoundary(angle)) > 1.5);
  }
});
