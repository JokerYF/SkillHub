/**
 * Skills Intelligence Hub - 间距设计令牌
 *
 * 基于 4px 网格系统，提供一致的间距体验
 * 命名采用 t-shirt 尺寸法，便于记忆和使用
 */

export const spacing = {
  // ========================================
  // 基础间距 (Base Spacing)
  // 基于 4px 网格: 0, 1(4px), 2(8px), 3(12px)...
  // ========================================
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px

  // ========================================
  // 语义间距 (Semantic Spacing)
  // 用于特定场景的预设值
  // ========================================
  semantic: {
    // 内边距
    padding: {
      xs: '0.25rem',    // 4px - 紧凑内边距
      sm: '0.5rem',     // 8px - 小内边距
      md: '1rem',       // 16px - 默认内边距
      lg: '1.5rem',     // 24px - 大内边距
      xl: '2rem',       // 32px - 超大内边距
      '2xl': '3rem',    // 48px - 巨大内边距
    },
    // 外边距
    margin: {
      xs: '0.25rem',    // 4px
      sm: '0.5rem',     // 8px
      md: '1rem',       // 16px
      lg: '1.5rem',     // 24px
      xl: '2rem',       // 32px
      '2xl': '3rem',    // 48px
    },
    // 间隙
    gap: {
      xs: '0.25rem',    // 4px
      sm: '0.5rem',     // 8px
      md: '1rem',       // 16px
      lg: '1.5rem',     // 24px
      xl: '2rem',       // 32px
    },
  },

  // ========================================
  // 布局间距 (Layout Spacing)
  // 用于页面布局的固定间距
  // ========================================
  layout: {
    // 页面边距
    pagePadding: {
      sm: '1rem',       // 16px - 移动端
      md: '2rem',       // 32px - 平板
      lg: '4rem',       // 64px - 桌面
      xl: '6rem',       // 96px - 大屏
    },
    // 区块间距
    sectionGap: {
      sm: '2rem',       // 32px
      md: '4rem',       // 64px
      lg: '6rem',       // 96px
    },
    // 组件间距
    componentGap: {
      sm: '0.5rem',     // 8px
      md: '1rem',       // 16px
      lg: '1.5rem',     // 24px
    },
    // 导航高度
    navbarHeight: '4rem',    // 64px
    sidebarWidth: '16rem',   // 256px
    footerHeight: '4rem',    // 64px
  },
} as const

// 间距类型
export type SpacingValue = keyof typeof spacing
export type PaddingSize = keyof typeof spacing.semantic.padding
export type MarginSize = keyof typeof spacing.semantic.margin
export type GapSize = keyof typeof spacing.semantic.gap

// 辅助函数：获取 Tailwind 间距类
export function getPaddingClass(size: PaddingSize): string {
  const valueMap: Record<PaddingSize, string> = {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-12',
  }
  return valueMap[size]
}

export function getGapClass(size: GapSize): string {
  const valueMap: Record<GapSize, string> = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  }
  return valueMap[size]
}

export default spacing