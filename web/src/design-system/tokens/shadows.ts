/**
 * Skills Intelligence Hub - 阴影设计令牌
 *
 * 阴影系统用于表达层次感和深度
 * 分为基础阴影和语义阴影两类
 */

export const shadows = {
  // ========================================
  // 基础阴影 (Base Shadows)
  // 按深度级别命名
  // ========================================
  none: 'none',

  // 最小阴影 - 用于微妙的层次区分
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',

  // 小阴影 - 用于卡片、下拉菜单等
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',

  // 默认阴影 - 用于悬浮元素
  DEFAULT: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

  // 中等阴影 - 用于模态框、弹出层
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',

  // 大阴影 - 用于强调悬浮效果
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

  // 超大阴影 - 用于侧边抽屉
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

  // 巨大阴影 - 用于模态框
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // 内阴影
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',

  // ========================================
  // 语义阴影 (Semantic Shadows)
  // 用于特定 UI 状态
  // ========================================
  semantic: {
    // 卡片阴影
    card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    // 卡片悬浮阴影
    cardHover: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    // 下拉菜单阴影
    dropdown: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    // 模态框阴影
    modal: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    // 输入框聚焦阴影
    inputFocus: '0 0 0 3px rgb(59 130 246 / 0.5)',
    // 按钮悬浮阴影
    buttonHover: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    // 品牌色聚焦阴影
    brandFocus: '0 0 0 3px rgb(59 130 246 / 0.3)',
  },

  // ========================================
  // 特殊阴影 (Special Shadows)
  // ========================================
  special: {
    // 发光效果 - 品牌色
    glow: {
      sm: '0 0 10px rgb(59 130 246 / 0.3)',
      md: '0 0 20px rgb(59 130 246 / 0.4)',
      lg: '0 0 30px rgb(59 130 246 / 0.5)',
    },
    // 成功状态发光
    success: '0 0 0 3px rgb(34 197 94 / 0.3)',
    // 错误状态发光
    error: '0 0 0 3px rgb(239 68 68 / 0.3)',
    // 警告状态发光
    warning: '0 0 0 3px rgb(234 179 8 / 0.3)',
  },
} as const

// 阴影类型
export type ShadowSize = keyof typeof shadows

// 辅助函数：获取 Tailwind 阴影类
export function getShadowClass(size: ShadowSize): string {
  if (size === 'DEFAULT') return 'shadow'
  return `shadow-${size}`
}

// 辅助函数：获取语义阴影
export function getSemanticShadow(name: keyof typeof shadows.semantic): string {
  return shadows.semantic[name]
}

export default shadows