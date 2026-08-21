# 依赖图（Dependency Graph）

> 状态：**STUB** · 所有者：A1 总架构师 · 起草时点：**M1**（`packages/` 骨架建立后）
> 权威定义在 `architecture.md §2.1`。本文件负责把它变成机器可检查的规则与可视化。

---

## 目标依赖方向（来自 `architecture.md §2.1`）

```
content ──┐
shared ───┼──> sim ──┬──> client
protocol ─┘          └──> server
                            │
telemetry <─────────────────┘
econ-sim ──> content, shared   (独立，不依赖 sim)
```

## 禁止的依赖（CI 强制，`pnpm gates:deps`）

| 禁止 | 理由 |
|---|---|
| `sim` → `client` / `server` | 单一模拟内核原则。sim 被两边共用，它不能知道自己跑在哪边 |
| `sim` → `three` / 任何 DOM | sim 必须能在 Node 里无头跑，否则测不了 |
| `sim` → 任何 Node IO / `Date.now()` / `Math.random()` | 确定性原则。这三样是回放测试失效的三大元凶 |
| `client` → `server` | |
| `content` → 任何代码包 | content 是纯数据 |

## 起草时要做的

1. 用 `dependency-cruiser` 或等价工具，把上表写成配置
2. 生成依赖图 SVG，放进本文件，CI 里自动更新
3. **每条禁止规则配一个"违反示例"的测试**——确保规则本身是有效的

第 3 条容易被跳过，但它很重要。一条从未被触发过的 lint 规则，你无法确定它到底在不在工作。
写一个故意违反的样例，断言 lint 确实报错，才知道这道闸门是真的。

> 这是 M0 负向验收（故意越界必须被抓住）的思路在代码层的延续：
> **闸门本身也需要被测试。**
