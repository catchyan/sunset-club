# AGENTS.md · 进入本仓库的第一件事

> **任何 Agent 在对本仓库做任何操作之前，必须先读完这一页。**
> 这一页是索引和红线。完整制度在只读镜像 `docs/_studio/`。

---

## 这是什么项目

《夕阳红俱乐部》——一款 3D 像素风、四人联机的动作角色扮演游戏。
主题是**英雄迟暮**：退役的刀剑教头、前头牌舞娘、被逐师门的老符匠、断腿的前近卫队长。
身体在衰退，技艺还在。玩家无法靠肝赢，只能靠精、靠配合、靠传承。

技术栈：TypeScript + Three.js + 权威服务器（Colyseus）+ Electron/Steam。

## 两层结构 · 先搞清楚你在哪一层

```
sunset-studio         制度层。宪法、框架、岗位、闸门、SOP。跨项目
      │ .studio-version 钉住 tag
      ▼
docs/_studio/         ← 只读镜像。你在这里读制度，但绝不能改
本仓库其余部分         ← 项目层。游戏规格、代码、看板。你在这里工作
```

**`docs/_studio/` 是只读的。**

想改制度 → 去 sunset-studio 仓库提 PR → 发新版本 → 在本仓库升级 `.studio-version`。
就地改会被两道检查同时拦下：G5 车道闸门（owner 是「人类」）+ `tools/studio-sync.mjs` 的逐字节校验。

> 为什么这么严：如果每个项目都能就地改制度，半年后各项目会有各自互不兼容的框架，
> 工作室就不存在了。这不是形式主义，这是这套双仓设计唯一的支点。

---

## 开工前的三句自检

**在你回复的第一段，必须回答这三句。答不出任何一句 → 不要开工，退回 @总督。**

1. 我读了哪些文件？（列出精确路径）
2. 我这次允许改哪些路径？（列出 glob，对照 `docs/03-process/ownership.md`）
3. 我的验收命令是什么？跑通它意味着什么？

---

## 十条红线（违反即为事故）

1. **不在别人的车道里改文件。** 车道见 `docs/03-process/ownership.md`。越界的 PR 会被 CI 不看内容直接拒绝。
2. **不改 `docs/_studio/`。** 那是制度镜像，见上。
3. **不在别人的 worktree 目录里操作。** 你只能在 `/workspace/lanes/<你的代号>-<名>/` 里工作。
4. **不直接 push `main`。** 一切通过 PR。（例外：`board/locks.md` 的加解锁行）
5. **不修改** `docs/00-charter/vision.md`、以及任何标记 `Status: FROZEN` 的契约文件。需要改 → 提 ADR。
6. **不自评通过。** 你无权宣布自己的工作完成。验收由 CI + 另一个 Bot 判定。
7. **不谎报。** 证据包里的输出必须是真实执行的。闸门官每天会在干净环境里重跑 20% 的已完成任务。
8. **不静默。** 每 2 小时更新心跳。卡住 30 分钟内上报。同一问题失败 3 次必须停手写阻塞报告，严禁第 4 次。
9. **不在聊天里下结论。** 没有落进 git 的决定视为不存在。
10. **不用形容词交付规格。** "手感要好"不是规格，帧数据表才是。

**发现下列情况必须拉安灯**：main CI 红 / 两份规格矛盾 / 冻结契约被违反 / 前面的工作建立在错误假设上。
**拉错不罚，不拉才罚。**

---

## 每次工作会话的标准序列

```bash
# 1. 同步
cd /workspace/lanes/<你的 lane>
git fetch origin && git rebase origin/main

# 2. 读任务信封第 2 段列出的全部输入文件

# 3. 回答三句自检

# 4. 建任务分支
git switch -c lane/<代号>/T-XXX

# 5. 先跑一次验收命令（此时应该是红的）
<任务信封第 6 段的命令>

# 6. 实现（小步提交，每条 commit message 带 [T-XXX]）

# 7. 自验（必须真的看到 EXIT_CODE=0）

# 8. 生成证据包 evidence/T-XXX/

# 9. 开 PR，状态改 REVIEW，@评审人

# 10. 更新心跳
```

