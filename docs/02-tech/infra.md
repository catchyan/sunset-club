# 基础设施（Infrastructure）

> 状态：**STUB** · 所有者：O1 运维官 · 起草时点：**M3 前**
> 占位文件。M0–M2 不需要服务器，见下。

---

## M0–M2：不需要服务器

`architecture.md §8` 已定：staging 用 Cloudflare Pages / GitHub Pages 托管纯客户端构建。零运维、零成本、一个 URL 就能试玩。

**不要提前搭服务器。** 一台没人用的服务器，两个月后一定是一台没人记得怎么配的服务器。

## M3 起需要什么

| 组件 | 用途 | 规格下限 |
|---|---|---|
| Colyseus | 权威服务器 | 见 `architecture.md §6`：单房间 ≤8% of 1 core |
| PostgreSQL | 账号、角色、物品实例、货币审计表 | 需要事务与 append-only 审计 |
| Redis | 会话、房间、排行榜 | |
| 反向代理 | TLS、WebSocket 升级 | Caddy 优先（自动证书） |

按 300–1000 CCU 的目标（`architecture.md §6`），起步 4C8G 足够，需要可垂直扩容。

## ⚠️ 当前已知问题

人类提供的那台服务器（地址不写进公开仓库，见本节末）**从开发环境不可达**：

- TCP 三次握手在 22 / 2222 / 22022 / 80 / 443 / 8080 **全部报告成功**
- 但 SSH banner 交换超时（`ssh -vv` 卡在 `Connection timed out during banner exchange`）
- ICMP 不通

全端口都 ACK 但没有服务响应，这是运营商侧应答式过滤或 CGNAT 的典型特征——外部看到的是网关在替这个地址回应，而不是主机本身。

**结论**：这台机器不能用作 M3 的部署目标，除非人类确认一个真实可达的地址或换一台 VPS。
**影响**：M0–M2 无影响。M3 开始前必须解决。人类已确认：**M3 前再处理**。

> 🔒 **本仓库是公开的。主机地址、端口、凭据一律不写进来。**
> 部署目标通过环境变量或 GitHub Secrets 注入，本地放 `.env`（已在 `.gitignore` 中）。
> 这条不只是针对服务器——它适用于任何凭据。Bot 在写文档时很容易顺手把连接串贴进去。

## 分支保护（已解决）

**当前状态：已生效并实测通过。**

```
Repository:            catchyan/sunset-club  (public)
Require PR:            yes, 1 approving review, dismiss stale reviews
Required status check: gates  (strict)
enforce_admins:        true
Force push / delete:   blocked
```

实测：`git push origin main` 返回 `GH006: Protected branch update failed`。

### 走到这里的过程（留给后来者）

仓库最初建为私有，但**免费账户无法在私有仓库上启用分支保护或 ruleset**——
分支保护 API 与 rulesets API 均返回 403 "Upgrade to GitHub Pro or make this repository public"。

这不是小麻烦。RELAY 的执行链是：

```
车道所有权表 → CI 闸门 → 分支保护拒绝未过闸的合并 → 越界物理上进不了 main
```

**去掉最后一环，前面三环全部退化为建议。** 而弱 Agent 遇到阻碍时的典型行为，恰恰就是找一条绕过去的路——
`git push origin main` 成功一次，它就学会了这条路。

人类总制作人选择了**改为公开仓库**。附带好处：公开仓库的 Actions 分钟数不限，对一个每 PR 都跑 CI 的项目是实打实的收益。

### ⚠️ `enforce_admins` 必须为 true

初次配置时 `enforce_admins` 设为了 false（想给人类留一条紧急通道），**这是个洞**：

**Bot 是用人类的 GitHub 账号推送的。** 人类账号是 admin。admin 豁免 = Bot 豁免。
整套保护对它本该防的对象完全无效。

已改为 `true`。代价是人类自己也推不了 main——这是对的，见下面的正确做法。

### 人类需要直接落盘时的正确做法

**不要**长期关掉 `enforce_admins`。要用显式、留痕、时间窗最小的临时开关：

```bash
# 1. 关闭（这一步会在仓库的 audit log 里留痕）
gh api -X DELETE repos/catchyan/sunset-club/branches/main/protection/enforce_admins
# 2. 推送
git push origin main
# 3. 立刻恢复。不要拖到"待会儿"
gh api -X POST   repos/catchyan/sunset-club/branches/main/protection/enforce_admins
# 4. 确认
gh api repos/catchyan/sunset-club/branches/main/protection/enforce_admins
```

**任何 Bot 执行上述第 1 步 = 立即拉安灯 + 记信任账本。** 这条通道只属于人类。
建议在 Grok Bot 的 Auto-review 里把 `enforce_admins` 加入 Require Approval 名单。

## 起草时必须写清楚的

1. **一条命令重建**：`tools/bootstrap/` 要做到在一台空白 Linux 上一条命令重建整个环境。这是宪法"可复现"要求在基础设施上的体现。
2. **不许有雪花服务器**：任何手动改动当天写回 bootstrap 脚本（见 `board/infra-health.md`）。
3. 备份与恢复演练（见 `backup.md`）
4. 监控与告警
5. 部署流程与回滚
6. 密钥管理：**任何凭据不许进 git**
