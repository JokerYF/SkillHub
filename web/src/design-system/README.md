# Skills Intelligence Hub Design System

企业级 AI 技能管理平台的统一设计系统，为前端工程师提供可落地实现的设计规范。

## 设计原则

### 1. 清晰 (Clarity)
- 视觉层次分明，信息架构清晰
- 减少认知负担，让用户快速理解
- 文案简洁明确，避免歧义

### 2. 一致 (Consistency)
- 相同功能使用相同的视觉表现
- 统一的交互模式和反馈机制
- 跨页面、跨组件的样式一致性

### 3. 高效 (Efficiency)
- 减少操作步骤，优化用户流程
- 提供快捷操作和智能推荐
- 支持批量操作和键盘导航

### 4. 专业 (Professional)
- 企业级视觉风格
- 稳重而不失现代感
- 适配不同用户角色和权限

### 5. 可访问 (Accessible)
- 符合 WCAG 2.1 AA 标准
- 支持键盘导航和屏幕阅读器
- 提供足够的对比度和点击区域

---

## 颜色系统

### 品牌色

品牌色用于表达产品个性和品牌识别。主色为 `brand-500`，适用于主要操作和强调元素。

| 名称 | 值 | 用途 |
|------|-----|------|
| brand-50 | hsl(220, 100%, 97%) | 品牌色最浅背景 |
| brand-500 | hsl(220, 100%, 58%) | 品牌主色 |
| brand-600 | hsl(220, 100%, 48%) | 品牌色悬停态 |
| brand-700 | hsl(220, 100%, 42%) | 品牌色按下态 |

### 语义色

语义色用于传达特定含义和状态。

| 类型 | 用途 | 使用场景 |
|------|------|----------|
| success | 成功、完成 | 操作成功提示、完成状态 |
| warning | 警告、注意 | 需要注意的信息 |
| error | 错误、失败 | 错误提示、必填项 |
| info | 信息、提示 | 一般信息提示 |

### 中性色

中性色用于文字、边框、背景等基础元素。

| 名称 | 值 | 用途 |
|------|-----|------|
| neutral-50 | hsl(220, 20%, 98%) | 页面背景 |
| neutral-100 | hsl(220, 15%, 95%) | 次级背景 |
| neutral-200 | hsl(220, 10%, 88%) | 边框、分割线 |
| neutral-500 | hsl(220, 5%, 46%) | 占位符文字 |
| neutral-700 | hsl(220, 5%, 26%) | 次要文字 |
| neutral-900 | hsl(220, 5%, 12%) | 主要文字 |

### 技能类型色

用于区分不同 AI 编程工具的技能标签。

| 类型 | 颜色 | 说明 |
|------|------|------|
| claude | 紫色系 | Claude Code 技能 |
| cursor | 紫罗兰色系 | Cursor 技能 |
| copilot | 青色系 | GitHub Copilot 技能 |

---

## 排版系统

### 字体家族

```css
/* 主要 UI 字体 */
font-family: Inter, -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;

/* 代码字体 */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### 字号阶梯

| 名称 | 值 | 用途 |
|------|-----|------|
| xs | 12px | 辅助文字、标签 |
| sm | 14px | 次要内容、表单标签 |
| base | 16px | 正文内容 |
| lg | 18px | 卡片标题 |
| xl | 20px | 区块标题 |
| 2xl | 24px | 页面标题 |

### 行高

| 名称 | 值 | 用途 |
|------|-----|------|
| tight | 1.25 | 标题 |
| normal | 1.5 | 正文 |
| relaxed | 1.625 | 长文本 |

---

## 间距系统

基于 4px 网格系统，采用 t-shirt 尺寸命名。

### 基础间距

| 名称 | 值 | 用途 |
|------|-----|------|
| 1 | 4px | 最小间距 |
| 2 | 8px | 紧凑间距 |
| 3 | 12px | 小间距 |
| 4 | 16px | 默认间距 |
| 6 | 24px | 中等间距 |
| 8 | 32px | 大间距 |

### 语义间距

```typescript
padding: {
  xs: '4px',   // 紧凑内边距
  sm: '8px',   // 小内边距
  md: '16px',  // 默认内边距
  lg: '24px',  // 大内边距
  xl: '32px',  // 超大内边距
}
```

### 布局间距

| 名称 | 值 | 用途 |
|------|-----|------|
| navbarHeight | 64px | 导航栏高度 |
| sidebarWidth | 256px | 侧边栏宽度 |
| pagePadding-sm | 16px | 页面边距(移动端) |
| pagePadding-lg | 64px | 页面边距(桌面端) |

---

## 阴影系统

| 名称 | 用途 |
|------|------|
| xs | 最小层次区分 |
| sm | 卡片、下拉菜单 |
| md | 悬浮元素 |
| lg | 强调悬浮效果 |
| 2xl | 模态框 |

### 语义阴影

```typescript
semantic: {
  card: '卡片默认阴影',
  cardHover: '卡片悬停阴影',
  dropdown: '下拉菜单阴影',
  modal: '模态框阴影',
  inputFocus: '输入框聚焦阴影',
}
```

---

## 组件使用示例

### Button 按钮

```vue
<template>
  <!-- 主要按钮 -->
  <Button type="primary">主要操作</Button>

  <!-- 次要按钮 -->
  <Button type="secondary">次要操作</Button>

  <!-- 轮廓按钮 -->
  <Button type="outline">轮廓按钮</Button>

  <!-- 幽灵按钮 -->
  <Button type="ghost">幽灵按钮</Button>

  <!-- 危险按钮 -->
  <Button type="danger">删除</Button>

  <!-- 尺寸变体 -->
  <Button size="sm">小按钮</Button>
  <Button size="md">默认尺寸</Button>
  <Button size="lg">大按钮</Button>

  <!-- 状态 -->
  <Button loading>加载中</Button>
  <Button disabled>禁用</Button>

  <!-- 带图标 -->
  <Button>
    <template #icon-left>
      <PlusIcon />
    </template>
    添加技能
  </Button>
