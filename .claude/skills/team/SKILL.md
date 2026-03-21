---
name: team
description: Use when starting team collaboration for development, review, testing, or design tasks that require multiple agent roles
---

## 工作流程

### 1. 解析任务

读取 `.claude/team.yaml`，根据关键词匹配任务类型。

### 2. 确定工作流

根据匹配的任务类型，获取对应的 workflow 配置：
- **顺序执行**：`[architect, backend, tester]`
- **并行执行**：`parallel: [backend, frontend]`

### 3. 派发 Agent

按照 workflow 顺序派发 agent：
- 读取角色 skill 文件
- 注入角色上下文（身份、技术栈、工作原则）
- 执行任务

### 4. 汇总结果

收集各 agent 输出，生成结构化报告。

## 任务类型

| 类型 | 关键词 | 工作流 |
|------|--------|--------|
| feature | 实现、开发、添加、新建 | architect → backend/frontend 并行 → tester |
| review | 审查、review、检查 | architect |
| test | 测试、test、验证 | tester |
| bugfix | 修复、fix、bug | backend → tester |
| design | 设计、架构、方案 | architect |

## 使用示例

```
/team 实现 user-auth 功能
/team review src/backend/auth.rs
/team 修复登录验证 bug
/team 设计 API 接口
```