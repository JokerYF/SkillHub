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

### 5. 任务总结 ⭐

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

### 6. 构建本地镜像 ⭐ 新流程

**研发完成后，由部署专员构建本地 Docker 镜像**：

```bash
# 构建本地镜像
docker compose build

# 镜像命名规范
# skills-hub-backend:local
# skills-hub-frontend:local
```

**数据库连接配置**：
- 使用 `.env` 文件配置云端数据库连接
- 镜像构建时将 `.env` 打包进去
- 本地测试直接连接云端数据库

### 7. QA 本地验证 ⭐ 新流程

**测试工程师在本地使用 Docker 镜像进行验证**：

1. 部署专员通知后启动本地容器
2. 使用本地镜像 + 云端数据库进行测试
3. 执行 API 测试和 UI 测试
4. 汇总 Bug 清单，反馈给研发
5. 验证通过后，通知部署专员可以部署

**优势**：
- 真实的云端数据库环境
- 避免云端部署后发现问题再回滚
- 快速迭代验证

### 8. 部署镜像到云端 ⭐ 新流程

**QA 验证通过后，部署专员将镜像推送到云端**：

```bash
# 方式一：推送镜像到云端 registry（推荐）
docker tag skills-hub-backend:local registry.example.com/skills-hub-backend:latest
docker push registry.example.com/skills-hub-backend:latest

# 方式二：直接在云端构建
ssh cloud-server "cd /root/projects/skills_hub && docker compose build && docker compose up -d"
```

**云端环境说明**：
- 云端为**测试环境**
- 连接云端数据库
- 配置与本地测试一致

### 9. PM 推送代码 ⭐

**部署完成后，由 PM 统一推送到 GitHub**：

1. 确认所有提交已完成
2. 确认 QA 本地验证通过
3. 确认云端部署成功
4. 推送代码：
   ```bash
   git push origin master
   ```

### 10. 汇总结果

收集各 agent 输出，生成结构化报告。

## 新旧流程对比

| 阶段 | 旧流程 | 新流程 |
|------|--------|--------|
| 研发完成 | 直接部署到云端 | 先构建本地镜像 |
| QA 验证 | 在云端环境测试 | 本地镜像测试（连云端DB） |
| 验证时机 | 部署后验证 | 部署前验证 |
| 问题修复 | 需要回滚云端 | 本地直接修改重新构建 |
| 部署触发 | 研发完成后 | QA 验证通过后 |

## 流程图

```
┌──────────────────────────────────────────────────────────────────┐
│                        Feature 开发流程（新）                      │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────┐    ┌───────────────┐    ┌───────────────────┐    │
│  │  架构师    │───▶│ UI交互工程师   │───▶│ 后端开发/前端开发  │    │
│  │ (设计)    │    │  (UI/交互)    │    │    (并行开发)      │    │
│  └───────────┘    └───────────────┘    └─────────┬─────────┘    │
│                                                   │              │
│                                                   ▼              │
│  ┌───────────┐    ┌───────────────────┐    ┌───────────────┐    │
│  │    PM     │◀───│     部署专员       │◀───│   测试工程师   │    │
│  │ (推送)    │    │  (部署镜像到云端)   │    │ (本地镜像测试) │    │
│  └───────────┘    └───────────────────┘    └───────┬───────┘    │
│                                                    │             │
│                                                    ▼             │
│                                           ┌───────────────┐      │
│                                           │   部署专员     │      │
│                                           │ (构建本地镜像) │      │
│                                           └───────────────┘      │
│                                                                  │
│  数据库：本地镜像 → 云端数据库                                     │
│  云端环境：测试环境                                               │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## 角色职责

| 角色 | 职责 | 是否推送 |
|------|------|----------|
| 架构师 | 技术决策、架构设计、Code Review | ❌ 仅提交 |
| UI交互工程师 | UI 设计、交互流程、用户体验 | ❌ 仅提交 |
| 后端开发 | API、CLI 开发 | ❌ 仅提交 |
| 前端开发 | Web UI 开发 | ❌ 仅提交 |
| 部署专员 | 构建镜像、部署到云端 | ❌ 仅提交 |
| 测试工程师 | 本地镜像测试、质量保障 | ❌ 仅提交 |
| PM | 统筹协调、最终推送 | ✅ 推送代码 |

## 任务类型

| 类型 | 关键词 | 工作流 |
|------|--------|--------|
| feature | 实现、开发、添加、新建 | architect → ui-designer → backend/frontend 并行 → developer(构建镜像) → tester(本地测试) → developer(部署云端) → PM push |
| review | 审查、review、检查 | architect → commit → PM push |
| test | 测试、test、验证 | tester → commit → PM push |
| bugfix | 修复、fix、bug | backend → commit → developer(构建镜像) → tester(本地测试) → developer(部署云端) → PM push |
| design | 设计、架构、方案 | architect → commit → PM push |
| build-image | 构建、镜像、image | developer(构建镜像) → tester(本地测试) |
| deploy | 部署、deploy、云端、环境 | developer(部署云端) → PM push |
| ui-design | UI、界面、交互、体验、样式 | ui-designer → commit → PM push |

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
| build | 镜像构建 |

示例：
```
feat(auth): add JWT middleware by backend
fix(api): resolve CORS issue by backend
design(ui): add login page mockup by ui-designer
build(image): build local docker images by developer
deploy(cloud): deploy images to cloud by developer
test(local): verify with local image by tester
```

## 使用示例

```
/team 实现 user-auth 功能
/team review src/backend/auth.rs
/team 修复登录验证 bug
/team 设计 API 接口
/team 构建镜像
/team 部署到云端
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
feature: architect → ui-designer → backend(加载TDD) / frontend(加载TDD) 并行 → developer(构建镜像) → tester(本地测试) → developer(部署云端)
bugfix: backend(加载TDD) → developer(构建镜像) → tester(本地测试) → developer(部署云端)
build-image: developer(构建镜像) → tester(本地测试)
deploy: developer(部署云端)
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
cat .claude/daily-summaries/2026-03-24.md
```

## ⭐ 本地镜像测试配置

### 配置原则

**镜像构建时不打包任何配置文件**，配置在运行时手动指定。

### 本地测试

```yaml
# docker-compose.yml
services:
  backend:
    build: ./backend
    env_file:
      - .env.local  # 本地配置文件
    ports:
      - "3000:3000"

  frontend:
    build: ./web
    ports:
      - "5173:5173"
```

### 云端部署

```bash
# 云端配置文件位置：/root/config/.env
ssh cloud-server "cd /root/projects/skills_hub && docker compose --env-file /root/config/.env up -d"
```

### .env 示例

```env
# 云端数据库连接
DATABASE_URL=postgresql://postgres:password@115.190.114.160:5432/skills_hub

# JWT 密钥
JWT_SECRET=your-jwt-secret-key

# 日志配置
RUST_LOG=info
LOG_FORMAT=pretty
```

### 测试流程

```bash
# 1. 构建镜像（不含配置）
docker compose build

# 2. 启动容器（指定配置文件）
docker compose --env-file .env.local up -d

# 3. 查看日志
docker compose logs -f

# 4. 执行测试
# API 测试
curl http://localhost:3000/api/health

# UI 测试
# 浏览器访问 http://localhost:5173

# 5. 停止容器
docker compose down
```

### Dockerfile 规范

```dockerfile
# ❌ 禁止：不要复制配置文件
# COPY .env /app/.env

# ✅ 正确：只复制代码
COPY src/ /app/src/
COPY Cargo.toml /app/
```