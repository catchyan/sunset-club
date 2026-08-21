# 文档地图

> 效力顺序（宪法第一条）：
> **宪法 > 愿景 > 契约 > 规格(GDD) > 计划 > 任务指令 > 个人判断**
>
> 下级与上级冲突时，**上级胜出**，且发现者有义务报告冲突（拉安灯或记漂移），不许自行"调和"。

---

## 00-charter · 宪章层（效力最高，Bot 无权修改）

| 文件 | 内容 | 谁必须读 |
|---|---|---|
| [`constitution.md`](00-charter/constitution.md) | 20 条不可谈判的原则 | **所有 Bot，每次开工前** |
| [`vision.md`](00-charter/vision.md) | 我们在做什么、给谁、什么算成功、**什么明确不做** | 所有 Bot |
| [`glossary.md`](00-charter/glossary.md) | 术语表 + 禁用词 | 所有 Bot |

## 01-game · 游戏设计

| 文件 | 内容 | 所有者 |
|---|---|---|
| [`gdd-core.md`](01-game/gdd-core.md) | 核心循环、角色、战斗、地下城、传承 | D1 |
| [`feel-spec.md`](01-game/feel-spec.md) | **帧数据契约**，被 CI 自动断言 | D1 |
| [`gdd-economy.md`](01-game/gdd-economy.md) | 经济系统 + 模拟器 8 条稳定性判据 | C1 |
| [`art-bible.md`](01-game/art-bible.md) | 3D 像素规格 + `art-lint` 机检规则 | V1 |

## 02-tech · 技术

| 文件 | 内容 | 所有者 |
|---|---|---|
| [`architecture.md`](02-tech/architecture.md) | 选型、仓库结构、三条架构原则、性能预算 | A1 |
| [`contracts/`](02-tech/contracts/README.md) | **接口契约区**（冻结后才可实现） | A1 |
| [`adr/INDEX.md`](02-tech/adr/INDEX.md) | 架构决策记录（含回滚条件） | A1 |

## 03-process · 协作框架

| 文件 | 内容 |
|---|---|
| [`framework.md`](03-process/framework.md) | **RELAY 框架**：为什么这么设计，对抗哪些 Agent 失败模式 |
| [`roles.md`](03-process/roles.md) | 14 个岗位的职责、权力、禁区、车道 |
| [`gates.md`](03-process/gates.md) | 11 道闸门 G1–G9 / H1–H2，含品味评分表 |
| [`ownership.md`](03-process/ownership.md) | 车道所有权表（生成 CODEOWNERS） |
| [`cadence.md`](03-process/cadence.md) | 日/周/里程碑三层节奏与四向反馈 |

## 04-plan · 计划

| 文件 | 内容 |
|---|---|
| [`roadmap.md`](04-plan/roadmap.md) | M0–M6，**闸门制而非日期制**，每个里程碑有放行条件 |

## 05-grokbot · 落地手册（人类操作这一层）

| 文件 | 内容 |
|---|---|
| [`setup.md`](05-grokbot/setup.md) | **从零开始的操作步骤**，人类看这个 |
| [`bot-profiles.md`](05-grokbot/bot-profiles.md) | 每个 Bot 的 description 原文，可直接复制粘贴 |
| [`routines.md`](05-grokbot/routines.md) | 11 个自动化 routine 的原文 |
| [`skills/`](05-grokbot/skills/) | 11 份 SOP，注册为 Grok Bot Skill |

---

## 三条阅读路线

**人类总制作人（你）**
`README.md` → `05-grokbot/setup.md` → 之后每天只读 `board/daily-brief.md`

**新加入的 Bot**
`AGENTS.md` → `00-charter/constitution.md` → 自己在 `03-process/roles.md` 中的那一节 → 自己的车道在 `03-process/ownership.md` 中的那几行

**想理解这套框架的人**
`03-process/framework.md`（这是本项目真正原创的部分）
