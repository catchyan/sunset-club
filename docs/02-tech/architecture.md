# 技术架构

> 状态：DRAFT v0.1 · 所有者：总架构师(A1) · 冻结需人类批准
> 变更需 ADR。契约文件在 `docs/02-tech/contracts/`。

---

## 1. 技术选型与理由

| 层 | 选型 | 理由 | 备选与放弃原因 |
|---|---|---|---|
| 语言 | **TypeScript**（strict） | 类型检查是弱 Agent 最有效的护栏；生态成熟 | JS 无类型 → 放弃；Rust/C++ 迭代慢且 Agent 出错率高 |
| 渲染 | **Three.js** | Web 3D 事实标准，文档与示例最多（对 Agent 极重要） | Babylon.js 也可，但 Three 的社区样本多一个量级 |
| 物理/碰撞 | **自研 2.5D 碰撞**（M1）→ 视需要引入 Rapier | ARPG 只需要胶囊体 + 扫掠查询，全套刚体物理是负担且破坏确定性 | Rapier 3D：确定性配置复杂，M1 不需要 |
| 联机 | **Colyseus**（MIT，可自托管） | 房间、匹配、状态同步开箱即用；WebSocket 稳定，穿透无问题 | geckos.io（WebRTC/UDP）更平滑但运维与调试成本高。**M3 先 Colyseus，M4 按测量结果决定是否上 UDP**，走 ADR |
| 状态管理 | **自研 ECS**（bitECS 风格，SoA） | 需要严格确定性与可序列化；现成 ECS 大多有隐式全局状态 | bitECS 可直接用，M1 评估 |
| UI | **React**（仅 HUD/菜单） | 菜单与经济界面复杂，React 生态成熟 | 铁律：**React 不进游戏主循环** |
| 构建 | **Vite + pnpm workspaces** | 快，配置少 | — |
| 校验 | **Zod**（运行时）+ 生成 JSON Schema | 一份定义同时产出 TS 类型、运行时校验、内容数据 schema | — |
| 测试 | **Vitest** + 自研帧数据快照 | 与 Vite 同源，快 | — |
| 数据库 | **PostgreSQL**（账号/经济/审计）+ Redis（会话/排行） | 经济系统需要事务与审计，必须关系型 | SQLite：单机可以，但经济服务必须 Postgres |
| 桌面封装 | **Electron + steamworks.js** | Steam 官方支持路径最成熟；Chromium 渲染性能优于系统 WebView | Tauri：WebKit 渲染在 Mac/Linux 上性能差，Steam 集成需写 Rust。NW.js：打包简单但生态在萎缩 |
| CI | **GitHub Actions**（+ 自建 runner） | 与仓库同源，事件可触发 Grok Bot routine | — |

---

## 2. 仓库结构（monorepo）

```
sunset-club/
├─ AGENTS.md                    # Bot 入口约束（每个 Bot 必读）
├─ docs/                        # 全部文档（见 docs/README.md）
├─ board/                       # 看板：状态、心跳、日报、锁、账本
├─ evidence/                    # 任务证据包
├─ packages/
│  ├─ sim/         # ★ 纯逻辑内核。零 DOM / 零网络 / 零 IO。客户端与服务端共用
│  ├─ protocol/    # ★ 网络消息与存档 schema（Zod）。契约冻结区
│  ├─ content/     # ★ 数据驱动的内容：怪物/装备/配方/帧数据/地下城/文案
│  ├─ client/      # Three.js 渲染、输入、UI、音频、预测与插值
│  ├─ server/      # Colyseus 权威服务器、持久化、匹配、审计
│  ├─ econ-sim/    # 经济蒙特卡洛模拟器
│  ├─ telemetry/   # 埋点与分析
│  └─ shared/      # 纯工具函数（数学、随机、序列化）
├─ assets/                      # 美术与音频源资产 + 调色板
├─ tools/
│  ├─ bootstrap/   # 环境搭建（幂等）
│  ├─ lanes/       # worktree 车道管理
│  ├─ gates/       # 闸门脚本（车道检查、diff 大小、task-id 校验）
│  ├─ art-lint/    # 美术风格 lint + 触感 lint
│  └─ asset-gen/   # 程序化/AI 资产生成管线
├─ deploy/                      # 部署脚本与环境定义
└─ .github/workflows/           # CI
```

