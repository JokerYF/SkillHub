---
name: team
description: Use when starting team collaboration for development, review, testing, or design tasks that require multiple agent roles
---

## 工作流程

### 1. 解析任务

读取 `.claude/team.yaml`，根据关键词匹配任务类型。

### 2. 确定工作流

根据匹配的任务类型，获取对应的 workflow 配置：
- **顺序执行**：`[architect, ui-designer, backend, developer, tester]`
- **并行执行**：`parallel: [backend, frontend]`

### 3. 派发 Agent

按照 workflow 顺序派发 agent：
- 读取角色 skill 文件
- 注入角色上下文（身份、技术栈、工作原则）
- **执行代码操作前，必须加载 TDD 技能** ⭐
- 执行任务

### 4. 提交检查点 ⭐

**每个 Agent 完成任务后，执行提交检查点**：

1. 检查是否有未提交的更改：`git status`
2. 如果有更改，提交代码：
   ```bash
   git add -A
   git commit -m "feat(module): description by {role}"
   ```
3. **不自动推送**，等待 PM 统一推送

**目的**：防止后续修改破坏已完成的工作，便于回滚和追踪。

### 5. 任务总结 ⭐ 新增

**每个 Agent 完成任务后，生成当日任务总结**：

1. 确定总结文件路径：`.claude/daily-summaries/{YYYY-MM-DD}.md`
2. 如果文件不存在，创建并添加标题
3. 追加任务总结内容到文件末尾

**总结内容包括**：
- 完成的任务
- 关键决策/技术实现
- 遇到的问题及解决方案
- 相关文件/待跟进事项

**目的**：方便长期记忆，回顾之前做过的工作，便于知识沉淀。

### 6. 部署到云端 ⭐

**研发完成后，由部署专员（developer）同步代码到云端**：

1. 接收研发完成通知
2. rsync 同步代码到云端服务器
3. 安装新依赖（如有）
4. 重启服务
5. 执行健康检查
6. 通知测试工程师进行云端测试

### 7. 云端测试验证

**测试工程师在云端环境执行测试验证**：

1. 部署专员通知后开始测试
2. 在云端执行功能测试、集成测试
3. 验证通过后，通知 PM 可以推送

### 8. PM 推送代码 ⭐

**测试验证通过后，由 PM 统一推送到 GitHub**：

1. 确认所有提交已完成
2. 确认云端测试验证通过
3. 推送代码：
   ```bash
   git push origin master
   ```

**目的**：在推送前有最后一次检查机会，确保代码质量。

### 9. 汇总结果

收集各 agent 输出，生成结构化报告。

## 角色职责

| 角色 | 职责 | 是否推送 |
|------|------|----------|
| 架构师 | 技术决策、架构设计、Code Review | ❌ 仅提交 |
| UI交互工程师 | UI 设计、交互流程、用户体验 | ❌ 仅提交 |
| 后端开发 | API、CLI 开发 | ❌ 仅提交 |
| 前端开发 | Web UI 开发 | ❌ 仅提交 |
| 部署专员 | 代码部署、云端环境配置 | ❌ 仅提交 |
| 测试工程师 | 测试验证、质量保障 | ❌ 仅提交 |
| PM | 统筹协调、最终推送 | ✅ 推送代码 |

## 任务类型

| 类型 | 关键词 | 工作流 |
|------|--------|--------|
| feature | 实现、开发、添加、新建 | architect → ui-designer → backend/frontend 并行 → developer(部署) → tester(云端测试) → PM push |
| review | 审查、review、检查 | architect → commit → PM push |
| test | 测试、test、验证 | tester → commit → PM push |
| bugfix | 修复、fix、bug | backend → commit → developer(部署) → tester(云端测试) → PM push |
| design | 设计、架构、方案 | architect → commit → PM push |
| deploy | 部署、deploy、云端、环境 | developer → commit → PM push |
| cloud-test | 云端测试 | developer → tester → PM push |
| ui-design | UI、界面、交互、体验、样式 | ui-designer → commit → PM push |

## 流程图

```
┌──────────────────────────────────────────────────────────────────┐
│                        Feature 开发流程                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────┐    ┌───────────────┐    ┌───────────────────┐    │
│  │  架构师    │───▶│ UI交互工程师   │───▶│ 后端开发/前端开发  │    │
│  │ (设计)    │    │  (UI/交互)    │    │    (并行开发)      │    │
│  └───────────┘    └───────────────┘    └─────────┬─────────┘    │
│                                                   │              │
│                                                   ▼              │
│  ┌───────────┐    ┌───────────────────┐    ┌───────────────┐    │
│  │    PM     │◀───│     测试工程师      │◀───│   部署专员    │    │
│  │ (推送)    │    │    (云端测试)       │    │ (云端部署)   │    │
│  └───────────┘    └───────────────────┘    └───────────────┘    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 提交规范

采用 Conventional Commits 格式：

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | Bug 修复 |
| refactor | 重构 |
| docs | 文档更新 |
| test | 测试相关 |
| chore | 构建/工具相关 |
| deploy | 部署相关 |
| design | 设计相关 |

示例：
```
feat(auth): add JWT middleware by backend
fix(api): resolve CORS issue by backend
design(ui): add login page mockup by ui-designer
deploy(cloud): sync code to cloud-server by developer
test(api): verify endpoints on cloud by tester
```

## 使用示例

```
/team 实现 user-auth 功能
/team review src/backend/auth.rs
/team 修复登录验证 bug
/team 设计 API 接口
/team 部署到云端
/team 云端测试
/team 设计登录页面的 UI 交互
```

## ⭐ TDD 约束

**所有涉及代码编写的角色（backend、frontend），在执行任务前必须加载 TDD 技能。**

### 加载方式

```
使用 Skill tool 调用 superpowers:test-driven-development 技能
```

### 适用场景

| 角色 | 是否加载 TDD |
|------|-------------|
| 架构师 | ❌ 不涉及代码编写 |
| UI交互工程师 | ❌ 设计为主 |
| 后端开发 | ✅ 必须加载 |
| 前端开发 | ✅ 必须加载 |
| 部署专员 | ❌ 配置为主 |
| 测试工程师 | ❌ 测试验证为主 |
| PM | ❌ 不涉及代码编写 |

### 工作流调整

```
feature: architect → ui-designer → backend(加载TDD) / frontend(加载TDD) 并行 → developer → tester
bugfix: backend(加载TDD) → developer → tester
deploy: developer
ui-design: ui-designer
```

## ⭐ 任务总结规范

### 文件路径

```
.claude/daily-summaries/{YYYY-MM-DD}.md
```

### 通用格式

```markdown
# 任务总结 - {YYYY-MM-DD}

---

## 角色：{角色名称}

### 完成的任务
- [在此填写具体任务]

### 关键产出
- [决策/实现/测试结果等]

### 遇到的问题
- 问题：描述及解决方案

### 相关文件
- 修改的文件列表

### 待跟进事项
- [ ] 需要跟进的事项
```

### 查看历史总结

```bash
# 查看今日总结
cat .claude/daily-summaries/$(date +%Y-%m-%d).md

# 查看最近 7 天的总结
ls -la .claude/daily-summaries/ | tail -7

# 搜索特定日期的总结
cat .claude/daily-summaries/2026-03-23.md
```