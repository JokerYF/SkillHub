/**
 * Skills Intelligence Hub - Tag 组件类型定义
 */

// 标签类型
export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'

// 标签尺寸
export type TagSize = 'sm' | 'md' | 'lg'

// 标签变体
export type TagVariant = 'solid' | 'outline' | 'soft'

// 技能类型标签
export type SkillTagType = 'claude' | 'cursor' | 'copilot'

// 标签属性接口
export interface TagProps {
  /** 标签内容 */
  label?: string
  /** 标签类型 */
  type?: TagType
  /** 标签尺寸 */
  size?: TagSize
  /** 标签变体 */
  variant?: TagVariant
  /** 是否可关闭 */
  closable?: boolean
  /** 是否可选 */
  selectable?: boolean
  /** 是否选中 */
  selected?: boolean
  /** 是否禁用 */
  disabled?: boolean
  /** 技能类型 (用于技能标签) */
  skillType?: SkillTagType
  /** 图标 */
  icon?: string
}

// 标签事件接口
export interface TagEmits {
  (e: 'close', event: MouseEvent): void
  (e: 'click', event: MouseEvent): void
  (e: 'update:selected', value: boolean): void
}

// 尺寸对应的样式映射
export const tagSizeMap: Record<TagSize, {
  height: string
  padding: string
  fontSize: string
  iconSize: string
}> = {
  sm: {
    height: '1.25rem',    // 20px
    padding: '0.25rem 0.5rem', // 4px 8px
    fontSize: '0.75rem',  // 12px
    iconSize: '0.75rem',  // 12px
  },
  md: {
    height: '1.5rem',     // 24px
    padding: '0.25rem 0.75rem', // 4px 12px
    fontSize: '0.75rem',  // 12px
    iconSize: '0.875rem', // 14px
  },
  lg: {
    height: '2rem',       // 32px
    padding: '0.375rem 1rem', // 6px 16px
    fontSize: '0.875rem', // 14px
    iconSize: '1rem',     // 16px
  },
}

// 类型和变体对应的样式映射
export const tagStyleMap: Record<TagType, Record<TagVariant, {
  bg: string
  text: string
  border: string
}>> = {
  default: {
    solid: { bg: 'bg-neutral-500', text: 'text-white', border: 'border-transparent' },
    outline: { bg: 'bg-transparent', text: 'text-neutral-700', border: 'border-neutral-300' },
    soft: { bg: 'bg-neutral-100', text: 'text-neutral-700', border: 'border-transparent' },
  },
  primary: {
    solid: { bg: 'bg-brand-500', text: 'text-white', border: 'border-transparent' },
    outline: { bg: 'bg-transparent', text: 'text-brand-600', border: 'border-brand-500' },
    soft: { bg: 'bg-brand-100', text: 'text-brand-700', border: 'border-transparent' },
  },
  success: {
    solid: { bg: 'bg-semantic-success-dark', text: 'text-white', border: 'border-transparent' },
    outline: { bg: 'bg-transparent', text: 'text-semantic-success-dark', border: 'border-semantic-success-dark' },
    soft: { bg: 'bg-semantic-success-light', text: 'text-semantic-success-dark', border: 'border-transparent' },
  },
  warning: {
    solid: { bg: 'bg-semantic-warning-dark', text: 'text-white', border: 'border-transparent' },
    outline: { bg: 'bg-transparent', text: 'text-semantic-warning-dark', border: 'border-semantic-warning-dark' },
    soft: { bg: 'bg-semantic-warning-light', text: 'text-semantic-warning-dark', border: 'border-transparent' },
  },
  error: {
    solid: { bg: 'bg-semantic-error-dark', text: 'text-white', border: 'border-transparent' },
    outline: { bg: 'bg-transparent', text: 'text-semantic-error-dark', border: 'border-semantic-error-dark' },
    soft: { bg: 'bg-semantic-error-light', text: 'text-semantic-error-dark', border: 'border-transparent' },
  },
  info: {
    solid: { bg: 'bg-semantic-info-dark', text: 'text-white', border: 'border-transparent' },
    outline: { bg: 'bg-transparent', text: 'text-semantic-info-dark', border: 'border-semantic-info-dark' },
    soft: { bg: 'bg-semantic-info-light', text: 'text-semantic-info-dark', border: 'border-transparent' },
  },
}

// 技能类型标签样式映射
export const skillTagStyleMap: Record<SkillTagType, {
  bg: string
  text: string
  border: string
}> = {
  claude: {
    bg: 'bg-purple-100',
    text: 'text-purple-700',
    border: 'border-purple-200',
  },
  cursor: {
    bg: 'bg-violet-100',
    text: 'text-violet-700',
    border: 'border-violet-200',
  },
  copilot: {
    bg: 'bg-cyan-100',
    text: 'text-cyan-700',
    border: 'border-cyan-200',
  },
}