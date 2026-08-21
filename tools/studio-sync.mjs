#!/usr/bin/env node
/**
 * 校验 docs/_studio/ 只读镜像没有被就地修改，且确实等于 .studio-version 钉住的那个 tag。
 *
 *   node tools/studio-sync.mjs            本地校验（快，离线）
 *   node tools/studio-sync.mjs --remote   额外回源核对（CI 用）
 *
 * 两层校验缺一不可：
 *   本地层  抓"有人改了镜像文件"
 *   回源层  抓"有人改了镜像文件之后又重新生成了清单"
 * 只做本地层，等于让作弊者自带公章。
 */

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { tmpdir } from 'node:os';

const STUDIO_REPO = process.env.STUDIO_REPO ?? 'https://github.com/catchyan/sunset-studio.git';
const MIRROR = join('docs', '_studio');
const MANIFEST = join(MIRROR, 'MANIFEST.json');

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function main() {
  const problems = [];

  if (!existsSync('.studio-version')) {
    console.error('❌ 缺少 .studio-version。项目必须钉住一个框架版本。');
    return 1;
  }
  if (!existsSync(MANIFEST)) {
    console.error(`❌ 缺少 ${MANIFEST}。用 mount.mjs 重新挂载。`);
    return 1;
  }

  const pinned = readFileSync('.studio-version', 'utf8').trim();
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));

  console.log(`钉住版本: ${pinned}`);
  console.log(`清单版本: ${manifest.version} (${manifest.commit.slice(0, 7)})`);

  if (manifest.version !== pinned) {
    problems.push(`.studio-version 是 ${pinned}，但镜像清单是 ${manifest.version}。重新挂载。`);
  }

  // —— 第一层：本地镜像 vs 清单 ——
  const actual = new Set(
    walk(MIRROR)
      .map((p) => relative(MIRROR, p).split(sep).join('/'))
      .filter((p) => p !== 'MANIFEST.json')
  );
  const expected = new Set(Object.keys(manifest.files));

  for (const f of expected) {
    if (!actual.has(f)) {
      problems.push(`镜像缺文件: ${f}`);
      continue;
    }
    if (sha256(readFileSync(join(MIRROR, f))) !== manifest.files[f]) {
      problems.push(`镜像被修改: ${f}`);
    }
  }
  for (const f of actual) {
    if (!expected.has(f) && f !== 'README.md') problems.push(`镜像多出文件: ${f}`);
  }

  console.log(`本地校验: ${expected.size} 个文件`);

  // —— 第二层：清单 vs 上游 tag ——
  if (process.argv.includes('--remote')) {
    const tmp = mkdtempSync(join(tmpdir(), 'studio-verify-'));
    try {
      // 与 mount.mjs 一致强制 LF，否则在 Windows 上核对会因行尾转换全量误报
      execSync(
        `git -c core.autocrlf=false -c core.eol=lf clone --depth 1 --branch ${pinned} ${STUDIO_REPO} "${tmp}"`,
        { stdio: 'pipe' }
      );
      const upstream = execSync('git rev-parse HEAD', { cwd: tmp, encoding: 'utf8' }).trim();

      if (upstream !== manifest.commit) {
        problems.push(
          `tag ${pinned} 现在指向 ${upstream.slice(0, 7)}，清单记录的是 ${manifest.commit.slice(0, 7)}。\n` +
            '    tag 被移动过——这在工作室仓库里是禁止的行为，去查为什么。'
        );
      }

      let checked = 0;
      for (const [f, hash] of Object.entries(manifest.files)) {
        if (f === 'README.md') continue;
        const src = join(tmp, f);
        if (!existsSync(src)) {
          problems.push(`上游 ${pinned} 中不存在 ${f}，但清单里有。清单是伪造的。`);
          continue;
        }
        if (sha256(readFileSync(src)) !== hash) {
          problems.push(`${f} 与上游 ${pinned} 不一致。清单是伪造的。`);
        }
        checked += 1;
      }
      console.log(`回源校验: ${checked} 个文件 vs ${pinned}`);
    } catch (err) {
      problems.push(`无法回源核对 ${pinned}: ${err.message}`);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }

  if (problems.length) {
    console.error(`\n❌ ${problems.length} 个问题：\n`);
    problems.forEach((p, i) => console.error(`  ${i + 1}. ${p}`));
    console.error('\n`docs/_studio/` 是只读的。制度要改，回 sunset-studio 提 PR、发版本，');
    console.error('然后在本仓库升级 .studio-version。就地改是行不通的，也不会被接受。\n');
    return 1;
  }

  console.log('✅ 镜像与钉住的框架版本一致。');
  return 0;
}

process.exit(main());
