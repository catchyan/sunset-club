# 契约 · 战斗事件（Combat Events）

> Status: **DRAFT v0** · Owner: A1 总架构师
> 需要它的里程碑：M1 · 依赖方：E1-sim / E2-client / V1-视效 / U1-声音
> **这份契约冻结之前，任何人不许开始写战斗表现层代码。**
> 单一定义源：`packages/protocol/src/combat-events.ts`（Zod）。本文档与该文件由 CI 逐字段比对。

---

## 1. 这份契约要解决的问题

架构原则 3.3：**sim 不知道"特效"存在。** sim 只负责判定，客户端负责好看。

如果没有这份契约，一定会发生下面这件事：E1 在 sim 里写了 `playHitEffect('slash_big')`，V1 后来把特效改名，游戏静默失效，没有任何测试能发现。半个月后 D1 试玩时说"打击感怎么没了"，然后花两天定位。

有了这份契约：sim 发 `hit_confirmed{kind:'heavy'}`，客户端查表播特效。**特效随便改，逻辑一行不动；逻辑的测试不需要渲染器。**

---

## 2. 基础类型

| 类型 | 定义 | 说明 |
|---|---|---|
| `EntityId` | `number`（uint32） | 实体 ID。0 保留为"无" |
| `Tick` | `number`（uint32） | 逻辑帧号，30Hz |
| `Vec3` | `{x:number, y:number, z:number}` | 定点数，单位 1/1024。用于特效定位 |
| `HitKind` | 见 §3 | 决定命中停顿档位 |
| `DamageType` | `'slash' \| 'pierce' \| 'blunt' \| 'inner'` | 决定音效材质与特效族 |
| `WoundId` / `MemoryId` / `DuetId` | `string`（内容数据主键） | 必须存在于 `packages/content/` |

**为什么 `Vec3` 用定点数**：架构原则 3.2，浮点进入 sim 会破坏确定性。事件里的坐标虽然只给表现层用，但事件本身要参与回放哈希，必须确定。

---

## 3. HitKind 枚举（与手感规格 §3 一一对应）

| 值 | 触发条件 | 对应命中停顿 |
|---|---|---|
| `light` | 轻攻击命中 | 2 帧，仅双方 |
| `heavy` | 重攻击命中 | 4 帧，仅双方 |
| `charged` | 蓄力满命中 | 6 帧 + 全局 0.8× 慢放 4 帧 |
| `counter` | 招架后反击命中 | 8 帧，全局 |
| `poise_break` | 该次命中打破了破防条 | 6 帧，全局 |
| `execute` | 处决命中 | 12 帧，全局 + 镜头微推 |
| `duet` | 合击段命中 | 每段 2 帧 |
| `chip` | 招架/格挡后的削减伤害 | 1 帧，仅受击方 |

**CI 断言**：本表的枚举值集合，必须与 `docs/01-game/feel-spec.md §3` 的行、以及 `packages/content/combat/hitstop.json` 的键，三者完全一致。任一处新增而未同步 → 红。

---

## 4. 事件定义

所有事件共有字段：`t`（判别标签）、`tick`（发生的逻辑帧）。

### 4.1 命中类

```ts
{ t: 'hit_confirmed',
  tick: Tick,
  attacker: EntityId,
  target: EntityId,
  kind: HitKind,
  dmgType: DamageType,
  dmg: number,            // 最终伤害，已结算所有减免
  crit: boolean,
  poiseDmg: number,       // 本次造成的破防值
  pos: Vec3,              // 命中点，特效生成位置
  dir: Vec3,              // 命中法线，决定溅射方向与击退朝向
  fromBehind: boolean }   // 背击，苏九娘的核心机制，客户端需要不同特效
```

```ts
{ t: 'hit_blocked', tick, attacker, target, chipDmg: number, pos: Vec3 }
{ t: 'attack_whiffed', tick, attacker, actionId: string }  // 空挥，用于"重量感"音效
```

### 4.2 攻防状态类

