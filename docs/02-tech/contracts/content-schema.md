# 契约 · 内容数据 Schema

> Status: **DRAFT v0** · Owner: A1 总架构师（schema 结构）+ D1 设计总监（字段语义）
> 需要它的里程碑：M1 · 依赖方：E1-sim / D1 / T1 / V1 / C1
> 单一定义源：`packages/protocol/src/content/*.ts`（Zod）→ 生成 JSON Schema → 校验 `packages/content/**/*.json`

---

## 1. 为什么内容必须是数据

宪法第八条：**数值、帧数据、掉落表、配方、文案不许写死在代码里。**

三个理由，按重要性排序：

1. **D1 调数值不需要 E1。** 手感调优要迭代几十次，每次都走"提任务→写代码→评审→合并"是不可能收敛的。
2. **数值变更的 diff 可读。** `"hitstop_frames": 4 → 5` 一眼能看懂；埋在 TypeScript 里的同样修改，评审者看不出影响面。
3. **机器可校验。** JSON Schema 能断言"每个攻击动作都有 vfx_id 且该 id 存在"。代码里做不到。

**判定标准**：如果 D1 想调这个值，他需不需要开一个 PR 改 `.ts` 文件？需要 → 说明这个值放错地方了。

---

## 2. 目录结构

```
packages/content/
├─ combat/
│  ├─ frames/<character>.json     # 帧数据，与 feel-spec.md §4 逐帧对应
│  ├─ hitstop.json                # HitKind → 停顿帧数与作用域
│  ├─ actions/<character>.json    # 动作定义（含触感六件套引用）
│  └─ enemies/<archetype>.json    # 敌人动作与预警帧
├─ characters/<id>.json           # 角色基础属性、旧伤、肌肉记忆槽
├─ items/                         # 装备、材料、消耗品
├─ recipes/                       # 锻造与制作配方
├─ dungeons/<id>.json             # 层数、房间池、怪物配比、掉落表
├─ economy/                       # 价格曲线、投放/回收系数（M5）
└─ text/zh-CN/*.json              # 全部文案。代码里禁止出现中文字符串
```

---

## 3. 核心 Schema：攻击动作

```jsonc
{
  "id": "lu_light_1",                 // 全局唯一，snake_case
  "character": "lu_laosan",
  "displayNameKey": "action.lu_light_1",   // 指向 text/，不许直接写中文

  // —— 帧数据：必须与 docs/01-game/feel-spec.md §4 完全一致（CI 双向校验）——
  "startup": 5,
  "active": [6, 8],
  "recovery": 9,
  "cancelWindow": [12, 20],
  "staminaCost": 0,

  // —— 判定 ——
  "dmgMult": 1.00,
  "poiseDmg": 8,
  "dmgType": "slash",
  "hitKind": "light",
  "hitbox": { "shape": "capsule", "offset": [0, 900, 1200], "radius": 500, "height": 1400 },

  // —— 触感六件套：六项全部必填，缺一个 schema 校验失败 ——
  "juice": {
    "hitstopRef": "light",           // 查 hitstop.json，不许写死帧数
    "shakeAmpPx": 2,
    "shakeFrames": 4,
    "vfxId": "hit_slash_s",
    "sfxId": "sfx_hit_flesh_s",      // 必须有 ≥3 个变体
    "dmgPopupStyle": "normal",
    "flashFrames": 3,
    "flashColor": "pal_38"           // 必须是 40 色调色板中的索引
  }
}
```

### 3.1 `juice` 字段为什么是必填而不是可选

因为可选字段一定会被漏掉。M1 做 8 个动作时人人都记得填；M6 做第 60 个动作时一定有人忘。到那时问题表现为"这一招打起来手感怪怪的说不上来"，排查成本极高。

**schema 层面强制必填 = 这个 bug 类别在本项目中不可能存在。** 这比任何数量的评审都可靠。

---

## 4. 引用完整性（CI 断言）

`tools/gates/content-lint.ts` 检查全部内容数据的交叉引用：

| 规则 | 说明 |
|---|---|
| `vfxId` 存在 | 对应 `assets/vfx/` 下有资源 |
| `sfxId` 存在且 ≥3 变体 | 单一音效重复播放会非常廉价 |
| `flashColor` 在调色板内 | 见 `art-bible.md` 40 色约束 |
| `hitstopRef` 是合法 HitKind | 见 `combat-events.md §3` |
| `displayNameKey` 在 `text/zh-CN/` 中存在 | 防止上线后出现 `action.xxx` 占位符 |
| 帧数据与 feel-spec 一致 | 双向：文档有而 JSON 没有 → 红；JSON 有而文档没有 → 红 |
| 掉落表物品 id 存在 | 防止刷出空气 |
| 配方材料 id 存在且可获得 | **可获得性检查**：每个材料必须至少有一个产出来源，否则配方是死配方 |
| 无孤儿数据 | 定义了但没有任何地方引用 → 警告（不红），列入 `board/drift.md` |

> 最后两条尤其重要。梦幻西游式的经济系统里，一个"无法获得的材料"会让整条产业链静默失效，
> 而这种问题在游戏里表现为"这个配方好像没人做"，几个月都可能发现不了。

---

## 5. 硬约束

1. **代码中禁止出现中文字符串字面量。** CI 正则扫描 `packages/*/src/`，命中即红。（例外：注释）
2. **代码中禁止出现魔法数值。** 任何进入伤害/概率/价格计算的常量必须来自 `content/`。
3. **content 包不依赖任何代码包。** 它是纯数据。CI 检查其 `package.json` 无 dependencies。
4. **所有 id 全局唯一**，跨文件也不许重复。
5. **数值改动必须在 PR 描述里写"为什么"**，且战斗数值改动需 D1 批准（CODEOWNERS 强制）。

---

## 6. 冻结前必须回答的问题

| # | 问题 | 回答方 | 状态 |
|---|---|---|---|
| 1 | 用这套 schema，能不能表达苏九娘"错步后 30 帧内背击"这种带条件窗口的动作？ | D1 | ⬜ |
| 2 | 敌人的"攻击令牌"机制（同屏最多 2 个敌人同时判定）需要什么数据字段？ | E1 | ⬜ |
| 3 | 程序化/AI 生成的资产，产出的元数据能不能直接填进 `juice` 字段？ | V1 | ⬜ |
| 4 | 经济数据（M5）用同一套 schema 体系还是独立一套？ | C1 | ⬜ |
| 5 | 有没有字段是"猜将来会用到"加的？删掉。 | A1 | ⬜ |

---

## 7. 变更历史

| 版本 | 日期 | 变更 | ADR |
|---|---|---|---|
| v0 | 2026-08-20 | 初稿 | — |
