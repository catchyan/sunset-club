#!/usr/bin/env node
/**
 * Asserts this project's ownership table says what we think it says.
 *
 * The matching engine is tested in the studio's own suite; this file tests the
 * table's content. The two are separate because a correct engine reading a wrong
 * table produces a confidently wrong verdict, and that is the failure that is hard
 * to notice.
 *
 * Usage: node tools/gates/ownership.test.mjs
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { ownerOf, parseOwnership } from '../../docs/_studio/tools/gates/lib.mjs';

const rows = parseOwnership(readFileSync('docs/03-process/ownership.md', 'utf8'));
let failed = 0;

function check(desc, actual, expected) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    failed += 1;
    console.error(`  FAIL ${desc}\n       expected ${JSON.stringify(expected)}\n       actual   ${JSON.stringify(actual)}`);
  }
}

const owner = (f, task) => ownerOf(f, rows, task)?.owner ?? '(none)';

console.log('reserved paths');
check('the vision belongs to the human', owner('docs/00-charter/vision.md'), 'HUMAN');
check('the mirror belongs to the framework', owner('docs/_studio/docs/00-charter/constitution.md'), 'FRAMEWORK');
check('the andon file is append-shared', owner('board/andon.md'), 'ANYONE');

console.log('task-scoped paths');
// The literal-token version of these two rows matched nothing, so every evidence
// pack the team would ever produce was rejected. It failed on the first task.
check('evidence resolves for the branch task', owner('evidence/T-042/output.txt', 'T-042'), 'TASK-AUTHOR');
check('evidence for another task does not', owner('evidence/T-999/output.txt', 'T-042'), '(none)');
check('a blocker report resolves', owner('board/blockers/T-042.md', 'T-042'), 'TASK-AUTHOR');

console.log('specificity');
check('the client belongs to E2', owner('packages/client/src/app.ts'), 'E2');
check('rendering inside the client belongs to V1', owner('packages/client/src/render/pass.ts'), 'V1');
check('audio inside the client belongs to U1', owner('packages/client/src/audio/mix.ts'), 'U1');
check('combat content beats the content fallback', owner('packages/content/combat/frames/lu.json'), 'D1');
check('economy content beats the content fallback', owner('packages/content/economy/prices.json'), 'C1');
check('unclaimed content falls back to A1', owner('packages/content/items/sword.json'), 'A1');
check('audio assets beat the asset fallback', owner('assets/audio/parry.ogg'), 'U1');
check('other assets belong to V1', owner('assets/palettes/dusk.png'), 'V1');

console.log('discipline paths');
check('gate code belongs to Q1', owner('tools/gates/ownership.test.mjs'), 'Q1');
check('the art linter belongs to V1', owner('tools/art-lint/index.mjs'), 'V1');
check('other tooling falls back to O1', owner('tools/scaffold.mjs'), 'O1');
check('workflows belong to Q1', owner('.github/workflows/gates.yml'), 'Q1');
check('the pin belongs to A1', owner('.studio-version'), 'A1');

console.log('coverage');
// A path no glob covers is a violation, so an uncovered path that really exists
// blocks honest work rather than catching anything.
const mustBeCovered = [
  'AGENTS.md',
  'README.md',
  '.gitignore',
  '.gitattributes',
  'docs/README.md',
  'docs/00-charter/glossary.md',
  'docs/03-process/staffing.md',
  'docs/04-plan/roadmap.md',
  'board/backlog.md',
  'board/tasks/T-001.md',
  'board/drift.md',
  'board/trust-ledger.md',
  'packages/sim/index.ts',
  'packages/server/room.ts',
  'packages/protocol/schema.ts',
  'packages/shared/rng.ts',
  'packages/econ-sim/run.ts',
  'docs/02-tech/adr/0003-x.md',
  'docs/01-game/feel-spec.md',
];
check(
  'every path we expect to exist has an owner',
  mustBeCovered.filter((f) => !ownerOf(f, rows, 'T-001')),
  []
);

// The list above is a wish; this is the repository. Twice during the rewrite a file
// was added whose directory no glob covered, and the lane gate only said so at the
// end of a long CI run. Checking the real tree moves that to the second it happens.
const TASK_IN_PATH = /^(?:evidence|board\/blockers)\/(T-\d{3,})\b/;
const tracked = execSync('git ls-files', { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);
check(
  'every tracked file has an owner',
  tracked.filter((f) => !ownerOf(f, rows, f.match(TASK_IN_PATH)?.[1])),
  []
);

console.log('single writer');
const bad = rows.filter((r) => /,|\/|\bor\b|&/.test(r.owner));
check('no row names two owners', bad.map((r) => `${r.glob} -> ${r.owner}`), []);

if (failed) {
  console.error(`\nFAIL: ${failed} assertion(s).`);
  process.exit(1);
}
console.log('\nOK: the ownership table says what it should.');
