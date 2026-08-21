#!/usr/bin/env node
/**
 * 本项目所有权表的归属断言。
 *
 * glob 引擎本身的测试在工作室层（docs/_studio/tools/gates/lane-check.test.mjs）。
 * 这里只测**这张表划得对不对**——它是本项目独有的，工作室管不着。
 *
 * 车道表写错会导致两种故障，且都不容易诊断：
 *   划分太粗 → 两个 Bot 抢同一批文件，天天冲突
 *   有遗漏   → 出现"无归属"路径，任何人改都被拒，任务永远做不完
 *
 * 用法：node tools/gates/ownership.test.mjs
 */

import { readFileSync } from 'node:fs';
import { ownerOf as resolve, parseOwnership } from '../../docs/_studio/tools/gates/lane-check.mjs';

const rows = parseOwnership(readFileSync('docs/03-process/ownership.md', 'utf8'));
const ownerOf = (file) => resolve(file, rows)?.owner ?? '(无归属)';

const CASES = [
  // 人类保留
  ['docs/00-charter/vision.md', '人类'],
  // ★ 制度镜像必须锁死。这是双仓设计的支点，坏了整套就散了
  ['docs/_studio/docs/00-charter/constitution.md', '人类'],
  ['docs/_studio/tools/gates/lane-check.mjs', '人类'],

  ['docs/00-charter/glossary.md', 'S1'],
  ['docs/03-process/ownership.md', 'A1'],
  ['docs/03-process/staffing.md', 'P0'],
  ['.studio-version', 'A1'],

  ['packages/sim/src/combat.ts', 'E1'],
  ['packages/client/src/main.ts', 'E2'],
  // 更具体的 glob 必须战胜更宽泛的
  ['packages/client/src/render/pixel-pass.ts', 'V1'],
  ['packages/client/src/audio/mixer.ts', 'U1'],
  ['packages/protocol/src/combat-events.ts', 'A1'],
  ['packages/content/combat/frames/lu.json', 'D1'],
  ['packages/content/economy/prices.json', 'C1'],

  ['docs/02-tech/architecture.md', 'A1'],
  ['docs/02-tech/adr/INDEX.md', 'S1'],
  ['docs/02-tech/infra.md', 'O1'],
  ['docs/02-tech/contracts/combat-events.md', 'A1'],

  ['tools/gates/ownership.test.mjs', 'Q1'],
  ['tools/studio-sync.mjs', 'Q1'],
  ['tools/art-lint/juice-lint.ts', 'V1'],
  ['deploy/server/compose.yml', 'E3'],
  ['deploy/staging.yml', 'O1'],
  ['assets/audio/hit.wav', 'U1'],

  ['board/heartbeat/A1.md', '各自'],
  ['board/andon.md', '任何人'],
  ['board/locks.md', '任何人'],
  ['board/trust-ledger.md', 'Q1'],

  ['package.json', 'A1'],
  ['pnpm-workspace.yaml', 'A1'],
  ['AGENTS.md', 'P0'],
  ['.github/workflows/gates.yml', 'Q1'],
];

let failed = 0;
console.log(`所有权表解析出 ${rows.length} 行\n`);
for (const [file, expected] of CASES) {
  const actual = ownerOf(file);
  const ok = actual === expected;
  if (!ok) failed += 1;
  console.log(`${ok ? '✅' : '❌'} ${file.padEnd(48)} -> ${actual}${ok ? '' : `  (期望 ${expected})`}`);
}

if (failed) {
  console.error(`\n❌ ${failed} 个用例失败。在修好之前，G5 车道闸门对本项目是不可信的。`);
  process.exit(1);
}
console.log('\n✅ 本项目车道归属解析全部正确。');