### 2.1 依赖方向（不可违反）

```
content ──┐
shared ───┼──> sim ──┬──> client
protocol ─┘          └──> server
                            │
telemetry <─────────────────┘
econ-sim ──> content, shared   (独立，不依赖 sim)
```

**禁止的依赖**（CI 检查）：
- `sim` → `client` / `server` / `three` / 任何 DOM 或 Node IO
- `client` → `server`
- `content` → 任何代码包（content 是纯数据）

---

## 3. 三条核心架构原则

### 3.1 单一模拟内核（One Sim）
客户端和服务端跑**同一份 `packages/sim`**。不允许存在"服务端版战斗逻辑"。

- 客户端：跑 sim 做预测 + 渲染
- 服务端：跑 sim 做权威判定
- 两边不一致 → 服务端赢，客户端和解回滚

这条原则一旦破坏，网络同步问题会指数级增长，且弱 Agent 一定会在两份逻辑上写出分歧。

### 3.2 确定性（Determinism）
- 固定逻辑 tick：**30Hz**
- 所有随机走 seeded PRNG（`shared/rng.ts`，xorshift128+），禁止 `Math.random()`
- 禁止 `Date.now()` 进入 sim（时间由 tick 计数提供）
- 浮点：统一使用 `Math.fround` 规范化关键计算；碰撞与位移使用固定小数（1/1024 单位）
- **验证**：回放测试——给定 seed + 输入序列，2000 tick 后世界状态哈希必须与快照一致

### 3.3 事件驱动的表现层（Sim Emits, Client Renders）
sim 不知道"特效"存在。它只发结构化事件：

```ts
// packages/protocol/src/combat-events.ts (FROZEN v1)
type CombatEvent =
  | { t: 'hit_confirmed'; attacker: EntityId; target: EntityId; kind: HitKind; dmg: number; crit: boolean; pos: Vec3 }
  | { t: 'parry_success'; who: EntityId; against: EntityId; tick: number }
  | { t: 'poise_broken'; target: EntityId; by: EntityId }
  | { t: 'duet_triggered'; duetId: DuetId; members: EntityId[]; level: 1|2|3 }
  | { t: 'wound_flared'; who: EntityId; woundId: WoundId }
  | { t: 'memory_recalled'; who: EntityId; memoryId: MemoryId }
  // ...
```

客户端订阅事件 → 查表 → 播放 VFX / SFX / 屏震 / 停顿。
这样做的收益：**表现可以随便改，逻辑不受影响；逻辑的测试不需要渲染。**

---

## 4. 网络模型（M3 起）

```
客户端                                  服务端 (Colyseus Room)
  │                                        │
  ├─ 采集输入 ──> 立即本地预测执行            │
  ├─ 发送 InputCommand{tick, seq, buttons} ─┤
  │                                        ├─ 缓冲输入，按 tick 顺序执行 sim
  │                                        ├─ 每 tick 生成状态快照
  │  <── StateSnapshot{tick, ackSeq, delta} ┤ (20Hz 下行，delta 压缩)
  ├─ 和解：回滚到 ackSeq，重放未确认输入        │
  └─ 远端实体：100ms 缓冲 + 快照插值           │
```

| 参数 | 值 |
|---|---|
| 逻辑 tick | 30Hz |
| 下行快照 | 20Hz（delta 压缩） |
| 插值缓冲 | 100ms |
| 外推上限 | 200ms（超出则冻结并显示连接警告） |
| 房间容量 | 4 玩家 |
| 权威范围 | 伤害、掉落、货币、交易、经验、所有持久化变更 |

**反作弊边界**：客户端只发**按键与朝向**，不发位置、不发伤害。服务端对输入做合法性检查（频率、朝向变化率）。

---

## 5. 渲染管线（3D 像素）

详细规格见 `docs/01-game/art-bible.md`，此处只给管线结构。

