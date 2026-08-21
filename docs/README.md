# 文档地图

本仓库分两层。**先搞清楚你要找的东西在哪一层。**

```
docs/_studio/    制度层（只读镜像）    宪法、框架、岗位、闸门、SOP    跨项目
docs/ 其余       项目层                 游戏规格、技术架构、路线图      本作专属
```

制度层的真相在 [sunset-studio](https://github.com/catchyan/sunset-studio) 仓库，
本仓库通过 `.studio-version` 钉住一个版本，`docs/_studio/` 是它的逐字节镜像。
**镜像只读**，CI 会逐字节校验。

---

## 制度层 · `docs/_studio/`

| 文件 | 内容 | 谁该读 |
|---|---|---|
| `docs/_studio/docs/00-charter/studio-charter.md` | 工作室章程：两个产品、三条铁律 | 所有 Bot |
| `docs/_studio/docs/00-charter/constitution.md` | 20 条不可谈判的原则 | **所有 Bot，每次开工前** |
| `docs/_studio/docs/00-charter/glossary.md` | 流程术语表 | 所有 Bot |
| `docs/_studio/docs/01-framework/framework.md` | **RELAY 框架**：为什么这么设计，对抗哪些 Agent 失败模式 | 想理解制度的 |
| `docs/_studio/docs/01-framework/cadence.md` | 日/周/里程碑三层节奏与四向反馈 | P0 |
| `docs/_studio/docs/02-roles/roles.md` | 14 个岗位的职责、权力、禁区 | 所有 Bot |
| `docs/_studio/docs/03-gates/gates.md` | 11 道闸门 G1–G9 / H1–H2，含品味评分表 | Q1、所有 Bot |
| `docs/_studio/docs/03-gates/ownership-schema.md` | 车道表的格式与规则 | A1 |
| `docs/_studio/docs/04-grokbot/setup.md` | 从零开始的操作步骤 | 人类 |
| `docs/_studio/docs/04-grokbot/bot-profiles.md` | 每个 Bot 的 description 原文 | 人类 |
| `docs/_studio/docs/04-grokbot/routines.md` | 自动化 routine 原文 | 人类、P0 |
| `docs/_studio/docs/04-grokbot/skills/` | 17 份 SOP，注册为 Grok Bot Skill | 所有 Bot |
| `docs/_studio/docs/05-studio/` | 工作室成熟度、效能指标、能力账本 | P0、Q1、人类 |

## 项目层

### `00-charter/` · 立项

| 文件 | 内容 |
|---|---|
| `vision.md` | 这游戏到底是什么、给谁玩、什么算成功、**明确不做什么** |
| `glossary.md` | 本作的游戏术语 |

### `01-game/` · 玩法规格

| 文件 | 内容 | Owner |
|---|---|---|
| `gdd-core.md` | 核心循环、角色、战斗系统、地下城、传承 | D1 |
| `feel-spec.md` | **帧数据表**。手感的唯一真相 | D1 |
| `gdd-economy.md` | 经济系统、双闸门锚、三货币、稳定性判据 | C1 |
| `gdd-encounters.md` | 敌人与遭遇设计 | D1 |
| `gdd-world.md` | 世界观与叙事 | N1 |
| `art-bible.md` | 3D 像素风格规范、调色板、机检规则 | V1 |
| `audio-bible.md` | 音频规范 | U1 |
| `telemetry-spec.md` | 埋点规格 | T1 |
| `econ-dashboard.md` | 经济看板 | C1 |

### `02-tech/` · 技术

| 文件 | 内容 |
|---|---|
| `architecture.md` | 技术选型、monorepo 结构、依赖规则、性能预算 |
| `contracts/` | **跨模块契约**。冻结后改动需 ADR |
| `adr/` | 架构决策记录，含回滚条件 |
| `infra.md` `backup.md` `dependency-graph.md` | 运维 |

### `03-process/` · 本项目的流程实例

| 文件 | 内容 |
|---|---|
| `ownership.md` | **车道所有权表**。G5 闸门的唯一依据 |
| `staffing.md` | 本项目配了哪些岗、题材边界、框架占位的填充 |

### `04-plan/` · 计划

| 文件 | 内容 |
|---|---|
| `roadmap.md` | M0–M6 里程碑与放行条件 |

---

## 阅读路径

**人类总制作人**
`README.md` → `docs/_studio/docs/04-grokbot/setup.md` → 之后每天只读 `board/daily-brief.md`

**新上线的 Bot**
`AGENTS.md` → `docs/_studio/docs/00-charter/constitution.md` →
`docs/_studio/docs/02-roles/roles.md` 中自己那一节 →
`docs/03-process/ownership.md` 中自己的车道 → `docs/03-process/staffing.md`

**想了解游戏设计**
`00-charter/vision.md` → `01-game/gdd-core.md` → `01-game/feel-spec.md` → `01-game/gdd-economy.md`

**想了解多 Agent 协作框架**
`docs/_studio/README.md` → `docs/_studio/docs/01-framework/framework.md`
