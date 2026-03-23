/**
 * Skills Intelligence Hub - 设计系统统一导出
 *
 * 提供设计令牌、基础组件和布局组件的统一入口
 */

// 导出设计令牌
export * from './tokens'
export { default as tokens } from './tokens'

// 导出基础组件
export * from './elements'
export { default as elements } from './elements'

// 导出布局组件
export * from './layouts'
export { default as layouts } from './layouts'

// 导出类型定义
export type {
  // Colors
  BrandColor,
  NeutralColor,
  SemanticType,
  SkillType,
  // Typography
  FontSize,
  FontWeight,
  LineHeight,
  TextStyle,
  // Spacing
  SpacingValue,
  PaddingSize,
  MarginSize,
  GapSize,
  // Shadows
  ShadowSize,
  // Breakpoints
  Breakpoint,
  ResponsiveValue,
  // Button
  ButtonType,
  ButtonSize,
  ButtonState,
  ButtonShape,
  ButtonProps,
  ButtonEmits,
  // Input
  InputSize,
  InputState,
  InputProps,
  InputEmits,
  // Tag
  TagType,
  TagSize,
  TagVariant,
  SkillTagType,
  TagProps,
  TagEmits,
} from './tokens'
export type {
  ButtonProps as UIButtonProps,
  ButtonEmits as UIButtonEmits,
} from './elements/Button'
export type {
  InputProps as UIInputProps,
  InputEmits as UIInputEmits,
} from './elements/Input'
export type {
  TagProps as UITagProps,
  TagEmits as UITagEmits,
} from './elements/Tag'

// 设计系统完整对象
import tokens from './tokens'
import elements from './elements'
import layouts from './layouts'

export const designSystem = {
  tokens,
  elements,
  layouts,
}

export default designSystem