```
Scene (Three.js)
  ↓ 渲染到低分辨率 WebGLRenderTarget  384×216, NearestFilter, 无 mipmap, 无 MSAA
  ↓ [Pass 1] 顶点吸附（材质 onBeforeCompile 注入，吸附网格 = 渲染目标分辨率）
  ↓ [Pass 2] 深度雾（线性空间）
  ↓ [Pass 3] 调色板量化 + Bayer 4×4 有序抖动
  ↓ [Pass 4] 可选 CRT / 扫描线（默认关闭，设置里可开）
  ↓ 全屏三角形上采样到画布，整数倍缩放优先（1080p = 5× 于 384×216 → 1920×1080 正好）
```

**关键约束**：
- 渲染分辨率 **384×216**（= 1920×1080 ÷ 5，整数倍，零插值模糊）
- 相机位置吸附像素网格（否则会抖，这是 3D 像素最常见的翻车点）
- 调色板固定 40 色（见 `assets/palettes/sunset-40.png`）
- **UI 不进后处理**：HUD 单独在全分辨率层渲染（低分辨率 UI 文字不可读）

---

## 6. 性能预算

| 项目 | 预算 |
|---|---|
| Draw call（典型战斗场景） | ≤ 120 |
| 三角面（同屏） | ≤ 60k |
| 纹理内存 | ≤ 128MB |
| sim tick 耗时（4 玩家 + 24 敌人） | ≤ 2ms |
| 客户端帧时间 p99 | ≤ 18.2ms |
| 服务端单房间 CPU | ≤ 8% of 1 core |
| 单服目标 | 300–1000 CCU（约 75–250 房间） |

预算超标 = CI 红。预算调整需 ADR。

---

## 7. 数据与持久化（M3 起）

| 数据 | 存储 | 备注 |
|---|---|---|
| 账号、角色、俱乐部、导师 | PostgreSQL | |
| 物品实例 | PostgreSQL（每件唯一 ID） | 便于审计与追溯 |
| 货币变更 | PostgreSQL **append-only 审计表** | 铁律：不允许无记录的余额直接 UPDATE |
| 交易与拍卖 | PostgreSQL（事务） | |
| 会话、房间、排行榜 | Redis | |
| 遥测 | 独立库/文件，异步写 | 不阻塞游戏逻辑 |

**审计表设计**（契约级）：每笔货币变动记录 `(id, account, currency, delta, balance_after, reason_code, ref_id, tick/ts)`。经济出事时靠它回滚。

---

## 8. 环境与部署

| 环境 | 用途 | 部署 |
|---|---|---|
| `local` | Bot 在 lane 里跑的开发环境 | `pnpm dev` |
| `ci` | GitHub Actions | 每 PR |
| `staging` | 内部可玩构建，D1 试玩、Q1 验收 | 自动部署 main |
| `prod` | 玩家服（M5 起） | 手动批准部署 |

**M0 阶段**：`staging` 先用 GitHub Pages / Cloudflare Pages 托管纯客户端构建（无服务端），够用且零运维。
**M3 起**：需要一台 Linux 服务器跑 Colyseus + Postgres + Redis。见 `docs/02-tech/infra.md`。

---

## 9. 已知风险与预案

| 风险 | 概率 | 影响 | 预案 |
|---|---|---|---|
| Colyseus 在 4 人快节奏战斗下延迟不可接受 | 中 | 高 | M3 结束前做网络测试台实测；不达标则 ADR 切 geckos.io |
| 确定性在浮点上被破坏 | 中 | 高 | 关键路径用定点数；回放测试每次 CI 跑 |
| Electron 的 Steam overlay 不工作 | 中 | 中 | M6 早期做 spike；备选 NW.js |
| 3D 像素在动态光照下抖动/闪烁 | 高 | 中 | M2 优先解决；必要时改用全静态烘焙光照 + 少量动态点光 |
| 共享云电脑资源不足以跑完整测试 | 中 | 中 | CI 跑在 GitHub Actions 或自建 runner，不在云电脑上跑重活 |
