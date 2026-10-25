import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const read = p => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const originalBytes = readFileSync(new URL('data/master_topics.original.json', root));
const original = JSON.parse(originalBytes);
const extended = read('data/master_topics.extended.json');
const report = read('reports/import-report.json');
const allowedVisuals = new Set(['2D', '3D', 'Watch', 'Simulate']);
assert.equal(extended.schema_version, '2.0.0');
assert.deepEqual(original.grades, Array.from({ length: 12 }, (_, i) => i + 1));
assert.deepEqual(extended.grades, original.grades);
assert.deepEqual(extended.boards, original.boards, 'legacy board names must remain compatible');
assert.equal(new Set(extended.records.map(r => r.id)).size, extended.records.length);
assert.equal(new Set(extended.records.map(r => r.concept_id)).size, extended.records.length);
const byId = new Map(extended.records.map(r => [r.id, r]));
const conceptIds = new Set(extended.records.map(r => r.concept_id));
const sourceIds = new Set(extended.source_registry.map(s => s.id));
const boardIds = new Set(extended.board_registry.map(b => b.id));
for (const r of original.records) {
  assert.match(r.id, /^SA-\d{4}$/);
  for (const key of ['subject', 'chapter', 'topic', 'curriculum_status']) assert.equal(typeof r[key], 'string');
  assert.ok(Array.isArray(r.subtopics) && r.subtopics.every(s => typeof s === 'string'));
  assert.ok(Array.isArray(r.visuals) && r.visuals.every(s => allowedVisuals.has(s)));
  const imported = byId.get(r.id);
  assert.ok(imported, `removed original ${r.id}`);
  for (const [key, value] of Object.entries(r)) assert.deepEqual(imported[key], value, `changed legacy field ${r.id}.${key}`);
}
for (const r of extended.records) {
  assert.ok(r.title.trim());
  assert.ok(r.recommended_grades.every(g => Number.isInteger(g) && g >= 1 && g <= 12));
  assert.equal(r.grade_recommendation_status, 'editorial_browse_range_not_official_mapping');
  assert.equal(r.content_status, 'inventory_only');
  assert.equal(r.review_status, 'pending_scientific_review');
  r.source_references.forEach(s => assert.ok(sourceIds.has(s), `unknown source ${s}`));
  for (const mapping of r.curriculum_mappings) {
    assert.ok(sourceIds.has(mapping.source_id));
    assert.ok(boardIds.has(mapping.board_id));
    assert.ok(conceptIds.has(mapping.scientific_concept_id));
    assert.equal(mapping.class, 10);
    assert.equal(mapping.academic_year, '2026-27');
    assert.equal(mapping.status, 'concept_presence_verified');
    assert.equal(mapping.chapter, null, 'do not invent textbook chapter names');
    assert.equal(mapping.assessment_scope, 'pending_clarification');
  }
}
for (const edge of extended.concept_graph.edges) {
  assert.ok(conceptIds.has(edge.from));
  assert.ok(conceptIds.has(edge.to));
}
assert.equal(report.source_sha256, createHash('sha256').update(originalBytes).digest('hex'));
assert.equal(report.original_record_count, original.records.length);
assert.equal(report.extended_record_count, extended.records.length);
assert.equal(report.additions_count, extended.records.length - original.records.length);
assert.equal(report.partial_verified_concept_mappings, extended.records.flatMap(r => r.curriculum_mappings).length);
assert.equal(report.removed_count, 0);
assert.equal(report.fully_verified_textbook_mappings, 0);
console.log(`Inventory validation passed: ${original.records.length} original records preserved, ${extended.records.length} concepts, ${report.partial_verified_concept_mappings} partial source-backed mappings.`);
