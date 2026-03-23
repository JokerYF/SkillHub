/**
 * Skills Intelligence Hub - 颜色设计令牌
 *
 * 颜色系统采用语义化命名，便于主题切换和维护
 * 基于 HSL 格式定义，支持透明度调整
 */

export const colors = {
  // ========================================
  // 品牌色 (Brand Colors)
  // ========================================
  brand: {
    50: 'hsl(220, 100%, 97%)',   // 最浅
    100: 'hsl(220, 100%, 94%)',
    200: 'hsl(220, 100%, 88%)',
    300: 'hsl(220, 100%, 78%)',
    400: 'hsl(220, 100%, 68%)',
    500: 'hsl(220, 100%, 58%)',  // 主色
    600: 'hsl(220, 100%, 48%)',  // 悬停态
    700: 'hsl(220, 100%, 42%)',
    800: 'hsl(220, 100%, 36%)',
    900: 'hsl(220, 100%, 28%)',  // 最深
  },

  // ========================================
  // 语义色 (Semantic Colors)
  // ========================================
  semantic: {
    // 成功
    success: {
      light: 'hsl(152, 76%, 95%)',
      DEFAULT: 'hsl(152, 76%, 85%)',
      dark: 'hsl(152, 76%, 40%)',
      text: 'hsl(152, 76%, 25%)',
    },
    // 警告
    warning: {
      light: 'hsl(38, 92%, 95%)',
      DEFAULT: 'hsl(38, 92%, 85%)',
      dark: 'hsl(38, 92%, 50%)',
      text: 'hsl(38, 92%, 25%)',
    },
    // 错误
    error: {
      light: 'hsl(0, 84%, 95%)',
      DEFAULT: 'hsl(0, 84%, 85%)',
      dark: 'hsl(0, 84%, 50%)',
      text: 'hsl(0, 84%, 30%)',
    },
    // 信息
    info: {
      light: 'hsl(200, 100%, 95%)',
      DEFAULT: 'hsl(200, 100%, 85%)',
      dark: 'hsl(200, 100%, 45%)',
      text: 'hsl(200, 100%, 25%)',
    },
  },

  // ========================================
  // 中性色 (Neutral Colors)
  // ========================================
  neutral: {
    white: 'hsl(0, 0%, 100%)',
    black: 'hsl(0, 0%, 0%)',
    // 灰度阶梯
    50: 'hsl(220, 20%, 98%)',
    100: 'hsl(220, 15%, 95%)',
    150: 'hsl(220, 12%, 92%)',
    200: 'hsl(220, 10%, 88%)',
    300: 'hsl(220, 8%, 75%)',
    400: 'hsl(220, 6%, 60%)',
    500: 'hsl(220, 5%, 46%)',
    600: 'hsl(220, 5%, 36%)',
    700: 'hsl(220, 5%, 26%)',
    800: 'hsl(220, 5%, 18%)',
    900: 'hsl(220, 5%, 12%)',
  },

  // ========================================
  // 角色色 (Role Colors) - UI 元素专用
  // ========================================
  role: {
    // 背景
    background: {
      primary: 'hsl(0, 0%, 100%)',
      secondary: 'hsl(220, 20%, 98%)',
      tertiary: 'hsl(220, 15%, 95%)',
      inverse: 'hsl(220, 5%, 18%)',
    },
    // 文字
    text: {
      primary: 'hsl(220, 5%, 12%)',
      secondary: 'hsl(220, 5%, 36%)',
      tertiary: 'hsl(220, 5%, 46%)',
      inverse: 'hsl(0, 0%, 100%)',
      disabled: 'hsl(220, 8%, 75%)',
    },
    // 边框
    border: {
      DEFAULT: 'hsl(220, 10%, 88%)',
      light: 'hsl(220, 15%, 95%)',
      dark: 'hsl(220, 8%, 75%)',
      focus: 'hsl(220, 100%, 58%)',
    },
    // 交互
    interactive: {
      DEFAULT: 'hsl(220, 100%, 58%)',
      hover: 'hsl(220, 100%, 48%)',
      active: 'hsl(220, 100%, 42%)',
      disabled: 'hsl(220, 10%, 88%)',
    },
  },

  // ========================================
  // 技能类型色 (Skill Type Colors)
  // ========================================
  skillType: {
    claude: {
      light: 'hsl(270, 60%, 95%)',
      DEFAULT: 'hsl(270, 60%, 55%)',
      dark: 'hsl(270, 60%, 35%)',
    },
    cursor: {
      light: 'hsl(280, 65%, 95%)',
      DEFAULT: 'hsl(280, 65%, 50%)',
      dark: 'hsl(280, 65%, 35%)',
    },
    copilot: {
      light: 'hsl(180, 60%, 95%)',
      DEFAULT: 'hsl(180, 60%, 45%)',
      dark: 'hsl(180, 60%, 30%)',
    },
  },
} as const

// 颜色类型定义
export type BrandColor = keyof typeof colors.brand
export type NeutralColor = keyof typeof colors.neutral
export type SemanticType = keyof typeof colors.semantic
export type SkillType = keyof typeof colors.skillType

// 辅助函数：获取带透明度的颜色
export function withOpacity(hslColor: string, opacity: number): string {
  // 解析 HSL 并添加透明度
  const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/)
  if (match) {
    const [, h, s, l] = match
    return `hsla(${h}, ${s}%, ${l}%, ${opacity})`
  }
  return hslColor
}

export default colors