```ts
{ t: 'parry_success', tick, who: EntityId, against: EntityId }
{ t: 'parry_failed',  tick, who: EntityId }                  // 招架窗口错过，14 帧破绽
{ t: 'poise_broken',  tick, target: EntityId, by: EntityId } // 进入可处决状态
{ t: 'poise_recovered', tick, who: EntityId }
{ t: 'stance_entered', tick, who: EntityId, stanceId: string }
{ t: 'stance_exited',  tick, who: EntityId, stanceId: string, reason: 'input'|'stamina'|'stagger' }
```

### 4.3 本作特有机制类

```ts
{ t: 'duet_triggered', tick, duetId: DuetId, members: EntityId[], level: 1|2|3 }
{ t: 'duet_segment',   tick, duetId: DuetId, seg: number, by: EntityId }
{ t: 'wound_flared',   tick, who: EntityId, woundId: WoundId, severity: 1|2|3 }
{ t: 'memory_recalled',tick, who: EntityId, memoryId: MemoryId }
{ t: 'vigor_spent',    tick, who: EntityId, amount: number, reason: string }
```

> 旧伤（`wound_flared`）与肌肉记忆（`memory_recalled`）是本作"英雄迟暮"主题的机制载体。
> 它们**必须**有独立的视听表现——这不是可选的润色，是主题能否被玩家感知到的关键。见 `docs/01-game/gdd-core.md §5`。

### 4.4 生命周期类

```ts
{ t: 'entity_spawned', tick, id: EntityId, archetype: string, pos: Vec3 }
{ t: 'entity_died',    tick, id: EntityId, killer: EntityId, overkill: number }
{ t: 'loot_dropped',   tick, from: EntityId, itemInstanceId: string, pos: Vec3 }
```

---

## 5. 硬约束（违反即 CI 红）

1. **事件是只读的、不可变的。** 客户端不得修改事件对象后传递。
2. **sim 不得引用任何 `vfx_id` / `sfx_id` / 动画名。** CI 静态检查 `packages/sim/` 中不出现这些字段名。
3. **事件不得携带表现参数。** 没有 `shakeAmount`、没有 `hitstopFrames`。这些由客户端查 `packages/content/combat/hitstop.json` 得到。
   - 理由：同一个 `heavy` 命中，D1 想把停顿从 4 帧调成 5 帧时，应该只改一个 JSON，而不是改 sim 代码并重跑回放测试。
4. **事件顺序即 tick 顺序**，同一 tick 内按发出顺序稳定排列。回放哈希包含事件序列。
5. **客户端对未知事件类型必须静默忽略**，不得崩溃。（版本不匹配时的降级行为）
6. **服务端权威**：M3 起，客户端预测产生的事件标记 `predicted: true`，被服务端事件覆盖时不重复播放特效。

---

## 6. 冻结前必须回答的问题

> A1 起草后，以下每个问题必须由对应 Bot 在常委会明确回答"能/不能"，才可提交人类冻结。

| # | 问题 | 回答方 | 状态 |
|---|---|---|---|
| 1 | 用这些事件，能不能实现手感规格 §2 触感六件套的全部六项？ | V1 + U1 | ⬜ 未回答 |
| 2 | 事件里的信息够不够做命中停顿分档？ | E2 | ⬜ 未回答 |
| 3 | 事件序列进回放哈希，会不会因为事件顺序不稳定导致回放测试随机失败？ | E1 | ⬜ 未回答 |
| 4 | M3 加网络后，这些事件哪些需要下发、哪些客户端本地推导即可？ | E3 | ⬜ 未回答 |
| 5 | 有没有哪个字段是"我猜将来会用到"加上去的？有就删掉。 | A1 | ⬜ 未回答 |

> 第 5 个问题来自宪法第十八条（删除的权力）。**契约里每多一个字段，就多一处未来的不一致。**

---

## 7. 变更历史

| 版本 | 日期 | 变更 | ADR |
|---|---|---|---|
| v0 | 2026-08-20 | 初稿 | — |