</template>
```

### Input 输入框

```vue
<template>
  <!-- 基础输入框 -->
  <Input v-model="value" placeholder="请输入内容" />

  <!-- 带标签 -->
  <Input v-model="value" label="技能名称" required />

  <!-- 可清除 -->
  <Input v-model="value" clearable />

  <!-- 密码输入 -->
  <Input v-model="password" type="password" show-password />

  <!-- 带前缀/后缀 -->
  <Input v-model="value">
    <template #prefix>
      <SearchIcon />
    </template>
  </Input>

  <!-- 错误状态 -->
  <Input v-model="value" state="error" error-message="请输入有效内容" />

  <!-- 尺寸变体 -->
  <Input size="sm" />
  <Input size="md" />
  <Input size="lg" />
</template>
```

### Tag 标签

```vue
<template>
  <!-- 基础标签 -->
  <Tag label="Python" />

  <!-- 类型变体 -->
  <Tag type="primary" label="主要" />
  <Tag type="success" label="成功" />
  <Tag type="warning" label="警告" />
  <Tag type="error" label="错误" />

  <!-- 变体样式 -->
  <Tag variant="solid" label="实心" />
  <Tag variant="outline" label="轮廓" />
  <Tag variant="soft" label="柔和" />

  <!-- 可关闭 -->
  <Tag label="可删除" closable @close="handleClose" />

  <!-- 可选择 -->
  <Tag label="可选择" selectable v-model:selected="isSelected" />

  <!-- 技能类型标签 -->
  <Tag skill-type="claude" label="Claude" />
  <Tag skill-type="cursor" label="Cursor" />
  <Tag skill-type="copilot" label="Copilot" />

  <!-- 尺寸变体 -->
  <Tag size="sm" label="小" />
  <Tag size="md" label="默认" />
  <Tag size="lg" label="大" />
</template>
```

---

## 布局使用示例

### AuthLayout 认证布局

用于登录、注册等认证相关页面。

```vue
<template>
  <AuthLayout
    title="Skills Intelligence Hub"
    subtitle="让技能主动找到你"
  >
    <!-- 登录表单 -->
    <form @submit="handleSubmit">
      <Input v-model="username" label="用户名" />
      <Input v-model="password" type="password" label="密码" />
      <Button type="primary" block>登录</Button>
    </form>

    <!-- 底部链接 -->
    <template #footer>
      <p>还没有账号？<a href="/register">立即注册</a></p>
    </template>
  </AuthLayout>
</template>
```

### AppLayout 应用布局

用于应用主界面，包含导航栏和可选侧边栏。

```vue
<template>
  <AppLayout
    title="技能市场"
    :show-sidebar="true"
    :sidebar-collapsed="isSidebarCollapsed"
    @toggle-sidebar="toggleSidebar"
  >
    <!-- 页面内容 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <SkillCard v-for="skill in skills" :key="skill.id" :skill="skill" />
    </div>
  </AppLayout>
</template>
```

---

## 命名规范

### 文件命名

- 组件文件：PascalCase（如 `Button.vue`）
- 类型文件：`.types.ts` 后缀（如 `Button.types.ts`）
- 导出文件：`index.ts`

### 组件命名

- 组件名称：PascalCase（如 `<Button />`）
- Props 名称：camelCase（如 `isLoading`）
- 事件名称：kebab-case（如 `@click`）

### CSS 类名

- 使用 Tailwind CSS 原子类
- 自定义类名使用 kebab-case（如 `.card-container`）
- 状态修饰符使用 `is-` 前缀（如 `.is-active`）

### 变量命名

- 常量：UPPER_SNAKE_CASE（如 `BUTTON_SIZE_MAP`）
- 变量：camelCase（如 `buttonSize`）
- 类型：PascalCase（如 `ButtonProps`）

---

## 目录结构

```
web/src/design-system/
├── tokens/              # 设计令牌
│   ├── colors.ts        # 颜色系统
│   ├── typography.ts    # 排版系统
│   ├── spacing.ts       # 间距系统
│   ├── shadows.ts       # 阴影系统
│   ├── breakpoints.ts   # 响应式断点
│   └── index.ts         # 统一导出
├── elements/            # 基础组件
│   ├── Button/          # 按钮组件
│   │   ├── Button.vue
│   │   ├── Button.types.ts
│   │   └── index.ts
│   ├── Input/           # 输入框组件
│   │   ├── Input.vue
│   │   ├── Input.types.ts
│   │   └── index.ts
│   ├── Tag/             # 标签组件
│   │   ├── Tag.vue
│   │   ├── Tag.types.ts
│   │   └── index.ts
│   └── index.ts
├── layouts/             # 页面布局
│   ├── AuthLayout.vue   # 认证页布局
│   ├── AppLayout.vue    # 应用主布局
│   └── index.ts
├── README.md            # 设计文档
└── index.ts             # 统一导出
```

---

## 快速开始

### 导入设计令牌

```typescript
import { colors, typography, spacing } from '@/design-system/tokens'
```

### 导入组件

```typescript
import { Button, Input, Tag } from '@/design-system/elements'
```

### 导入布局

```typescript
import { AuthLayout, AppLayout } from '@/design-system/layouts'
```

### 导入全部

```typescript
import { tokens, elements, layouts } from '@/design-system'
```

---

## 版本历史

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0.0 | 2026-03-23 | 初始版本，包含基础设计令牌和核心组件 |