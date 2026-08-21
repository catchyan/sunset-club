# Sprint 看板

> Owner: P0 总督 · 这是任务状态的**唯一真相**。其他地方的说法与此冲突时，以此为准。

- **当前里程碑**：M0 · 地基
- **当前 Sprint**：W00（未开始）
- **里程碑放行条件进度**：0 / 12
- **安灯状态**：✅ 无
- **活跃 Bot**：0 / 5（待创建）

---

## 状态机

```
TODO ──接单──> CLAIMED ──开工──> IN_PROGRESS ──开PR──> REVIEW ──合并──> DONE
                  │                   │                  │
                  └──拒绝──> TODO      ├──卡住──> BLOCKED  └──打回──> IN_PROGRESS
                                      └──撤回──> TODO
```

只有 **CI + 评审人**能把状态改成 DONE。实现者不能（宪法第七条）。

---

## 本 Sprint 任务

| ID | 标题 | 负责 | 评审 | 状态 | 推进的放行条件 | 更新 |
|---|---|---|---|---|---|---|
| — | *（等待 M0 编制上线后由总督填充）* | — | — | — | — | — |

---

## M0 放行条件清单

### 主验收
- [ ] 一个平凡任务（渲染旋转立方体 + 单测）从派单到合入主干，**全程人类零介入**，完整走过 G1–G9，evidence 完备

### 负向验收（M0 的灵魂，一条都不能少）
- [ ] **越界**：故意提交改别人车道的 PR → CI 的 G5 拒绝
- [ ] **谎报**：故意伪造 evidence → 红队抽检在 24 小时内抓到并记入信任账本
- [ ] **停摆**：故意让一个 Bot 6 小时不心跳 → 停摆检测标红且出现在日报
- [ ] **文档矛盾**：故意制造两处矛盾规格 → 漂移检测在 24 小时内报出

### 基础设施
- [ ] 连续 3 天 `daily-brief.md` 在 21:00 自动生成，人类读完 ≤5 分钟
- [ ] `tools/bootstrap/setup.sh` 在空白 Linux 上一条命令重建环境成功
- [ ] 5 个 M0 Bot 全部完成入职（能正确复述自己的边界 + 心跳 PR 通过 CI）
- [ ] 6 条必需 routine 全部配置并 Test run 通过
- [ ] 分支保护生效（直推 main 被拒绝）
- [ ] Auto-review 规则配置完成
- [ ] staging 自动部署可用

---

## 已由人类架构师预置（不需要派任务）

这些是"Bot 上线之前就必须存在"的东西——它们要保护的正是 Bot 干活的第一天。
让 Bot 自己造约束自己的闸门，是先有鸡还是先有蛋的问题。

| 产物 | 说明 |
|---|---|
| `tools/gates/lane-check.mjs` | G5 车道闸门。直接解析所有权表，不另建配置 |
| `tools/gates/lane-check.test.mjs` | **闸门的测试**。27 条归属断言，含"具体 glob 战胜宽泛 glob"等易错用例 |
| `tools/gates/envelope-check.mjs` | G3 信封 + G4 小步 + 证据包完整性 + 不许自证 |
| `tools/gates/selfcheck.mjs` | 死链、失效 SOP 引用、禁用术语 |
| `.github/workflows/gates.yml` | CI 主流水线。纪律闸门第一天生效，代码闸门随 M1 接入 |
| `.github/CODEOWNERS` | 文档作用；真正的强制在 CI |
| `docs/`、`board/` 全套 | 宪章、框架、岗位、闸门、路线图、16 份 SOP、看板模板 |

## Backlog（M0 待派）

| ID | 标题 | 建议负责 | 依赖 | 推进的放行条件 |
|---|---|---|---|---|
| T-001 | monorepo 骨架（pnpm workspaces + TS strict + Vite + Vitest） | A1 | — | 主验收前置 |
| T-002 | `tools/bootstrap/setup.sh` 幂等环境搭建 | O1 | — | 基础设施 |
| T-003 | `tools/lanes/` worktree 车道管理脚本 | O1 | — | 基础设施 |
| T-004 | 分支保护 + Auto-review 规则落地并**实测被拒** | O1 | — | 基础设施 ×2 |
| T-005 | 6 条 routine 配置 + Test run | P0 | — | 基础设施 |
| T-006 | 依赖方向检查 `pnpm gates:deps` | A1 | T-001 | M1 前置 |
| T-007 | sim 纯净性检查（禁 DOM / `Date.now` / `Math.random`） | A1 | T-001 | M1 前置 |
| T-008 | 契约同步检查（契约文档字段表 ↔ Zod 定义） | A1 | T-001 | M1 前置 |
| T-009 | staging 自动部署（Cloudflare Pages） | O1 | T-001 | 基础设施 |
| T-010 | **主验收任务**：旋转立方体 + 单测，全程零介入走完 G1–G9 | A1 | T-001, T-009 | 主验收 |
| T-011 | 负向验收 ①越界 ②谎报 ③停摆 ④文档矛盾（逐条演习） | Q1 | T-010 | 负向验收 ×4 |
| T-012 | 冻结 `contracts/combat-events.md`（回答 §6 的 5 个问题） | A1 | — | M1 前置 |
| T-013 | 冻结 `contracts/content-schema.md`（回答 §6 的 5 个问题） | A1 | T-012 | M1 前置 |

> T-012 / T-013 虽然属于 M1 的前置，但**必须在 M0 期间完成**。
> 契约没冻结就扩编到 E1/E2，他们上来就只能等——或者更糟，凭自己的理解开始写。

---

## 并发度约束（总督派单时必查）

- IN_PROGRESS 的任务数 ≤ 活跃 Bot 数
- 同一个 package 内同时最多 1 个 IN_PROGRESS 任务
- 同时最多 3 个工段群