---

## 文档地图

### 制度（只读镜像，跨项目通用）

| 我想知道 | 读这个 |
|---|---|
| 工作室为什么存在 | `docs/_studio/docs/00-charter/studio-charter.md` |
| 不可协商的规矩 | `docs/_studio/docs/00-charter/constitution.md` |
| 流程术语是什么意思 | `docs/_studio/docs/00-charter/glossary.md` |
| 协作制度为什么这么设计 | `docs/_studio/docs/01-framework/framework.md` |
| 我的岗位职责 | `docs/_studio/docs/02-roles/roles.md` |
| 什么算通过 | `docs/_studio/docs/03-gates/gates.md` |
| 怎么写任务/心跳/阻塞报告 | `docs/_studio/docs/04-grokbot/skills/` 或输入 `/sop-` |

### 本项目

| 我想知道 | 读这个 |
|---|---|
| 这游戏到底是什么 | `docs/00-charter/vision.md` |
| 游戏术语 | `docs/00-charter/glossary.md` |
| 我能改哪些文件 | `docs/03-process/ownership.md` |
| 本项目配了哪些岗、题材边界是什么 | `docs/03-process/staffing.md` |
| 现在该做什么 | `board/sprint.md` + `board/tasks/T-XXX.md` |
| 里程碑和放行条件 | `docs/04-plan/roadmap.md` |
| 玩法怎么设计的 | `docs/01-game/gdd-core.md` |
| 手感的具体帧数 | `docs/01-game/feel-spec.md` |
| 经济系统 | `docs/01-game/gdd-economy.md` |
| 技术架构 | `docs/02-tech/architecture.md` |
| 为什么当初这么决定 | `docs/02-tech/adr/INDEX.md` |

---

## 共享单机警告 ⚠️

**本项目所有 Bot 共用同一台 Grok Bot 云电脑和同一个文件系统。**

- 你能看到别人的文件。**能看不等于能改。**
- 并发操作同一个目录会互相破坏。所以有 worktree 车道制。
- 端口、数据库、`pnpm store` 这些是全局唯一的。用之前先看 `board/locks.md`，加锁。
- 云电脑可能被 reset。**未提交的改动不是持久状态。** 小步提交，勤 push。

详见 `/sop-lane-lock`。

---

## 提交信息格式

```
<type>(<scope>): <描述> [T-XXX]
```

`type`：`feat` / `fix` / `docs` / `refactor` / `test` / `chore` / `perf` / `content` / `art`
`scope`：包名或模块名，如 `sim`、`client`、`econ`、`board`

**没有 `[T-XXX]` 的提交会被 CI 拒绝。** 任务 ID 必须存在于 `board/sprint.md`。

---

## 代码规约

- TypeScript strict，`any` 需要注释说明为什么
- `packages/sim` **不得** import DOM / Three.js / 网络 / fs（CI 检查）
- 禁止 `Math.random()`（用 `@sunset/shared` 的 seeded RNG）与 `Date.now()`（用 tick 计数）
- 数值不写死在代码里，走 `packages/content` 数据文件
- 代码里不出现中文字符串，走 i18n key（CI 检查）
- 注释只写**为什么**（约束、权衡），不写**做了什么**。不写"这次改动是……"这类给评审者看的话
- 单个 PR diff ≤400 行

---

## 遇到问题找谁

```
技术/架构/接口 → @架构 A1
玩法/手感/数值 → @设计 D1
质量/闸门/验收 → @闸门 Q1
环境/工具/CI → @运维 O1
文档矛盾/术语 → @典藏 S1
经济数值 → @经济 C1
优先级/说不清 → @总督 P0 →（他也定不了）→ 人类
```

**每一级必须在 4 小时内给出裁决，或明确说"我也定不了，往上"。不允许沉默。**
