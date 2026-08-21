#!/usr/bin/env node
/** 仓库自检：相对链接是否有效、SOP 引用是否存在、禁用词。本地跑，CI 也跑。 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';

const ROOT = process.cwd();
const problems = [];

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e === '.git' || e === 'node_modules') continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e.endsWith('.md')) out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const skills = new Set(
  existsSync('docs/05-grokbot/skills')
    ? readdirSync('docs/05-grokbot/skills').map((f) => f.replace(/\.md$/, ''))
    : []
);

for (const f of files) {
  const rel = relative(ROOT, f).replace(/\\/g, '/');
  const text = readFileSync(f, 'utf8');
  const isTemplate = /TEMPLATE\.md$/.test(rel);

  // 1. markdown 相对链接
  for (const m of text.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
    const target = m[1].split('#')[0];
    if (!target || /^(https?:|mailto:)/.test(target)) continue;
    if (!existsSync(resolve(dirname(f), target))) {
      problems.push(`${rel}: 死链 -> ${target}`);
    }
  }

  // 2. /sop-xxx 引用必须有对应的 skill 文件
  for (const m of text.matchAll(/`?\/(sop-[a-z-]+)`?/g)) {
    if (m[1] === 'sop-xxx') continue; // setup.md 里的占位示例
    if (!skills.has(m[1])) problems.push(`${rel}: 引用了不存在的 skill /${m[1]}`);
  }

  // 3. 反引号包裹的仓库内路径。
  //    只检查 docs/ 与 board/ ——它们现在就该存在。
  //    packages/ tools/ assets/ deploy/ evidence/ 是 M0 之后才产出的，
  //    在它们存在之前对着规格报错，只会训练所有人忽略这个检查。
  for (const m of text.matchAll(/`((?:docs|board)\/[A-Za-z0-9_./*<>-]+)`/g)) {
    const p = m[1];
    if (isTemplate) continue;
    if (/[*<>]/.test(p)) continue; // glob
    if (/XXX|YYY|<|\bNN\b/.test(p)) continue; // 占位符
    if (!existsSync(join(ROOT, p))) problems.push(`${rel}: 引用了不存在的路径 ${p}`);
  }

  // 4. 禁用术语
  // glossary 与漂移检测清单本身要列出这些词，是它们的工作内容
  if (!/glossary\.md|sop-drift-check\.md|board\/drift\.md|selfcheck/.test(rel)) {
    for (const bad of ['体力值', '架势条', '弹反', '连携技']) {
      if (text.includes(bad)) problems.push(`${rel}: 使用了禁用术语「${bad}」`);
    }
  }
}

console.log(`自检 ${files.length} 个 markdown 文件`);
if (problems.length === 0) {
  console.log('✅ 无问题');
  process.exit(0);
}
console.error(`\n❌ ${problems.length} 个问题：`);
for (const p of problems) console.error('  ' + p);
process.exit(1);
