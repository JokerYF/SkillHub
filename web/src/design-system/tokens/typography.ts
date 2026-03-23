/**
 * Skills Intelligence Hub - 排版设计令牌
 *
 * 排版系统基于模块化缩放 (Modular Scale)
 * 基准值: 16px (1rem)
 * 缩放比例: Major Third (1.25)
 */

export const typography = {
  // ========================================
  // 字体家族 (Font Families)
  // ========================================
  fontFamily: {
    // 无衬线字体 - 主要 UI 字体
    sans: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'Segoe UI',
      'Roboto',
      'PingFang SC',
      'Microsoft YaHei',
      'sans-serif',
    ].join(', '),
    // 等宽字体 - 代码显示
    mono: [
      'JetBrains Mono',
      'Fira Code',
      'SF Mono',
      'Monaco',
      'Consolas',
      'monospace',
    ].join(', '),
    // 显示字体 - 标题装饰
    display: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif',
    ].join(', '),
  },

  // ========================================
  // 字号 (Font Sizes)
  // ========================================
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
  },

  // ========================================
  // 行高 (Line Heights)
  // ========================================
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // ========================================
  // 字重 (Font Weights)
  // ========================================
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // ========================================
  // 字间距 (Letter Spacing)
  // ========================================
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // ========================================
  // 预设样式 (Text Styles)
  // ========================================
  textStyle: {
    // 页面标题
    pageTitle: {
      fontFamily: 'display',
      fontSize: '2xl',
      fontWeight: 'bold',
      lineHeight: 'tight',
      letterSpacing: 'tight',
    },
    // 区块标题
    sectionTitle: {
      fontFamily: 'sans',
      fontSize: 'xl',
      fontWeight: 'semibold',
      lineHeight: 'snug',
      letterSpacing: 'normal',
    },
    // 卡片标题
    cardTitle: {
      fontFamily: 'sans',
      fontSize: 'lg',
      fontWeight: 'semibold',
      lineHeight: 'snug',
      letterSpacing: 'normal',
    },
    // 正文
    body: {
      fontFamily: 'sans',
      fontSize: 'base',
      fontWeight: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    // 正文小字
    bodySmall: {
      fontFamily: 'sans',
      fontSize: 'sm',
      fontWeight: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
    },
    // 标签文字
    label: {
      fontFamily: 'sans',
      fontSize: 'sm',
      fontWeight: 'medium',
      lineHeight: 'none',
      letterSpacing: 'wide',
    },
    // 代码
    code: {
      fontFamily: 'mono',
      fontSize: 'sm',
      fontWeight: 'normal',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
    },
    // 按钮
    button: {
      fontFamily: 'sans',
      fontSize: 'sm',
      fontWeight: 'medium',
      lineHeight: 'none',
      letterSpacing: 'wide',
    },
    // 链接
    link: {
      fontFamily: 'sans',
      fontSize: 'base',
      fontWeight: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      textDecoration: 'underline',
    },
  },
} as const

// 字号类型
export type FontSize = keyof typeof typography.fontSize
export type FontWeight = keyof typeof typography.fontWeight
export type LineHeight = keyof typeof typography.lineHeight
export type TextStyle = keyof typeof typography.textStyle

// 辅助函数：获取 Tailwind 字体类
export function getFontSizeClass(size: FontSize): string {
  return `text-${size}`
}

export function getFontWeightClass(weight: FontWeight): string {
  return `font-${weight}`
}

export default typography