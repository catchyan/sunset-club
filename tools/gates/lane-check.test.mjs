#!/usr/bin/env node
/**
 * 车道闸门自测。
 *
 * 依据 dependency-graph.md 的那条纪律：**闸门本身也需要被测试。**
 * 一条从未被触发过的规则，你无法确定它到底在不在工作。
 *
 * 用法：node tools/gates/lane-check.test.mjs
 */

import { readFileSync } from 'node:fs';
import { parseOwnership, ownerOf as resolve } from './lane-check.mjs';

// 复用被测实现本身，绝不复制一份。复制的那份一定会跟真的那份漂移，
// 到时候测试全绿而闸门是坏的——那比没有测试更危险。
const rows = parseOwnership(readFileSync('docs/03-process/ownership.md', 'utf8'));
const ownerOf = (file) => resolve(file, rows)?.owner ?? '(无归属)';

// 期望值直接来自 ownership.md。这张表是断言，不是文档。
const CASES = [
  ['docs/00-charter/constitution.md', '人类'],
  ['docs/00-charter/vision.md', '人类'],
  ['docs/00-charter/glossary.md', 'S1'],
  ['packages/sim/src/combat.ts', 'E1'],
  ['packages/client/src/main.ts', 'E2'],
  // 关键用例：更具体的 glob 必须战胜更宽泛的
  ['packages/client/src/render/pixel-pass.ts', 'V1'],
  ['packages/client/src/audio/mixer.ts', 'U1'],
  ['packages/protocol/src/combat-events.ts', 'A1'],
  ['packages/content/combat/frames/lu.json', 'D1'],
  ['packages/content/economy/prices.json', 'C1'],
  ['docs/02-tech/architecture.md', 'A1'],
  ['docs/02-tech/adr/INDEX.md', 'S1'], // 例外行必须生效
  ['docs/02-tech/infra.md', 'O1'], // 例外行必须生效
  ['docs/02-tech/contracts/combat-events.md', 'A1'],
  ['tools/gates/lane-check.mjs', 'Q1'],
  ['tools/art-lint/juice-lint.ts', 'V1'],
  ['deploy/server/compose.yml', 'E3'], // 例外行必须战胜 deploy/**
  ['deploy/staging.yml', 'O1'],
  ['assets/audio/hit.wav', 'U1'], // 例外行必须战胜 assets/**
  ['board/heartbeat/A1.md', '各自'],
  ['package.json', 'A1'],
  ['pnpm-workspace.yaml', 'A1'],
  ['AGENTS.md', 'P0'],
  ['board/andon.md', '任何人'],
  ['board/locks.md', '任何人'],
  ['board/trust-ledger.md', 'Q1'],
  ['.github/workflows/gates.yml', 'Q1'],
];

let failed = 0;
console.log(`所有权表解析出 ${rows.length} 行\n`);
for (const [file, expected] of CASES) {
  const actual = ownerOf(file);
  const ok = actual === expected;
  if (!ok) failed++;
  console.log(`${ok ? '✅' : '❌'} ${file.padEnd(45)} -> ${actual}${ok ? '' : `  (期望 ${expected})`}`);
}

if (failed) {
  console.error(`\n❌ ${failed} 个用例失败。所有权表或 glob 匹配逻辑有问题——在这之前，G5 车道闸门是不可信的。`);
  process.exit(1);
}
console.log('\n✅ 车道归属解析全部正确。');
